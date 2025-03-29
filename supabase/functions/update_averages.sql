-- Add logging table if needed
CREATE TABLE IF NOT EXISTS debug_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    message TEXT
);

-- Function to update category averages
CREATE OR REPLACE FUNCTION update_university_averages()
RETURNS TRIGGER AS $$
DECLARE
    target_university_id INTEGER;
BEGIN
    -- Determine which university to update
    IF TG_OP = 'DELETE' THEN
        target_university_id := OLD.universityid;
    ELSE
        target_university_id := NEW.universityid;
    END IF;

    -- Update or insert the averages
    INSERT INTO category (
        universityid,
        avgstudentlife,
        avgclassesteachers,
        avgcost,
        avgreturnoninvestment,
        avgdiningfood,
        avgdormshousing,
        avghealthsafety,
        avgcitysetting
    )
    SELECT 
        target_university_id,
        ROUND(AVG(studentlife)::numeric, 1),
        ROUND(AVG(classesteachers)::numeric, 1),
        ROUND(AVG(cost)::numeric, 1),
        ROUND(AVG(returnoninvestment)::numeric, 1),
        ROUND(AVG(diningfood)::numeric, 1),
        ROUND(AVG(dormshousing)::numeric, 1),
        ROUND(AVG(healthsafety)::numeric, 1),
        ROUND(AVG(citysetting)::numeric, 1)
    FROM rating
    WHERE universityid = target_university_id
    GROUP BY universityid
    ON CONFLICT (universityid) DO UPDATE SET
        avgstudentlife = EXCLUDED.avgstudentlife,
        avgclassesteachers = EXCLUDED.avgclassesteachers,
        avgcost = EXCLUDED.avgcost,
        avgreturnoninvestment = EXCLUDED.avgreturnoninvestment,
        avgdiningfood = EXCLUDED.avgdiningfood,
        avgdormshousing = EXCLUDED.avgdormshousing,
        avghealthsafety = EXCLUDED.avghealthsafety,
        avgcitysetting = EXCLUDED.avgcitysetting;

    -- Log the trigger firing
    INSERT INTO debug_logs (message) 
    VALUES ('Trigger fired for university: ' || target_university_id);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_averages_trigger ON rating;
DROP TRIGGER IF EXISTS rating_insert_trigger ON rating;
DROP TRIGGER IF EXISTS rating_update_trigger ON rating;
DROP TRIGGER IF EXISTS rating_delete_trigger ON rating;
DROP TRIGGER IF EXISTS update_averages_trigger_insert ON rating;
DROP TRIGGER IF EXISTS update_averages_trigger_update ON rating;
DROP TRIGGER IF EXISTS update_averages_trigger_delete ON rating;
DROP FUNCTION IF EXISTS update_university_averages();

-- Populate initial data (optional - run this to initialize all averages)
DO $$
DECLARE
  uni_id INT;
BEGIN
  -- Clear existing category data
  DELETE FROM category;
  
  -- Get all distinct university IDs
  FOR uni_id IN SELECT DISTINCT universityid FROM rating LOOP
    -- Run the update function for each university
    PERFORM update_university_averages();
  END LOOP;
END;
$$ LANGUAGE plpgsql;
