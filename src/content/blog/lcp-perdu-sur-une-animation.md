---
title: "800 ms de LCP perdues sur une animation"
description: "Le contenu principal de ce site était masqué jusqu'à ce qu'un script le révèle. Récit du diagnostic, fausse piste comprise."
pubDate: 2026-09-03
tags: ["performance", "Core Web Vitals", "LCP", "diagnostic"]
---

Ce site affichait son contenu principal en 797 millisecondes sur mobile. Il l'affiche aujourd'hui en 223. La correction n'a demandé aucune optimisation de fichier, aucun changement d'hébergement, aucun format d'image exotique. Elle a demandé de supprimer une animation.

Le chemin pour y arriver est plus instructif que la correction elle-même, parce qu'il commence par une erreur de diagnostic.

## Le symptôme

Le site est statique, généré à la compilation, servi depuis un réseau de diffusion. Les polices sont auto-hébergées et préchargées. Il n'y a ni image dans l'en-tête, ni script tiers, ni requête vers une API. Sur le papier, rien ne peut retarder le premier affichage.

Et pourtant, le relevé mobile donnait un *Largest Contentful Paint* proche de huit dixièmes de seconde, alors que le premier octet arrivait en quelques dizaines de millisecondes. Entre les deux, un trou que rien dans la cascade réseau n'expliquait.

## La fausse piste

Le panneau de performance signalait un *forced reflow* de 47 millisecondes. J'avais un script de révélation au défilement qui, pour chaque élément à animer, appelait `getBoundingClientRect()` puis écrivait une classe dessus — lecture, écriture, lecture, écriture.

C'est le manuel : alterner lectures et écritures de mise en page force le navigateur à recalculer la géométrie à chaque tour. La correction est connue, j'ai groupé toutes les lectures d'abord, puis toutes les écritures.

Résultat mesuré : **47 millisecondes devenues 52**. Aucune amélioration, et même une légère dégradation dans le bruit de mesure.

C'est le moment le plus utile du diagnostic, à condition de le prendre au sérieux au lieu de recommencer. Une correction manuelle qui ne produit rien signifie que le modèle mental est faux. Ici, le coût n'était pas dans l'*alternance* des lectures et des écritures. Il était dans la **première lecture**, quelle qu'elle soit : `getBoundingClientRect()` oblige le navigateur à calculer la mise en page sur-le-champ, dans le fil principal, avant de rendre la valeur. Grouper les appels ne supprime pas ce calcul, il le déplace.

## La vraie cause

En reprenant depuis le début — non pas « pourquoi ce script est-il lent » mais « pourquoi le contenu s'affiche-t-il si tard » —, la réponse était dans une feuille de style :

```css
.js-motion [data-reveal] {
	opacity: 0;
	transform: translateY(16px);
}
```

Le titre du site portait `data-reveal`. Il était donc **invisible** jusqu'à ce qu'un script s'exécute, observe qu'il est à l'écran, et lui ajoute une classe.

Le navigateur avait le HTML, avait la police, avait tout ce qu'il fallait pour peindre. Il peignait effectivement — un bloc transparent. Le *Largest Contentful Paint* ne se déclenche pas sur un élément à opacité nulle : il attendait que le JavaScript soit téléchargé, analysé, exécuté, que l'observateur remonte son premier lot, et que la transition CSS ait avancé assez pour que le texte devienne visible.

L'animation ne ralentissait pas l'affichage. **Elle était l'affichage.**

## La correction

Une ligne : retirer `data-reveal` du bloc d'en-tête.

```astro
{/* Aucune révélation ici : ce bloc est le premier contenu peint, et souvent
    l'élément retenu pour le LCP. */}
<section class="card relative overflow-hidden p-6 md:p-10 lg:p-14">
```

Le reste de la page conserve ses animations. Elles concernent des blocs situés plus bas, qui ne sont de toute façon pas visibles au chargement, et qui ne peuvent donc pas porter le LCP.

Mesure après correction : **223 millisecondes sur mobile**, et l'avertissement de *forced reflow* disparu — puisque j'ai profité du même passage pour retirer toute mesure de géométrie du script. L'observateur d'intersection rapporte l'état initial de tous les éléments qu'il surveille, sans rien bloquer : son premier appel dit déjà lesquels sont à l'écran. Il n'y avait aucune raison de mesurer à la main.

## Trois règles que j'en retire

**Ce qui est masqué jusqu'à l'exécution d'un script n'existe pas pour le navigateur.** Toute technique qui rend du contenu invisible en attendant JavaScript — révélation au défilement, hydratation qui gouverne la visibilité, écran de chargement — déplace le premier affichage utile après le premier octet de script exécuté. Sur une connexion mobile lente, cet écart se compte en secondes.

**Une correction qui ne mesure rien est une hypothèse réfutée, pas une correction à peaufiner.** J'aurais pu passer une heure à raffiner le groupement des lectures. Le résultat nul était l'information : il disait que je regardais au mauvais endroit.

**Le contenu ne doit jamais dépendre d'une animation qui aboutit.** Même après correction, j'ai gardé deux protections : les styles de révélation ne s'appliquent que si une classe `js-motion` est posée par le script lui-même — sans JavaScript, tout est visible — et un délai de sécurité révèle tout au bout de trois secondes, quoi qu'il arrive. Un onglet ouvert en arrière-plan, un observateur muet, une erreur en amont : le texte s'affiche quand même.

## Ce qui reste

Le site tient aujourd'hui 100 sur 100 aux quatre catégories de l'audit, sur ordinateur comme sur mobile, avec un décalage cumulé nul et moins de six kilo-octets de JavaScript. Ces chiffres ne viennent pas d'une optimisation fine mais de deux décisions simples : ne rien masquer au chargement, et [n'embarquer aucun script dont on ne peut pas justifier chaque kilo-octet](/blog/choisir-sa-stack/).

Le code est public. Les mesures se refont en cinq minutes avec l'outil d'audit de n'importe quel navigateur — c'est d'ailleurs la seule façon honnête de citer un chiffre de performance.
