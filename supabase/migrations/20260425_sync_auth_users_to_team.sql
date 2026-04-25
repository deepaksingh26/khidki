-- Fix: Ensure all auth users have team_members records
-- This handles cases where users existed before the trigger was in place

INSERT INTO public.team_members (user_id, role, display_name, phone)
SELECT 
  au.id,
  CASE WHEN au.email = 'admin@khidkee.in' THEN 'admin'::public.team_role ELSE 'field_worker'::public.team_role END,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1), 'Team member'),
  au.phone
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.team_members tm WHERE tm.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;
