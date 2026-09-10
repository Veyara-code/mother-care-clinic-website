/*
# Enable public inserts on appointments table

## Purpose
The Mother Care Clinic website has a public appointment booking form with no
sign-in. Visitors submit the form and the data is written to the `appointments`
table. RLS is currently enabled on the table but has NO policies, which locks
the table down completely — no role (including anon) can insert rows.

## Changes
1. Security: Add an INSERT policy on `appointments` scoped to `anon, authenticated`
   so the public booking form can save new appointment requests.
2. Security: Add a SELECT policy on `appointments` scoped to `authenticated` only,
   so clinic staff (when signed in) can review submissions. The anon public
   visitor cannot list other people's appointments.

## Notes
- No new tables or columns. The `appointments` table already exists with columns:
  id, created_at, patient_name, phone, email, age, doctor, service,
  appointment_date, reason.
- This is a single-tenant public-form app (no sign-in screen), so the INSERT
  policy intentionally allows any visitor to create a row. The SELECT policy
  remains restricted to authenticated staff.
*/

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "staff_select_appointments" ON appointments;
CREATE POLICY "staff_select_appointments"
ON appointments FOR SELECT
TO authenticated
USING (true);
