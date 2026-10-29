"""Regression tests for scope, freshness, provenance and preview authorization."""
import copy
import tempfile
import unittest
from pathlib import Path
from production_next import next_action, NAMES

class RoutingTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name); (self.root/'evidence.md').write_text('Synthetic test record')
        self.r={'schemaVersion':2,'mode':'execute','targetStage':'release','taskEvidence':['evidence.md'],
                'runtimeCommit':'source-a','runtimeFingerprint':'runtime-a','contractFingerprint':'contract-a',
                'implementer':'worker-run','independentReviewRequired':True,'ownerCheckpoints':[],
                'agents':[{'id':i,'status':'completed','evidence':['evidence.md']} for i in ['worker-run','review-run']],
                'assetInventoryComplete':True,'assetJobs':[],
                'stages':{s:{'status':'done','evidence':['evidence.md']} for s in NAMES},
                'review':{'verdict':'ready-for-owner-review','runtimeFingerprint':'runtime-a','contractFingerprint':'contract-a','reference':'evidence.md','reviewer':'review-run','independent':True,'unresolved':[],'evidence':['evidence.md']},
                'publication':{'kind':'preview','allowed':True,'runtimeFingerprint':'runtime-a','contractFingerprint':'contract-a','evidence':['evidence.md']}}
    def stage(self): return next_action(self.r,self.root)['stage']
    def test_prepare_does_not_require_runtime_or_release(self):
        self.r.update(mode='prepare',targetStage='spec',runtimeFingerprint=None,publication={'allowed':False})
        self.r['stages']={s:self.r['stages'][s] for s in ['brief','spec']}
        self.assertEqual(self.stage(),'complete')
    def test_prepare_cannot_publish(self):
        self.r['mode']='prepare'; self.assertEqual(self.stage(),'setup')
    def test_readonly_review_can_finish_with_defects(self):
        self.r.update(mode='review',targetStage='review')
        self.r['review'].update(verdict='fix',unresolved=['MASK-1'])
        self.assertEqual(self.stage(),'complete')
    def test_stale_runtime_and_contract_block_review(self):
        for key in ['runtimeFingerprint','contractFingerprint']:
            with self.subTest(key=key):
                original=self.r['review'][key]; self.r['review'][key]='stale'
                self.assertEqual(self.stage(),'review'); self.r['review'][key]=original
    def test_document_only_commit_does_not_invalidate_runtime(self):
        self.r['runtimeCommit']='report-only-commit'; self.assertEqual(self.stage(),'complete')
    def test_ready_asset_is_not_scene_acceptance(self):
        self.r['assetJobs']=[{'id':'facade','status':'ready'}]; self.assertEqual(self.stage(),'assets')
    def test_optional_job_can_be_skipped_with_evidence(self):
        self.r['assetJobs']=[{'id':'clean-plate','required':False,'status':'skipped','reason':'no separate movement','evidence':['evidence.md']}]
        self.assertEqual(self.stage(),'complete')
        self.r['assetJobs'][0]['required']=True; self.assertEqual(self.stage(),'assets')
    def test_asset_stage_skip_cannot_hide_required_job(self):
        self.r['assetJobs']=[{'id':'facade','status':'pending'}]
        self.r['stages']['assets']={'status':'not-applicable','reason':'scope','evidence':['evidence.md']}
        self.assertEqual(self.stage(),'assets')
    def test_owner_checkpoint_is_version_bound(self):
        self.r['ownerCheckpoints']=[{'id':'sample','beforeStage':'assets','status':'approved','subjectFingerprint':'new','approvedFingerprint':'old','evidence':['evidence.md']}]
        self.assertEqual(self.stage(),'assets')
        self.r['ownerCheckpoints'][0]['approvedFingerprint']='new'; self.assertEqual(self.stage(),'complete')
    def test_reviewer_name_alone_not_independence(self):
        self.r['agents'].pop(); self.assertEqual(self.stage(),'review')
    def test_self_review_not_independent(self):
        self.r['review']['reviewer']='worker-run'; self.assertEqual(self.stage(),'review')
    def test_known_defect_preview_preserves_negative_verdict(self):
        self.r['review'].update(verdict='fix',unresolved=['MASK-1'])
        self.assertEqual(self.stage(),'review')
        self.r['publication'].update(allowKnownDefects=True,acceptedDefects=['MASK-1'])
        self.assertEqual(self.stage(),'complete')
        self.assertEqual(self.r['review']['verdict'],'fix')
        self.r['review']['unresolved'].append('OTHER-2'); self.assertEqual(self.stage(),'review')
    def test_final_needs_owner_acceptance(self):
        self.r['publication']['kind']='final'; self.assertEqual(self.stage(),'release')
        self.r['ownerAcceptance']={'status':'approved','runtimeFingerprint':'runtime-a','contractFingerprint':'contract-a','evidence':['evidence.md']}
        self.assertEqual(self.stage(),'complete')
    def test_path_escape_and_malformed_json_values(self):
        self.r['taskEvidence']=['../external.md']; self.assertEqual(self.stage(),'setup')
        self.r['taskEvidence']=['evidence.md']; self.r['agents']='reviewer'; self.assertEqual(self.stage(),'setup')
    def test_legacy_requires_explicit_migration(self):
        self.r.pop('schemaVersion'); self.assertEqual(self.stage(),'setup')
    def test_malformed_verdict_returns_obligation_not_exception(self):
        for value in ([],{},None,False):
            with self.subTest(value=value):
                self.r['review']['verdict']=value; self.assertEqual(self.stage(),'review')
    def test_release_cannot_skip_deploy_evidence(self):
        self.r['stages']['release']={'status':'pending','evidence':[]}; self.assertEqual(self.stage(),'release')

if __name__=='__main__': unittest.main()
