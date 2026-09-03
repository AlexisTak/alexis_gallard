---
title: "La sécurité au niveau de la base, pas du code"
description: "Une règle d'accès écrite dans un contrôleur doit être répétée partout et peut être oubliée une fois. Écrite dans PostgreSQL, elle s'applique même au code qui a tort."
pubDate: 2026-09-03
tags: ["PostgreSQL", "sécurité", "architecture", "RLS"]
---

La fuite de données la plus banale ne vient pas d'une injection SQL ni d'un mot de passe faible. Elle vient d'un `WHERE` oublié.

Une application multi-utilisateurs filtre les données par propriétaire. La règle est simple, elle est écrite dans chaque contrôleur, et elle fonctionne — jusqu'au jour où quelqu'un ajoute un point d'entrée en oubliant la clause, ou écrit une jointure qui contourne le filtre, ou expose une route d'export pensée pour l'administration.

Le problème n'est pas la compétence de cette personne. Le problème est structurel : **la règle vit à un endroit, la donnée à un autre, et rien ne les relie**.

## Déplacer la règle vers la donnée

PostgreSQL sait appliquer des politiques d'accès au niveau des lignes. La règle cesse d'être une convention à respecter dans le code applicatif pour devenir une propriété de la table.

```sql
alter table documents enable row level security;

create policy documents_proprietaire on documents
  for all
  using (owner_id = current_setting('app.user_id')::uuid);
```

À partir de cette instruction, toute requête sur `documents` est filtrée par la base, quel que soit le code qui l'émet. Un `select * from documents` sans condition ne renvoie que les lignes de l'utilisateur courant. Une jointure maladroite ne fuit pas. Une route d'export oubliée n'expose rien.

L'application transmet l'identité en début de transaction :

```sql
set local app.user_id = '…';
```

Le mot-clé `local` est important : le réglage disparaît à la fin de la transaction et ne peut pas fuiter vers la requête suivante d'un pool de connexions partagé.

## Ce que ce déplacement change vraiment

Il ne rend pas l'application « plus sécurisée » d'un cran. Il **supprime une classe entière de défauts**, ce qui est différent et bien plus intéressant.

Sans politique de ligne, la sécurité est une propriété de chaque chemin de code : elle est vraie si les cinquante requêtes de l'application sont correctes, et fausse dès que l'une ne l'est pas. Elle se dégrade mécaniquement avec la taille de l'équipe et le temps.

Avec une politique de ligne, la sécurité est une propriété de la table. Le nombre de chemins de code n'a plus d'importance. Une revue de code n'a plus à vérifier que chaque requête filtre : elle vérifie que la politique existe et qu'elle est juste, ce qui se fait une fois.

C'est le même raisonnement que le typage statique. On ne demande pas à un système de types de rendre le code correct ; on lui demande de rendre une catégorie d'erreurs impossible à écrire.

## Ce que ça coûte

Il serait malhonnête de présenter cela comme gratuit.

**Le débogage devient moins direct.** Une requête qui ne renvoie rien peut être un bug de logique ou une politique qui s'applique. Le réflexe à acquérir : vérifier d'abord l'identité posée dans la transaction. C'est déroutant les premières semaines.

**Les politiques doivent être testées comme du code.** Une politique fausse est un faux sentiment de sécurité, pire que pas de politique du tout. Cela signifie des tests qui se connectent avec plusieurs identités et vérifient qu'elles ne voient que ce qu'elles doivent voir. Ces tests sont courts et ils sont la seule preuve que la protection existe.

**Les performances demandent attention.** La condition de la politique s'ajoute à chaque requête. Si elle porte sur une colonne non indexée, ou pire sur une sous-requête, le coût se paie partout. La colonne de propriété doit être indexée, et la politique doit rester une comparaison simple.

**Les migrations et les tâches de fond doivent être pensées.** Un travail par lots qui traite toutes les lignes ne peut pas s'exécuter sous une identité utilisateur. Il faut un rôle distinct, explicitement exempté, et cette exemption devient un point à surveiller — c'est le seul endroit où la protection ne s'applique pas.

## Quand ne pas le faire

Cette approche a un domaine de pertinence, et le prétendre universel serait une erreur.

Elle convient quand la règle d'accès est **simple et stable** : chaque ligne appartient à un utilisateur, ou à une organisation. C'est le cas de la grande majorité des applications multi-locataires.

Elle convient mal quand les droits sont **complexes et contextuels** : permissions calculées à partir d'un graphe de délégations, règles qui dépendent de l'état d'un flux de validation, accès temporaires. Exprimer cela en SQL produit des politiques illisibles et lentes. Mieux vaut alors un service d'autorisation dédié, et garder les politiques de ligne pour un filet de sécurité grossier — l'appartenance à l'organisation, par exemple — en laissant la logique fine au-dessus.

Elle ne convient pas non plus quand l'application n'a qu'un seul utilisateur, ou quand la base est déjà isolée par client. Ajouter un mécanisme sans le risque qu'il couvre est une complexité gratuite.

## Le principe au-delà de PostgreSQL

Ce qui compte n'est pas la fonctionnalité mais le déplacement qu'elle illustre : **placer la contrainte au niveau le plus bas où elle reste exprimable**.

Une contrainte d'unicité dans la base plutôt qu'une vérification avant insertion, qui laisse passer les écritures concurrentes. Une clé étrangère plutôt qu'une convention. Un champ non nul plutôt qu'une validation de formulaire. À chaque fois, la même question : cette règle survit-elle à un développeur qui l'ignore ?

Les règles qui vivent uniquement dans le code applicatif sont vraies tant que tout le monde s'en souvient. Celles qui vivent dans le schéma sont vraies parce que le système refuse le contraire.

C'est ce raisonnement qui m'a fait choisir des politiques de ligne pour Anti-Pépins, une plateforme qui traite des contenus signalés par ses utilisateurs — numéros, adresses, messages. Sur ce type de données, une fuite entre comptes n'est pas un incident technique, c'est un incident tout court. La protection devait tenir même en cas de bug côté application.
