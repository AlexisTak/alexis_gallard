---
title: "Choisir sa stack sans suivre la mode"
description: "Avant « quelle technologie », il y a « qui va maintenir ça dans deux ans ». Les critères qui tiennent quand l'enthousiasme retombe."
pubDate: 2026-05-19
tags: ["architecture", "Rust", "microservices", "décision technique"]
---

Une décision de stack se juge mal au moment où on la prend. Tout paraît raisonnable le premier jour : la documentation est bonne, le prototype avance vite, l'équipe est enthousiaste. Elle se juge deux ans plus tard, quand il faut corriger un bug en urgence dans un composant que plus personne n'a touché depuis six mois.

C'est cet horizon-là qu'il faut avoir en tête, et il change complètement les critères.

## La question qui précède toutes les autres

Avant « quelle technologie », il y a « qui va maintenir ça ». Cette question en contient plusieurs :

- Combien de personnes touchent ce code aujourd'hui, et combien dans un an ?
- Sont-elles déjà à l'aise avec cette technologie, ou faut-il les former ?
- Si la personne qui a écrit ce composant part, combien de temps pour que quelqu'un reprenne la main ?

Une technologie excellente que personne dans l'équipe ne maîtrise est une technologie risquée. Une technologie médiocre que tout le monde connaît est souvent le bon choix. Ce n'est pas du conservatisme : c'est reconnaître que le coût dominant d'un système sur sa durée de vie n'est pas son écriture, c'est sa maintenance.

Le corollaire est utile : **le nombre de technologies distinctes dans un projet est un coût en soi**. Chaque langage supplémentaire, c'est une chaîne de compilation, un gestionnaire de dépendances, un écosystème de tests, une façon de déployer, et un ensemble de gens capables d'intervenir. Ajouter un langage doit apporter un bénéfice qui dépasse ce coût-là, pas seulement résoudre élégamment un problème ponctuel.

## Microservices : un critère organisationnel déguisé en critère technique

Le découpage en microservices est presque toujours justifié par des arguments techniques — montée en charge, isolation des pannes, déploiement indépendant. Ce sont de vrais bénéfices. Mais le critère qui décide est ailleurs.

Les microservices résolvent d'abord un problème de coordination humaine : ils permettent à plusieurs équipes de livrer sans se marcher dessus. Ce bénéfice est réel à partir de plusieurs équipes autonomes. En dessous, on paie le prix sans toucher la contrepartie.

Et le prix est élevé :

- **Les transactions deviennent un problème d'architecture.** Ce qui était une transaction de base de données devient une saga avec compensation, des états intermédiaires et des cas d'échec partiels à traiter explicitement.
- **L'observabilité devient obligatoire.** Sur un monolithe, une trace d'exception suffit souvent. Sur un système distribué, sans traçage corrélé, un incident se diagnostique à l'aveugle.
- **Le déploiement se complexifie d'un ordre de grandeur.** Il faut gérer les versions d'interface entre services, la compatibilité ascendante, l'ordre de déploiement.
- **L'environnement local se dégrade.** Faire tourner quinze services sur un portable est possible, agréable non.

Un monolithe modulaire — un seul déployable, mais des frontières internes explicites et respectées — offre l'essentiel des bénéfices de structuration sans ces coûts. Et il conserve une propriété précieuse : si les frontières sont propres, en extraire un service le jour où c'est justifié est un travail borné. L'inverse, recoller des microservices prématurés, ne l'est pas.

La règle que j'applique : commencer modulaire dans un seul déployable, et n'extraire un service que lorsqu'une raison nommable apparaît — une équipe distincte, un profil de charge incompatible, une contrainte de conformité qui impose l'isolation.

## Quand Rust vaut son coût d'apprentissage

Rust a un coût d'entrée réel. La gestion de la propriété des valeurs demande de réapprendre des réflexes, et les premières semaines sont lentes. Ce coût se justifie dans des cas précis, et pas dans les autres.

Il se justifie quand une de ces conditions est vraie :

- **Le logiciel est distribué et tourne chez l'utilisateur.** Un binaire sans machine virtuelle ni dépendance système est un avantage d'exploitation considérable : pas de version de runtime à gérer sur des postes qu'on ne contrôle pas.
- **La consommation mémoire est une contrainte.** Sur un poste de travail chargé, un logiciel qui prend cent cinquante mégaoctets plutôt que huit cents change l'expérience de façon perceptible.
- **La correction compte plus que la vitesse d'écriture.** Le système de types élimine à la compilation une catégorie entière de bugs — accès concurrents non protégés, usage après libération. Sur du code de longue durée de vie, ce contrat est rentable.

Il ne se justifie pas pour un service web classique dont le facteur limitant est la base de données, ni pour un outil interne appelé à changer toutes les semaines. La vitesse d'itération y vaut davantage que la performance à l'exécution.

Le cas mixte est intéressant : un logiciel de bureau en Rust dont l'interface reste en technologies web. On garde la rapidité de développement côté interface et les propriétés du natif côté cœur, sans embarquer un navigateur complet. C'est un bon compromis quand l'interface est riche et évolue vite.

## Un exemple mesurable

Ce site est un cas d'application de ces critères. Le besoin : quelques pages de contenu, mises à jour occasionnelles, aucune interaction serveur.

Un framework applicatif aurait fonctionné. Il aurait aussi imposé un runtime côté client, un état à hydrater et une surface de maintenance sans rapport avec le besoin. Le choix retenu — génération statique, JavaScript réduit au strict nécessaire — donne un site qui pèse moins de six kilo-octets de script, affiche son contenu principal en un peu plus de deux dixièmes de seconde sur mobile, et n'a aucune dépendance à surveiller en production.

Ce n'est pas un choix élégant en soi. C'est le choix proportionné au problème — même si [y arriver a demandé de corriger une erreur de conception](/blog/lcp-perdu-sur-une-animation/). Le code est public, les mesures sont reproductibles.

## Ce que je regarde, dans l'ordre

1. **Quelle est la contrainte dominante ?** Charge, conformité, délai, taille d'équipe. Il y en a rarement plus d'une qui décide vraiment.
2. **Qui maintient, avec quelles compétences ?** Une stack au-dessus du niveau de l'équipe est une dette qui se paie au pire moment.
3. **Quelle décision est réversible ?** À bénéfice comparable, on choisit celle dont on peut sortir. Une base de données se change difficilement, un framework d'interface se remplace, un découpage en services ne se recolle pas.
4. **Qu'est-ce qui échoue en premier, et le saura-t-on ?** Une architecture dont on ne peut pas observer la défaillance est une architecture qu'on découvre en panne.

Aucun de ces critères ne mentionne la popularité d'une technologie. C'est volontaire : la mode est une information sur l'écosystème, pas sur le problème à résoudre.
