# SEO et visibilité dans les réponses IA

## État local — 2 novembre 2026

Le domaine canonique configuré reste `https://alexisgallard.vercel.app`. L’adresse email en `alexis-gallard.fr` ne suffit pas à établir que ce domaine héberge le portfolio. Aucun changement de domaine ni déploiement n’a été effectué.

Améliorations intégrées :

- Titres de l’accueil et des expertises précisant le positionnement freelance IA / full-stack et une zone d’intervention nationale, en accord avec le contenu visible.
- URL canonique normalisée et utilisée aussi par Open Graph ; paramètres de requête exclus.
- Image de partage valide pour la 404 et exclusion explicite de cette page du sitemap.
- Identité Person reliée à l’association Biscuits IA et à son rôle de fondateur, sans inventer une adresse commerciale, une certification ou des avis.
- Services reliés à des ancres consultables, au prestataire et à la zone d’intervention France.
- Articles avec auteur visible, lien vers le parcours, image et relation à leur page dans BlogPosting.
- Liens internes entre articles, prestations, projets et contact.
- JSON-LD échappé pour éviter qu’un caractère `<` dans le contenu n’interrompe le bloc.
- Résumé llms.txt conservé comme complément informatif, avec les statuts et les limites des projets. Il ne remplace pas le HTML et ne garantit pas une citation.

## Vérifications

`npm run verify` lance le contrôle Astro, la compilation, la vérification des liens et `check:seo`.

Le contrôle SEO inspecte les pages réellement compilées : présence et unicité des titres, descriptions et canoniques, un H1 par page, langue, concordance Open Graph, existence des images de partage, JSON-LD parsable, champs essentiels des articles et exclusion de la 404 du sitemap. Il ne remplace pas un test distant des statuts HTTP, une validation complète schema.org ou les données terrain de performance.

## Après publication

1. Vérifier la propriété du domaine public dans Search Console et Bing Webmaster Tools, puis soumettre `/sitemap-index.xml`.
2. Inspecter l’accueil, les expertises et les trois projets principaux : canonique retenue, indexabilité et absence de blocage par l’hébergeur.
3. Tester une URL inexistante : elle doit retourner HTTP 404, pas une page d’erreur servie avec un statut 200.
4. Mesurer les Core Web Vitals avec les données terrain lorsqu’elles sont disponibles ; compléter par des mesures Lighthouse mobile reproductibles.
5. Suivre impressions, clics, requêtes et demandes qualifiées. Un contrôle technique local ne permet pas d’affirmer une progression de classement.
6. Enrichir les projets avec preuves et retours réels : démonstrations, mesures contextualisées, témoignages autorisés et limites explicites. Ne pas ajouter de statistiques ou d’avis fictifs.

Les fondamentaux SEO restent applicables aux réponses IA de Google. Aucun balisage spécial ni fichier IA n’est requis pour y apparaître ; l’indexation et la citation ne sont pas garanties.

Sources officielles consultées : [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
