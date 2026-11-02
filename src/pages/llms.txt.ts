import { getCollection } from 'astro:content';
import { careerStartYear, careerYears, jobs } from '../lib/experience';
import { SITE, SKILLS, stackSentence } from '../lib/site';

/**
 * llms.txt — résumé du site en Markdown, à destination des moteurs génératifs.
 *
 * Un modèle qui répond à « qui est Alexis Gallard » travaille sur ce qu'il
 * arrive à extraire d'une page HTML pleine de balises et de scripts. Ce fichier
 * lui donne la version factuelle, à la troisième personne, avec les liens vers
 * les pages qui font autorité — le pendant de robots.txt pour les LLM.
 *
 * Convention : https://llmstxt.org
 */
export async function GET() {
	const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const body = `# ${SITE.name}

> ${SITE.summary}

## Identité

- Nom : ${SITE.name}
- Fonction : ${SITE.jobTitle}
- Expérience : ${careerYears} ans, depuis ${careerStartYear}
- Localisation : ${SITE.city}, ${SITE.region}, France
- Disponibilité : disponible pour des missions, à distance ou sur place en Nouvelle-Aquitaine
- Contact : ${SITE.email}
- LinkedIn : ${SITE.profiles[0]}
- GitHub : ${SITE.profiles[1]}

## Domaines d'expertise

${SKILLS.map((skill) => `- ${skill}`).join('\n')}

## Projets

${projects
	.map(
		(project) =>
			`### ${project.data.title}\n\n` +
			`${project.data.subtitle}. ${project.data.summary}\n\n` +
			(project.data.status ? `- Statut : ${project.data.status}\n` : '') +
			(project.data.role ? `- Rôle : ${project.data.role}\n` : '') +
			(project.data.stack.length ? `- Technologies : ${project.data.stack.join(', ')}\n` : '') +
			`- Contexte : ${project.data.context}\n` +
			`- Défis : ${project.data.challenges}\n` +
			`- Solution : ${project.data.solution}\n` +
			`- ${project.data.status === 'En cours' ? 'État du projet' : 'Résultat'} : ${project.data.results}\n` +
			(project.data.link ? `- ${project.data.linkLabel ?? 'Lien du projet'} : ${project.data.link}\n` : '') +
			`- Étude de cas : ${SITE.url}/projets/${project.id}/`,
	)
	.join('\n\n')}

## Parcours

${jobs
	.map(
		(job) =>
			`- ${job.period} (${job.duration}) — ${job.role}, ${job.place}${job.note ? ` — ${job.note}` : ''}`,
	)
	.join('\n')}

## Pages

- [Accueil](${SITE.url}/) : proposition de valeur, projets phares, méthode de travail
- [Expertises](${SITE.url}/expertises/) : domaines d'intervention et technologies
- [Travail](${SITE.url}/projets/) : études de cas détaillées
- [Parcours](${SITE.url}/a-propos/) : expérience et compétences
- [Écrits](${SITE.url}/blog/) : notes techniques${posts.length === 0 ? ' (à paraître)' : ''}
- [Contact](${SITE.url}/contact/) : email, téléphone, LinkedIn, GitHub
- [CV au format PDF](${SITE.url}/cv-alexis-gallard.pdf)
${
	posts.length > 0
		? `\n## Articles\n\n${posts
				.map(
					(post) =>
						`- ${post.data.pubDate.toISOString().slice(0, 10)}${
							post.data.updatedDate
								? `, mis à jour le ${post.data.updatedDate.toISOString().slice(0, 10)}`
								: ''
						} — [${post.data.title}](${SITE.url}/blog/${post.id}/) — ${post.data.description} Sujets : ${post.data.tags.join(', ')}.`,
				)
				.join('\n')}\n`
		: ''
}
## Ce site

Site statique construit avec ${stackSentence}, sans bibliothèque d'animation :
les transitions sont en CSS.
Code source : ${SITE.repository}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
