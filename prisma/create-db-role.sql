DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'duraes_admin') THEN
    CREATE ROLE duraes_admin WITH LOGIN PASSWORD 'DuraesMoveis2026DbPass' CREATEDB;
  ELSE
    ALTER ROLE duraes_admin WITH LOGIN PASSWORD 'DuraesMoveis2026DbPass' CREATEDB;
  END IF;
END $$;

GRANT CONNECT ON DATABASE postgres TO duraes_admin;
GRANT USAGE, CREATE ON SCHEMA public TO duraes_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO duraes_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO duraes_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO duraes_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO duraes_admin;

SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname = 'duraes_admin';
