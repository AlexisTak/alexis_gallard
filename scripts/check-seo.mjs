import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const errors = [];
const titles = new Set();
const canonicals = new Set();
const descriptions = new Set();
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))).flat();
}
const files = (await walk('dist')).filter(f => f.endsWith('.html'));
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const fail = message => errors.push(`${file}: ${message}`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/s)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/s)?.[1];
  const image = html.match(/<meta property="og:image" content="([^"]+)"/s)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/s)?.[1];
  for (const [value, seen, label] of [[title,titles,'titre'],[description,descriptions,'description'],[canonical,canonicals,'canonique']]) {
    if (!value || seen.has(value)) fail(`${label} absent ou dupliqué`);
    seen.add(value);
  }
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) fail('un seul H1 attendu');
  if (!/<html[^>]*lang="fr"/.test(html)) fail('langue française absente');
  if (canonical !== ogUrl) fail('URL Open Graph différente de la canonique');
  try {
    const url = new URL(canonical);
    if (url.protocol !== 'https:' || /localhost|127\.0\.0\.1/.test(url.hostname)) fail('canonique non publique');
    const path = url.pathname;
    if (path !== '/' && !path.endsWith('/') && !path.endsWith('.html')) fail('slash canonique absent');
    const imageUrl = new URL(image);
    if (imageUrl.origin !== url.origin) fail('image OG sur une origine inattendue');
    await access(join('dist', imageUrl.pathname));
  } catch { fail('URL invalide ou image OG introuvable'); }
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  if (!blocks.length) fail('JSON-LD absent');
  for (const [, block] of blocks) {
    try {
      const data = JSON.parse(block);
      if (data['@context'] !== 'https://schema.org') fail('contexte JSON-LD invalide');
      for (const node of data['@graph'] ?? []) {
        if (node['@type'] === 'BlogPosting' && (!node.image || !node.author || !node.datePublished || !node.mainEntityOfPage)) fail('article incomplet');
      }
    } catch { fail('JSON-LD non parsable'); }
  }
  if (file.endsWith('404.html') && !html.includes('noindex')) fail('404 indexable');
}
const sitemap = (await Promise.all((await walk('dist')).filter(f => /sitemap.*\.xml$/.test(f)).map(f => readFile(f,'utf8')))).join('');
if (/<loc>[^<]*\/404(?:\.html|\/)?<\/loc>/.test(sitemap)) errors.push('404 présente dans le sitemap');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`${files.length} pages : titres, descriptions, canoniques, images OG, H1, JSON-LD et exclusion 404 vérifiés.`);
