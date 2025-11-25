# Garala - Plateforme de Petites Annonces

**Slogan :** *Tout se vend, tout s'achète*

Garala est une plateforme de petites annonces inspirée de Leboncoin, adaptée pour le marché centrafricain avec une attention particulière portée à Bangui.

## 🚀 Stack Technique

- **Framework** : Next.js 16 (App Router) with Turbopack
- **Base de données** : Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Styling** : Tailwind CSS v4
- **Langage** : TypeScript
- **Validation** : Zod
- **Animations** : Framer Motion
- **Icônes** : Lucide React

## 📱 Fonctionnalités

### ✅ Implémentées

- **Authentification**
  - Email/Password avec vérification
  - OAuth Google et Apple
  - Wizard multi-étapes avec toggle Connexion/Inscription
  
- **Annonces**
  - Création via wizard 6 étapes
  - Upload d'images avec compression WhatsApp (max 1MB)
  - Feed avec pagination
  - Détails d'annonce
  - Localisation Bangui (quartiers/arrondissements)
  - FCFA (Franc CFA)
  - **Gestion d'annonces** (Sprint 1)
    - Partager (Web Share API + clipboard)
    - Modifier (redirect vers edit)
    - Supprimer avec confirmation
    - Signaler une annonce

- **Modération**
  - Table reports avec RLS
  - Signalements par utilisateurs authentifiés

- **Profil**
  - Modification nom/username
  - Suppression de compte avec archivage

- **Conformité Légale**
  - Pages CGU, Privacy, Cookies, À propos
  - Cookie consent banner
  - Archivage 90 jours des comptes supprimés
  - Footer avec liens légaux

### 🚧 À venir (Sprint 2+)

- **Annonces Invité** (sans compte, expiration 7j)
- **Édition d'annonces** (formulaire complet)
- **Messagerie** (Realtime chat)
- **Favoris & Notifications**
- **Dark Mode**
- **Bottom Navigation Mobile**

## 📚 Documentation

- **CHANGELOG.md** : Historique détaillé des modifications
- **MEMORY.md** : Problèmes récurrents et solutions
- **garala_prototype/README.md** : Architecture prototype de référence

## 🐛 Problèmes Connus

### Build Turbopack

Problème Next.js 16 avec fonts en production. Utiliser `npm run dev`.

### Suppression OAuth

Suppression d'utilisateurs OAuth depuis Dashboard Supabase peut échouer. Utiliser la fonction `delete_user_account()`.

---

**Garala** - *Tout se vend, tout s'achète* 🏪
