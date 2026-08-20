import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { readFile } from "node:fs/promises";

import { Database } from '@/types/database.types'

// 1. Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL_LOCAL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY_LOCAL;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

// 2. Initialize Clients with Database typing
const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
const anthropicClient = new Anthropic({ apiKey: anthropicApiKey });

type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionSubtopicJunctionInsert = Database['public']['Tables']['question_subtopic_junction']['Insert']

// Zod schema matching the Insert type for runtime validation
const QuestionBaseSchema = z.object({
  question_title: z.string().describe('Usually in the form (School Name) (Year) (Prelims/Promos/Common Test etc) (Paper 1/2) (Question Integer Number). If this format cannot be achieved, give a generic name based on the Question Content.'),
  question_content: z.string().describe('Complete question text formatted in LaTeX.'),
  question_solution: z.string().optional().describe('Step-by-step worked solution formatted in LaTeX.'),
  subject: z.string().default('H2 Math'),
  year_of_question: z.number().int().optional().describe('Integer Year, can be inferred from the question_title.'),

}) satisfies z.ZodType<QuestionInsert>;

const QuestionExtractionSchema = QuestionBaseSchema.extend({
  subtopic_ids: z.array(z.number()).describe('Array of subtopic IDs where the subtopic is assessed by this Question.')
})

const IngestionPayloadSchema = z.object({
  questions: z.array(QuestionExtractionSchema),
});

const QUESTION_BANK_DIR = path.join(process.cwd(), 'scripts', 'question_bank');

const EXTRACTION_TOOL: Anthropic.Tool = {
  name: 'save_extracted_questions',
  description: 'Saves extracted questions and solutions into database format.',
  input_schema: zodToJsonSchema(IngestionPayloadSchema) as Anthropic.Tool.InputSchema,
};

const MAX_PDF_BASE64_BYTES = 32 * 1024 * 1024;

async function loadPdfAsBase64(filePath: string): Promise<string> {
  const buf = await readFile(filePath);
  const base64 = buf.toString('base64');
  if (base64.length > MAX_PDF_BASE64_BYTES) {
    throw new Error(`PDF too large after base64 encoding: ${filePath}`);
  }
  return base64;
}

