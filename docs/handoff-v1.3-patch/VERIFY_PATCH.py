from pathlib import Path
import hashlib,json,sys
root=Path(sys.argv[1]).resolve()
expected=json.loads((Path(__file__).parent/'EXPECTED_FILES_v1_3.json').read_text())
errors=[]
for rel,digest in expected.items():
 p=root/rel
 if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest: errors.append(rel)
if (root/'00_STANDARDS/TALENT_WEBSITE_DEVELOPMENT_MASTER_v1_2026-10-18.md').exists(): errors.append('Remove old master v1.0')
print(json.dumps({'status':'FAIL' if errors else 'PASS','checked':len(expected),'errors':errors,'runtimeTests':'NOT_RUN'},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
