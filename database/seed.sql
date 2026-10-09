INSERT INTO owners (email)
VALUES ('demo@allora.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO notes (owner_id, created_by, title, body)
SELECT id, id, 'Welcome to Allora', 'Your workspace is ready.'
FROM owners
WHERE email = 'demo@allora.local'
  AND NOT EXISTS (SELECT 1 FROM notes WHERE title = 'Welcome to Allora');
