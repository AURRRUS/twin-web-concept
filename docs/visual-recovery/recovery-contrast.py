import asyncio,json,pathlib
from PIL import Image
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).resolve().parents[2] / 'artifacts/visual-recovery'
def luminance(rgb):
 c=[v/255 for v in rgb[:3]];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c];return sum(a*b for a,b in zip(c,[.2126,.7152,.0722]))
def ratio(a,b):
 a,b=sorted([luminance(a),luminance(b)]);return (b+.05)/(a+.05)
async def main():
 report=[]
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=await b.new_page(viewport={'width':1440,'height':900})
  await page.goto('http://127.0.0.1:4324/',wait_until='networkidle');await page.evaluate('document.fonts.ready')
  for selector,name in [('.hero-copy','hero'),('.channels-heading','channels')]:
   for i in range(1 if name=='hero' else 4):
    await page.goto('http://127.0.0.1:4324/',wait_until='networkidle');await page.evaluate('document.fonts.ready')
    if name=='channels':await page.get_by_role('tab',name=['Сайт','Онлайн-показ','Агент','Офис продаж'][i],exact=True).click()
    await page.locator(selector).evaluate("e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-30,behavior:'instant'})")
    await page.evaluate("async()=>await Promise.all([...document.querySelectorAll('.channel-scene img')].map(x=>{x.loading='eager';return x.decode().catch(()=>{})}))")
    await page.wait_for_timeout(500)
    boxes=await page.locator(selector).evaluate('''root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),boxes=[];let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement,css=getComputedStyle(el);if(!css.color.startsWith('rgb'))continue;const r=document.createRange();r.selectNodeContents(n);for(const x of r.getClientRects())boxes.push({x:x.x,y:x.y,w:x.width,h:x.height,color:css.color,font:parseFloat(css.fontSize),text:n.textContent.trim()});}for(const e of [root,...root.querySelectorAll('*')]){e.dataset.oldStyle=e.getAttribute('style')||'';e.style.setProperty('-webkit-text-fill-color','transparent','important');e.style.setProperty('text-shadow','none','important');}return boxes;}''')
    path=OUT/f'contrast-{name}-{i}.png';await page.screenshot(path=str(path));im=Image.open(path)
    for box in boxes:
     if box['font']<10 or box['y']<0 or box['y']+box['h']>900:continue
     color=tuple(int(float(v)) for v in box['color'].split('(')[1].split(')')[0].split(',')[:3]);scores=[]
     for x in range(max(0,int(box['x'])+1),min(1440,int(box['x']+box['w'])),4):
      for y in range(max(0,int(box['y'])+1),min(900,int(box['y']+box['h'])),4):scores.append(ratio(color,im.getpixel((x,y))))
     if scores:report.append({'scene':name,'state':i,'text':box['text'],'color':box['color'],'rect':[box['x'],box['y'],box['w'],box['h']],'minContrast':round(min(scores),2),'required':3 if box['font']>=24 else 4.5})
    await page.locator(selector).evaluate("root=>{for(const e of [root,...root.querySelectorAll('*')]){e.setAttribute('style',e.dataset.oldStyle);delete e.dataset.oldStyle;}}")
    path.unlink()
  await b.close()
 (OUT/'contrast.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps([r for r in report if r['minContrast']<r['required']],ensure_ascii=False))
asyncio.run(main())
