import { getCollection } from 'astro:content';
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
- Expérience : 12 ans, depuis 2014
- Localisation : ${SITE.city}, ${SITE.region}, France
- Disponibilité : ouvert aux opportunités, sur place ou à distance
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
			`- Technologies : ${project.data.stack.join(', ')}\n` +
			`- Contexte : ${project.data.context}\n` +
			`- Défis : ${project.data.challenges}\n` +
			`- Solution : ${project.data.solution}\n` +
			`- Résultats : ${project.data.results}\n` +
			(project.data.link ? `- En production : ${project.data.link}\n` : '') +
			`- Étude de cas : ${SITE.url}/projets/${project.id}/`,
	)
	.join('\n\n')}

## Parcours

- Depuis 04/2022 — Développeur Fullstack Senior et AI Engineer, indépendant
- 10/2014 à 01/2023 — Développeur Fullstack, Emmaüs Ruffec
- 02/2016 à 09/2022 — Assistant technique, Auto École Solidaire (en parallèle)

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
