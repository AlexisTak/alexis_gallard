---
title: "Modèle propriétaire ou open source : les quatre axes qui décident"
description: "La question n'est pas de savoir lequel est meilleur, mais lequel est meilleur pour une contrainte donnée. Coût réel, confidentialité, latence et dépendance — et le calcul qui dit à partir de quand l'auto-hébergement devient rentable."
pubDate: 2026-06-30
tags: ["LLM", "open source", "architecture", "coût"]
---

« On part sur GPT ou sur du Llama ? » est une question mal posée. Elle appelle une réponse générale à un problème qui n'en a pas : le bon choix dépend de quatre contraintes, et selon celle qui domine, la réponse s'inverse complètement.

## Le coût réel, qui n'est pas le prix affiché

L'API se facture au jeton, l'auto-hébergement se facture à l'heure de GPU. Ce sont deux régimes différents, et ils se croisent.

Une API coûte proportionnellement à l'usage : zéro requête, zéro euro. C'est imbattable en dessous d'un certain volume, et ce seuil est plus haut qu'on ne l'imagine. Un GPU capable de servir un modèle de taille moyenne coûte plusieurs centaines d'euros par mois en location, **qu'il tourne ou non**. Il faut un trafic soutenu et régulier pour amortir cela face à une facturation à l'usage.

Le calcul à faire est simple, et il faut le faire avec ses vrais chiffres :

- Le coût mensuel du GPU, location et supervision comprises.
- Le nombre de jetons réellement traités par mois, entrée et sortie séparées.
- Le prix au million de jetons de l'API équivalente.

Deux pièges dans ce calcul. D'abord, un GPU loué au mois est payé vingt-quatre heures sur vingt-quatre alors que le trafic est concentré sur les heures ouvrées : le taux d'occupation réel dépasse rarement vingt pour cent sans traitement par lots. Ensuite, l'auto-hébergement ajoute un coût qui n'apparaît sur aucune facture — quelqu'un doit surveiller, mettre à jour, et se lever la nuit quand le service tombe.

Conclusion pratique : en dessous d'un trafic soutenu et prévisible, l'API gagne presque toujours sur le coût seul. Ce qui fait basculer la décision, c'est généralement autre chose.

## La confidentialité, qui est souvent le vrai sujet

C'est le critère qui tranche le plus souvent, et le plus rapidement. Certaines données ne doivent pas sortir : dossiers de santé, pièces de procédure, code source sous contrat, données personnelles dont le transfert hors Union européenne n'est pas couvert.

Attention à ne pas confondre deux choses. Les principaux fournisseurs proposent des engagements contractuels de non-entraînement et des hébergements en région européenne. Cela répond à une bonne partie des exigences réglementaires. Ce que cela ne change pas, c'est que la donnée quitte votre infrastructure et transite chez un tiers — et il existe des contextes où cette seule sortie est disqualifiante, indépendamment de toute garantie contractuelle.

Quand c'est le cas, la discussion sur le coût devient secondaire : l'auto-hébergement n'est pas une optimisation, c'est la seule option conforme.

## La latence, où l'intuition se trompe

On suppose souvent qu'un modèle local répondra plus vite parce qu'il n'y a pas de réseau à traverser. En pratique, l'aller-retour réseau vers une API représente quelques dizaines de millisecondes, quand la génération d'une réponse en prend plusieurs milliers. Le réseau est du bruit.

Ce qui compte réellement, c'est le débit de génération, et il dépend de la taille du modèle, de la quantification et du taux de parallélisme. Un modèle auto-hébergé servi sans traitement par lots, sur un GPU sous-dimensionné, est plus lent qu'une API — parfois nettement.

Le seul cas où le local gagne franchement sur la latence est le **démarrage différé** : une API commerciale à forte charge peut faire attendre, alors qu'une instance dédiée répond toujours dans le même délai. Si votre contrainte est la régularité plutôt que la vitesse moyenne, c'est un argument sérieux.

La quantification mérite d'être comprise plutôt que subie. Passer d'une précision native à une représentation sur quatre bits divise l'empreinte mémoire par un facteur important et permet de faire tenir un modèle sur un GPU beaucoup moins cher. La dégradation est réelle mais faible sur les tâches de reformulation, de classification ou d'extraction ; elle devient sensible sur le raisonnement multi-étapes et la génération de code. Il faut la mesurer sur ses propres cas, pas la déduire d'un tableau de référence.

## La dépendance, qui se paie plus tard

Un modèle propriétaire est un service qui peut changer sous vos pieds : les tarifs évoluent, les versions sont retirées, les comportements se déplacent d'une mise à jour à l'autre. Un prompt calibré finement sur une version se dégrade silencieusement sur la suivante.

Un modèle ouvert que vous avez téléchargé ne changera jamais. C'est un avantage de reproductibilité considérable pour tout ce qui doit être auditable ou stable sur plusieurs années.

La bonne réponse à ce risque n'est pas de choisir le camp « ouvert » par principe, mais de **garder le choix réversible**. Concrètement :

- Une couche d'abstraction fine entre le code métier et le fournisseur, qui ne cherche pas à unifier toutes les fonctionnalités mais seulement celles que vous utilisez réellement.
- Aucune dépendance à une extension propriétaire — appels d'outils exotiques, formats de sortie spécifiques — sans une solution de repli écrite.
- Le même jeu d'évaluation exécutable contre n'importe quel fournisseur. C'est lui qui rend la migration décidable au lieu d'être un pari.

Cette réversibilité coûte peu à construire au départ et devient très chère à ajouter après coup.

## Ma règle de décision

Dans l'ordre, parce que l'ordre compte :

1. **Les données peuvent-elles sortir ?** Si non, c'est auto-hébergé, et le reste de la discussion est sans objet.
2. **Le volume est-il soutenu et prévisible ?** Si non, c'est l'API : payer un GPU pour un trafic irrégulier est un gaspillage.
3. **La tâche est-elle simple et répétitive ?** Extraction, classification, reformulation : un petit modèle ouvert quantifié fait le travail pour une fraction du coût, et c'est là que l'auto-hébergement est le plus rentable.
4. **Faut-il du raisonnement ou du code de qualité ?** Les meilleurs modèles propriétaires gardent une avance sur ces tâches, et la nier coûte plus cher que de la payer.

Et dans tous les cas : mesurer sur ses propres données avant de trancher. Les classements publics disent quel modèle est bon en moyenne. Ils ne disent rien de votre corpus, de votre format de sortie, ni de vos cas limites — qui sont précisément ce qui fera échouer ou réussir le projet.
