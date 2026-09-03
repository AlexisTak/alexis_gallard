/**
 * Parcours professionnel, source unique.
 *
 * Ces dates alimentaient trois endroits écrits à la main : la frise de
 * `/a-propos`, la réponse « combien d'années d'expérience » de la FAQ d'accueil
 * — balisée en `FAQPage`, donc citable telle quelle par un moteur — et la
 * section Parcours de `llms.txt`. Elles avaient déjà divergé : la FAQ annonçait
 * neuf ans chez Emmaüs pour huit ans et trois mois réels, et quatre ans
 * d'indépendance pour trois ans et dix mois. Les durées sont désormais
 * calculées, elles ne peuvent plus mentir.
 */

export interface Job {
	/** Identifiant stable : le texte affiché change, pas lui. */
	id: string;
	role: string;
	place: string;
	/** Repère AAAA-MM, comme sur le CV. */
	start: string;
	/** Absent tant que le poste est en cours. */
	end?: string;
	/** Explique un chevauchement : deux postes tenus ensemble, ou une transition. */
	note?: string;
	points: string[];
}

export const EXPERIENCE: Job[] = [
	{
		id: 'independant',
		role: 'Développeur Fullstack Senior · AI Engineer',
		place: 'Indépendant',
		start: '2022-04',
		end: '2026-02',
		points: [
			"Architecture logicielle, analyse des besoins clients, conception d'API REST et développement Fullstack, avec tests unitaires et d'intégration.",
			"Déploiement de solutions d'IA open source en entreprise, réduisant la dépendance et les coûts liés aux LLM propriétaires.",
			'Agents IA et workflows automatisés ; hébergement et optimisation de modèles locaux selon les contraintes matérielles.',
			"Audit et migration d'infrastructures IA ; revues de code et d'architecture.",
		],
	},
	{
		id: 'emmaus',
		role: 'Développeur Fullstack',
		place: 'Emmaüs Ruffec',
		start: '2014-10',
		end: '2023-01',
		note: "Derniers mois en parallèle du lancement de l'activité indépendante",
		points: [
			'Frontend JavaScript/TypeScript (React, Next.js, TailwindCSS) : responsive, SEO technique, accessibilité.',
			'Backend Node.js (Express, NestJS) et PHP : API REST/GraphQL, authentification JWT/OAuth.',
			'Conception et optimisation de bases PostgreSQL, MySQL, MongoDB, Redis.',
			'Cloud et DevOps : Docker, CI/CD, Linux, Nginx, Vercel, Supabase ; déploiement et maintenance en production.',
		],
	},
	{
		id: 'auto-ecole',
		role: 'Assistant technique',
		place: 'Auto École Solidaire',
		start: '2016-02',
		end: '2022-09',
		note: 'Poste tenu en parallèle du poste chez Emmaüs Ruffec',
		points: [
			"Conception et maintenance de l'intranet de l'association.",
			'Support et formation des équipes aux outils informatiques ; gestion des dossiers bénéficiaires.',
		],
	},
];

const short = (value: string) => value.split('-').reverse().join('/');
const year = (value: string) => value.split('-')[0];

/** Nombre de mois entre deux repères AAAA-MM ; la date du jour fait office de fin. */
function monthsBetween(start: string, end?: string) {
	const [startYear, startMonth] = start.split('-').map(Number);
	const now = new Date();
	const [endYear, endMonth] = end
		? end.split('-').map(Number)
		: [now.getFullYear(), now.getMonth() + 1];
	return (endYear - startYear) * 12 + (endMonth - startMonth);
}

/** « 8 ans 3 mois » — ce qu'un recruteur cherche et que deux dates l'obligent
    sinon à calculer de tête. */
export function formatDuration(start: string, end?: string) {
	const total = Math.max(monthsBetween(start, end), 1);
	const years = Math.floor(total / 12);
	const months = total % 12;
	const parts: string[] = [];
	if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`);
	if (months > 0) parts.push(`${months} mois`);
	return parts.join(' ');
}

/** Un poste en cours n'a pas de borne de fin : « → aujourd'hui » laisserait
    croire à une date qui n'existe pas. */
export function formatPeriod(start: string, end?: string) {
	return end ? `${short(start)} → ${short(end)}` : `Depuis ${short(start)}`;
}

/* Trié par date de fin décroissante, le poste en cours d'abord : c'est l'ordre
   qu'on attend d'une frise, et il reste juste si un poste est ajouté. */
export const jobs = [...EXPERIENCE]
	.sort(
		(a, b) => (b.end ?? '9999').localeCompare(a.end ?? '9999') || b.start.localeCompare(a.start),
	)
	.map((job) => ({
		...job,
		period: formatPeriod(job.start, job.end),
		duration: formatDuration(job.start, job.end),
		startYear: year(job.start),
		endYear: job.end ? year(job.end) : undefined,
		current: !job.end,
	}));

const debut = EXPERIENCE.reduce((plusAncien, job) => (job.start < plusAncien ? job.start : plusAncien), EXPERIENCE[0].start);

/** Année du tout premier poste. */
export const careerStartYear = year(debut);

/** Ancienneté arrondie à l'année. Onze ans et onze mois s'annoncent douze,
    pas onze : l'arrondi est plus juste que la troncature. */
export const careerYears = Math.round(monthsBetween(debut) / 12);

/** Retrouve un poste par son identifiant, pour les phrases qui en citent un. */
export const jobById = (id: string) => {
	const job = jobs.find((entry) => entry.id === id);
	if (!job) throw new Error(`Poste inconnu : ${id}`);
	return job;
};
