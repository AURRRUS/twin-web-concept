/** Twin architectural video scene. One scroll progress owns all scene layers. */
const film = document.querySelector('.r4-film');
if (film) {
  const video = film.querySelector('video');
  const frame = film.querySelector('.r4-film-frame');
  const stage = film.querySelector('.r4-film-inner');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  video.poster = new URL('./film-poster.jpg', import.meta.url).href;
  video.controls = false;
  for (const side of ['left','right']) {
    const wing = document.createElement('img');
    wing.className = `r4-film-wing r4-film-wing-${side}`;
    wing.src = new URL('./architecture-wings.webp', import.meta.url).href;
    wing.alt = ''; wing.setAttribute('aria-hidden','true');
    stage.append(wing);
  }
  const play = document.createElement('button');
  play.className = 'r4-film-play'; play.type = 'button';
  play.setAttribute('aria-label','Смотреть видео Twin by TALENT');
  play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2 22 12 5 22Z"/></svg>';
  frame.append(play);
  let raf=0, enabled=false, start=0, distance=1, viewing=false;
  const paint = () => {
    raf=0; if(document.hidden)return;
    start=film.getBoundingClientRect().top+scrollY;
    const p=enabled?Math.max(0,Math.min(1,(scrollY-start)/distance)):1;
    const t=Math.max(0,Math.min(1,(p-.08)/.64));
    const e=viewing?1:t*t*(3-2*t);
    film.style.setProperty('--film-reveal',String(e));
    film.style.setProperty('--film-title',String(1-Math.min(1,p/.4)));
    film.dataset.progress=p.toFixed(4);
  };
  const requestPaint=()=>{if(!raf)raf=requestAnimationFrame(paint);};
  const layout=()=>{
    enabled=innerWidth>=1100&&innerHeight>=650&&!reduced.matches;
    film.dataset.scrollScene=String(enabled);
    start=film.getBoundingClientRect().top+scrollY;
    distance=innerHeight*1.15;
    requestPaint();
  };
  play.addEventListener('click',async()=>{
    viewing=true;video.controls=true;requestPaint();
    try{await video.play();}catch{play.hidden=false;}
  });
  video.addEventListener('play',()=>{viewing=true;play.hidden=true;video.controls=true;requestPaint();});
  video.addEventListener('pause',()=>{play.hidden=false;});
  video.addEventListener('ended',()=>{play.hidden=false;});
  new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting){video.pause();viewing=false;requestPaint();}
  }).observe(stage);
  window.addEventListener('scroll',requestPaint,{passive:true});
  window.addEventListener('resize',layout);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else requestPaint();});
  reduced.addEventListener('change',layout);
  const opening=document.querySelector(".r4-opening");
  if(opening)new ResizeObserver(layout).observe(opening);
  document.fonts.ready.then(layout);layout();
}
