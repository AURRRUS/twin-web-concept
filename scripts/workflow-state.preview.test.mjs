import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseRun,visualRequirementsPath,publicationErrors} from './workflow-state.mjs';

test('working preview defers only an explicitly final-only owner checkpoint without accepting it',()=>{
 const run={ownerAcceptance:{status:'pending'},ownerCheckpoints:[
  {id:'final',status:'pending',beforeStage:'release',releaseKinds:['final'],evidence:['decision.md']},
  {id:'general',status:'pending',beforeStage:'release',evidence:['decision.md']},
  {id:'foundation',status:'pending',beforeStage:'spec',releaseKinds:['final'],evidence:['decision.md']}
 ]};
 const task={publication:{allowed:true,kind:'preview'}};
 const view=releaseRun(run,task,'preview');
 assert.equal(view.ownerCheckpoints[0].status,'not-applicable');
 assert.equal(view.ownerCheckpoints[1].status,'pending');
 assert.equal(view.ownerCheckpoints[2].status,'pending');
 assert.equal(view.ownerAcceptance.status,'pending');
 assert.equal(run.ownerCheckpoints[0].status,'pending');
 assert.deepEqual(releaseRun(run,task,'final'),run);
 assert.deepEqual(releaseRun(run,{publication:{allowed:false,kind:'preview'}},'preview'),run);
 const errors=publicationErrors({workflowTask:{mode:'execute',publicationAllowed:true}},
  {mode:'execute',publication:{allowed:true,kind:'final'}},
  {...run,mode:'execute',targetStage:'release'},'final');
 assert(errors.includes('Final owner acceptance missing or stale'));
});

test('visual gate follows the candidate requirements while legacy profiles retain their default',()=>{
 assert.equal(visualRequirementsPath({siteCandidate:{visualRequirementsPath:'.twin/tasks/VIS-007/visual-requirements.json'}}),'.twin/tasks/VIS-007/visual-requirements.json');
 assert.equal(visualRequirementsPath({}),'.twin/v2/visual-requirements.json');
 for(const file of ['/tmp/requirements.json','.twin/../outside.json','public/requirements.json'])
  assert.throws(()=>visualRequirementsPath({siteCandidate:{visualRequirementsPath:file}}),/Invalid candidate/);
});
