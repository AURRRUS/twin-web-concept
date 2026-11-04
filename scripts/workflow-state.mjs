import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const readJSON = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
export const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const fileHash = (root, file) => sha256(fs.readFileSync(path.join(root, file)));
export const readState = root => readJSON(root, '.twin/state.json');
export function visualRequirementsPath(state) {
  const file=state.siteCandidate?.visualRequirementsPath || '.twin/v2/visual-requirements.json';
  if(typeof file!=='string' || path.isAbsolute(file) || file.split(/[\\/]/).includes('..') || !file.startsWith('.twin/'))
    throw Error('Invalid candidate visual requirements path');
  return file;
}
export function candidate(root) {
  const state = readState(root);
  const task = readJSON(root, `${state.siteCandidate.path}/task.json`);
  return {state, task, run: readJSON(root, `${state.siteCandidate.path}/run.json`)};
}
export function publicationErrors(state, task, run, kind, root) {
  const errors = [];
  if (!['preview', 'final'].includes(kind)) errors.push('Explicit preview/final release kind required');
  if (state.workflowTask?.publicationAllowed !== true) errors.push('Active workflow scope does not authorize deployment');
  if (state.workflowTask?.mode !== 'execute' || task.mode !== 'execute' || run.mode !== 'execute' || run.targetStage !== 'release') errors.push('Release requires execute mode and explicit release target');
  if (task.publication?.allowed !== true || task.publication?.kind !== kind) errors.push('Candidate publication kind is not authorized');
  if (kind === 'final') {
    const a = run.ownerAcceptance;
    if (a?.status !== 'approved' || !a.runtimeFingerprint || !a.contractFingerprint ||
        a.runtimeFingerprint !== run.runtimeFingerprint || a.contractFingerprint !== run.contractFingerprint || !Array.isArray(a.evidence) || !a.evidence.length ||
        !root || !a.evidence.every(p=>typeof p==='string' && !path.isAbsolute(p) && !p.split(/[\\/]/).includes('..') && fs.existsSync(path.join(root,p)) && fs.statSync(path.join(root,p)).isFile()))
      errors.push('Final owner acceptance missing or stale');
  }
  return errors;
}

// A release-only view of preview obligations. Never persist this view as owner
// acceptance: final-only checkpoints and any original blocked jobs stay intact.
export function releaseRun(run, task, kind) {
  const view=structuredClone(run), p=task.publication;
  if(kind!=='preview'||p?.allowed!==true||p.kind!=='preview') return view;
  for(const checkpoint of view.ownerCheckpoints || []) {
    if(checkpoint.beforeStage==='release' && checkpoint.status==='pending' &&
       Array.isArray(checkpoint.releaseKinds) && checkpoint.releaseKinds.length===1 && checkpoint.releaseKinds[0]==='final') {
      checkpoint.status='not-applicable';
      checkpoint.reason='Owner acceptance is still pending for final release; this is an explicitly authorized working preview';
    }
  }
  if(p.allowKnownDefects!==true) return view;
  const mappings=Array.isArray(p.assetExceptions)?p.assetExceptions:[];
  const accepted=Array.isArray(p.acceptedDefects)?p.acceptedDefects:[];
  const unresolved=Array.isArray(run.review?.unresolved)?run.review.unresolved:[];
  let exceptions=0;
  for(const job of view.assetJobs || []) {
    const map=mappings.find(m=>m.jobId===job.id);
    if(!map || !accepted.includes(map.defectId) || !unresolved.includes(map.defectId) ||
       !Array.isArray(job.defectIds) || job.defectIds.length!==1 || job.defectIds[0]!==map.defectId || job.status!=='blocked') continue;
    job.required=false;job.status='skipped';
    job.reason='Release-only owner-authorized preview exception: '+map.defectId+'; not asset acceptance';
    job.evidence=[`.twin/tasks/${task.id}/task.json`];exceptions++;
  }
  if(exceptions && view.assetJobs.every(j=>j.status==='accepted'||(j.required===false&&j.status==='skipped'))) {
    view.stages.assets={status:'done',evidence:[`.twin/tasks/${task.id}/task.json`],reason:'Release-only explicit exceptions; production jobs remain open'};
  }
  return view;
}
