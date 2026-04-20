insert into public.team_members (id, user_id, role, display_name, phone)
values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'admin', 'Rekha Kumari', '+91 98765 40001'),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'field_worker', 'Arif Ansari', '+91 98765 40002'),
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'view_only', 'Neelam Devi', '+91 98765 40003')
on conflict (user_id) do nothing;

insert into public.contacts (
  id, name, name_hi, phone, whatsapp, village, panchayat, block, district, tags, notes, photo_url, last_visit_at, visit_count, added_by
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'Ramesh Paswan',
    'रमेश पासवान',
    '+91 91234 50001',
    '+91 91234 50001',
    'Mahua Tola',
    'Basantpur',
    'Mahua',
    'Vaishali',
    array['farmer', 'flood-watch'],
    'Keeps track of the low-lying fields near the canal. Usually the first to notice water rise.',
    null,
    timezone('utc', now()) - interval '34 days',
    11,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Sunita Devi',
    'सुनीता देवी',
    '+91 91234 50002',
    '+91 91234 50002',
    'Chandpur Basti',
    'Basantpur',
    'Mahua',
    'Vaishali',
    array['self-help-group', 'women-leader'],
    'Runs the women’s group circle and often gathers concerns before meetings.',
    null,
    timezone('utc', now()) - interval '19 days',
    14,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Md. Aslam',
    'मो. असलम',
    '+91 91234 50003',
    '+91 91234 50003',
    'Naya Gaon',
    'Rampur Khajuria',
    'Mahua',
    'Vaishali',
    array['youth-volunteer', 'bike-access'],
    'Can reach scattered hamlets quickly. Useful in urgent follow-up.',
    null,
    timezone('utc', now()) - interval '8 days',
    9,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Pushpa Kumari',
    'पुष्पा कुमारी',
    '+91 91234 50004',
    '+91 91234 50004',
    'Bishunpur',
    'Rampur Khajuria',
    'Mahua',
    'Vaishali',
    array['anganwadi', 'nutrition'],
    'Tracks nutrition follow-up for mothers with infants.',
    null,
    timezone('utc', now()) - interval '67 days',
    5,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    'Bhola Yadav',
    'भोला यादव',
    '+91 91234 50005',
    null,
    'Jalalpur',
    'Sahariya',
    'Mahua',
    'Vaishali',
    array['panchayat-member', 'water'],
    'Usually available in the evening after field work.',
    null,
    timezone('utc', now()) - interval '12 days',
    17,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    'Kiran Bano',
    'किरण बानो',
    '+91 91234 50006',
    '+91 91234 50006',
    'Sikandarpur',
    'Sahariya',
    'Mahua',
    'Vaishali',
    array['health', 'volunteer'],
    'Often helps with medical referrals and escort support.',
    null,
    timezone('utc', now()) - interval '4 days',
    8,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000007',
    'Anil Kumar',
    'अनिल कुमार',
    '+91 91234 50007',
    '+91 91234 50007',
    'Betia East',
    'Chandpura',
    'Mahua',
    'Vaishali',
    array['tractor-owner', 'logistics'],
    'Provides transport during flood response if fuel is arranged.',
    null,
    timezone('utc', now()) - interval '42 days',
    6,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000008',
    'Mamta Ji',
    'ममता जी',
    '+91 91234 50008',
    '+91 91234 50008',
    'Khaira Tola',
    'Chandpura',
    'Mahua',
    'Vaishali',
    array['school-committee', 'adolescent-girls'],
    'Leads the local adolescent girls learning circle.',
    null,
    timezone('utc', now()) - interval '26 days',
    10,
    '20000000-0000-0000-0000-000000000002'
  )
on conflict (id) do nothing;

