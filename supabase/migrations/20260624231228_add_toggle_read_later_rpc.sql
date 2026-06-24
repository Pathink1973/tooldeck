/*
# Add toggle_read_later RPC function

Creates a stored procedure that adds or removes a card from read_later_cards
for the currently authenticated user. Using an RPC bypasses PostgREST schema
cache issues that affect direct table access on newly created tables.

1. New function
   - `toggle_read_later(p_card_id uuid)` — inserts or deletes from read_later_cards
   - Returns boolean: true = added, false = removed
   - Runs as SECURITY INVOKER (uses caller's auth.uid())
*/

CREATE OR REPLACE FUNCTION public.toggle_read_later(p_card_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_user_id uuid;
  v_exists boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.read_later_cards
    WHERE card_id = p_card_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.read_later_cards
    WHERE card_id = p_card_id AND user_id = v_user_id;
    RETURN false;
  ELSE
    INSERT INTO public.read_later_cards (card_id, user_id)
    VALUES (p_card_id, v_user_id);
    RETURN true;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_read_later(uuid) TO authenticated;
