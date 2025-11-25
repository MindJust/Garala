-- Fix: Drop existing policies and recreate them
-- Table reports existe déjà, on ajoute juste les policies manquantes

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

-- Activer RLS (si pas déjà activé)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Recréer les policies
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Créer les index si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_reports_listing ON public.reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);

-- Commentaires
COMMENT ON TABLE public.reports IS 'Table pour stocker les signalements d''annonces par les utilisateurs';
COMMENT ON COLUMN public.reports.reason IS 'Type de signalement: spam, inappropriate, scam, duplicate, other';
COMMENT ON COLUMN public.reports.status IS 'Statut du signalement: pending, reviewed, resolved, dismissed';
