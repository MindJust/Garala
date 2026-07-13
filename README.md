# #GARALA 🚀
**GARALA** est une application web progressive (PWA) conçue pour centraliser, nettoyer et diffuser des annonces immobilières ou de vente issues de groupes WhatsApp communautaires.
Le projet résout un problème majeur : la fragmentation des informations dans les groupes de vente WhatsApp (canaux "uniquement administrateurs") en regroupant toutes les offres sur une plateforme unique, claire et consultable.
## 🛠️ Stack Technique & Architecture
L'application repose sur une architecture moderne séparée en 4 piliers principaux :

[ Groupes WhatsApp ] ──(Scraping Bot)──> [ LLM (Nettoyage/Filtrage) ] ──> [ Supabase (BDD/Images) ] ──> [ PWA Next.js ]

 * **Scraping Bot (WhatsApp) :** Surveille en continu les groupes de vente ciblés (où seuls les vendeurs publient) pour extraire les messages textuels et les médias.
 * **Intelligence Artificielle (LLM) :** Analyse les messages bruts pour filtrer le spam, extraire les données clés (prix, localisation, type de bien) et reformuler l'annonce pour la rendre plus lisible.
 * **Backend & Stockage (Supabase) :** Base de données PostgreSQL pour structurer les annonces et stockage (Storage Bucket) pour héberger les images extraites.
 * **Frontend (Next.js & PWA) :** Une interface web ultra-rapide, optimisée pour le SEO et installable sur smartphone comme une application native (Progressive Web App).
## 🚀 Démarrage Rapide
Ce projet est basé sur Next.js et initialisé avec create-next-app.
### Prerequis
Assurez-vous d'avoir configuré vos variables d'environnement (.env.local) pour connecter Supabase et l'API du LLM (si intégrée directement au front/api de Next).
### Lancement du serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev

```
Ouvrez http://localhost:3000 dans votre navigateur pour voir le résultat.
Vous pouvez commencer à modifier l'application en évaluant le fichier app/page.tsx. La page se met à jour automatiquement.
## 📱 Fonctionnalités Clés
 * ✨ **Centralisation Automatique :** Plus besoin de parcourir des dizaines de groupes WhatsApp.
 * 🧠 **Annonces Enrichies par IA :** Correction des fautes, structuration des critères et suppression du superflu.
 * 📸 **Gestion des Médias :** Association automatique des photos WhatsApp aux bonnes annonces.
 * Offline & Installable : Grâce au format **PWA**, les utilisateurs peuvent installer l'application sur leur écran d'accueil et consulter les annonces de manière fluide.
## 🌐 Déploiement
La méthode la plus simple pour déployer la partie Frontend de ce projet est d'utiliser la plateforme **Vercel** (créateurs de Next.js).
Consultez la documentation de déploiement de Next.js pour plus de détails.
