CREATE TABLE IF NOT EXISTS modalities
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 name varchar(200),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS modality_study
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 study_id uuid not null references studies(id),
 modality_id uuid not null references modalities(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
