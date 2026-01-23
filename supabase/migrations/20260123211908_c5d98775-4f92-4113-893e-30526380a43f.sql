-- Phase 2: Dispatch/Responder auth + roles + incident dispatching + unit tracking

-- 1) Profiles (public schema only; do NOT reference auth schema with FKs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Roles (stored in a separate table)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'dispatcher', 'responder');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role),
  CONSTRAINT user_roles_user_fk FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Role check helper to avoid recursive RLS patterns
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Dispatch domain enums
DO $$ BEGIN
  CREATE TYPE public.incident_status AS ENUM ('new', 'triaged', 'dispatched', 'resolved', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.incident_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.unit_status AS ENUM ('available', 'enroute', 'on_scene', 'transporting', 'unavailable');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assignment_status AS ENUM ('assigned', 'accepted', 'declined', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4) Incidents (created by dispatchers/admins; can be sourced from citizen reports)
CREATE TABLE IF NOT EXISTS public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_report_id uuid NULL,
  title text NOT NULL,
  description text,
  latitude numeric,
  longitude numeric,
  status public.incident_status NOT NULL DEFAULT 'new',
  priority public.incident_priority NOT NULL DEFAULT 'medium',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT incidents_created_by_fk FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE RESTRICT,
  CONSTRAINT incidents_source_report_fk FOREIGN KEY (source_report_id) REFERENCES public.citizen_reports(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_incidents_updated_at ON public.incidents;
CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Responder units + membership
CREATE TABLE IF NOT EXISTS public.responder_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  callsign text,
  is_active boolean NOT NULL DEFAULT true,
  current_status public.unit_status NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_responder_units_callsign ON public.responder_units(callsign) WHERE callsign IS NOT NULL;

ALTER TABLE public.responder_units ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_responder_units_updated_at ON public.responder_units;
CREATE TRIGGER update_responder_units_updated_at
BEFORE UPDATE ON public.responder_units
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.unit_members (
  unit_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (unit_id, user_id),
  CONSTRAINT unit_members_unit_fk FOREIGN KEY (unit_id) REFERENCES public.responder_units(id) ON DELETE CASCADE,
  CONSTRAINT unit_members_user_fk FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

ALTER TABLE public.unit_members ENABLE ROW LEVEL SECURITY;

-- 6) Unit status events (append-only) + trigger to update current status
CREATE TABLE IF NOT EXISTS public.unit_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL,
  status public.unit_status NOT NULL,
  note text,
  set_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unit_status_events_unit_fk FOREIGN KEY (unit_id) REFERENCES public.responder_units(id) ON DELETE CASCADE,
  CONSTRAINT unit_status_events_set_by_fk FOREIGN KEY (set_by) REFERENCES public.profiles(user_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_unit_status_events_unit_created_at ON public.unit_status_events(unit_id, created_at DESC);

ALTER TABLE public.unit_status_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.apply_unit_status_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.responder_units
  SET current_status = NEW.status,
      updated_at = now()
  WHERE id = NEW.unit_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_unit_status_event ON public.unit_status_events;
CREATE TRIGGER trg_apply_unit_status_event
AFTER INSERT ON public.unit_status_events
FOR EACH ROW
EXECUTE FUNCTION public.apply_unit_status_event();

-- 7) Incident assignments
CREATE TABLE IF NOT EXISTS public.incident_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  assigned_by uuid NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  status public.assignment_status NOT NULL DEFAULT 'assigned',
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  note text,
  CONSTRAINT incident_assignments_incident_fk FOREIGN KEY (incident_id) REFERENCES public.incidents(id) ON DELETE CASCADE,
  CONSTRAINT incident_assignments_unit_fk FOREIGN KEY (unit_id) REFERENCES public.responder_units(id) ON DELETE CASCADE,
  CONSTRAINT incident_assignments_assigned_by_fk FOREIGN KEY (assigned_by) REFERENCES public.profiles(user_id) ON DELETE RESTRICT,
  CONSTRAINT incident_assignments_ack_by_fk FOREIGN KEY (acknowledged_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_incident_assignments_incident ON public.incident_assignments(incident_id);
CREATE INDEX IF NOT EXISTS idx_incident_assignments_unit ON public.incident_assignments(unit_id);
CREATE INDEX IF NOT EXISTS idx_incident_assignments_status ON public.incident_assignments(status);

ALTER TABLE public.incident_assignments ENABLE ROW LEVEL SECURITY;

-- 8) RLS policies

-- Helper: is user a member of a unit
CREATE OR REPLACE FUNCTION public.is_unit_member(_user_id uuid, _unit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.unit_members
    WHERE user_id = _user_id
      AND unit_id = _unit_id
  )
$$;

-- INCIDENTS
DROP POLICY IF EXISTS "Dispatch can read all incidents" ON public.incidents;
CREATE POLICY "Dispatch can read all incidents"
ON public.incidents
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'dispatcher')
);

