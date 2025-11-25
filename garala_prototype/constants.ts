

import { Ad, Category, GeoLocation, InfoPageKey, BoostPlan, SubscriptionPlan } from './types';

export const APP_LAUNCH_DATE = new Date('2024-01-01').getTime(); // Simulation logic

const NOW = Date.now();
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

export const BOOST_PLANS: BoostPlan[] = [
  { 
    id: 'boost_basic', 
    price: 100, 
    label: 'Basique', 
    frequency: '2x / heure', 
    color: 'bg-gray-100 border-gray-200 text-gray-800' 
  },
  { 
    id: 'boost_standard', 
    price: 250, 
    label: 'Standard', 
    frequency: '5x / heure', 
    color: 'bg-blue-50 border-blue-200 text-blue-800' 
  },
  { 
    id: 'boost_premium', 
    price: 500, 
    label: 'Premium', 
    frequency: '15x / heure', 
    color: 'bg-green-50 border-green-200 text-green-800',
    highlight: true
  },
  { 
    id: 'boost_gold', 
    price: 1000, 
    label: 'Or', 
    frequency: '40x / heure', 
    globalReach: 'Top Général 10x / h',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800' 
  },
  { 
    id: 'boost_platinum', 
    price: 1500, 
    label: 'Platine', 
    frequency: '80x / heure', 
    globalReach: 'Top Général 20x / h',
    color: 'bg-purple-50 border-purple-200 text-purple-800' 
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub_basic',
    name: 'Pro Basique',
    price: 2000,
    description: 'Pour les vendeurs indépendants.',
    features: ['Boutique certifiée', 'Gestion de stock', 'Support prioritaire']
  },
  {
    id: 'sub_enterprise',
    name: 'Entreprise',
    price: 5000,
    description: 'Pour les équipes et grandes structures.',
    features: ['Compte multi-utilisateurs', 'Statistiques avancées', 'Badge Gold', 'API dédiée']
  }
];

// Coordinates for Bangui Neighborhoods (Approximate centers)
export const BANGUI_LOCATIONS: GeoLocation[] = [
  { name: 'Bangui, Centre-ville', lat: 4.3617, lng: 18.5550 },
  { name: 'Sica 1', lat: 4.3750, lng: 18.5600 },
  { name: 'Sica 2', lat: 4.3800, lng: 18.5650 },
  { name: 'Sica 3', lat: 4.3850, lng: 18.5700 },
  { name: 'PK5', lat: 4.3800, lng: 18.5400 },
  { name: 'Miskine', lat: 4.3900, lng: 18.5600 },
  { name: 'Boy-Rabe', lat: 4.4000, lng: 18.5800 },
  { name: 'Combattant', lat: 4.3700, lng: 18.5900 }, // Airport area
  { name: 'Fouh', lat: 4.3950, lng: 18.5700 },
  { name: 'Lakouanga', lat: 4.3550, lng: 18.5650 },
  { name: 'Bégoua', lat: 4.4200, lng: 18.5500 }, // North
  { name: 'PK10', lat: 4.4300, lng: 18.5400 },
  { name: 'PK11', lat: 4.4400, lng: 18.5350 },
  { name: 'PK12', lat: 4.4500, lng: 18.5300 },
  { name: 'Bimbo', lat: 4.3200, lng: 18.5300 }, // South West
  { name: 'Petevo', lat: 4.3300, lng: 18.5400 },
  { name: 'Ngaragba', lat: 4.3600, lng: 18.5900 },
  { name: 'Ouango', lat: 4.3700, lng: 18.6100 },
  { name: 'Galabadja', lat: 4.3950, lng: 18.5550 },
  { name: 'Gobongo', lat: 4.4100, lng: 18.5500 },
  { name: 'Kpetene', lat: 4.3850, lng: 18.5350 },
  { name: 'Ben-Zvi', lat: 4.3700, lng: 18.5600 },
  { name: '200 Villas', lat: 4.3650, lng: 18.5700 },
  { name: 'Malimaka', lat: 4.3900, lng: 18.5450 }
];

