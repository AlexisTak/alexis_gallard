# Portfolio — Alexis Gallard

Site personnel d'Alexis Gallard, développeur Fullstack Senior et AI Engineer.
Applications web, logiciels desktop en Rust, intégration IA (LLM, RAG, agents).

Site statique, sans backend ni base de données : le contenu vit dans le dépôt,
l'hébergement se réduit à servir des fichiers.

## Stack

| Outil | Rôle | Pourquoi |
| :--- | :--- | :--- |
| [Astro](https://astro.build) | Génération statique | HTML envoyé au navigateur, zéro JavaScript par défaut ; le JS n'arrive que sur les îlots qui en ont besoin |
| [Tailwind CSS 4](https://tailwindcss.com) | Styles | Configuration en CSS (`@theme`), pas de fichier JS de config |
| [GSAP](https://gsap.com) | Animations | Timelines orchestrées et `ScrollTrigger` pour la section Travail épinglée |
| [Lenis](https://lenis.darkroom.engineering) | Scroll interpolé | Interpole le scroll natif de la fenêtre, donc `position: sticky` continue de fonctionner |
| WebGL | Champ de points du hero | Un quad plein écran et un fragment shader écrits à la main — ~3 Ko, contre ~150 Ko pour un moteur 3D dont rien ne serait utilisé |
| [Fontsource](https://fontsource.org) | Polices | Archivo, Instrument Sans et JetBrains Mono auto-hébergées, aucune requête vers un tiers |

Budget JavaScript : environ 48 Ko gzip, chargés en différé.

## Structure

```text
src/
├── assets/            images optimisées à la compilation par astro:assets
├── components/
│   ├── Header.astro       navigation, bascule de thème
│   ├── Footer.astro       relance de contact, plan du site, colophon
│   ├── Hero.astro         séquence d'ouverture et champ WebGL
│   ├── WorkReel.astro     section Travail épinglée, un projet par cran de scroll
│   ├── Section.astro      section à label en gouttière
│   ├── PageHeader.astro   en-tête de page
│   └── ProjectRow.astro   ligne de projet (listing /projets)
├── content/
│   └── projects/      une étude de cas par fichier Markdown
├── content.config.ts  schémas des collections (projects, blog)
├── layouts/
│   └── Layout.astro   document HTML, métadonnées, balisage schema.org
├── pages/
│   ├── index.astro        accueil
│   ├── expertises.astro   domaines d'intervention
│   ├── a-propos.astro     parcours et compétences
│   ├── projets/           listing et études de cas générées
│   ├── blog/              listing et articles
│   └── contact.astro
├── scripts/
│   ├── motion.ts          révélations au scroll, filet de sécurité
│   ├── smooth-scroll.ts   initialisation de Lenis
│   └── hero-field.ts      champ de points WebGL
└── styles/
    └── global.css     jetons de couleur, thèmes, utilitaires
```

## Commandes

| Commande | Effet |
| :--- | :--- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur de développement sur `localhost:4321` |
| `npm run build` | Compile le site statique dans `./dist/` |
| `npm run preview` | Sert le résultat de la compilation localement |

Node 22.12 ou plus récent.

## Ajouter du contenu

**Une étude de cas** — créer `src/content/projects/mon-projet.md`. Le nom du
fichier devient l'URL (`/projets/mon-projet`). Champs attendus :

```yaml
---
title: 'Nom du projet'
subtitle: 'Une ligne de contexte'
stack: ['Next.js', 'PostgreSQL']
summary: 'Deux phrases pour le listing.'
context: 'Le besoin, en quelques phrases.'
challenges: 'Ce qui rendait la chose difficile.'
solution: 'Les choix techniques et leur justification.'
results: 'Ce que ça donne, mesurable si possible.'
link: 'https://exemple.fr'   # optionnel
featured: true               # apparaît sur l'accueil
order: 1
---
```

**Un article** — créer `src/content/blog/mon-article.md` avec `title`,
`description`, `pubDate` et `tags`. Le corps Markdown est rendu tel quel.

Les schémas sont validés à la compilation : un champ manquant fait échouer le
build plutôt que de produire une page cassée.

## Parti pris techniques

**Le contenu ne dépend jamais d'une animation.** Le masquage initial des blocs
révélés au scroll est conditionné à une classe `js-motion`, posée par un script
en ligne uniquement si le JavaScript s'exécute. Sans JS, la page est
intégralement lisible. Si une séquence n'aboutit pas — onglet ouvert en
arrière-plan, `requestAnimationFrame` indisponible, erreur — un filet applique
l'état final au bout de quelques secondes.

**Lenis n'est initialisé qu'après une première image.** Il intercepte la molette
pour appliquer son propre défilement : si `requestAnimationFrame` ne tourne pas,
la page deviendrait impossible à faire défiler. Tant qu'aucune image n'est
calculée, rien n'est installé et le scroll natif reste seul maître.

**Sombre par défaut, clair sur choix explicite.** Le thème est appliqué par un
script en ligne avant le premier rendu, donc sans flash, et mémorisé dans
`localStorage`.

**`prefers-reduced-motion` coupe tout.** Séquence d'ouverture, révélations,
scroll interpolé et champ WebGL.

## Déploiement

Site entièrement statique : `npm run build` produit `./dist/`, à servir tel quel
(Vercel, Netlify, Cloudflare Pages ou n'importe quel serveur de fichiers).

Le domaine est déclaré dans `astro.config.mjs` (`site`) — il alimente le sitemap
et les URL canoniques. Il faut aussi le reporter dans `public/robots.txt`.
