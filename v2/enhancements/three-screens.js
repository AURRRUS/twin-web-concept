/** Film scroll director. Journey remains owned by its original React controller.
 * Scroll changes composition, never video time or wheel-event count.
 */
const film = document.querySelector('.r4-film');
if (film) {
  const video = film.querySelector('video');
  const frame = film.querySelector('.r4-film-frame');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  video.poster = new URL('./film-poster.jpg', import.meta.url).href;
  const play = document.createElement('button');
  play.className = 'r4-film-play';
  play.type = 'button';
  play.setAttribute('aria-label', 'Смотреть видео Twin by TALENT');
  play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2 22 12 5 22Z"/></svg>';
  frame.append(play);
  const caption = document.createElement('div');
  caption.className = 'r4-film-caption';
  caption.innerHTML = '<span>Цифровая инфраструктура продаж</span><span>Twin by TALENT</span>';
  film.querySelector('.r4-film-inner').append(caption);
  let raf = 0, enabled = false, start = 0, distance = 1;
  const paint = () => {
    raf = 0;
    if (document.hidden) return;
    const p = enabled ? Math.max(0, Math.min(1, (scrollY - start) / distance)) : 1;
    // Settle into a full rectangle before native controls become the focus.
    const t = Math.min(1, p / .68);
    const eased = t * t * (3 - 2 * t);
    film.style.setProperty('--film-reveal', String(eased));
    film.dataset.progress = p.toFixed(4);
  };
  const requestPaint = () => { if (!raf) raf = requestAnimationFrame(paint); };
  const layout = () => {
    enabled = innerWidth >= 1100 && innerHeight >= 650 && !reduced.matches;
    film.dataset.scrollScene = String(enabled);
    start = film.getBoundingClientRect().top + scrollY;
    distance = innerHeight * .65;
    requestPaint();
  };
  play.addEventListener('click', async () => {
    // Reveal controls fully before play; no autoplay or sound surprises.
    film.style.setProperty('--film-reveal', '1');
    try { await video.play(); } catch { video.controls = true; }
  });
  video.addEventListener('play', () => { play.hidden = true; frame.style.clipPath = 'none'; frame.style.transform = 'none'; });
  video.addEventListener('pause', () => { if (!video.ended) play.hidden = false; });
  video.addEventListener('ended', () => { play.hidden = false; });
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting && !video.paused) video.pause();
  }, { threshold: 0 });
  observer.observe(film);
  window.addEventListener('scroll', requestPaint, {passive:true});
  window.addEventListener('resize', layout);
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else requestPaint(); });
  reduced.addEventListener('change', layout);
  document.fonts.ready.then(layout);
  layout();
}
