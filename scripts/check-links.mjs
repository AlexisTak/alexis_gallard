/**
 * Vérifie que chaque lien interne du site compilé mène quelque part.
 *
 * Un lien mort passe inaperçu au développement — la page existait encore la
 * dernière fois qu'on l'a ouverte — et ne se voit qu'en production, sur une
 * 404. Ce contrôle lit le HTML généré plutôt que les sources : il attrape donc
 * aussi les liens construits dynamiquement, comme les études de cas.
 *
 * Écrit à la main plutôt qu'avec une dépendance : la règle tient en cinquante
 * lignes et n'a pas besoin de lancer un serveur.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const DIST = resolve('dist');

/** Tous les fichiers de dist, en chemins absolus. */
async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? walk(path) : [path];
		}),
	);
	return files.flat();
}

const exists = async (path) => {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
};

/** Un lien interne peut viser un fichier, un dossier avec index.html, ou une page sans slash. */
async function resolves(href) {
	const path = decodeURIComponent(href.split('#')[0].split('?')[0]);
	if (path === '' || path === '/') return exists(join(DIST, 'index.html'));

	const target = join(DIST, path);
	const candidates = [target, join(target, 'index.html'), `${target}.html`];

	for (const candidate of candidates) {
		if (await exists(candidate)) return true;
	}
	return false;
}

const files = (await walk(DIST)).filter((file) => file.endsWith('.html'));
const broken = [];
let checked = 0;

for (const file of files) {
	const html = await readFile(file, 'utf8');
	const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

	for (const href of hrefs) {
		// Externes, ancres et protocoles particuliers : hors de notre ressort.
		if (!href.startsWith('/') || href.startsWith('//')) continue;

		checked += 1;
		if (!(await resolves(href))) {
			broken.push({ page: relative(DIST, file), href });
		}
	}
}

if (broken.length > 0) {
	console.error(`\n${broken.length} lien(s) interne(s) cassé(s) :\n`);
	for (const { page, href } of broken) {
		console.error(`  ${page} → ${href}`);
	}
	process.exit(1);
}

console.log(`${checked} liens internes vérifiés dans ${files.length} pages, aucun cassé.`);
