-- Table pour archiver les utilisateurs supprimés (conformité RGPD)
-- Conservation 90 jours avant purge définitive

CREATE TABLE archived_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_user_id uuid NOT NULL,
  user_data jsonb NOT NULL,
  profile_data jsonb,
  listings_data jsonb,
  deletion_date timestamptz DEFAULT now() NOT NULL,
  purge_date timestamptz DEFAULT (now() + interval '90 days') NOT NULL,
  deletion_reason text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index pour recherche rapide
CREATE INDEX idx_archived_users_purge_date ON archived_users(purge_date);
CREATE INDEX idx_archived_users_original_id ON archived_users(original_user_id);

-- RLS: Seulement les admins peuvent lire (via service_role)
ALTER TABLE archived_users ENABLE ROW LEVEL SECURITY;

-- Fonction pour purger automatiquement les comptes expirés
CREATE OR REPLACE FUNCTION purge_expired_archived_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM archived_users
  WHERE purge_date < now();
END;
$$;

-- Mise à jour de la fonction de suppression pour archiver
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  user_record jsonb;
  profile_record jsonb;
  listings_record jsonb;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Récupérer les données du profil
  SELECT to_jsonb(profiles.*) INTO profile_record
  FROM profiles WHERE id = user_id;

  -- Récupérer les annonces de l'utilisateur
  SELECT jsonb_agg(to_jsonb(listings.*)) INTO listings_record
  FROM listings WHERE user_id = user_id;

  -- Récupérer les métadonnées d'authentification
  SELECT to_jsonb(auth.users.*) INTO user_record
  FROM auth.users WHERE id = user_id;

  -- Archiver les données
  INSERT INTO archived_users (
    original_user_id,
    user_data,
    profile_data,
    listings_data,
    deletion_reason
  ) VALUES (
    user_id,
    user_record,
    profile_record,
    COALESCE(listings_record, '[]'::jsonb),
    'User requested account deletion'
  );

  -- Supprimer les annonces
  DELETE FROM listings WHERE user_id = user_id;

  -- Supprimer le profil
  DELETE FROM profiles WHERE id = user_id;
  
  -- Supprimer l'utilisateur (cascade)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Fonction pour restaurer un compte (dans les 90 jours)
CREATE OR REPLACE FUNCTION restore_archived_user(archived_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  archive_record archived_users%ROWTYPE;
BEGIN
  -- Récupérer l'archive
  SELECT * INTO archive_record
  FROM archived_users
  WHERE id = archived_id AND purge_date > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Archive not found or expired';
  END IF;

  -- Note: La restauration complète nécessite une logique côté application
  -- car la réinsertion dans auth.users n'est pas possible directement
  
  RAISE NOTICE 'Archive found. Restoration requires manual intervention.';
END;
$$;
