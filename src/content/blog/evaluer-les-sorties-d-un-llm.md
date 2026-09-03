---
title: "Évaluer les sorties d'un LLM sans se mentir"
description: "Sans jeu d'évaluation, changer un prompt est un pari et chaque mise à jour du modèle une régression invisible. Comment mesurer utilement."
pubDate: 2026-08-12
tags: ["LLM", "évaluation", "IA appliquée", "qualité"]
---

Une équipe qui déploie un LLM passe par la même séquence. On écrit un prompt, on essaie trois exemples, ça marche. On l'améliore, on réessaie les trois mêmes exemples, ça marche encore. On met en production. Trois semaines plus tard, un utilisateur signale une réponse absurde sur un cas qu'on n'avait jamais testé, et personne ne sait si le problème est nouveau ou s'il était là depuis le début.

C'est le symptôme d'une absence : il n'y a pas de mesure. Et sans mesure, il n'y a pas d'ingénierie — seulement une suite d'intuitions dont on ne saura jamais laquelle a aidé.

## Ce qui ne marche pas

**Les classements publics.** Ils disent quel modèle est bon en moyenne sur des tâches génériques. Ils ne disent rien de votre format de sortie, de votre vocabulaire métier, ni de vos cas limites — qui sont précisément ce qui fera échouer le projet.

**Le jugement à la lecture.** Trois exemples relus par la personne qui a écrit le prompt mesurent surtout la conviction de cette personne. Le biais est structurel, pas moral : on teste ce qu'on a en tête, et ce qu'on a en tête est ce qu'on vient d'améliorer.

**Les jeux générés automatiquement.** Faire produire mille questions par un modèle donne mille questions qui ressemblent à ce qu'un modèle imagine que les gens demandent. Les vraies questions sont mal orthographiées, elliptiques, hors périmètre, et parfois posées deux fois de suite avec un mot changé.

## Le jeu d'évaluation : cent exemples suffisent

Cent cas annotés à la main valent mieux que dix mille générés. Ils se constituent en une journée et servent des années. Trois sources, dans cet ordre de valeur :

1. **Les questions réellement posées.** Dès qu'un prototype tourne devant des utilisateurs, chaque requête est un échantillon. C'est la source la plus précieuse parce qu'elle n'est pas imaginée.
2. **Les cas qui ont échoué.** Chaque bug remonté entre dans le jeu, avec la réponse attendue. C'est ainsi qu'on garantit qu'une régression corrigée ne revient pas.
3. **Les cas limites construits volontairement.** Question hors périmètre, question dont la réponse n'est pas dans le corpus, question ambiguë, question piège contenant une prémisse fausse.

Ce dernier point est celui qu'on oublie, et c'est celui qui distingue un système utilisable d'un système dangereux. Un jeu composé uniquement de questions auxquelles il existe une bonne réponse ne mesure jamais la capacité à dire « je ne sais pas ».

Pour chaque cas, on note l'entrée, la sortie attendue — ou les critères qu'elle doit remplir — et la catégorie. La catégorie compte : elle permet de voir qu'une modification a amélioré la moyenne tout en dégradant une famille entière de cas.

## Mesurer la tâche, pas la ressemblance

La tentation est de comparer la réponse produite à une réponse de référence, mot à mot ou par similarité vectorielle. C'est une mauvaise mesure : deux formulations très différentes peuvent être toutes deux correctes, et deux formulations très proches peuvent différer sur le seul point qui compte.

Il vaut mieux mesurer ce que la tâche exige réellement, et cela se décompose presque toujours en critères vérifiables :

- **La sortie est-elle bien formée ?** Si l'on attend du JSON avec trois champs obligatoires, c'est une vérification déterministe, gratuite, et elle attrape beaucoup plus d'erreurs qu'on ne le croit.
- **Les faits cités figurent-ils dans les sources fournies ?** C'est la question la plus utile d'un [système documentaire](/blog/rag-en-production/). Une réponse juste mais non appuyée signale que le modèle puise dans ses paramètres — ce qui marchera jusqu'au cas spécifique qui justifiait le projet.
- **Le système a-t-il refusé quand il fallait refuser ?** Mesuré sur les cas limites construits pour cela.
- **La contrainte métier est-elle respectée ?** Un montant reste dans une plage, une date est postérieure à une autre, un identifiant existe en base.

Ces vérifications sont du code ordinaire. Elles tournent en quelques secondes, ne coûtent rien, et couvrent la majorité des régressions réelles.

## Le modèle juge, et ses biais

Reste ce qui ne se vérifie pas mécaniquement : la pertinence, le ton, la complétude. On peut faire noter les réponses par un autre modèle. C'est efficace, à condition de savoir ce qu'on achète.

Un modèle juge a des biais documentés et reproductibles. Il préfère les réponses longues à qualité égale. Il favorise la première option présentée dans une comparaison. Il note plus favorablement les textes produits par un modèle de sa propre famille.

Trois précautions rendent la mesure exploitable :

- **Une grille explicite plutôt qu'une note globale.** « Cette réponse contient-elle une affirmation absente des sources ? Oui / Non » est beaucoup plus stable que « note de 1 à 10 ».
- **L'ordre des candidats permuté** quand on compare deux versions, et les résultats moyennés sur les deux sens.
- **Un étalonnage humain.** On annote soi-même trente cas, on fait juger les mêmes par le modèle, et on mesure l'accord. Si l'accord est faible, le juge ne mesure pas ce que l'on croit, et il faut réécrire la grille avant de s'en servir.

## Le faire tourner comme une suite de tests

Une évaluation qu'on lance à la main sert deux fois puis tombe en désuétude. Elle doit être une commande, exécutable par n'importe qui, produisant un tableau par catégorie et un écart par rapport à la dernière exécution enregistrée.

À partir de là, trois usages deviennent possibles, et ce sont eux qui justifient l'investissement initial :

**Comparer deux prompts** en quelques minutes, avec un chiffre par catégorie plutôt qu'une impression.

**Détecter la dérive d'un fournisseur.** Les modèles propriétaires évoluent ; un prompt calibré finement sur une version se dégrade parfois silencieusement sur la suivante. Sans évaluation, on l'apprend par un utilisateur.

**Rendre un changement de modèle décidable.** [Migrer vers un modèle moins cher, ou vers un modèle ouvert auto-hébergé](/blog/proprietaire-ou-open-source/), cesse d'être un pari : on mesure, on compare, on tranche sur des chiffres.

C'est le point qui compte le plus. Une équipe sans évaluation est prisonnière de son fournisseur, non par contrat, mais parce qu'elle n'a aucun moyen de savoir ce qu'elle perdrait en partant.
