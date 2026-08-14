# Solve Application

## Components

### scripts/question_bank

This folder should contain 1 or many folders containing at between 1 to 2 files, _qp.pdf_ and _ans.pdf_ (optional). These will be the content that are processed by the ingestion script to populate our Questions db.

## Commands

`npm run ingest`: Ingests the qp and ans files in each folder in the `question_bank` folder under `scripts`. Please remember to delete the folders after ingestion, so as to prevent duplicates in the db.


