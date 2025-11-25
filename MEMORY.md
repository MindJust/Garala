# 🧠 MEMORY - Garala Development

> **Dernière mise à jour**: 2025-11-25 22:20

---

## 🚨 Problèmes Récurrents & Solutions

### 1. Image Upload Broken (RÉSOLU)
**Symptôme**: `POST /api/upload 404`  
**Cause**: API route manquante  
**Fix**: Créé `app/api/upload/route.ts` wrapper vers `uploadListingImage`  
**Date**: 2025-11-25

### 2. Delete Shows "Error" But Works (RÉSOLU)
**Symptôme**: Toast "Erreur" affiché mais suppression fonctionne  
**Cause**: `redirect()` Next.js lance exception NEXT_REDIRECT  
**Fix**: Catch spécifique pour ignorer NEXT_REDIRECT  
**Date**: 2025-11-25

### 3. Build Errors After Code Changes
**Symptôme**: Parsing errors, cache corrompu  
**Solution**: 
```bash
Remove-Item -Force -Recurse .next
npm run dev
```

---

## 📦 Architecture Actuelle

### Database Schema
```
listings (table principale)
  - id, user_id, title, description
  - price, currency, category
  - images[], location (jsonb)
  - phone, status
  - created_at, updated_at
  
profiles (utilisateurs)
  - id, username, full_name
  - avatar_url
  - created_at, updated_at

reports (signalements) ✅ NEW Sprint 1
  - id, listing_id, reporter_id
  - reason, details, status
```

### Server Actions Locations
- **Listings CRUD**: `components/features/listings/listings.actions.ts`
- **Listing Management**: `components/features/listings/listing-management.actions.ts` (NEW)
  - deleteListing()
  - reportListing()
  - isListingOwner()

### API Routes
- `/api/upload` → `uploadListingImage` wrapper

---

## 🔧 Configuration Important

### Supabase Storage
- Bucket: `listing-images`
- Structure: `{user_id}/{random}.{ext}`
- Public access: oui

### RLS Policies Active
- listings: INSERT (auth users), SELECT (public), UPDATE/DELETE (owner only)
- profiles: SELECT (public), UPDATE (own only)
- reports: INSERT (auth users), SELECT (own reports only)

---

## ⚠️ Known Issues

### À NE PAS FAIRE
1. ❌ Ne pas utiliser `is_guest` dans queries (n'existe pas encore)
2. ❌ Ne pas modifier `listing-management.actions.ts` sans rebuild cache
3. ❌ Ne pas appeler server actions avec redirect() sans catch NEXT_REDIRECT

### Colonne Manquantes (Sprint 2)
- `listings.is_guest` (pour annonces sans compte)
- `listings.expires_at` (expiration 7 jours guest)
- `profiles.is_pro` (vendeurs pro)

---

## 📁 Fichiers Critiques

### Composants UI Réutilisables
- `components/ui/*` (shadcn)
- `components/features/listings/listing-card.tsx`
- `components/features/listings/image-upload.tsx`
- `components/features/listings/listing-actions.tsx` ✅ NEW

### Pages Importantes
- `app/listings/new/page.tsx` (création)
- `app/listings/[id]/page.tsx` (détails)
- `app/listings/[id]/edit/page.tsx` (placeholder)

---

## 🎯 Sprints Roadmap

### Sprint 1 (CURRENT - Presque fini)
- [x] Delete, Share, Report
- [x] Reports table + RLS
- [x] ListingActions component
- [ ] Tests finaux validation

### Sprint 2 (À venir)
- [ ] Guest posts (sans compte)
- [ ] Edit page fonctionnelle
- [ ] Expiration auto 7j

### Sprint 3
- [ ] Messagerie interne
- [ ] Chat threads
- [ ] Audio messages

---

## 💡 Lessons Learned

1. **Next.js redirect() throws**: Toujours catch avec check NEXT_REDIRECT
2. **Turbopack cache**: Supprimer .next si erreurs bizarres
3. **API routes vs Server Actions**: Server actions préférables, mais API nécessaire pour fetch() côté client
4. **RLS Policies**: Toujours DROP IF EXISTS avant CREATE
