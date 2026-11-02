/** Texte éditorial partagé entre l'accueil et la page parcours. */
const headline = ['Des outils web et IA', 'utiles à votre activité,', 'avec la maîtrise de vos données.'] as const;

export const positioning = {
	headingParts: headline,
	heading: headline.join(' '),
	subtitle: 'Je suis Alexis Gallard, développeur full-stack et ingénieur IA freelance. Je transforme vos besoins en applications et automatisations concrètes, avec la sécurité, le choix de l’hébergement et la reprise en main par vos équipes pensés dès le départ.',
	about: [
		'Je suis Alexis Gallard, développeur full-stack et ingénieur IA freelance. J’accompagne les entreprises qui veulent créer un outil métier, intégrer l’IA à leurs processus ou faire évoluer une application existante. Mon rôle : traduire votre besoin en décisions techniques compréhensibles, puis en un outil que votre équipe peut utiliser et faire évoluer.',
		'Je relie le développement web, les agents IA et la sécurité pour traiter le projet dans son ensemble. Avant de choisir un modèle ou une technologie, nous clarifions le problème, les données disponibles et les critères de réussite. Vous savez ce que nous construisons, pourquoi nous le construisons et comment nous le vérifierons.',
		'Les solutions souveraines et open source occupent une place importante dans mon travail. Je vous aide à arbitrer entre confidentialité, budget et contraintes d’exploitation, pour choisir un hébergement et des composants adaptés à votre situation.',
		'Je suis aussi fondateur de Biscuits IA, une association qui démocratise l’IA auprès des associations, des TPE et des collectivités. Cet engagement nourrit ma façon de travailler : expliquer clairement, partir des usages et transmettre les connaissances. Basé à Poitiers, j’accompagne des clients partout en France, à distance. Mon objectif est de vous laisser un outil utile, documenté et une équipe capable de le reprendre.',
	],
	reasons: [
		{ title: 'Un interlocuteur qui relie tout le projet.', text: 'Application, IA, sécurité et déploiement : je prends en compte leurs dépendances dès le cadrage. Vous avancez avec une vision d’ensemble et des arbitrages expliqués.', proof: 'Du développement full-stack à l’architecture d’accès de Zero-Secret.', href: '/projets/zero-secret/' },
		{ title: 'Vos données et vos choix restent au centre.', text: 'Je compare les options d’hébergement, les modèles et les composants selon vos contraintes. L’open source et l’auto-hébergement sont des options concrètes, avec leurs coûts et leurs limites.', proof: 'Une démarche portée aussi par mon engagement dans Biscuits IA.', href: '/projets/biscuits-ia/' },
		{ title: 'Vous pouvez comprendre, vérifier et reprendre.', text: 'Périmètre explicite, critères de validation et documentation font partie du travail. Vous pouvez suivre les décisions et préparer la suite avec votre équipe.', proof: 'Des décisions d’architecture documentées dans le dépôt Zero-Secret.', href: 'https://github.com/AlexisTak/zero-secret' },
	],
} as const;
