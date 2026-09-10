/*
# Add status column and secure admin RLS policies on appointments

## Purpose
Prepare the appointments table for a production admin dashboard. This migration:
1. Adds a `status` column defaulting to 'Pending' for all new appointments.
2. Adds a CHECK constraint restricting status to the four allowed values.
3. Backfills existing rows to 'Pending' so the column is never NULL.
4. Tightens Row Level Security so:
   - Public (anon) visitors can ONLY insert new appointments (no SELECT, UPDATE, DELETE).
   - Authenticated admin users can SELECT and UPDATE appointments.
   - No one can DELETE appointments via the anon key (admin deletes are out of scope).

## Changes to the `appointments` table
- New column: `status` (text, NOT NULL, default 'Pending')
- New constraint: `appointments_status_check` — status IN ('Pending','Confirmed','Completed','Cancelled')

## Security (RLS)
- DROP existing `anon_insert_appointments` INSERT policy and recreate it (anon + authenticated, WITH CHECK true) so the public booking form still works.
- DROP existing `staff_select_appointments` SELECT policy and recreate it (authenticated only, USING true) so only signed-in admins can read appointments.
- ADD new `staff_update_appointments` UPDATE policy (authenticated only) so admins can change the status.
- ADD new `staff_delete_appointments` DELETE policy (authenticated only) for completeness, though the dashboard does not expose deletes.

## Notes
1. The public booking form (MotherCareClinic.jsx) inserts rows WITHOUT a status value; the column default 'Pending' fills it automatically. The frontend insert code is unchanged.
2. The anon role loses SELECT/UPDATE/DELETE privileges via RLS. Public visitors can still INSERT (book an appointment) but cannot read, modify, or delete any appointment record.
3. Idempotent: safe to re-run. Uses IF NOT EXISTS for the column add and DROP POLICY IF EXISTS before each CREATE POLICY.
*/

-- 1. Add status column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'status'
  ) THEN
    ALTER TABLE appointments ADD COLUMN status text NOT NULL DEFAULT 'Pending';
  END IF;
END $$;

-- 2. Backfill any NULLs (defensive; column is NOT NULL so this is a no-op on fresh tables)
UPDATE appointments SET status = 'Pending' WHERE status IS NULL;

-- 3. Add CHECK constraint (drop first for idempotency)
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'));

-- 4. Recreate RLS policies

-- Public INSERT: anon + authenticated can create appointments (booking form)
DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin SELECT: only authenticated staff can read appointments
DROP POLICY IF EXISTS "staff_select_appointments" ON appointments;
CREATE POLICY "staff_select_appointments"
ON appointments FOR SELECT
TO authenticated
USING (true);

-- Admin UPDATE: only authenticated staff can update appointment status
DROP POLICY IF EXISTS "staff_update_appointments" ON appointments;
CREATE POLICY "staff_update_appointments"
ON appointments FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Admin DELETE: only authenticated staff can delete (not exposed in UI but locked from anon)
DROP POLICY IF EXISTS "staff_delete_appointments" ON appointments;
CREATE POLICY "staff_delete_appointments"
ON appointments FOR DELETE
TO authenticated
USING (true);
