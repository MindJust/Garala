# 📝 CHANGELOG - Garala

## [Sprint 1] - 2025-11-25

### Added
- ✅ **API Route d'Upload** (`app/api/upload/route.ts`)
  - Wrapper pour la fonction `uploadListingImage`
  - Fix de l'erreur 404 lors de l'upload d'images

- ✅ **Système de Gestion d'Annonces**
  - Server actions (`listing-management.actions.ts`):
    - `deleteListing()` - Suppression avec vérification propriété
    - `reportListing()` - Signalement d'annonces
    - `isListingOwner()` - Vérification propriété
  - Composant UI (`listing-actions.tsx`):
    - Dropdown menu actions (Partager, Modifier, Supprimer, Signaler)
    - Web Share API avec fallback clipboard
    - Dialogs de confirmation (AlertDialog, Dialog)
  - Page Edit placeholder (`app/listings/[id]/edit/page.tsx`)
  
- ✅ **Table Reports** (Base de données)
  - Schema SQL avec RLS policies
  - Colonnes: reason, details, status
  - Foreign keys vers listings & profiles

### Fixed
- 🐛 **Delete Function Error**
  - Enlevé `is_guest` du SELECT (colonne inexistante)
  - Ajouté gestion NEXT_REDIRECT dans catch
  - Fix "erreur lors de la suppression" alors que ça marchait

- 🐛 **Image Upload 404**
  - API route manquante créée
  - Restauré fonctionnalité d'upload

- 🐛 **Build Errors**
  - Cache .next cleared et rebuild
  - Turbopack parsing errors résolus

### Changed
- Server action `deleteListing`: remove `is_guest` check (Sprint 2 feature)
- Composant `listing-actions`: meilleure gestion des redirects Next.js

### Database
```sql
-- Table reports créée
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  reporter_id UUID REFERENCES profiles(id),
  reason TEXT CHECK (spam|inappropriate|scam|duplicate|other),
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Components
- `components/features/listings/listing-management.actions.ts` (NEW)
- `components/features/listings/listing-actions.tsx` (NEW)
- `app/listings/[id]/page.tsx` (MODIFIED - added ListingActions)
- `app/listings/[id]/edit/page.tsx` (NEW - placeholder)
- `app/api/upload/route.ts` (NEW)

---

## [Phase 2D] - 2025-11-24 (Historical)

### Added
- Search & Filters
- OAuth Google
- UI Polish (skeletons, toasts)

---

## Notes
- **Sprint 1 Status**: Presque complet (manque test final)
- **Prochains sprints**: Guest posts, Edit fonctionnel, Messagerie
