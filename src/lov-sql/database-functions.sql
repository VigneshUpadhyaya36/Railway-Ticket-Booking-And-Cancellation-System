
-- Function to safely decrement a value in a column
CREATE OR REPLACE FUNCTION public.decrement(row_id uuid, value integer)
RETURNS integer AS $$
DECLARE
  current_value integer;
BEGIN
  -- Get the current value
  SELECT available_seats INTO current_value FROM train WHERE train_id = row_id;
  
  -- Only decrement if result would be non-negative
  IF current_value >= value THEN
    UPDATE train SET available_seats = available_seats - value WHERE train_id = row_id;
    RETURN current_value - value;
  ELSE
    -- If not enough seats, set to 0
    UPDATE train SET available_seats = 0 WHERE train_id = row_id;
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to safely increment a value in a column
CREATE OR REPLACE FUNCTION public.increment(row_id uuid, value integer)
RETURNS integer AS $$
DECLARE
  current_value integer;
  max_value integer;
BEGIN
  -- Get the current value and max value (total seats)
  SELECT available_seats, total_seats INTO current_value, max_value FROM train WHERE train_id = row_id;
  
  -- Only increment if it wouldn't exceed the maximum
  IF current_value + value <= max_value THEN
    UPDATE train SET available_seats = available_seats + value WHERE train_id = row_id;
    RETURN current_value + value;
  ELSE
    -- If it would exceed, set to max
    UPDATE train SET available_seats = max_value WHERE train_id = row_id;
    RETURN max_value;
  END IF;
END;
$$ LANGUAGE plpgsql;
