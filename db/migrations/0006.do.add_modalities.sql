CREATE TABLE IF NOT EXISTS modalities
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 name varchar(200)
);

CREATE TABLE IF NOT EXISTS modality_study
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 study_id uuid not null references studies(id),
 modality_id uuid not null references modalities(id)
);
