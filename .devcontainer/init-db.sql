-- ─────────────────────────────────────────────────────
--  init-db.sql
--  Se ejecuta automáticamente la primera vez que
--  PostgreSQL arranca con un volumen vacío.
--  Solo crea extensiones y schemas base;
--  las tablas las maneja Flyway desde Spring Boot.
-- ─────────────────────────────────────────────────────

-- UUID nativo de Postgres (para gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Para búsquedas de texto en español (catálogo de prendas)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Schema de auditoría separado del schema principal
CREATE SCHEMA IF NOT EXISTS audit;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'FRI APP DB inicializada correctamente';
END;
$$;
