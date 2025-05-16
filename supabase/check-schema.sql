-- This will show us the current structure of your ideas table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ideas';
