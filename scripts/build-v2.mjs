import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..'),dist=join(root,'dist'),out=join(dist,'v2');
execFileSync('npm',['run','build'],{cwd:root,stdio:'inherit',env:{...process.env,TWIN_BASE_PATH:'/twin-web-concept'}});
if(!existsSync(join(out,'index.html')))throw Error('V2 page not found in dist/v2/index.html');
if(existsSync(join(dist,'_astro')))cpSync(join(dist,'_astro'),join(out,'_astro'),{recursive:true});
for(const path of ['top-v2/hero.webp','logo.webp','final-r2/journey/project.png','final-r2/journey/corpus.png','final-r2/journey/floor.png','final-r2/journey/lot.png']){const source=join(dist,'media',path),target=join(out,'media',path);if(!existsSync(source))throw Error(`Missing V2 media: ${path}`);mkdirSync(resolve(target,'..'),{recursive:true});cpSync(source,target)}
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
for(const path of walk(out))if(/\.(html|css|js|mjs)$/.test(path)){
 const before=readFileSync(path,'utf8');const after=before.replaceAll('/twin-web-concept/_astro/','/twin-web-concept/v2/_astro/').replaceAll('/twin-web-concept/media/','/twin-web-concept/v2/media/');
 if(after!==before)writeFileSync(path,after);
}
const html=readFileSync(join(out,'index.html'),'utf8');if(!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html))throw Error('V2 noindex marker missing');
for(const file of walk(out))if(/\.(html|css|js|mjs)$/.test(file)){const content=readFileSync(file,'utf8');if(/\/twin-web-concept\/(?:_astro|media)\//.test(content))throw Error(`V1 dependency reference in ${file}`);if(/\/twin-web-concept(?:media|demo)\//.test(content))throw Error(`Missing slash after BASE_URL in ${file}`)}
for(const match of html.matchAll(/(?:src|href|component-url|renderer-url)="\/twin-web-concept\/v2\/([^"?#]+)"/g)){if(!existsSync(join(out,match[1])))throw Error(`V2 dependency missing: ${match[1]}`)}
console.log('V2 standalone subtree prepared at dist/v2');
