CREATE TABLE IF NOT EXISTS patients
(
  id uuid primary key DEFAULT uuid_generate_v4(),
  iin varchar(200),
  firstname varchar(200),
  lastname varchar(200),
  surname varchar(200),
  bdate DATE,
  region varchar(200),
  gernder varchar(200),
  phone varchar(200),
  fullname varchar(200),
  email varchar(200)
);