// 5. Main Processing Function
async function runIngestion() {
  if (!fs.existsSync(QUESTION_BANK_DIR)) {
    console.error(`Question bank directory not found at: ${QUESTION_BANK_DIR}`);
    return;
  }

  const entries = fs.readdirSync(QUESTION_BANK_DIR, { withFileTypes: true });
  const folders = entries.filter((dirent) => dirent.isDirectory());

  console.log(`Found ${folders.length} folder(s) to process.\n`);

	// Fetch subtopic data from supabase
	const { data: subtopicData, error: subtopicFetchError } = await supabaseClient
		.from('subtopics')
		.select()

  if (subtopicFetchError) {
    throw new Error(`Supabase failed to fetch subtopic data.`);
  }

  for (const folder of folders) {
    const folderPath = path.join(QUESTION_BANK_DIR, folder.name);
    const files = fs.readdirSync(folderPath);

    const qpFile = files.find((f) => f.toLowerCase().includes('qp') && f.endsWith('.pdf'));
    const ansFile = files.find((f) => f.toLowerCase().includes('ans') && f.endsWith('.pdf'));

    if (!qpFile) {
      console.warn(`[Skip] No QP PDF found in folder: ${folder.name}`);
      continue;
    }

    console.log(`Processing: ${folder.name}...`);

		try {
			const qpPath = path.join(folderPath, qpFile);
			const qpBase64 = await loadPdfAsBase64(qpPath);

			const contentBlocks: Anthropic.MessageParam['content'] = [
				{
					type: 'document',
					source: { type: 'base64', media_type: 'application/pdf', data: qpBase64 },
				},
			];

			if (ansFile) {
				const ansPath = path.join(folderPath, ansFile);
				const ansBase64 = await loadPdfAsBase64(ansPath);
				contentBlocks.push({
					type: 'document',
					source: { type: 'base64', media_type: 'application/pdf', data: ansBase64 },
				});
			}

			contentBlocks.push({
				type: 'text',
				text: `Extract all questions and their matching solutions from the attached PDF(s): a question paper and its corresponding markers' report / solutions. From the content of the question, use one or multiple subtopic id's that is/are relevant to the question.

        AVAILABLE SUBTOPICS (assign relevant ones to each question):
        ${JSON.stringify(subtopicData)}

				OUTPUT STRUCTURE:
				- If a question has multiple parts, i.e: Question 9 with parts a(i), a(ii) and b, it should be only *1 question*, which is Question 9.
				- Question and its parts should be fully shown in the question_content.

				CONTENT RULES:
				- Transcribe questions and solutions word-for-word from the source. Do not paraphrase, summarize, or reword any mathematical or English content.
				- The markers' report has a "Remarks" or "Comments" column separate from the "Solution" column — extract only the Solution column content as the answer. Discard remarks/comments columns entirely (they are examiner notes, not part of the solution).
				- If a solution shows multiple methods (e.g. "Alternatively," "Method 1" / "Method 2"), extract all methods, keeping them clearly labeled and separate.
				- If a solution or question continues onto a new PDF page without a new question number appearing, treat it as a continuation of the same question — do not split it into a separate entry.
				- If a question or solution includes a diagram, sketch, or figure that carries required content, omit both the question and the solution. If the diagram, sketch, figure or any similar entities is not essential for the understanding of the question/solution, you should extract the text but omit any mention of the pictorial.

				FORMATTING RULES:
				- Format all math in LaTeX: $...$ for inline, $$...$$ for display equations.
				- Escape any literal currency dollar amounts as \\$ (e.g. \\$8,250 or \\$$(x+2)$) — never leave a bare $ next to a number unless it is genuine LaTeX math. This matters especially for word problems involving money.`
			});

			const response = await anthropicClient.messages.stream({
				model: 'claude-sonnet-5',
				max_tokens: 24000,
				tools: [EXTRACTION_TOOL],
				tool_choice: { type: 'tool', name: EXTRACTION_TOOL.name },
				messages: [{ role: 'user', content: contentBlocks }],
			}).finalMessage();

			if (response.stop_reason === 'max_tokens') {
				throw new Error('Response truncated at max_tokens — increase max_tokens or split the PDF.');
			}
			if (response.stop_reason === 'refusal') {
				throw new Error('LLM refused to process this document.');
			}

			const toolBlock = response.content.find(
				(b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
			);
			if (!toolBlock) {
				throw new Error('LLM did not return structured tool output.');
			}

			const parseResult = IngestionPayloadSchema.safeParse(toolBlock.input);
			if (!parseResult.success) {
				console.error('Raw tool input:', JSON.stringify(toolBlock.input, null, 2));
				throw new Error(`Schema validation failed: ${parseResult.error.message}`);
			}

			const validated = parseResult.data;

      const questionRecords = validated.questions.map(({ subtopic_ids, ...q}) => q);

      if (questionRecords.length > 0) {
        const { data: insertedQuestions, error } = await supabaseClient
          .from('questions')
          .insert(questionRecords)
          .select('id');

        if (error) {
          throw new Error(`Supabase insert failed (${validated.questions.length} rows): ${error.message}`);
        }

        const junctionRecords = insertedQuestions.flatMap((q, idx) => validated.questions[idx].subtopic_ids.map(subtopic_id =>
          ({
            question_id: q.id,
            subtopic_id
          })
          ))

        if (junctionRecords.length > 0) {
          const { error: junctionError } = await supabaseClient
            .from('question_subtopic_junction')
            .insert(junctionRecords);

          if (junctionError) throw new Error(`Failed to insert junctions: ${junctionError.message}`);

          console.log(`✅ Ingested ${insertedQuestions.length} questions for: ${folder.name}`);
        } else {
          console.warn(`⚠️ No junction table entries created for: ${folder.name}`);
				  continue;
        }
      } else {
        console.warn(`⚠️ No questions extracted for: ${folder.name}`);
				continue;
      }
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			console.error(`❌ Error processing ${folder.name}:`, message);
		}
	}

  console.log('\nIngestion pipeline complete.');
}

runIngestion();