export const INFO_CONTENT: Record<InfoPageKey, { title: string; content: string }> = {
  ABOUT: {
    title: "À propos de Garala",
    content: `Garala est la plateforme de référence pour le commerce en ligne en République Centrafricaine. Née de la volonté de simplifier le quotidien des Centrafricains, notre application permet d'acheter, de vendre et d'échanger des biens et services en toute simplicité.

Notre Mission :
Connecter les acheteurs et les vendeurs locaux grâce à une technologie accessible, rapide et sécurisée, adaptée aux réalités de notre marché.

Nos Valeurs :
- Proximité : Une solution pensée par et pour les locaux.
- Sécurité : Des outils pour renforcer la confiance entre utilisateurs.
- Innovation : Digitaliser l'économie informelle pour offrir plus d'opportunités à tous.

Que vous soyez un particulier vendant son téléphone ou une entreprise cherchant à écouler son stock, Garala est votre partenaire de croissance.`
  },
  JOIN_US: {
    title: "Carrières",
    content: `Rejoignez l'aventure Garala !

Nous sommes une équipe jeune, dynamique et ambitieuse, basée à Bangui. Nous cherchons en permanence des talents pour nous aider à transformer le commerce en RCA.

Postes ouverts régulièrement :
- Développeurs Fullstack (React / Node.js)
- Commerciaux terrain & B2B
- Service Client & Modération
- Marketing Digital

Pourquoi nous rejoindre ?
- Impact réel sur l'économie locale.
- Environnement de travail stimulant.
- Formation continue et évolution.

Envoyez votre CV et lettre de motivation à : jobs@garala.cf`
  },
  IMPACT: {
    title: "Notre Engagement Écologique",
    content: `Chez Garala, nous croyons que la seconde main est l'avenir de la consommation durable.

L'économie circulaire :
Chaque objet vendu sur Garala est un objet qui n'est pas jeté. En facilitant le réemploi, nous contribuons à réduire les déchets électroniques, textiles et plastiques à Bangui et en province.

Nos actions :
- Sensibilisation à la réparation plutôt qu'au remplacement.
- Partenariats avec des artisans locaux pour la remise en état des objets.
- Optimisation de notre infrastructure numérique pour réduire notre empreinte carbone.

Acheter d'occasion, c'est un geste pour votre portefeuille et pour la planète.`
  },
  ADS: {
    title: "Solutions Publicitaires",
    content: `Boostez votre visibilité avec Garala Publicité.

Avec des milliers de visiteurs uniques par jour, Garala est le média idéal pour toucher une audience urbaine, connectée et prête à consommer.

Nos formats :
- Bannières in-app (Accueil, Recherche).
- Articles sponsorisés et notifications push.
- Habillage de catégories spécifiques.

Ciblage précis :
Touchez vos clients selon leur localisation (quartier), leurs centres d'intérêt (Auto, Immo, Tech) ou leur comportement d'achat.

Demandez notre kit média : pub@garala.cf`
  },
  PRO_IMMO: {
    title: "Espace Pro Immobilier",
    content: `Digitalisez votre agence immobilière.

Garala Immo offre aux agences et courtiers indépendants des outils puissants pour louer et vendre plus vite.

Avantages Pro Immo :
- Compte certifié "Agence Vérifiée" (Badge de confiance).
- Publication illimitée d'annonces avec photos HD.
- Remontée automatique en tête de liste chaque semaine.
- Tableau de bord de performance (Vues, Appels, Messages).
- Gestion de flotte pour vos agents.

Tarifs préférentiels pour les abonnements annuels. Contactez notre équipe commerciale dédiée.`
  },
  RECRUITMENT: {
    title: "Solutions RH & Recrutement",
    content: `Trouvez les talents qu'il vous faut.

La catégorie Emploi de Garala connecte les entreprises locales avec les chercheurs d'emploi actifs.

Pour les recruteurs :
- CVthèque accessible sur demande.
- Mise en avant des offres d'emploi "Urgentes".
- Filtrage des candidats par compétences.

Pour les candidats :
- Création de profil professionnel.
- Alertes emploi par catégorie.

Simplifiez vos recrutements dès aujourd'hui.`
  },
  TERMS: {
    title: "Conditions Générales d'Utilisation",
    content: `Dernière mise à jour : Octobre 2023

1. Objet
Les présentes CGU régissent l'utilisation de l'application Garala. Tout accès et utilisation de l'application suppose l'acceptation inconditionnelle de ces termes.

2. Compte Utilisateur
L'inscription est gratuite. L'utilisateur s'engage à fournir des informations exactes. Garala se réserve le droit de suspendre tout compte suspect ou frauduleux.

3. Dépôt d'annonces
L'annonceur est seul responsable du contenu de son annonce. Il certifie détenir les droits sur le bien vendu.
Sont interdits : armes, drogues, contrefaçons, contenus haineux ou sexuels.

4. Responsabilité
Garala est une plateforme de mise en relation technique. Nous n'intervenons pas dans la transaction finale et ne garantissons pas la solvabilité des acheteurs ni la qualité des biens.

5. Paiements et Services Payants
Les options de visibilité (Boost) et abonnements Pro sont payables via Mobile Money. Ils sont fermes et non remboursables une fois le service activé.

6. Modification
Garala peut modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés des changements majeurs.`
  },
  RULES: {
    title: "Règles de Diffusion",
    content: `Pour garantir la qualité du service, voici les règles à respecter :

1. Texte de l'annonce
- Le titre doit être clair et décrire le bien.
- Pas de titres en MAJUSCULES excessives.
- Pas de mots-clés sans rapport (spam).
- Description honnête de l'état du bien.

2. Photos
- Photos réelles du bien (pas d'images Google génériques si possible).
- Pas de photos avec logos d'autres sites concurrents.
- Pas de photos suggestives ou inappropriées.

3. Prix
- Le prix doit être le prix final (TTC).
- Pas de prix "1 FCFA" pour solliciter des offres, indiquez le vrai prix.

4. Doublons
- Ne publiez pas plusieurs fois la même annonce. Supprimez l'ancienne avant de republier.

Le non-respect de ces règles entraînera le rejet de l'annonce.`
  },
  PRIVACY: {
    title: "Politique de Confidentialité",
    content: `La protection de vos données personnelles est notre priorité.

1. Collecte des données
Nous collectons :
- Informations d'inscription (Nom, Email, Téléphone).
- Données de navigation et localisation (si autorisée).
- Contenu des échanges via la messagerie intégrée.

2. Utilisation
Ces données servent à :
- Vous mettre en relation avec d'autres utilisateurs.
- Sécuriser votre compte.
- Améliorer nos algorithmes de recommandation.
- Vous envoyer des notifications pertinentes.

3. Partage
Nous ne vendons pas vos données. Elles peuvent être partagées avec des autorités judiciaires sur réquisition légale.

4. Sécurité
Nous utilisons le chiffrement HTTPS et des protocoles sécurisés pour stocker vos informations.

5. Vos Droits
Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données via les paramètres de l'application ou par email à privacy@garala.cf`
  },
  HELP: {
    title: "Centre d'Aide & FAQ",
    content: `Questions Fréquentes

Q : Comment vendre un article ?
R : Cliquez sur le bouton "+" jaune en bas de l'écran, prenez des photos, décrivez votre bien et validez. C'est gratuit !

Q : Comment contacter un vendeur ?
R : Sur la page de l'annonce, utilisez les boutons "Appeler" ou "WhatsApp".

Q : Mon annonce a été refusée, pourquoi ?
R : Vérifiez vos emails, nous indiquons toujours la raison (photos floues, article interdit, prix irréaliste).

Q : Comment modifier mon annonce ?
R : Allez dans "Compte" > "Mes annonces", puis cliquez sur l'icône crayon.

Q : Comment devenir Vendeur Vérifié ?
R : Allez dans "Paramètres" et suivez la procédure de vérification d'identité (CNI + Selfie).`
  },
  SECURITY: {
    title: "Conseils de Sécurité",
    content: `Votre sécurité est essentielle. Voici nos règles d'or pour des transactions sereines.

POUR LES ACHETEURS :
1. Rencontre en lieu public : Préférez les lieux fréquentés (cafés, devant un commissariat, centres commerciaux) et en journée.
2. Inspectez le bien : Vérifiez le fonctionnement de l'article avant de payer. Testez l'électronique.
3. Pas d'acomptes : Ne payez jamais à l'avance par Mobile Money ou transfert (Western Union) pour "réserver" un bien. Payez au moment de l'échange.

POUR LES VENDEURS :
1. Vérifiez l'argent : Assurez-vous d'avoir reçu la totalité de la somme (espèces ou SMS de confirmation Mobile Money vérifié) avant de remettre le bien.
2. Méfiez-vous des profils sans historique : Soyez vigilant avec les nouveaux comptes sans avis ni photo.

SIGNALEMENT :
Si une annonce vous semble frauduleuse, utilisez le bouton "Signaler" présent sur chaque page produit.`
  },
  CONTACT: {
    title: "Contactez-nous",
    content: `Notre équipe support est basée à Bangui et disponible pour vous aider.

Horaires :
Lundi - Vendredi : 8h00 - 18h00
Samedi : 9h00 - 13h00

Moyens de contact :
- Email : support@garala.cf
- WhatsApp Support : +236 75 00 00 00
- Facebook : @GaralaRCA

Adresse de nos bureaux :
Immeuble Bangui Tech,
Avenue des Martyrs,
Bangui, République Centrafricaine.

Pour les partenariats commerciaux : partners@garala.cf`
  }
};

