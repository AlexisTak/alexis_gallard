# Portfolio freelance — textes et structure

## 1. Accroche et sous-titre

**Des outils web et IA utiles à votre activité, avec la maîtrise de vos données.**

Je suis Alexis Gallard, développeur full-stack et ingénieur IA freelance. Je transforme vos besoins en applications et automatisations concrètes, avec la sécurité, le choix de l’hébergement et la reprise en main par vos équipes pensés dès le départ.

## 2. À propos

Je suis Alexis Gallard, développeur full-stack et ingénieur IA freelance. J’accompagne les entreprises qui veulent créer un outil métier, intégrer l’IA à leurs processus ou faire évoluer une application existante. Mon rôle : traduire votre besoin en décisions techniques compréhensibles, puis en un outil que votre équipe peut utiliser et faire évoluer.

Je relie le développement web, les agents IA et la sécurité pour traiter le projet dans son ensemble. Avant de choisir un modèle ou une technologie, nous clarifions le problème, les données disponibles et les critères de réussite. Vous savez ce que nous construisons, pourquoi nous le construisons et comment nous le vérifierons.

Les solutions souveraines et open source occupent une place importante dans mon travail. Je vous aide à arbitrer entre confidentialité, budget et contraintes d’exploitation, pour choisir un hébergement et des composants adaptés à votre situation.

Je suis aussi fondateur de Biscuits IA, une association qui démocratise l’IA auprès des associations, des TPE et des collectivités. Cet engagement nourrit ma façon de travailler : expliquer clairement, partir des usages et transmettre les connaissances. Basé à Poitiers, j’interviens en Nouvelle-Aquitaine et à distance. Mon objectif est de vous laisser un outil utile, documenté et une équipe capable de le reprendre.

## 3. Projets

### Zero-Secret — En cours

**Description courte (170 caractères)**

Remplacer les secrets permanents par des accès temporaires, autorisés selon le contexte et traçables. Un prototype pour repenser la sécurité des environnements critiques.

**Description longue**

**Le problème.** Une clé d’API permanente ou un compte administrateur oublié peut donner un accès durable à une infrastructure. Zero-Secret part d’une question concrète : comment autoriser une intervention sans laisser derrière elle un accès exploitable indéfiniment ?

**Ma solution.** Je développe un parcours en quatre étapes : preuve d’identité WebAuthn/FIDO2, décision d’accès selon des politiques dynamiques, émission d’identifiants éphémères juste à temps, puis accès à la ressource. Les composants Rust et Go séparent les décisions de sécurité de l’orchestration. L’architecture intègre OpenBao, une interface HSM PKCS#11 — SoftHSM2 en développement — et un journal d’audit signé et chaîné, dont l’intégrité peut être vérifiée.

**État actuel.** Un prototype technique fonctionnel, avec un parcours JIT documenté et une base de code publique conçue pour être examinée. Le travail se poursuit : le projet n’a pas encore fait l’objet d’une revue de sécurité indépendante ni d’un test d’intrusion. Il constitue un terrain d’expérimentation, pas une solution validée pour la production critique.

