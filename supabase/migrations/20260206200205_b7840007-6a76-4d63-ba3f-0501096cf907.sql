-- Add new columns for recruiter contact form
ALTER TABLE public.contacts
ADD COLUMN company text,
ADD COLUMN role text,
ADD COLUMN contact_type text;

-- Rename 'nome' conceptually stays but we keep backward compat
-- No data loss since new columns are nullable
