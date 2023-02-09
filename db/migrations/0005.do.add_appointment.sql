CREATE TABLE IF NOT EXISTS appointment
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 patient_iin varchar(200),
 patient_fio varchar(200),
 appointment_date DATE,
 referrer varchar(200),
 status varchar(200),
 link_conclusion varchar(500),
 mis_id varchar(200),
 service_name varchar(200),
 service_code varchar(200),
 conclusion_id uuid not null references conclusion(id),
 sender_mo_id varchar(200),
 sender_mo_name varchar(200),
 sender_fp_name varchar(200),
 sender_doc_post_id varchar(200),
 study_id integer,
 serviceCount integer,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);