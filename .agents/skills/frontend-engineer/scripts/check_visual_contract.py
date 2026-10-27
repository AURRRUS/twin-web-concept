#!/usr/bin/env python3
"""Validate a visual task contract. This is NOT an aesthetic quality gate."""
import argparse, json, math
from pathlib import Path

def validate(c, root):
    errors=[]
    def fail(message): errors.append(message)
    def text(v): return isinstance(v,str) and bool(v.strip()) and not any(x in v.lower() for x in ('todo','tbd','заполнить'))
    def num(v): return isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v)
    def existing(v):
        if not text(v): return False
        p=(root/v).resolve()
        return p.is_relative_to(root.resolve()) and p.is_file()
    if not isinstance(c,dict): return ['contract must be an object']
    if c.get('mode') not in ('redesign','reproduce'): fail('mode: redesign/reproduce required')
    for k in ('baseline','route'):
        if not text(c.get(k)): fail(k+': required')
    ref=c.get('reference',{})
    if not isinstance(ref,dict): ref={}
    if not existing(ref.get('path')): fail('reference.path: existing project file required')
    vp=ref.get('viewport')
    if not isinstance(vp,list) or len(vp)!=2 or not all(num(x) and x>0 for x in vp): fail('reference.viewport: positive width/height required')
    for group in ('changes','anchors','typeRoles','layers'):
        rows=c.get(group)
        if not isinstance(rows,list) or not rows: fail(group+': nonempty list required'); continue
        for i,row in enumerate(rows):
            key=group+'['+str(i)+']'
            if not isinstance(row,dict): fail(key+': object required'); continue
            name='role' if group=='typeRoles' else 'element'
            if not text(row.get(name)): fail(key+': '+name+' required')
            if group=='changes':
                for k in ('before','after','implementation'):
                    if not text(row.get(k)): fail(key+': '+k+' required')
                if row.get('before')==row.get('after'): fail(key+': no visual change described')
            elif group=='anchors':
                box=row.get('box')
                if not isinstance(box,list) or len(box)!=4 or not all(num(x) for x in box) or box[2]<=0 or box[3]<=0: fail(key+': numeric bbox with positive dimensions required')
                if not num(row.get('tolerancePx')) or row['tolerancePx']<0: fail(key+': nonnegative tolerance required')
                if row.get('source') not in ('owner','measured-estimate','proposed'): fail(key+': source classification required')
            elif group=='typeRoles':
                if not existing(row.get('file')): fail(key+': real font file required')
                for k in ('weight','size','lineHeight','tracking','maxWidth'):
                    if not num(row.get(k)): fail(key+': numeric '+k+' required')
                for k in ('weight','size','lineHeight','maxWidth'):
                    if num(row.get(k)) and row[k]<=0: fail(key+': positive '+k+' required')
                if num(row.get('weight')) and row['weight']>1000: fail(key+': weight exceeds CSS range')
            else:
                if row.get('medium') not in ('dom','css','svg','raster','viewer'): fail(key+': medium required')
                if row.get('medium')=='raster':
                    if not existing(row.get('asset')): fail(key+': raster asset missing')
                    if row.get('fit') not in ('contain','cover'): fail(key+': fit required')
    responsive=c.get('responsive',{})
    if not isinstance(responsive,dict): responsive={}
    for k in ('mobile','lowHeight'):
        if not text(responsive.get(k)): fail('responsive.'+k+': required')
    motion=c.get('motion',{})
    if not isinstance(motion,dict): motion={}
    if not isinstance(motion.get('changed'),bool): fail('motion.changed: boolean required')
    elif motion['changed']:
        m=motion.get('contract',{})
        if not isinstance(m,dict): m={}
        for k in ('progress','reverse','reducedMotion','exit'):
            if not text(m.get(k)): fail('motion.contract.'+k+': required')
        if not isinstance(m.get('phases'),list) or not m['phases']: fail('motion.contract.phases: required')
    elif not text(motion.get('preserve')): fail('motion.preserve: required')
    a=c.get('acceptance')
    if not isinstance(a,list) or not a or not all(text(x) for x in a): fail('acceptance: criteria required')
    pub=c.get('publication',{})
    if not isinstance(pub,dict): pub={}
    if not isinstance(pub.get('allowed'),bool) or not text(pub.get('reason')): fail('publication: explicit authorization required')
    return errors

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('contract'); p.add_argument('--root',default='.')
    a=p.parse_args()
    try: errors=validate(json.loads(Path(a.contract).read_text()),Path(a.root).resolve())
    except (ValueError,OSError) as e: errors=[str(e)]
    if errors:
        print('\n'.join(errors)); raise SystemExit(1)
    print('Contract structure/files OK; visual correspondence NOT CHECKED')