DROP POLICY IF EXISTS "Responders can read assigned incidents" ON public.incidents;
CREATE POLICY "Responders can read assigned incidents"
ON public.incidents
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'responder')
  AND EXISTS (
    SELECT 1
    FROM public.incident_assignments ia
    JOIN public.unit_members um ON um.unit_id = ia.unit_id
    WHERE ia.incident_id = public.incidents.id
      AND um.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Dispatch can create incidents" ON public.incidents;
CREATE POLICY "Dispatch can create incidents"
ON public.incidents
FOR INSERT
TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
  AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Dispatch can update incidents" ON public.incidents;
CREATE POLICY "Dispatch can update incidents"
ON public.incidents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

-- UNITS
DROP POLICY IF EXISTS "Dispatch can manage units" ON public.responder_units;
CREATE POLICY "Dispatch can manage units"
ON public.responder_units
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

DROP POLICY IF EXISTS "Responders can read their units" ON public.responder_units;
CREATE POLICY "Responders can read their units"
ON public.responder_units
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'responder')
  AND EXISTS (
    SELECT 1 FROM public.unit_members um
    WHERE um.unit_id = public.responder_units.id
      AND um.user_id = auth.uid()
  )
);

-- UNIT MEMBERS
DROP POLICY IF EXISTS "Dispatch can manage unit members" ON public.unit_members;
CREATE POLICY "Dispatch can manage unit members"
ON public.unit_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

DROP POLICY IF EXISTS "Users can read their unit memberships" ON public.unit_members;
CREATE POLICY "Users can read their unit memberships"
ON public.unit_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- UNIT STATUS EVENTS
DROP POLICY IF EXISTS "Dispatch can read all unit status events" ON public.unit_status_events;
CREATE POLICY "Dispatch can read all unit status events"
ON public.unit_status_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

DROP POLICY IF EXISTS "Unit members can read their unit status events" ON public.unit_status_events;
CREATE POLICY "Unit members can read their unit status events"
ON public.unit_status_events
FOR SELECT
TO authenticated
USING (public.is_unit_member(auth.uid(), unit_id));

DROP POLICY IF EXISTS "Dispatch can insert unit status events" ON public.unit_status_events;
CREATE POLICY "Dispatch can insert unit status events"
ON public.unit_status_events
FOR INSERT
TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
  AND set_by = auth.uid()
);

DROP POLICY IF EXISTS "Unit members can insert their own status events" ON public.unit_status_events;
CREATE POLICY "Unit members can insert their own status events"
ON public.unit_status_events
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_unit_member(auth.uid(), unit_id)
  AND set_by = auth.uid()
);

-- ASSIGNMENTS
DROP POLICY IF EXISTS "Dispatch can read all assignments" ON public.incident_assignments;
CREATE POLICY "Dispatch can read all assignments"
ON public.incident_assignments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

DROP POLICY IF EXISTS "Unit members can read their assignments" ON public.incident_assignments;
CREATE POLICY "Unit members can read their assignments"
ON public.incident_assignments
FOR SELECT
TO authenticated
USING (public.is_unit_member(auth.uid(), unit_id));

DROP POLICY IF EXISTS "Dispatch can create assignments" ON public.incident_assignments;
CREATE POLICY "Dispatch can create assignments"
ON public.incident_assignments
FOR INSERT
TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
  AND assigned_by = auth.uid()
);

DROP POLICY IF EXISTS "Dispatch can update assignments" ON public.incident_assignments;
CREATE POLICY "Dispatch can update assignments"
ON public.incident_assignments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dispatcher'));

DROP POLICY IF EXISTS "Unit members can acknowledge/update their assignments" ON public.incident_assignments;
CREATE POLICY "Unit members can acknowledge/update their assignments"
ON public.incident_assignments
FOR UPDATE
TO authenticated
USING (public.is_unit_member(auth.uid(), unit_id))
WITH CHECK (
  public.is_unit_member(auth.uid(), unit_id)
  AND (acknowledged_by IS NULL OR acknowledged_by = auth.uid())
);

-- Safety: ensure anon cannot access operational tables
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.incidents FROM anon;
REVOKE ALL ON public.responder_units FROM anon;
REVOKE ALL ON public.unit_members FROM anon;
REVOKE ALL ON public.unit_status_events FROM anon;
REVOKE ALL ON public.incident_assignments FROM anon;

-- Also ensure anon can't write even if a policy is mis-added later
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.incidents FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.responder_units FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.unit_members FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.unit_status_events FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.incident_assignments FROM anon;
