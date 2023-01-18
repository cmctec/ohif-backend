CREATE TABLE IF NOT EXISTS share_dicom_archive
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 study_id uuid not null references studies(id),
 token varchar(200),
 otp_code varchar(200),
 doctor_iin varchar(200),
 status  varchar(200),
 verify_status BOOLEAN,
 number_of_attempts smallint
);