CREATE TABLE IF NOT EXISTS modalities (
 id uuid primary key DEFAULT uuid_generate_v4(),
 name varchar(200),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS modality_study (
 study_id uuid references studies(id),
 modality_id uuid references modalities(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 CONSTRAINT modality_study_pkey PRIMARY KEY (study_id, modality_id)
);