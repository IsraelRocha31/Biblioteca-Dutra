BEGIN;

ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS managed_by_env BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS admins_single_env_managed_idx
  ON admins (managed_by_env)
  WHERE managed_by_env = TRUE;

COMMIT;