[Explorer le code et l’architecture](https://github.com/AlexisTak/zero-secret)

### Agentic OS — En cours

**Description courte (158 caractères)**

Organiser des agents IA, suivre leurs tâches et garder la validation humaine. Un projet en cours qui réunit orchestration, garde-fous et suivi des ressources.

**Description longue**

**Le problème.** Ajouter des agents IA ne suffit pas à rendre une équipe plus efficace. Il faut savoir qui fait quoi, repérer les incidents, suivre les ressources consommées et décider quelles actions nécessitent une validation humaine.

**Ma solution.** Je conçois Agentic OS autour d’une métaphore simple : un pays composé de villes, chacune représentant un projet. Un « maire », agent orchestrateur, répartit les tâches entre agents spécialisés. Une « police » porte les garde-fous de sécurité ; un « hôpital » représente les tests automatisés. L’humain conserve la validation finale. Le tableau de bord est pensé pour réunir le suivi des agents, des tâches, des incidents et des ressources.

**État actuel.** Le projet est en cours de développement. Le visuel présente l’organisation et les fonctions visées du centre de commande ; ses chiffres sont illustratifs. Il montre la direction du produit, sans constituer une preuve de performance ni un résultat d’exploitation.

### La Minute de Code — Réalisé

**Description courte (166 caractères)**

Un site vitrine Astro pour découvrir une communauté tech, retrouver ses lives et rejoindre son Discord. Une identité café, avec un soin porté à la rapidité et au SEO.

**Description longue**

**Le problème.** La Minute de Code rassemble une communauté autour du développement. Ses lives, son Discord et sa newsletter avaient besoin d’une porte d’entrée commune : un site qui explique l’univers du projet et donne envie d’y participer.

**Ma solution.** J’ai développé pour un ami un site vitrine avec Astro. Il présente les lives, le Discord, la newsletter et le projet d’application mobile d’apprentissage du code. L’identité visuelle s’appuie sur un univers café, avec une attention portée à la hiérarchie de l’information, aux parcours vers les différents canaux et au SEO.

**Résultat.** Un site vitrine livré et accessible sur laminutedecode.tech, qui centralise les points d’entrée de la communauté et présente la future application mobile. Cette réalisation porte sur le site web : l’application est annoncée comme un projet à venir.

[Découvrir le site](https://laminutedecode.tech/)

## 4. Pourquoi me choisir

**Un interlocuteur qui relie tout le projet.** Application, IA, sécurité et déploiement : je prends en compte leurs dépendances dès le cadrage. Vous avancez avec une vision d’ensemble et des arbitrages expliqués.

Point d’appui : Du développement full-stack à l’architecture d’accès de Zero-Secret.

**Vos données et vos choix restent au centre.** Je compare les options d’hébergement, les modèles et les composants selon vos contraintes. L’open source et l’auto-hébergement sont des options concrètes, avec leurs coûts et leurs limites.

Point d’appui : Une démarche portée aussi par mon engagement dans Biscuits IA.

**Vous pouvez comprendre, vérifier et reprendre.** Périmètre explicite, critères de validation et documentation font partie du travail. Vous pouvez suivre les décisions et préparer la suite avec votre équipe.

Point d’appui : Des décisions d’architecture documentées dans le dépôt Zero-Secret.

## 5. Appel à l’action final

**Parlons de ce que vous voulez rendre plus simple.**

Un processus à automatiser, une application à créer ou des données à mieux exploiter ? Présentez-moi votre contexte et ce qui vous bloque. Nous verrons ensemble quelle première étape est pertinente.

**Bouton : « Présentez-moi votre projet »**

Quelques lignes suffisent : votre activité, le problème à résoudre et votre échéance si vous en avez une.

## 6. Structure et pistes d’amélioration

Ordre intégré à l’accueil :

1. Accroche, identité freelance et contact : le visiteur comprend votre apport dès le premier écran.
2. Trois raisons de travailler avec vous, reliées à des preuves concrètes.
3. Trois projets sélectionnés, avec votre rôle et leur statut. Les projets arrivent avant les prestations.
4. Trois formes d’accompagnement : clarifier, construire, préparer la production.
5. Cas d’usage IA pour aider le visiteur à reconnaître son besoin.
6. Méthode et livrables pour rendre la collaboration prévisible.
7. Présentation personnelle et engagement Biscuits IA ; récit complet sur la page Parcours.
8. FAQ sur le cadrage, les données et la collaboration.
9. Contact avec message prérempli, sans imposer un cahier des charges.

Les prochaines preuves à ajouter lorsqu’elles seront disponibles :

- Un témoignage réel de votre ami pour La Minute de Code, avec son accord : le contexte, votre contribution et ce qu’il a apprécié dans la collaboration.
- Des mesures datées du site livré (performance mobile, accessibilité, SEO technique), en précisant l’outil et les conditions. Un score technique ne prouve pas une hausse de conversions.
- Une courte démonstration de chaque projet : parcours fonctionnel pour Zero-Secret ; tâches et validations réellement implémentées pour Agentic OS.
- Une capture réelle de La Minute de Code pour montrer le travail livré. Le bloc café actuel est une illustration éditoriale, pas une capture du site.
- Pour Agentic OS, la stack et le périmètre déjà opérationnel. Ces informations restent absentes tant qu’elles ne sont pas confirmées.
- Des exemples anonymisés de livrables : note d’architecture, plan de validation, guide de reprise. Publier uniquement des éléments partageables.
- Votre profil Malt si vous souhaitez en faire un canal de prise de contact : ajouter le lien réel et, avec autorisation, les avis correspondants.

Les visuels de conception ne doivent pas être présentés comme des résultats d’exploitation. Le statut des prototypes reste visible ; aucun gain, délai ou résultat chiffré n’a été ajouté sans preuve.

Sources : informations transmises par Alexis ; [README de Zero-Secret](https://github.com/AlexisTak/zero-secret/blob/main/README.md) ; URL de production de [La Minute de Code](https://laminutedecode.tech/) confirmée par Alexis.
