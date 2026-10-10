-- Runs once, when the Postgres volume is first created.
-- workflow_builder is created by POSTGRES_DB; the runtime gets its own database.
CREATE DATABASE runtime;
