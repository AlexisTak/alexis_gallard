/**
 * Identité du site en un seul endroit.
 *
 * Ces valeurs alimentent les métadonnées, les données structurées et
 * `llms.txt` : les dupliquer dans chaque page finirait par les désynchroniser,
 * et une contradiction entre balisage et contenu vaut pire que leur absence.
 */

export const SITE = {
	name: 'Alexis Gallard',
	shortName: 'Alexis Gallard',
	url: 'https://alexisgallard.vercel.app',
	locale: 'fr_FR',
	lang: 'fr',
	jobTitle: 'Développeur Fullstack Senior · AI Engineer',
	/** Formulation à la troisième personne : c'est celle qu'un moteur reprend. */
	summary:
		"Alexis Gallard est développeur Fullstack Senior et AI Engineer, avec 12 ans d'expérience. Il conçoit des applications web, des logiciels desktop en Rust et des intégrations d'IA appliquée — LLM, RAG, agents — de l'architecture jusqu'à l'exploitation. Il est basé à Poitiers, en Nouvelle-Aquitaine.",
	email: 'alexis_gallard@outlook.fr',
	phone: '+33765723070',
	city: 'Poitiers',
	region: 'Nouvelle-Aquitaine',
	country: 'FR',
	profiles: ['https://www.linkedin.com/in/alexis-gallard', 'https://github.com/AlexisTak'],
	repository: 'https://github.com/AlexisTak/alexis_gallard',
} as const;

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
	seeks: {
		'@type': 'Demand',
		name: "Poste de développeur Fullstack Senior ou AI Engineer",
		availableAtOrFrom: {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressLocality: SITE.city,
				addressRegion: SITE.region,
				addressCountry: SITE.country,
			},
		},
	},
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
