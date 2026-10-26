#!/usr/bin/env python3
"""Structural check only, not aesthetic or browser validation."""
from pathlib import Path
import re,json,sys
root=Path(__file__).resolve().parent.parent
missing=[]
for p in [root/'SKILL.md',*root.joinpath('references').glob('*.md')]:
    for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
        if not link.startswith(('https:','http:','#')) and not (p.parent/link.split('#')[0]).is_file():missing.append(str(p.parent/link))
names=['ui-ux-pro-max','code-motion','web-concept-studio','pinwebconceptsystem','material-3','webapp-testing','design-code','design-review','design-qa']
found={}
for p in root.parent.glob('*/SKILL.md'):
    m=re.search(r'^name:\s*([^\n]+)',p.read_text(),re.M)
    if m and m[1].strip() in names:found[m[1].strip()]=str(p.parent)
print(json.dumps({'local_links_missing':missing,'skill_roots':found,'not_found_in_this_filesystem':[n for n in names if n not in found],'scope':'structural only'},ensure_ascii=False,indent=2))
sys.exit(bool(missing))
