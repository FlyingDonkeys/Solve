# Solve Application

## Resources

`/resources` requires Google sign-in and lists PDFs from the private `Question PDFs`
bucket directly inside `Practice Papers`. It uses the existing
`_LOCAL` Supabase credentials in development and `_PROD` credentials in production.
Each environment needs that bucket and the `public.file_activity` table.

View and Download buttons POST to `/api/resources/access`. The server verifies the
session, restricts access to practice-paper PDFs, creates a five-minute signed
URL, and records `view_requested` or `download_requested` with the verified user
ID. The corresponding `profiles` row must exist. A tracking failure returns an
error instead of releasing an untracked URL. Page loads and prefetches do not
record activity; events indicate requests, not completed downloads or reading.

Activity is written through the server's secret-key client. Enable RLS on
`file_activity` and avoid granting browser clients insert/read policies unless
needed for a separate feature. The browser does not need direct table access.

## Components

### scripts/question_bank

This folder should contain 1 or many folders containing at between 1 to 2 files, _qp.pdf_ and _ans.pdf_ (optional). These will be the content that are processed by the ingestion script to populate our Questions db.

## Commands

`npm run ingest`: Ingests the qp and ans files in each folder in the `question_bank` folder under `scripts`. Please remember to delete the folders after ingestion, so as to prevent duplicates in the db.


