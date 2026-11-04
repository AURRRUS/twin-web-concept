import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readJSON, readState, fileHash} from './workflow-state.mjs';
import {validateTask} from './twin-system.mjs';

export function validatePointers(state, v1, v2, task, workflowTask, branch) {
  const errors = [];
  if (state.schemaVersion !== 1 || state.repository !== 'AURRRUS/twin-web-concept') errors.push('Invalid state registry');
  if (!state.workingBranch || (branch && ![state.workingBranch,state.siteCandidate?.sourceBranch].includes(branch))) errors.push('Working branch differs from state registry');
  for (const [profile, alias] of [['v1', v1], ['v2', v2]])
    if (JSON.stringify(Object.keys(alias).sort()) !== JSON.stringify(['profile','schemaVersion','statePath']) || alias.schemaVersion !== 2 || alias.profile !== profile || alias.statePath !== '.twin/state.json') errors.push('Stale project pointer: '+profile);
  if (state.siteCandidate?.taskId !== task.id || state.siteCandidate?.path !== `.twin/tasks/${task.id}`) errors.push('Stale candidate task pointer');
  if (state.workflowTask?.id !== workflowTask.id || state.workflowTask?.path !== `.twin/tasks/${workflowTask.id}` || state.workflowTask?.mode !== workflowTask.mode) errors.push('Stale workflow task pointer');
  if (state.workflowTask?.publicationAllowed !== workflowTask.publication?.allowed) errors.push('Workflow publication scope mismatch');
  if (state.publicationAuthority?.source !== `${state.siteCandidate?.path}/task.json#/publication`) errors.push('Publication authority must reference candidate task');
  return errors;
}
export function validateContract(task, contract, typography, run) {
  const errors = [];
  for (const [name, projection] of [['contract',contract.publication],['run',run.publication]]) {
    if (projection?.source !== `.twin/tasks/${task.id}/task.json#/publication` || projection?.generated !== true) errors.push(name+': publication projection source missing');
    for (const [key,value] of Object.entries(task.publication || {}))
      if (JSON.stringify(projection?.[key]) !== JSON.stringify(value)) errors.push(name+': publication mismatch '+key);
  }
  if (!task.sources?.includes(typography.source) || !task.sources?.includes(contract.typographySource)) errors.push('Engineering/typography inheritance missing');
  for (const row of contract.typeRoles || []) {
    const role = typography.roles?.[row.role];
    if (!role || ['file','weight','tracking'].some(k=>row[k] !== role[k]) || row.size !== role.desktop.size || row.lineHeight !== role.desktop.lineHeight) errors.push('Typography projection mismatch: '+row.role);
  }
  const motion = contract.motion?.contract;
  if (contract.motion?.changed) {
    if (motion?.driver !== 'scroll' || !(motion.scrollDistancePx > 0)) errors.push('Numeric scroll budget required');
    let end = 0;
    for (const phase of motion?.phases || []) {
      if (!phase || typeof phase !== 'object' || !Number.isFinite(phase.start) || !Number.isFinite(phase.end) || Math.abs(phase.start-end)>1e-8 || phase.end<=phase.start || phase.end>1) errors.push('Numeric contiguous motion phases required');
      end = phase?.end;
    }
    if (end !== 1) errors.push('Motion timeline must end at 1');
  }
  if (run.schemaVersion !== 2 || !['prepare','execute','review'].includes(run.mode)) errors.push('Run schema/mode must be migrated explicitly');
  const stages=['brief','spec','sample','assets','static','responsive','motion','review','release'];
  if (!stages.includes(run.targetStage) || (run.mode==='prepare'&&!['brief','spec'].includes(run.targetStage)) || (run.mode==='review'&&run.targetStage!=='review')) errors.push('Invalid targetStage for run mode');
  if (!run.stages || typeof run.stages!=='object' || Array.isArray(run.stages)) errors.push('Run stages object required');
  for (const [name,stage] of Object.entries(run.stages || {})) {
    if (!stages.includes(name) || !['pending','blocked','done','not-applicable'].includes(stage?.status)) errors.push('Invalid stage status: '+name);
    if (stage?.status==='done' && (!Array.isArray(stage.evidence)||!stage.evidence.length)) errors.push('Completed stage requires evidence: '+name);
  }
  if (run.stages?.assets?.status === 'done' && run.assetJobs?.some(j=>j.required!==false && j.status!=='accepted')) errors.push('Required asset ready/blocked is not accepted');
  for (const job of run.assetJobs || []) if(job.status==='accepted' && (!Array.isArray(job.outputs)||!job.outputs.length||typeof job.acceptedBy!=='string'||!job.acceptedBy.trim()||typeof job.observed!=='string'||!job.observed.trim())) errors.push('Accepted asset requires outputs and scene acceptance');
  return errors;
}
export function checkWorkflow(root, {branch} = {}) {
  const state = readState(root), task = readJSON(root, `${state.siteCandidate.path}/task.json`), workflowTask = readJSON(root, `${state.workflowTask.path}/task.json`);
  const contractPath = `${state.siteCandidate.path}/visual-contract.json`;
  const contract = readJSON(root, contractPath), run = readJSON(root, `${state.siteCandidate.path}/run.json`), typography = readJSON(root, state.profiles.v2.typographySource);
  const errors = [
    ...validatePointers(state, readJSON(root,'.twin/project.json'), readJSON(root,'.twin/v2/project.json'), task, workflowTask, branch),
    ...validateTask(task), ...validateTask(workflowTask), ...validateContract(task, contract, typography, run)
  ];
  if (run.contractFingerprint !== fileHash(root, contractPath)) errors.push('Run contract fingerprint stale');
  if (contract.typographySource !== state.profiles.v2.typographySource) errors.push('Typography canon pointer mismatch');
  for (const [name,stage] of Object.entries(run.stages || {})) if(stage.status==='done')
    for(const file of stage.evidence || []) if(typeof file!=='string'||path.isAbsolute(file)||file.split(/[\\/]/).includes('..')||!fs.existsSync(path.join(root,file))||!fs.statSync(path.join(root,file)).isFile()) errors.push('Stage evidence missing/invalid: '+name);
  for (const file of ['AGENTS.md','TWIN_START.md','V2_START.md','.twin/START.md']) {
    const text=fs.readFileSync(path.join(root,file),'utf8');
    if (!text.includes('.twin/state.json')) errors.push(file+': missing registry link');
    if (/Рабочая ветка V2:|действующая ветка исходников —|Текущий контракт полной страницы:/.test(text)) errors.push(file+': stale copied pointer');
  }
  for (const skill of readJSON(root, '.twin/tasks/WF-001/SKILL_BUNDLE.json').skills)
    for (const file of skill.files)
      if (!fs.existsSync(path.join(root,file.path)) || fileHash(root,file.path)!==file.sha256) errors.push('Skill bundle drift: '+file.path);
  for (const file of readJSON(root,'.twin/skill-manifest.json').files)
    if (!fs.existsSync(path.join(root,file.path)) || fileHash(root,file.path)!==file.sha256) errors.push('Skill manifest drift: '+file.path);
  return errors;
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const root=path.resolve(import.meta.dirname,'..');
    const actual=execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim();
    // PR jobs intentionally use detached HEAD; the branch is checked at interactive intake.
    const errors=checkWorkflow(root,{branch:actual || undefined});
    if(errors.length) throw Error(errors.join('\n'));
    console.log('Workflow pointers/contracts/skill hashes PASS; site visual acceptance and deployment NOT RUN');
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
