# 🍊 GARALA - PWA MARKETPLACE ARCHITECTURE

> **Version:** 1.0.0 (Shell Prototype)  
> **Target:** République Centrafricaine (Bangui)  
> **Concept:** "Tout se vend, tout s'achète."

---

## ⚡ 1. LE MANIFESTE TECHNIQUE (ΩMEGA ARCHITECTURE)

Cette application est conçue comme une **"Coquille Intelligente" (Smart Shell)**. Elle est construite pour offrir une expérience native (60fps) via le web, avec une tolérance zéro pour les coupures réseau et une obsession pour la sécurité.

### 🏗️ La Stack (L'Arsenal)
*   **Core:** React 19 + TypeScript (Strict Mode).
*   **Routing:** React Router v7 (HashRouter pour compatibilité statique maximale).
*   **Styling:** Tailwind CSS (Mobile-First, Dark Mode natif class-based).
*   **Icons:** Lucide React (SVG légers et tree-shakables).
*   **State:** React Context API + Custom Hooks (`useUI`).
*   **PWA:** Service Worker (Caching statique) + Manifest.json complet.

---

## 🛡️ 2. PILIERS D'ARCHITECTURE

### 📡 A. Offline-First & Network Resilience
L'application ne doit jamais afficher une page blanche "Pas de connexion".
*   **Détection Réactive :** `UIContext` écoute l'état du réseau.
*   **Comportement Adaptatif :** 
    *   *Lecture (Read) :* Toujours possible (données en cache ou mock).
    *   *Écriture (Write) :* Bloquée avec feedback utilisateur immédiat (Toast Error) si `offlineMode` est actif.
*   **Service Worker :** Cache les assets critiques (JS, CSS, HTML) pour un chargement instantané au deuxième lancement.

### 🔒 B. Sécurité Paranoïaque (Frontend Layer)
Même sans backend connecté, l'UI implémente des patterns de sécurité stricts.
*   **App Lock System :** Un écran de verrouillage global (PIN / Biométrie simulée) qui s'active après un timeout d'inactivité ou lors du changement d'onglet (via `visibilitychange`).
*   **Verification Gate :** Les pages sensibles (Création Boutique, Paiements) sont protégées par des vérifications d'identité (Flux Webcam).
*   **Zod-like Validation :** Les formulaires (PostAd, Login) valident les types de données avant toute soumission.

### 🎨 C. UX "Liquid Motion"
*   **Pas de sauts de page :** Utilisation de Skeleton Screens (`AdSkeleton`) pendant les chargements.
*   **Feedback Haptique :** Utilisation de `navigator.vibrate()` lors des interactions clés (Like, Validation, Erreur).
*   **Navigation Contextuelle :** La `BottomNav` disparaît intelligemment lorsque le clavier virtuel s'ouvre (détection focus input) pour maximiser l'espace.

---

## 📂 3. CARTOGRAPHIE DU PROJET

```bash
/
├── components/         # Atomes & Molécules UI
│   ├── AppLockScreen   # Système de verrouillage global
│   ├── AdCard          # Composant carte produit (Smart Component)
│   └── ...
├── pages/              # Écrans principaux (Vues)
│   ├── HomePage        # Algorithme de recherche & Feed
│   ├── PostAdPage      # Wizard Form (Formulaire par étapes)
│   ├── ShopDashboard   # Gestion Pro (Stocks, Stats)
│   └── ...
├── context/
│   └── UIContext.tsx   # Cerveau de l'application (Global State)
├── constants.ts        # Config statique (Quartiers de Bangui, Plans, Mocks)
└── types.ts            # Définitions TypeScript strictes (Interfaces)
```

---

## 🚀 4. FONCTIONNALITÉS CLÉS (FEATURES)

### 🛒 Marketplace Engine
*   **Recherche Avancée :** Filtrage par tokens, prix min/max, catégorie et géolocalisation locale (Quartiers de Bangui).
*   **Tri Dynamique :** Pertinence, Prix, Date (automatique selon le contexte).

### 🏪 Espace Vendeur Pro (Shop Mode)
*   Une interface dédiée changeant radicalement l'UX pour les vendeurs "Pro".
*   Gestion rapide des stocks (Stepper +/-).
*   Gestion des variantes (Couleurs, Tailles).

### 💬 Messagerie & Interactions
*   Système de chat temps réel (simulé).
*   Envoi de messages vocaux (MediaRecorder API).
*   Partage de localisation et prise de rendez-vous.

### 💰 Monétisation (Simulée)
*   **Boosts :** Algorithme de mise en avant visuelle (`isBoosted`).
*   **Abonnements :** Gestion des plans (Basic, Enterprise).
*   **Publicité :** Régie publicitaire intégrée.

---

## 🔧 5. INSTALLATION & DÉPLOIEMENT

### Pré-requis
*   Node.js 18+
*   NPM ou Yarn

### Démarrage
```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

### Build Production
```bash
# Générer le bundle optimisé
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🔮 6. ROADMAP (PROCHAINES ÉTAPES)

1.  **Backend Sync :** Remplacer `MOCK_ADS` par Supabase (PostgreSQL).
2.  **Auth Réelle :** Intégrer Supabase Auth (OTP SMS).
3.  **Storage Réel :** Upload des images vers Supabase Storage (Buckets).
4.  **Edge Functions :** Notifications Push réelles via OneSignal ou FCM.

---

*Architected by ΩMEGA.*
