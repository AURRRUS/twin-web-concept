#!/usr/bin/env python3
"""Next production obligation. Structural routing, not aesthetic assessment or agent execution."""
import json,sys
from pathlib import Path
STAGES=[('brief','web-concept-studio'),('spec','frontend-engineer'),('assets','image-production'),('static','frontend-engineer'),('responsive','frontend-engineer'),('motion','code-motion + frontend-engineer'),('review','design-review'),('release','twin-site')]
def next_action(run,root):
    def result(stage,owner,reason):return dict(stage=stage,owner=owner,reason=reason)
    def file(p):
        if not isinstance(p,str) or not p:return False
        q=(root/p).resolve()
        return q.is_relative_to(root.resolve()) and q.is_file()
    if not isinstance(run,dict):return result('setup','twin-site','run must be an object')
    if run.get('mode') not in ('prepare','execute','review'):return result('setup','twin-site','explicit mode required')
    stages=run.get('stages',{})
    if not isinstance(stages,dict):return result('setup','twin-site','stages object required')
    for stage,owner in STAGES:
        s=stages.get(stage,{})
        if not isinstance(s,dict):return result(stage,owner,'stage object required')
        if stage=='assets':
            if run.get('assetInventoryComplete') is not True:return result('spec','frontend-engineer','asset inventory incomplete, including explicit zero-generation decision')
            jobs=run.get('assetJobs',[])
            if not isinstance(jobs,list):return result(stage,owner,'assetJobs list required')
            for j in jobs:
                if not isinstance(j,dict):return result(stage,owner,'malformed asset job')
                if j.get('status')!='accepted':return result(stage,j.get('producerSkill','image-production'),'asset '+str(j.get('id'))+' needs production or requester acceptance')
                if not j.get('acceptedBy') or not j.get('observed') or not j.get('outputs') or not all(file(p) for p in j['outputs']):return result(stage,'frontend-engineer','asset output/acceptance evidence missing')
        if s.get('status')!='done' or not isinstance(s.get('evidence'),list) or not s['evidence'] or not all(file(p) for p in s['evidence']):return result(stage,owner,'stage incomplete or evidence unavailable')
        if stage=='review':
            r=run.get('review',{})
            if not isinstance(r,dict):return result(stage,owner,'review object required')
            if r.get('verdict')!='ready-for-owner-review' or r.get('unresolved')!=[]:return result(stage,owner,'visual differences remain or no visual verdict')
            if not r.get('runtimeCommit') or r.get('runtimeCommit')!=run.get('runtimeCommit'):return result(stage,owner,'review runtime stale')
            if not file(r.get('reference')):return result(stage,owner,'chosen reference missing')
            if run.get('independentReviewRequired') and (r.get('independent') is not True or r.get('reviewer')==run.get('implementer') or not r.get('reviewer')):return result(stage,owner,'independent review not established')
        if stage=='release':
            p=run.get('publication',{})
            if not isinstance(p,dict) or p.get('allowed') is not True:return result(stage,'twin-site','publication not authorized')
    return result('complete','twin-site','Recorded obligations complete; inspect provenance and actual result, no automated aesthetic guarantee')
if __name__=='__main__':
    try:
        p=Path(sys.argv[1]);root=Path(sys.argv[2] if len(sys.argv)>2 else '.').resolve()
        print(json.dumps(next_action(json.loads(p.read_text()),root),ensure_ascii=False,indent=2))
    except (IndexError,ValueError,OSError) as e:
        print('Usage: production_next.py run.json [project-root]; '+str(e),file=sys.stderr);sys.exit(1)
