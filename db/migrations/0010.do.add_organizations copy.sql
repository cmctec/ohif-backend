CREATE TABLE IF NOT EXISTS  organizations
(
  id uuid primary key DEFAULT uuid_generate_v4(),
  name varchar(200),
  bin varchar(200),
  mis_id bigint,
  mis_username varchar(200),
  mis_password varchar(200),
  institution_name varchar(200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);