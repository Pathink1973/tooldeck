-- Force PostgREST to reload schema cache so it picks up the read_later_cards table
NOTIFY pgrst, 'reload schema';
