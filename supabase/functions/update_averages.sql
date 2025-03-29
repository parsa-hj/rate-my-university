-- Function to update university averages when a rating is modified
CREATE OR REPLACE FUNCTION update_university_averages()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is a DELETE operation, use OLD.universityid
    -- If this is an INSERT or UPDATE operation, use NEW.universityid
    DECLARE
        target_university_id INTEGER;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            target_university_id := OLD.universityid;
        ELSE
            target_university_id := NEW.universityid;
        END IF;

        -- Update or insert averages in the category table
        INSERT INTO category (universityid, avgstudentlife, avgclassesteachers, avgcost, avgreturnoninvestment, avgdiningfood, avgdormshousing, avghealthsafety, avgcitysetting)
        VALUES (
            target_university_id,
            COALESCE((SELECT AVG(studentlife) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(classesteachers) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(cost) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(returnoninvestment) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(diningfood) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(dormshousing) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(healthsafety) FROM rating WHERE universityid = target_university_id), 0),
            COALESCE((SELECT AVG(citysetting) FROM rating WHERE universityid = target_university_id), 0)
        )
        ON CONFLICT (universityid) DO UPDATE
        SET
            avgstudentlife = EXCLUDED.avgstudentlife,
            avgclassesteachers = EXCLUDED.avgclassesteachers,
            avgcost = EXCLUDED.avgcost,
            avgreturnoninvestment = EXCLUDED.avgreturnoninvestment,
            avgdiningfood = EXCLUDED.avgdiningfood,
            avgdormshousing = EXCLUDED.avgdormshousing,
            avghealthsafety = EXCLUDED.avghealthsafety,
            avgcitysetting = EXCLUDED.avgcitysetting;
    END;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_averages_trigger_insert ON rating;
DROP TRIGGER IF EXISTS update_averages_trigger_update ON rating;
DROP TRIGGER IF EXISTS update_averages_trigger_delete ON rating;

-- Create triggers for INSERT, UPDATE, and DELETE operations
CREATE TRIGGER update_averages_trigger_insert
    AFTER INSERT ON rating
    FOR EACH ROW
    EXECUTE FUNCTION update_university_averages();

CREATE TRIGGER update_averages_trigger_update
    AFTER UPDATE ON rating
    FOR EACH ROW
    EXECUTE FUNCTION update_university_averages();

CREATE TRIGGER update_averages_trigger_delete
    AFTER DELETE ON rating
    FOR EACH ROW
    EXECUTE FUNCTION update_university_averages();
