-- Bootstrap: allow the very first signed-in user to claim admin (only if no admin exists)

CREATE OR REPLACE FUNCTION public.any_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.claim_initial_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Only allow if there are currently NO admins
  IF public.any_admin_exists() THEN
    RETURN false;
  END IF;

  -- Ensure a profile exists for the user
  INSERT INTO public.profiles (user_id)
  VALUES (_uid)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

-- Allow authenticated users to call these functions (execution privileges)
GRANT EXECUTE ON FUNCTION public.any_admin_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;
