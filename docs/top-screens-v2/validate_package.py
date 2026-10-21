from pathlib import Path
import hashlib,json,struct
p=Path(__file__).resolve().parent
m=json.loads((p/'manifest.json').read_text(encoding='utf-8'))
for item in m['files']:
 f=p/item['path']; b=f.read_bytes()
 assert len(b)==item['bytes'],item['path']
 assert hashlib.sha256(b).hexdigest()==item['sha256'],item['path']
assert len(m['assets'])==5
assert {x['role'] for x in m['assets']}=={'hero','facade','scene-project','scene-space','scene-lot'}
for a in m['assets']:
 b=(p/a['path']).read_bytes(); assert b[:8]==b'\x89PNG\r\n\x1a\n'
 assert struct.unpack('>II',b[16:24])==(a['width'],a['height'])
print('OK: all registered files, 5 original PNG assets, sizes, SHA256 and dimensions verified.')
