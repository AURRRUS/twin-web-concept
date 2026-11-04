#!/usr/bin/env python3
"""Route recorded obligations within an explicit scope; no agent launch or aesthetic guarantee."""
import json
import sys
from pathlib import Path

STAGES = [('brief','web-production'), ('spec','frontend-engineer'),
          ('sample','frontend-engineer + image-production'), ('assets','image-production'), ('static','frontend-engineer'),
          ('responsive','frontend-engineer'), ('motion','code-motion + frontend-engineer'),
          ('review','design-review'), ('release','web-production')]
NAMES = [s for s, _ in STAGES]
VERDICTS = {'recapture','rebuild','fix','ready-for-owner-review'}


def next_action(run, root):
    root = Path(root).resolve()
    def result(stage, owner, reason):
        return dict(stage=stage, owner=owner, reason=reason)
    def setup(reason): return result('setup','web-production',reason)
    def text(value): return isinstance(value,str) and bool(value.strip())
    def file(value):
        if not text(value): return False
        path = (root/value).resolve()
        return path.is_relative_to(root) and path.is_file()
    def evidence(value):
        return isinstance(value,list) and bool(value) and all(file(p) for p in value)
    def obj(value): return value if isinstance(value,dict) else {}

    if not isinstance(run,dict): return setup('run must be an object')
    if run.get('schemaVersion') != 2: return setup('Migrate explicitly to run schemaVersion 2; do not invent completed stages')
    mode, target = run.get('mode'), run.get('targetStage')
    if mode not in ('prepare','execute','review'): return setup('explicit mode required')
    if target not in NAMES: return setup('explicit targetStage required')
    if mode=='prepare' and target not in ('brief','spec'): return setup('prepare ends at brief/spec; asset production requires execute scope')
    if mode=='review' and target!='review': return setup('review mode ends at review')
    if not evidence(run.get('taskEvidence')): return setup('task scope evidence missing')
    stages = run.get('stages')
    if not isinstance(stages,dict): return setup('stages object required')
    selected = [('review','design-review')] if mode=='review' else STAGES[:NAMES.index(target)+1]
    checkpoints = run.get('ownerCheckpoints',[])
    if not isinstance(checkpoints,list): return setup('ownerCheckpoints must be a list')
    for checkpoint in checkpoints:
        if not isinstance(checkpoint,dict) or checkpoint.get('beforeStage') not in NAMES:
            return setup('malformed owner checkpoint')
    agents = run.get('agents',[])
    if not isinstance(agents,list) or any(not isinstance(a,dict) for a in agents): return setup('agents must be a list of execution records')
    agent_ids = [a.get('id') for a in agents]
    if any(not text(i) for i in agent_ids) or len(set(agent_ids)) != len(agent_ids): return setup('agent execution IDs must be nonempty and unique')
    def agent_exists(agent_id):
        return any(a.get('id')==agent_id and a.get('status')=='completed' and evidence(a.get('evidence')) for a in agents)
    publication = obj(run.get('publication'))
    review = obj(run.get('review'))
    def fresh(record):
        return all(text(run.get(k)) and record.get(k)==run[k] for k in ('runtimeFingerprint','contractFingerprint'))
    def preview_exception():
        defects = review.get('unresolved')
        allowed = publication.get('acceptedDefects')
        return (target=='release' and publication.get('kind')=='preview'
                and publication.get('allowed') is True and evidence(publication.get('evidence'))
                and fresh(publication) and publication.get('allowKnownDefects') is True
                and isinstance(defects,list) and bool(defects) and all(text(d) for d in defects)
                and isinstance(allowed,list) and all(text(d) for d in allowed)
                and set(defects).issubset(set(allowed)) and review.get('verdict') in ('fix','rebuild'))

    for stage, owner in selected:
        for checkpoint in checkpoints:
            if checkpoint['beforeStage'] != stage: continue
            if checkpoint.get('status')=='not-applicable' and text(checkpoint.get('reason')) and evidence(checkpoint.get('evidence')):
                continue
            if (checkpoint.get('status')!='approved' or not evidence(checkpoint.get('evidence'))
                or not text(checkpoint.get('subjectFingerprint'))
                or checkpoint.get('approvedFingerprint')!=checkpoint['subjectFingerprint']):
                return result(stage,'web-production','Owner checkpoint '+str(checkpoint.get('id'))+' is pending or stale; reuse valid existing decisions')
        status = obj(stages.get(stage))
        if stage=='assets':
            if run.get('assetInventoryComplete') is not True: return result('spec','frontend-engineer','asset inventory incomplete, including explicit zero-generation decision')
            jobs = run.get('assetJobs')
            if not isinstance(jobs,list): return result(stage,owner,'assetJobs list required')
            for job in jobs:
                if not isinstance(job,dict): return result(stage,owner,'malformed asset job')
                if job.get('required') is False and job.get('status')=='skipped' and text(job.get('reason')) and evidence(job.get('evidence')):
                    continue
                if job.get('status')!='accepted': return result(stage,job.get('producerSkill','image-production'),'asset '+str(job.get('id'))+' requires production or scene acceptance')
                if not text(job.get('acceptedBy')) or not text(job.get('observed')) or not evidence(job.get('outputs')):
                    return result(stage,'frontend-engineer','asset output/scene acceptance missing')
        if status.get('status')=='not-applicable':
            if stage not in ('sample','assets','responsive','motion') or not text(status.get('reason')) or not evidence(status.get('evidence')):
                return result(stage,owner,'invalid not-applicable stage; retain scope evidence')
            continue
        if stage=='review':
            if not text(review.get('verdict')) or review['verdict'] not in VERDICTS or not isinstance(review.get('unresolved'),list) or not all(text(d) for d in review.get('unresolved',[])):
                return result(stage,owner,'review verdict and defect IDs required')
            if not fresh(review): return result(stage,owner,'review runtime or contract fingerprint stale/missing')
            if not file(review.get('reference')) or not evidence(review.get('evidence')):
                return result(stage,owner,'reference or observed review evidence missing')
            if run.get('independentReviewRequired',True):
                implementer, reviewer = run.get('implementer'), review.get('reviewer')
                if (review.get('independent') is not True or not text(implementer) or reviewer==implementer
                    or not agent_exists(implementer) or not agent_exists(reviewer)):
                    return result(stage,owner,'independent execution records missing; names/boolean alone are insufficient')
            elif not file(run.get('independentReviewException')):
                return result(stage,owner,'independent-review exception needs an explicit recorded decision')
            ready = review['verdict']=='ready-for-owner-review' and review['unresolved']==[]
            if review['verdict']=='ready-for-owner-review' and not ready:
                return result(stage,owner,'ready verdict contradicts unresolved defects')
            if not ready and mode!='review' and not preview_exception():
                return result(stage,owner,'visual findings remain; fix/recapture within authorized scope, do not rewrite verdict')
        if stage=='release':
            if publication.get('allowed') is not True or publication.get('kind') not in ('preview','final') or not evidence(publication.get('evidence')):
                return result(stage,'web-production','publication needs scoped authorization')
            if not fresh(publication): return result(stage,'web-production','publication subject changed; reconcile scope with existing authorization')
            if publication['kind']=='final':
                approval = obj(run.get('ownerAcceptance'))
                if approval.get('status')!='approved' or not fresh(approval) or not evidence(approval.get('evidence')):
                    return result(stage,'web-production','final owner acceptance missing/stale; preview is a different target')
        if status.get('status')!='done' or not evidence(status.get('evidence')):
            return result(stage,owner,'stage incomplete or evidence unavailable')
    return result('complete','web-production','Recorded '+mode+' scope through '+target+' complete; not an automated aesthetic, provenance, or deployment guarantee')


if __name__=='__main__':
    try:
        path=Path(sys.argv[1]); root=Path(sys.argv[2] if len(sys.argv)>2 else '.')
        print(json.dumps(next_action(json.loads(path.read_text()),root),ensure_ascii=False,indent=2))
    except (IndexError,ValueError,OSError) as error:
        print('Usage: production_next.py run.json [project-root]; '+str(error),file=sys.stderr)
        sys.exit(1)
