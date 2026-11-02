/**
 * Identité du site en un seul endroit.
 *
 * Ces valeurs alimentent les métadonnées, les données structurées et
 * `llms.txt` : les dupliquer dans chaque page finirait par les désynchroniser,
 * et une contradiction entre balisage et contenu vaut pire que leur absence.
 */

import { careerYears } from './experience';

export const SITE = {
	name: 'Alexis Gallard',
	shortName: 'Alexis Gallard',
	url: 'https://alexisgallard.vercel.app',
	locale: 'fr_FR',
	lang: 'fr',
	jobTitle: 'Développeur freelance IA & Fullstack Senior',
	/** Formulation à la troisième personne : c'est celle qu'un moteur reprend. */
	summary: `Alexis Gallard est développeur full-stack et ingénieur IA freelance, avec ${careerYears} ans d’expérience. Il conçoit des applications web, des agents IA et des systèmes RAG avec une attention particulière à la sécurité, aux solutions open source et à la maîtrise des données. Fondateur de Biscuits IA, il démocratise l’IA auprès des associations, TPE et collectivités. Basé à Poitiers, il intervient en Nouvelle-Aquitaine et à distance.`,
	email: 'contact@alexis-gallard.fr',
	phone: '+33765723070',
	city: 'Poitiers',
	region: 'Nouvelle-Aquitaine',
	country: 'FR',
	profiles: ['https://www.linkedin.com/in/alexis-gallard', 'https://github.com/AlexisTak'],
	repository: 'https://github.com/AlexisTak/alexis_gallard',
} as const;

/**
 * Jetons de vérification de propriété des outils pour webmasters.
 *
 * Publics par nature : ils apparaissent dans le HTML servi. Ils prouvent
 * seulement qu'on contrôle le site, ils n'ouvrent aucun accès.
 *
 * La vérification par DNS serait préférable — elle survit à un changement
 * d'hébergeur et couvre les sous-domaines — mais elle est impossible tant que
 * le site vit sous `vercel.app`, dont les enregistrements appartiennent à
 * Vercel. À reprendre par DNS le jour où un nom de domaine propre est en place.
 */
export const VERIFICATION = {
	google: 'K67LhKvGV1shIeLO0zdHvLNREBjS9C7pWFUebnXDYs8',
} as const;

/**
 * Informations légales.
 *
 * L'adresse de l'hébergeur et la date de mise à jour apparaissent sur deux
 * pages ; recopiées à la main, elles finiraient par diverger, et une mention
 * légale qui se contredit d'une page à l'autre vaut pire que son absence.
 */
export const LEGAL = {
	/** Format ISO, pour `dateModified` dans les données structurées. */
	updatedAt: '2026-10-21',
	/** Même date, écrite pour être lue. */
	updatedLabel: '21 octobre 2026',
	host: {
		name: 'Vercel Inc.',
		address: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
		url: 'https://vercel.com',
	},
} as const;

/**
 * Stack du site lui-même — à ne pas confondre avec SKILLS, qui décrit les
 * compétences d'Alexis. Décrite ici parce qu'elle est affirmée à trois
 * endroits : le colophon du pied de page, llms.txt et le README. Recopiée à la
 * main, elle finissait par citer une dépendance déjà retirée du projet.
 */
export const STACK = [
	{ name: 'Astro', role: 'génération statique' },
	{ name: 'Tailwind CSS', role: 'styles' },
	{ name: 'Lenis', role: 'scroll interpolé' },
] as const;

/** Une ligne prête à afficher : « Astro, Tailwind CSS et Lenis ». */
export const stackSentence = STACK.map((tool) => tool.name).reduce(
	(sentence, name, index, all) =>
		index === 0 ? name : index === all.length - 1 ? `${sentence} et ${name}` : `${sentence}, ${name}`,
	'',
);

export const SKILLS = [
	'Développement Fullstack',
	'TypeScript',
	'React',
	'Next.js',
	'Vue.js',
	'Node.js',
	'NestJS',
	'Laravel',
	'PHP',
	'Rust',
	'Tauri',
	'Go',
	'Java · Spring Boot',
	'Quarkus',
	'Angular',
	'Python',
	'Architecture microservices',
	'LLM',
	'RAG',
	'Fine-tuning LoRA',
	'Agents IA',
	'Docker',
	'Kubernetes',
	'Terraform',
	'CI/CD',
	'PostgreSQL',
] as const;

/** Personne, réutilisée telle quelle par les autres schémas via son identifiant. */
export const personSchema = {
	'@type': 'Person',
	'@id': `${SITE.url}/#person`,
	name: SITE.name,
	jobTitle: SITE.jobTitle,
	description: SITE.summary,
	url: SITE.url,
	email: `mailto:${SITE.email}`,
	telephone: SITE.phone,
	sameAs: [...SITE.profiles],
	address: {
		'@type': 'PostalAddress',
		addressLocality: SITE.city,
		addressRegion: SITE.region,
		addressCountry: SITE.country,
	},
	knowsAbout: [...SKILLS],
	knowsLanguage: ['fr', 'en'],
	memberOf: { '@id': `${SITE.url}/#biscuits-ia` },
};

export const biscuitsSchema = {
 '@type': 'Organization',
 '@id': `${SITE.url}/#biscuits-ia`,
 name: 'Biscuits IA',
 description: 'Association qui démocratise l’IA auprès des associations, TPE et collectivités.',
 url: `${SITE.url}/projets/biscuits-ia/`,
 founder: { '@id': `${SITE.url}/#person` },
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': `${SITE.url}/#website`,
	url: SITE.url,
	name: `${SITE.name} — ${SITE.jobTitle}`,
	description: SITE.summary,
	inLanguage: SITE.lang,
	publisher: { '@id': `${SITE.url}/#person` },
};

/** Fil d'Ariane : indique aux moteurs la place de la page dans le site. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Accueil', path: '/' }, ...trail].map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: new URL(item.path, SITE.url).toString(),
		})),
	};
}
