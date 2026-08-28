import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { readFile } from "node:fs/promises";

import { Database } from '@/types/database.types'
import { adminClient } from '@/lib/supabase/client';

// 1. Load the single .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 2. Initialize Anthropic client
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropicClient = new Anthropic({ apiKey: anthropicApiKey });

type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

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
	const { data: subtopicData, error: subtopicFetchError } = await adminClient
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
        - Every question MUST include the "subtopic_ids" array using integer IDs from the list above (e.g., [4, 7]). If none match, return [].

				CONTENT RULES:
				- Transcribe questions and solutions word-for-word from the source. Do not paraphrase, summarize, or reword any mathematical or English content.
				- The markers' report has a "Remarks" or "Comments" column separate from the "Solution" column — extract only the Solution column content as the answer. Discard remarks/comments columns entirely (they are examiner notes, not part of the solution).
				- If a solution shows multiple methods (e.g. "Alternatively," "Method 1" / "Method 2"), extract all methods, keeping them clearly labeled and separate.
				- If a solution or question continues onto a new PDF page without a new question number appearing, treat it as a continuation of the same question — do not split it into a separate entry.
				- If a question or solution includes a diagram, sketch, or figure that carries required content (e.g. a graph sketch that is part of the marked answer), do not mention its existence as it cannot be shown graphically. Instead, convey the content in a textual way, (e.g: Instead of saying "the following diagram shows {content}", you can say "the graph of {content}").
        - The year of the question can usually be inferred from the question title.
        - The solution should be question agnostic, i.e: it should not reference the question title or any other metadata. It should be in the form (a), (b), or (bi), (cii) etc, and not 1(a), 1(b), 1(b)(i) etc. The solution should be in the same order as the question parts, i.e: (a) first, then (b), then (c) etc.

				FORMATTING RULES:
				- Format all math in LaTeX, use $$...$$ for display equations, use single $ ... $ for inline variables and equations (e.g., $x$, $y = 2x+1$).
        - Do not use TeX macro escapes for plain text (e.g., write SGD such as SGD 8,250 instead of \$8,250).
        - Always add a newline after each answer part, i.e: after (a), (b), (c) etc. and after each subpart, i.e: (ai), (bii), (ciii) etc.`
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

      if (questionRecords.length === 0) {
        console.warn(`⚠️ No questions extracted for: ${folder.name}`);
        continue;
      }

      let ingestedCount = 0;

      for (let i = 0; i < questionRecords.length; i++) {
        const record = questionRecords[i];
        const validatedQuestion = validated.questions[i];

        // 1. Insert question individually and retrieve the generated ID
        const { data: insertedQuestion, error: questionError } = await adminClient
          .from('questions')
          .insert(record)
          .select('id')
          .single();

        if (questionError || !insertedQuestion) {
          throw new Error(
            `Supabase insert failed for question "${record.question_title}" in ${folder.name}: ${questionError?.message}`
          );
        }

        // 2. Prepare junction entries for this specific question
        const subtopicIds = validatedQuestion.subtopic_ids ?? [];
        if (subtopicIds.length > 0) {
          const junctionRecords = subtopicIds.map((subtopic_id) => ({
            question_id: insertedQuestion.id,
            subtopic_id,
          }));

          const { error: junctionError } = await adminClient
            .from('question_subtopic_junction')
            .insert(junctionRecords);

          if (junctionError) {
            throw new Error(
              `Failed to insert junctions for question ID ${insertedQuestion.id}: ${junctionError.message}`
            );
          }
        } else {
          console.warn(
            `⚠️ No subtopics assigned for question ID ${insertedQuestion.id} (${record.question_title}) in: ${folder.name}`
          );
        }

        ingestedCount++;
      }

      console.log(`✅ Ingested ${ingestedCount} questions for: ${folder.name}`);
		} catch (error) {
      console.error(`❌ Error processing folder "${folder.name}":`, error);
    }
	} 
  console.log('\nIngestion pipeline complete.');
}

runIngestion();
