import {execFileSync} from 'node:child_process';
import {cpSync,existsSync,mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {createHash,randomBytes} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),out=join(root,'dist','v2');
const git=(args,cwd=root)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
if(git(['status','--porcelain']))throw Error('Commit source before publishing');
if(!existsSync(join(out,'index.html')))throw Error('Run npm run build:v2 first');
const source=git(['rev-parse','HEAD']),ref='refs/heads/twin-preview';
const remoteHead=()=>git(['ls-remote','origin',ref]).split(/\s+/)[0];
const previous=remoteHead();if(!/^[a-f0-9]{40}$/.test(previous))throw Error('Cannot verify Pages HEAD');
const backup=`backup/pages-before-vis002-${new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)}-${randomBytes(3).toString('hex')}`;
if(git(['ls-remote','origin',`refs/heads/${backup}`]))throw Error('Backup already exists');
const dir=mkdtempSync(join(tmpdir(),'twin-v2-release-'));
function manifest(d,prefix=''){let result={};for(const e of readdirSync(d,{withFileTypes:true})){if(!prefix&&(e.name==='.git'||e.name==='v2'))continue;const name=prefix?`${prefix}/${e.name}`:e.name,path=join(d,e.name);if(e.isSymbolicLink())throw Error(`Unexpected symlink: ${name}`);if(e.isDirectory())Object.assign(result,manifest(path,name));else if(e.isFile())result[name]=createHash('sha256').update(readFileSync(path)).digest('hex');else throw Error(`Unexpected file: ${name}`)}return result}
try{
 git(['clone','--quiet','--single-branch','--branch','twin-preview','https://github.com/AURRRUS/twin-web-concept.git',dir]);
 if(git(['rev-parse','HEAD'],dir)!==previous)throw Error('Pages HEAD changed before clone; rebuild against latest');
 git(['push','origin',`${previous}:refs/heads/${backup}`],dir);
 if(git(['ls-remote','origin',`refs/heads/${backup}`],dir).split(/\s+/)[0]!==previous)throw Error('Backup mismatch');
 const baseline=manifest(dir),v1=JSON.parse(readFileSync(join(dir,'build-version.json'),'utf8'));
 const manifestPath=process.env.TWIN_V2_MANIFEST_FILE||join(tmpdir(),`twin-v2-v1-manifest-${source}.json`);
 writeFileSync(manifestPath,JSON.stringify({sourceCommit:source,previousPagesCommit:previous,files:baseline},null,2)+'\n');
 rmSync(join(dir,'v2'),{recursive:true,force:true});cpSync(out,join(dir,'v2'),{recursive:true});
 writeFileSync(join(dir,'v2','build-version.json'),JSON.stringify({version:'v2',taskId:'VIS-002',sourceCommit:source,basedOnV1SourceCommit:v1.sourceCommit,previousPagesCommit:previous,builtAt:new Date().toISOString()},null,2)+'\n');
 const after=manifest(dir);if(JSON.stringify(Object.entries(baseline).sort())!==JSON.stringify(Object.entries(after).sort()))throw Error('Non-v2 Pages files changed');
 git(['add','--all','--','v2'],dir);const changed=git(['diff','--cached','--name-only'],dir).split('\n').filter(Boolean);if(!changed.length||changed.some(p=>!p.startsWith('v2/')))throw Error('Staged changes outside v2 or empty release');
 if(remoteHead()!==previous)throw Error('Pages HEAD changed; fetch and rebuild');
 git(['-c','user.name=Codex','-c','user.email=codex@users.noreply.github.com','commit','-m',`Publish Twin V2 ${source.slice(0,7)}`],dir);
 git(['push','origin','HEAD:twin-preview'],dir);
 console.log(JSON.stringify({sourceCommit:source,pagesCommit:git(['rev-parse','HEAD'],dir),previousPagesCommit:previous,backup,nonV2FileCount:Object.keys(baseline).length,nonV2ManifestPath:manifestPath},null,2));
}finally{rmSync(dir,{recursive:true,force:true})}
