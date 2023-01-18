create function update_updated_at_column() returns trigger as $$
begin
  if old.updated_at = new.updated_at then
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


