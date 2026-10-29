"""Regression checks for executable motion contracts; no visual PASS implied."""
import copy
import tempfile
import unittest
from pathlib import Path
from check_visual_contract import validate

class MotionContractTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root/'ref.jpg').write_bytes(b'reference fixture')
        (self.root/'font.woff2').write_bytes(b'font fixture')
        self.c = {
            'mode':'reproduce','baseline':'candidate','route':'/v2/',
            'reference':{'path':'ref.jpg','viewport':[1440,900]},
            'changes':[{'element':'hero','before':'old','after':'chosen','implementation':'grid'}],
            'anchors':[{'element':'hero','box':[0,0,1440,900],'tolerancePx':2,'source':'owner'}],
            'typeRoles':[{'role':'hero','file':'font.woff2','weight':700,'size':58,'lineHeight':68,'tracking':0,'maxWidth':600}],
            'layers':[{'element':'title','medium':'dom'}],
            'responsive':{'mobile':'stack','lowHeight':'unpin'},
            'motion':{'changed':True,'contract':{
                'driver':'scroll','scrollDistancePx':900,'resizeRule':'recompute useful travel',
                'progress':'native scroll distance','reverse':'reversible','reducedMotion':'static','exit':'native continuation',
                'phases':[{'start':0,'end':0.25,'kind':'enter','state':'hero','purpose':'orient'},
                          {'start':0.25,'end':0.75,'kind':'hold','state':'choice','purpose':'read and choose'},
                          {'start':0.75,'end':1,'kind':'exit','state':'next','purpose':'reach CTA'}]}},
            'acceptance':['Readable choice at hold'],
            'publication':{'allowed':False,'reason':'test fixture'}
        }
    def errors(self): return validate(self.c,self.root)
    def test_complete_numeric_timeline(self): self.assertEqual(self.errors(),[])
    def test_old_prose_phases_rejected(self):
        self.c['motion']['contract']['phases']=['four reading ranges']
        self.assertTrue(any('object with' in e for e in self.errors()))
    def test_overlap_and_gap_rejected(self):
        for start in (0.2,0.3):
            with self.subTest(start=start):
                self.c['motion']['contract']['phases'][1]['start']=start
                self.assertTrue(any('gap or overlap' in e for e in self.errors()))
    def test_partial_timeline_rejected(self):
        self.c['motion']['contract']['phases'][-1]['end']=0.9
        self.assertTrue(any('end at 1' in e for e in self.errors()))
    def test_nan_bool_and_negative_distance_rejected(self):
        for value in (float('nan'),True,-1):
            with self.subTest(value=value):
                self.c['motion']['contract']['scrollDistancePx']=value
                self.assertTrue(any('positive number' in e for e in self.errors()))
    def test_unchanged_motion_remains_supported(self):
        self.c['motion']={'changed':False,'preserve':'existing native scroll'}
        self.assertEqual(self.errors(),[])
    def test_time_driver_has_own_budget(self):
        m=self.c['motion']['contract']; m['driver']='time'; del m['scrollDistancePx']; m['durationMs']=500
        self.assertEqual(self.errors(),[])

if __name__=='__main__': unittest.main()
