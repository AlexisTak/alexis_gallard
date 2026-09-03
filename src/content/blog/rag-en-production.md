---
title: "RAG en production : ce qui casse entre la démo et le vrai trafic"
description: "Un prototype RAG se monte en une après-midi. Le mettre en production demande de traiter le découpage, la récupération hybride, l'évaluation et le coût du contexte — quatre sujets que la démo masque."
pubDate: 2026-07-22
tags: ["RAG", "LLM", "IA appliquée", "architecture"]
---

Monter un prototype RAG prend une après-midi : on découpe des documents, on calcule des vecteurs, on récupère les cinq passages les plus proches, on les colle dans un prompt. La démo impressionne. Puis on branche de vrais utilisateurs sur un vrai corpus, et le système se met à répondre à côté, à inventer, ou à coûter trois fois le budget prévu.

L'écart ne vient pas du modèle. Il vient de quatre décisions que le prototype permet d'ignorer.

## Le découpage est une décision de produit

Découper en blocs de cinq cents jetons avec cinquante de chevauchement est le réglage par défaut de tous les tutoriels. C'est aussi la première cause de réponses fausses.

Un découpage aveugle coupe au milieu d'un tableau, sépare une définition de son exemple, isole un « il » de son antécédent. Le passage récupéré est alors syntaxiquement proche de la question et sémantiquement inutilisable.

Ce qui marche dépend du corpus, et il faut le regarder avant de choisir :

- **Documentation technique structurée** : découper sur les titres, en conservant la hiérarchie dans les métadonnées. Un bloc doit pouvoir répondre seul à une question.
- **Contrats, procédures, réglementaire** : découper à l'article ou à la clause. Ces documents sont déjà découpés par leurs auteurs, autant s'en servir.
- **Comptes rendus, échanges, tickets** : découper par tour de parole ou par fil, jamais par longueur.

Une technique qui règle beaucoup de cas : indexer des blocs courts pour la recherche, mais renvoyer au modèle le bloc parent complet. On cherche sur de la précision, on répond avec du contexte.

## La recherche vectorielle seule ne suffit presque jamais

Les plongements lexicaux capturent la proximité sémantique. Ils sont mauvais sur ce que les utilisateurs tapent en réalité : des références de produit, des codes d'erreur, des noms propres, des numéros d'article.

Une question comme « que dit l'article L. 121-4 » a une distance vectorielle médiocre avec le passage qui contient exactement cette référence, parce que la chaîne « L. 121-4 » porte peu de signal sémantique. Un index lexical classique, lui, la trouve immédiatement.

D'où la récupération hybride : on interroge en parallèle un index vectoriel et un index lexical de type BM25, puis on fusionne les deux classements. La fusion par rang réciproque suffit dans la plupart des cas et n'a aucun paramètre à régler.

Au-dessus, un réordonnanceur change la donne. Un modèle bi-encodeur compare une question et un passage sans jamais les avoir vus ensemble ; un réordonnanceur croisé les lit conjointement et juge leur pertinence réelle. On récupère largement — trente à cinquante passages —, on réordonne, on garde les cinq meilleurs. Le gain de précision est net, le coût reste modeste car le réordonnanceur ne tourne que sur des candidats déjà filtrés.

## Sans évaluation, on optimise à l'aveugle

C'est le point qui sépare un projet qui progresse d'un projet qui tourne en rond. Sans jeu d'évaluation, chaque modification est un pari : on change la taille des blocs, on trouve que « ça a l'air mieux », et on découvre trois semaines plus tard qu'on a dégradé une catégorie entière de questions.

Le minimum viable tient en deux mesures, et il faut les séparer.

**La récupération** se mesure indépendamment du modèle. On constitue un jeu de questions dont on connaît le passage qui contient la réponse, puis on mesure la proportion de cas où ce passage figure dans les résultats. Cette mesure ne dépend d'aucun LLM, elle est stable, rapide et peu coûteuse. Elle répond à une question précise : le système a-t-il seulement une chance de répondre correctement ?

**La génération** se mesure ensuite, et la question la plus utile n'est pas « la réponse est-elle bonne » mais « la réponse est-elle appuyée sur les passages fournis ». Une réponse juste mais non appuyée signale que le modèle puise dans ses paramètres plutôt que dans le corpus — ce qui marchera tant qu'on posera des questions générales, et échouera sur les cas spécifiques qui justifiaient le projet.

Cent questions annotées à la main valent mieux que dix mille générées automatiquement. Elles se constituent en une journée et servent pendant des années.

## Le coût n'est pas le modèle, c'est le contexte

Sur une facture RAG, la génération pèse peu. Ce qui pèse, ce sont les jetons d'entrée : cinq passages de mille jetons, une consigne système détaillée, un historique de conversation, et chaque requête part avec plusieurs milliers de jetons avant même que le modèle n'écrive un mot.

Trois leviers, par ordre d'efficacité décroissante :

1. **Récupérer moins, mais mieux.** Le réordonnanceur permet de passer de dix passages à trois sans perte de qualité. C'est une réduction directe et sans contrepartie.
2. **Mettre en cache le préfixe stable.** Consigne système, définitions, exemples : tout ce qui ne change pas d'une requête à l'autre doit être en tête du prompt et mis en cache par le fournisseur. La réduction sur cette portion est substantielle.
3. **Router selon la difficulté.** Toutes les questions n'ont pas besoin du plus gros modèle. Une classification préalable, ou simplement un seuil sur le score de récupération, permet d'envoyer les cas simples vers un modèle plus petit.

## Ce qu'on ajoute quand ça part en production

Trois choses qui ne servent à rien en démonstration et qui deviennent indispensables ensuite.

**La citation des sources**, non pour faire joli, mais parce que c'est le seul moyen pour un utilisateur de vérifier. Un système qui cite est un système qu'on peut corriger ; un système qui affirme est un système qu'on doit croire.

**Le refus explicite.** Quand la récupération ne rapporte rien de pertinent, le système doit le dire. C'est contre-intuitif au regard de la démonstration, où l'on veut toujours une réponse, et c'est ce qui fait la différence entre un outil qu'on utilise et un outil qu'on abandonne après trois réponses inventées.

**La journalisation des questions sans réponse.** Ce sont elles qui indiquent quoi ajouter au corpus. Un système RAG ne se règle pas une fois : il s'entretient à partir de ce que les utilisateurs cherchent et ne trouvent pas.

Rien de tout cela ne relève du modèle. C'est de l'ingénierie de données, de l'évaluation et de l'observabilité — le même métier que pour n'importe quel système en production.
