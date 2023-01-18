CREATE TABLE IF NOT EXISTS conclusion
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 conclusion_text varchar(200),
 conclusion_image varchar(200),
 ohif_id varchar(200),
 doctor_iin varchar(200),
 doctor_fullname varchar(200),
 conclusion_url varchar(200),
 study_id uuid not null references studies(id)
);
