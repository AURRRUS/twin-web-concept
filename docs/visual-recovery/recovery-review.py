import asyncio,pathlib,json
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).resolve().parents[2] / 'artifacts/visual-recovery/after'
async def main():
 results=[]
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await b.new_page(viewport={'width':1440,'height':900})
  await page.goto('http://127.0.0.1:4324/',wait_until='networkidle');await page.evaluate('document.fonts.ready')
  await page.evaluate("async()=>{const xs=[...document.querySelectorAll('.journey img')];xs.forEach(x=>x.loading='eager');await Promise.all(xs.map(x=>x.decode().catch(()=>{})))}")
  await page.locator('.hero').screenshot(path=str(OUT/'1440-hero.png'))
  for width,height in [(1440,900),(1366,768),(1280,800),(1920,1080),(390,844),(768,1024)]:
   await page.set_viewport_size({'width':width,'height':height});await page.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
   enhanced=await page.locator('.journey').get_attribute('data-enhanced')
   assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
   if enhanced=='true':
    for name,progress in [('project',.09),('text',.25),('wipe',.29),('space',.5),('lot',.91)]:
     await page.evaluate("p=>{const n=document.querySelector('.journey');window.scrollTo({top:n.getBoundingClientRect().top+scrollY+(n.offsetHeight-innerHeight)*p,behavior:'instant'})}",progress)
     await page.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
     await page.locator('.journey-cinematic').screenshot(path=str(OUT/f'{width}-{name}.png'))
   else:
    await page.locator('.journey-static').screenshot(path=str(OUT/f'{width}-static.png'))
   results.append({'width':width,'height':height,'enhanced':enhanced,'frame':await page.locator('.scene-materials').bounding_box() if enhanced=='true' else None})
  await b.close()
 (OUT/'layout.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
asyncio.run(main())
