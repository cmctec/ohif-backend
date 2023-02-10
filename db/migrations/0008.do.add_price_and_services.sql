CREATE TABLE IF NOT EXISTS services
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 service_code varchar(200) UNIQUE NOT NULL,
 codename varchar(200) UNIQUE NOT NULL,
 service_name varchar(200),
 dcm_description varchar(200),


 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS price
(
 id uuid primary key DEFAULT uuid_generate_v4(),
 price decimal NOT NULL,
 
 service_id uuid not null references services(id),

 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);