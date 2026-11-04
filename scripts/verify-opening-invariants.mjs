import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const state=JSON.parse(fs.readFileSync(path.join(root,'.twin/state.json'),'utf8'));
const file=path.join(root,state.siteCandidate.path,'baseline-hashes.json');
const baseline=JSON.parse(fs.readFileSync(file,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const errors=[];
for(const [name,expected] of Object.entries(baseline.files||{}))
 if(hash(fs.readFileSync(path.join(root,name)))!==expected)errors.push('Protected source changed: '+name);
const component=fs.readFileSync(path.join(root,'src/components/v2/ReferencePage.tsx'),'utf8');
const tail=component.indexOf('function ReferenceChannels');
if(tail<0||hash(component.slice(tail))!==baseline.referenceRestSha256)errors.push('Protected lower React blocks changed');
const css=fs.readFileSync(path.join(root,'src/styles/v2/hero-journey.css'),'utf8');
for(const [selector,expected] of Object.entries(baseline.acceptedTransitionRules||{})){
 const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const actual=css.match(new RegExp(escaped+'\\{[^}]*\\}','g'))||[];
 if(JSON.stringify(actual)!==JSON.stringify(expected))errors.push('Operator-approved transition changed: '+selector);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log('Protected media, accepted transition rules and downstream source unchanged');
