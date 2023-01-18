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
 conclusion_id uuid not null references conclusion(id)
);