insert into public.contact_locations (id, contact_id, label, latitude, longitude, accuracy_m, is_primary)
values
  ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Home', 25.7198, 85.4024, 18, true),
  ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Meeting Point', 25.7239, 85.4090, 24, true),
  ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'Naya Gaon Centre', 25.7314, 85.4162, 12, true),
  ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'Anganwadi Kendra', 25.7353, 85.4288, 15, true),
  ('31000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 'Ward Chowk', 25.7095, 85.3927, 17, true),
  ('31000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000006', 'Clinic Turn', 25.7047, 85.4014, 20, true),
  ('31000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', 'Tractor Shed', 25.7418, 85.4382, 28, true),
  ('31000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000008', 'School Gate', 25.7473, 85.4474, 19, true)
on conflict (id) do nothing;

insert into public.issues (
  id, contact_id, title, type, priority, status, description, action_taken, next_followup_at, assigned_to, created_by, created_at
)
values
  (
    '32000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Canal water entered lower field edge',
    'flood-risk',
    'high',
    'in_progress',
    'Bund repair is needed before the next heavy rain.',
    'Shared with panchayat member and marked for field check.',
    timezone('utc', now()) + interval '2 days',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '3 days'
  ),
  (
    '32000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'Self-help group meeting space locked',
    'community-space',
    'medium',
    'open',
    'Women’s group could not meet this week because the room key was not available.',
    'No action yet.',
    timezone('utc', now()) + interval '5 days',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '6 days'
  ),
  (
    '32000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000004',
    'Nutrition supplies delayed for two weeks',
    'nutrition',
    'critical',
    'blocked',
    'Children under three have missed the latest supply cycle.',
    'Called block office. Waiting for dispatch date.',
    timezone('utc', now()) + interval '1 day',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    '32000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000005',
    'Handpump repair request pending',
    'water',
    'high',
    'open',
    'Main handpump near ward chowk is still not repaired.',
    'Awaiting mechanic visit.',
    timezone('utc', now()) + interval '4 days',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '8 days'
  ),
  (
    '32000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000006',
    'Medical escort needed for antenatal check-up',
    'medical-support',
    'medium',
    'in_progress',
    'Family needs help getting to the community health centre.',
    'Volunteer support lined up for Thursday morning.',
    timezone('utc', now()) + interval '1 day',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '2 days'
  ),
  (
    '32000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000008',
    'Learning circle attendance dropped sharply',
    'education',
    'medium',
    'open',
    'Several girls have stopped coming after sunset because of lighting concerns.',
    'Need to speak with guardians and school committee.',
    timezone('utc', now()) + interval '6 days',
    '20000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '4 days'
  )
on conflict (id) do nothing;

insert into public.visits (
  id, contact_id, visited_by, visited_at, village, panchayat, duration_mins, outcome, notes, latitude, longitude
)
values
  ('33000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '4 days', 'Sikandarpur', 'Sahariya', 45, 'Escort plan agreed', 'Family confirmed they can leave by 8:30 AM.', 25.7047, 85.4014),
  ('33000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '8 days', 'Naya Gaon', 'Rampur Khajuria', 30, 'Volunteer route updated', 'Aslam shared two alternate lanes for rainy days.', 25.7314, 85.4162),
  ('33000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '12 days', 'Jalalpur', 'Sahariya', 35, 'Repair need confirmed', 'Handpump handle is still broken.', 25.7095, 85.3927),
  ('33000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '19 days', 'Chandpur Basti', 'Basantpur', 40, 'Group concerns collected', 'Women asked for safer evening meeting space.', 25.7239, 85.4090),
  ('33000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '26 days', 'Khaira Tola', 'Chandpura', 50, 'Attendance issue surfaced', 'Parents mentioned fear of dark road after evening class.', 25.7473, 85.4474),
  ('33000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '34 days', 'Mahua Tola', 'Basantpur', 55, 'Field risk mapped', 'Ramesh marked the section where water first enters.', 25.7198, 85.4024),
  ('33000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '42 days', 'Betia East', 'Chandpura', 20, 'Transport support discussed', 'Fuel support needed if transport is activated.', 25.7418, 85.4382),
  ('33000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '67 days', 'Bishunpur', 'Rampur Khajuria', 60, 'Stock gap escalated', 'Children may miss the next cycle too if delivery is delayed.', 25.7353, 85.4288),
  ('33000000-0000-0000-0000-000000000009', null, '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '3 days', 'Mahua Tola', 'Basantpur', 70, 'Area walk complete', 'Visited the canal edge and met two families without scheduled check-ins.', 25.7189, 85.4019),
  ('33000000-0000-0000-0000-000000000010', null, '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '10 days', 'Sikandarpur', 'Sahariya', 65, 'Health route reviewed', 'Volunteer path is usable even after rainfall.', 25.7052, 85.4009)
on conflict (id) do nothing;

insert into public.interactions (id, contact_id, interaction_type, interacted_by, interacted_at, notes)
values
  ('34000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'call', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '5 days', 'Checked on rainwater movement near the canal.'),
  ('34000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'meeting', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '19 days', 'Women’s group shared meeting space concern.'),
  ('34000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', 'call', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '2 days', 'Followed up on nutrition stock delay.')
on conflict (id) do nothing;

insert into public.alerts (id, created_by, crisis_type, latitude, longitude, radius_km, status, triggered_at)
values
  ('35000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Flood', 25.7204, 85.4031, 3, 'closed', timezone('utc', now()) - interval '28 days'),
  ('35000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Medical Emergency', 25.7050, 85.4012, 2, 'triggered', timezone('utc', now()) - interval '14 hours')
on conflict (id) do nothing;

insert into public.alert_recipients (id, alert_id, contact_id, distance_m, notified_at, response, responded_at)
values
  ('36000000-0000-0000-0000-000000000001', '35000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 140, timezone('utc', now()) - interval '28 days', 'Reached by phone and moved grain sacks to higher room.', timezone('utc', now()) - interval '28 days' + interval '25 minutes'),
  ('36000000-0000-0000-0000-000000000002', '35000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 860, timezone('utc', now()) - interval '28 days', 'Helped share warning across Naya Gaon.', timezone('utc', now()) - interval '28 days' + interval '32 minutes'),
  ('36000000-0000-0000-0000-000000000003', '35000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000006', 52, timezone('utc', now()) - interval '14 hours', 'Accompanied family to clinic.', timezone('utc', now()) - interval '13 hours 30 minutes'),
  ('36000000-0000-0000-0000-000000000004', '35000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005', 1020, timezone('utc', now()) - interval '14 hours', 'Kept road access open for vehicle.', timezone('utc', now()) - interval '13 hours 10 minutes')
on conflict (id) do nothing;

insert into public.access_requests (id, name, organization, phone, email, district, notes)
values
  ('37000000-0000-0000-0000-000000000001', 'Priyanka Singh', 'Jeevika cluster team', '+91 93456 70001', 'priyanka@example.org', 'Muzaffarpur', 'Looking for a pilot with four field staff.')
on conflict (id) do nothing;

insert into public.contact_messages (id, name, email, phone, message)
values
  ('38000000-0000-0000-0000-000000000001', 'Akhilesh Kumar', 'akhilesh@example.org', '+91 93456 70002', 'We are mapping village visits manually and want to understand whether Khidkee can fit our block-level team.')
on conflict (id) do nothing;

