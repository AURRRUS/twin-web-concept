import asyncio,pathlib,json,statistics
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).resolve().parents[2] / 'artifacts/visual-recovery'
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  context=await browser.new_context(viewport={'width':1440,'height':900},record_video_dir=str(OUT/'recording'),record_video_size={'width':1440,'height':900})
  page=await context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  await page.goto('http://127.0.0.1:4324/',wait_until='networkidle');await page.evaluate('document.fonts.ready')
  await page.evaluate("async()=>{const xs=[...document.querySelectorAll('.journey img')];xs.forEach(x=>x.loading='eager');await Promise.all(xs.map(x=>x.decode().catch(()=>{})))}")
  async def passage(start,end,duration):
   return await page.evaluate('''async ([a,b,duration])=>{
    const n=document.querySelector('.journey'),top=n.getBoundingClientRect().top+scrollY,travel=n.offsetHeight-innerHeight,times=[];
    await new Promise(resolve=>{let first,previous;const tick=t=>{first??=t;if(previous!==undefined)times.push(t-previous);previous=t;const p=Math.min(1,(t-first)/duration);window.scrollTo({top:top+travel*(a+(b-a)*p),behavior:'instant'});if(p<1)requestAnimationFrame(tick);else resolve()};requestAnimationFrame(tick)});return times;
   }''',[start,end,duration])
  forward=await passage(.09,.91,6500);await page.wait_for_timeout(350)
  backward=await passage(.91,.09,6500);await page.wait_for_timeout(350)
  await passage(.09,.91,1);await page.wait_for_timeout(500);await passage(.91,.09,1)
  await page.locator('.journey-cinematic .scene-expand').click();await page.get_by_role('dialog').wait_for();await page.keyboard.press('Escape')
  await context.close();video=await page.video.path();target=OUT/'scroll-forward-back.webm';pathlib.Path(video).replace(target)
  await browser.close()
 values=forward+backward
 report={'viewport':'1440x900','browser':'Chromium /usr/bin/chromium, headless in managed environment, recording enabled','forwardFrames':len(forward),'backwardFrames':len(backward),'medianFrameIntervalMs':round(statistics.median(values),2),'p95FrameIntervalMs':round(sorted(values)[int(len(values)*.95)],2),'intervalsOver33ms':sum(v>33.4 for v in values),'pageErrors':errors,'note':'rAF cadence of this recorded run; not a cross-device FPS or INP guarantee'}
 (OUT/'motion-profile.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));assert not errors
asyncio.run(main())
