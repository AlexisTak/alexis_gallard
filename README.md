# Portfolio — Alexis Gallard

**→ [alexisgallard.vercel.app](https://alexisgallard.vercel.app)**

[![CI](https://github.com/AlexisTak/alexis_gallard/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexisTak/alexis_gallard/actions/workflows/ci.yml)

Site personnel d'Alexis Gallard, développeur Fullstack Senior et AI Engineer.
Applications web, logiciels desktop en Rust, intégration IA (LLM, RAG, agents).

Site statique, sans backend ni base de données : le contenu vit dans le dépôt,
l'hébergement se réduit à servir des fichiers.

## Stack

| Outil | Rôle | Pourquoi |
| :--- | :--- | :--- |
| [Astro](https://astro.build) | Génération statique | HTML envoyé au navigateur, zéro JavaScript par défaut ; le JS n'arrive que sur les îlots qui en ont besoin |
| [Tailwind CSS 4](https://tailwindcss.com) | Styles | Configuration en CSS (`@theme`), pas de fichier JS de config |
| [Lenis](https://lenis.darkroom.engineering) | Scroll interpolé | Interpole le scroll natif de la fenêtre, donc `position: sticky` continue de fonctionner |
| [Fontsource](https://fontsource.org) | Polices | Schibsted Grotesk et JetBrains Mono auto-hébergées, aucune requête vers un tiers |

Les animations sont en CSS, déclenchées par un `IntersectionObserver` de
quelques lignes : aucune bibliothèque d'animation.

Budget JavaScript : environ 5 Ko gzip, chargés en différé.

## Structure

```text
src/
├── assets/            images optimisées à la compilation par astro:assets
├── components/
│   ├── Header.astro       navigation, bascule de thème
│   ├── Footer.astro       relance de contact, plan du site, colophon
│   ├── Sidebar.astro      carte de visite fixe : identité, chiffres, navigation
│   ├── Hero.astro         accroche et séquence d'ouverture
│   ├── Logo.astro         monogramme AG en SVG inline
│   ├── Section.astro      section en carte, avec étiquette
│   ├── PageHeader.astro   en-tête de page
│   └── ProjectRow.astro   ligne de projet (listing /projets)
├── content/
│   └── projects/      une étude de cas par fichier Markdown
├── content.config.ts  schémas des collections (projects, blog)
├── layouts/
│   └── Layout.astro   document HTML, métadonnées, balisage schema.org
├── lib/
│   └── site.ts        identité du site, schémas Person et WebSite
├── pages/
│   ├── index.astro        accueil, avec la FAQ balisée en FAQPage
│   ├── 404.astro          page d'erreur
│   ├── llms.txt.ts        résumé Markdown pour les moteurs génératifs
│   ├── rss.xml.ts         flux des articles
│   ├── og/[...route].ts   images de partage générées à la compilation
│   ├── expertises.astro   domaines d'intervention
│   ├── a-propos.astro     parcours et compétences
│   ├── projets/           listing et études de cas générées
│   ├── blog/              listing et articles
│   └── contact.astro
├── scripts/
│   ├── motion.ts          révélations au scroll, filet de sécurité
│   └── smooth-scroll.ts   initialisation de Lenis
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
| `npm run check` | Vérifie les types dans les fichiers `.astro` et `.ts` |
| `npm run check:links` | Contrôle les liens internes du site compilé |
| `npm run verify` | Enchaîne les trois : types, compilation, liens — ce que lance la CI |

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

**Clair par défaut, sombre sur choix explicite.** Le thème est appliqué par un
script en ligne avant le premier rendu, donc sans flash, et mémorisé dans
`localStorage`. Les deux palettes dérivent des mêmes rôles : fond, surface,
carte contrastée, encre, texte secondaire, accent.

**Une carte de visite permanente.** À partir de `lg`, la barre latérale reste à
l'écran pendant que le contenu défile : identité, chiffres clés, navigation,
adresse copiable et appel à l'action y sont toujours accessibles. En dessous,
elle redevient un en-tête empilé.

**`prefers-reduced-motion` coupe tout.** Séquence d'ouverture, révélations et
scroll interpolé.

## SEO et moteurs génératifs

**Métadonnées** — chaque page déclare son canonique, ses balises Open Graph et
Twitter, `og:locale`, et une directive `robots` autorisant les grandes
vignettes (`max-image-preview:large`).

**Images de partage** — `src/pages/og/[...route].ts` génère à la compilation une
image 1200×630 par page, aux couleurs du site, avec le titre de la page. Sans
elle, un lien partagé sur LinkedIn s'affiche en bloc de texte gris.

**Données structurées** — un graphe `schema.org` unique par page plutôt que des
blocs isolés : `WebSite`, `Person`, `WebPage` et `BreadcrumbList` partout, plus
le schéma propre à chaque page (`ProfilePage`, `CollectionPage`, `CreativeWork`,
`BlogPosting`, `FAQPage`, `ContactPage`). Les nœuds se référencent par `@id`,
ce qu'un moteur exploite pour relier page, site et personne.

**`llms.txt`** — généré par `src/pages/llms.txt.ts` d'après les mêmes sources que
le site, il résume l'identité, les compétences et les projets en Markdown, à la
troisième personne. C'est le pendant de `robots.txt` pour les moteurs
génératifs : leur donner la version factuelle plutôt que les laisser extraire
d'un HTML plein de scripts. Les robots correspondants sont autorisés
explicitement dans `robots.txt`.

**Flux RSS** — `/rss.xml` pour les articles.

**Sitemap** — sans `lastmod` : le renseigner à la date du build annoncerait
toutes les pages comme modifiées à chaque déploiement, et un signal faux est
ignoré par les moteurs quand il ne leur coûte pas leur confiance. Les images de
partage en sont exclues.

## Intégration continue

Le workflow `.github/workflows/ci.yml` s'exécute à chaque push et sur chaque
pull request. Il rejoue exactement `npm run verify` :

1. `npm ci` installe le contenu du lockfile, pas une résolution plus récente —
   la CI teste ce qui sera déployé.
2. `astro check` valide les types, y compris dans les balises `.astro`.
3. `astro build` compile le site.
4. `scripts/check-links.mjs` parcourt le HTML généré et vérifie que chaque lien
   interne mène quelque part. Il lit le résultat compilé plutôt que les
   sources : il attrape donc aussi les liens construits dynamiquement, comme
   ceux des études de cas.

Le site compilé est conservé en artefact pendant sept jours, téléchargeable
depuis la page du run.

## Déploiement

Hébergé sur Vercel, qui compile et publie à chaque push sur `master` via son
intégration GitHub — aucun workflow de déploiement n'est donc nécessaire.

`vercel.json` fixe ce que la plateforme ne devine pas :

- **En-têtes de sécurité** sur toutes les réponses : `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Cache immuable d'un an** sur `/_astro/`, où Astro place les fichiers dont le
  nom contient une empreinte du contenu — ils changent de nom à chaque
  modification, donc rien ne peut être servi périmé.
- **Slash final** conservé : Astro génère des dossiers avec `index.html`, et les
  URL canoniques comme le sitemap portent le slash. Forcer l'inverse ferait
  rediriger vers une adresse que la balise canonique contredit.

Le domaine de production est déclaré dans `astro.config.mjs` (`site`) — il
alimente le sitemap et les URL canoniques — et doit être reporté dans
`public/robots.txt`.