export const MOCK_ADS: Ad[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256Go',
    price: 450000,
    description: 'Vendu avec boîte et chargeur. Batterie propre. Visible au centre-ville.',
    category: Category.ELECTRONICS,
    location: 'Bangui, Centre-ville',
    coordinates: { lat: 4.3617, lng: 18.5550 },
    images: [
        'https://picsum.photos/seed/iphone/800/800',
        'https://picsum.photos/seed/iphone2/800/800'
    ],
    date: '14:30',
    sellerName: 'Didier M.',
    isPro: false,
    createdAt: NOW,
    phoneNumber: '75 12 34 56'
  },
  {
    id: '2',
    title: 'Toyota RAV4 2015',
    price: 8500000,
    description: 'Moteur essence, climatisée, papiers à jour. Prête à rouler.',
    category: Category.VEHICLE,
    location: 'Bimbo',
    coordinates: { lat: 4.3200, lng: 18.5300 },
    images: ['https://picsum.photos/seed/car/800/600'],
    date: '12:15',
    sellerName: 'Bangui Auto',
    isPro: true,
    createdAt: NOW - (2 * HOUR),
    phoneNumber: '72 00 00 01'
  },
  {
    id: '3',
    title: 'Maison 3 pièces à louer',
    price: 150000,
    description: 'Quartier calme, eau et courant disponibles. Caution 3 mois.',
    category: Category.REAL_ESTATE,
    location: 'Sica 2',
    coordinates: { lat: 4.3800, lng: 18.5650 },
    images: [
        'https://picsum.photos/seed/house/800/600',
        'https://picsum.photos/seed/house2/800/600',
        'https://picsum.photos/seed/house3/800/600'
    ],
    date: 'Hier',
    sellerName: 'Agence Paix',
    isPro: true,
    createdAt: NOW - DAY,
    phoneNumber: '70 55 44 33'
  },
  {
    id: '4',
    title: 'Salon complet cuir',
    price: 250000,
    description: 'Fauteuils importés, très confortables. Légère égratignure sur le côté.',
    category: Category.HOME,
    location: 'Miskine',
    images: ['https://picsum.photos/seed/sofa/800/600'],
    date: 'Hier',
    sellerName: 'Mama Sarah',
    isPro: false,
    createdAt: NOW - (DAY + 4 * HOUR),
    phoneNumber: '77 88 99 00'
  },
  {
    id: '5',
    title: 'Groupe Électrogène 5KVA',
    price: 350000,
    description: 'Marque CAT, diesel, démarre au quart de tour. Idéal pour délestage.',
    category: Category.ELECTRONICS,
    location: 'PK12',
    images: ['https://picsum.photos/seed/gen/800/600'],
    date: 'Il y a 2 jours',
    sellerName: 'Junior Elec',
    isPro: false,
    createdAt: NOW - (2 * DAY),
    phoneNumber: '75 44 55 66'
  },
  {
    id: '6',
    title: 'Bazin Riche Brodé',
    price: 45000,
    description: 'Tissu original, couture impeccable. Taille L/XL.',
    category: Category.FASHION,
    location: 'Boy-Rabe',
    images: ['https://picsum.photos/seed/dress/800/800'],
    date: 'Il y a 3 jours',
    sellerName: 'Fatima Mode',
    isPro: false,
    createdAt: NOW - (3 * DAY),
    phoneNumber: '72 66 77 88'
  },
  {
    id: '7',
    title: 'Terrain 500m2 Titré',
    price: 3500000,
    description: 'Terrain plat, borné, avec titre foncier. Zone accessible.',
    category: Category.REAL_ESTATE,
    location: 'Bégoua',
    images: ['https://picsum.photos/seed/land/800/600'],
    date: 'Il y a 4 jours',
    sellerName: 'Notaire Jean',
    isPro: true,
    createdAt: NOW - (4 * DAY),
    phoneNumber: '70 11 22 33'
  },
  // Shop Product Example
  {
    id: '8',
    title: 'AirPods Pro 2',
    price: 65000,
    description: 'Écouteurs sans fil originaux. Réduction de bruit active.',
    category: Category.ELECTRONICS,
    location: 'Centre-ville',
    images: ['https://picsum.photos/seed/airpods/800/800'],
    date: 'À l\'instant',
    sellerName: 'High-Tech Store',
    isPro: true,
    shopId: 'shop_demo',
    stock: 5,
    colors: ['#FFFFFF'],
    createdAt: NOW,
    phoneNumber: '75 99 88 77',
    ownerId: 'u_demo_verified'
  }
];
