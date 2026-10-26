#!/usr/bin/env node
'use strict';
// Capture trusted self-contained HTML. No realtime recorder, no network dependencies.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {pathToFileURL}=require('url');const {spawnSync}=require('child_process');
function options(argv){const a={mode:'preview'};for(let i=0;i<argv.length;i+=2){if(!['--html','--out','--mode'].includes(argv[i])||!argv[i+1])throw Error('Usage: --html FILE --out NEW_DIR --mode preview|video');a[argv[i].slice(2)]=argv[i+1];}if(!a.html||!a.out||!['preview','video'].includes(a.mode))throw Error('Missing/invalid arguments');return a;}
function command(name,args){const r=spawnSync(name,args,{encoding:'utf8',maxBuffer:8*1024*1024});if(r.error||r.status!==0)throw Error(name+': '+(r.error?.message||r.stderr));return r.stdout;}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function playwright(){try{return require('playwright');}catch(e){const root=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;if(!root)throw e;return require(path.join(root,'playwright'));}}
async function main(){
 const a=options(process.argv.slice(2)),html=path.resolve(a.html),out=path.resolve(a.out);
 if(fs.existsSync(out))throw Error('Output directory already exists; use a new directory');
 if(!fs.existsSync(html))throw Error('HTML file not found');
 if(a.mode==='video'){command('ffmpeg',['-version']);command('ffprobe',['-version']);}
 fs.mkdirSync(out,{recursive:true});const report={status:'started',mode:a.mode,html,htmlSha256:hash(fs.readFileSync(html)),blockedRequests:[],pageErrors:[]};
 const reportPath=path.join(out,'report.json');const save=()=>fs.writeFileSync(reportPath,JSON.stringify(report,null,2));save();
 let browser;
 try{
  const launch={headless:true};if(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)launch.executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  browser=await playwright().chromium.launch(launch);report.browser=browser.version();
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1,reducedMotion:'no-preference'});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  await page.route('**/*',route=>{const url=route.request().url();if(/^https?:/.test(url)){report.blockedRequests.push(url);return route.abort();}return route.continue();});
  await page.goto(pathToFileURL(html).href,{waitUntil:'load'});
  await page.waitForFunction(()=>typeof window.render==='function'&&window.CFG&&window.ready,{},{timeout:30000});
  await page.evaluate(()=>window.ready);
  const c=await page.evaluate(()=>window.CFG);const {width,height,fps,duration}=c;report.cfg=c;
  if(![width,height,fps].every(Number.isInteger)||width<=0||height<=0||fps<1||fps>120||!Number.isFinite(duration)||duration<=0||duration>30)throw Error('Invalid CFG dimensions/fps/duration (duration <=30 seconds)');
  if(width%2||height%2)throw Error('Use even dimensions for yuv420p video');
  const n=Math.round(duration*fps);if(Math.abs(n-duration*fps)>1e-6)throw Error('duration * fps must be an integer');
  await page.setViewportSize({width,height});
  const capture=async t=>{await page.evaluate(t=>window.render(t),t);return page.screenshot({type:'png',animations:'disabled',caret:'hide',scale:'css'});};
  const t=Math.min(duration-.5/fps,duration*.37);const first=hash(await capture(t));await capture(duration*.81);const repeat=hash(await capture(t));await capture(0);const backwards=hash(await capture(t));
  report.determinism={t,first,repeat,backwards,pass:first===repeat&&first===backwards};
  if(!report.determinism.pass)throw Error('Repeated/out-of-order render(t) is not deterministic');
  if(report.pageErrors.length||report.blockedRequests.length)throw Error('Page errors or external dependencies detected');
  const times=[0,duration/4,duration/2,duration*3/4,duration-1/fps,...(c.qaTimes||[]),...Object.values(c.scenes||{}).flatMap(s=>[s.start-1/fps,s.start,s.start+1/fps,s.end-1/fps])];
  const qa=[...new Set(times.filter(x=>Number.isFinite(x)&&x>=0&&x<duration).map(x=>Math.round(x*fps)/fps))].sort((x,y)=>x-y);
  fs.mkdirSync(path.join(out,'qa'));report.qa=[];
  for(let i=0;i<qa.length;i++){const b=await capture(qa[i]),file=path.join(out,'qa',`key-${String(i).padStart(2,'0')}.png`);fs.writeFileSync(file,b);report.qa.push({t:qa[i],file});}
  if(a.mode==='video'){
   const frames=path.join(out,'frames');fs.mkdirSync(frames);report.expectedFrames=n;
   const started=Date.now();for(let i=0;i<n;i++){fs.writeFileSync(path.join(frames,`frame-${String(i).padStart(6,'0')}.png`),await capture(i/fps));if(i%60===0){console.log(`frame ${i}/${n}`);report.framesCompleted=i+1;save();}}
   report.framesCompleted=n;report.captureSeconds=(Date.now()-started)/1000;
   if(report.pageErrors.length||report.blockedRequests.length)throw Error('Runtime errors during capture');
   await browser.close();browser=null;
   const video=path.join(out,'motion.mp4');command('ffmpeg',['-v','error','-n','-framerate',String(fps),'-start_number','0','-i',path.join(frames,'frame-%06d.png'),'-frames:v',String(n),'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',video]);
   const probe=JSON.parse(command('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',video]));report.probe=probe;
   const s=probe.streams.find(s=>s.codec_type==='video');const fraction=s.avg_frame_rate.split('/').map(Number);
   if(s.width!==width||s.height!==height||s.codec_name!=='h264'||s.pix_fmt!=='yuv420p'||Number(s.nb_read_frames)!==n||Math.abs(fraction[0]/fraction[1]-fps)>1e-6||Math.abs(Number(s.duration||probe.format.duration)-duration)>1/fps)throw Error('Export verification failed');
   command('ffmpeg',['-v','error','-i',video,'-f','null','-']);report.fullDecode=true;report.video=video;
  }
  report.status='verified';save();console.log(JSON.stringify({status:report.status,mode:a.mode,out,video:report.video,qaFrames:report.qa.length}));
 }catch(e){report.status='failed';report.error=e.message;save();throw e;}finally{if(browser)await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
