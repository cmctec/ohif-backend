CREATE TABLE IF NOT EXISTS studies
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 ohif_id varchar(200),
 patient_id uuid not null references patients(id),
 description varchar(200),
 date DATE,
 access_number varchar(200),
 status varchar(200),
 SMS_status varchar(200),
 incorrectIIN BOOLEAN,
 UUID_whatsapp varchar(200),
 anonymized_ohif_id varchar(200),
 archive_url varchar(500),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);