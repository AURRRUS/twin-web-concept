/* Twin by TALENT — mobile experience pass 01
   Menu, scroll-led image focus and in-page image viewer.
   Scoped to the motion-preview page; no external dependencies. */
(() => {
  if (window.__twinMobileExperienceV5) return;
  window.__twinMobileExperienceV5 = true;

  // Full-size image viewer: modal, close button, backdrop, Escape and vertical swipe.
  const viewer = document.getElementById("r4-image-viewer");
  if (viewer) {
    const viewerImage = viewer.querySelector(".r4-image-viewer__image");
    const closeButton = viewer.querySelector(".r4-image-viewer__close");
    let lastTrigger = null;
    let touchStart = null;
    let pageLock=null;
    const lockPage=()=>{if(pageLock)return;const s=document.body.style;pageLock={y:scrollY,overflow:s.overflow,position:s.position,top:s.top,width:s.width};s.overflow='hidden';s.position='fixed';s.top=-pageLock.y+'px';s.width='100%';};
    const unlockPage=()=>{if(!pageLock)return;const p=pageLock;pageLock=null;Object.assign(document.body.style,{overflow:p.overflow,position:p.position,top:p.top,width:p.width});scrollTo({top:p.y,left:0,behavior:'instant'});};

    const restoreFocus = () => {
      unlockPage();
      const trigger = lastTrigger;
      lastTrigger = null;
      if (trigger?.isConnected) {
        try { trigger.focus({ preventScroll: true }); }
        catch { trigger.focus(); }
      }
    };

    const closeViewer = () => {
      if (typeof viewer.close === "function" && viewer.open) {
        viewer.close();
      } else {
        viewer.removeAttribute("open");
        viewer.classList.remove("is-fallback-open");
        restoreFocus();
      }
    };

    const openViewer = (trigger) => {
      const figure = trigger.closest(".r4-journey-mobile-media");
      const source = figure?.querySelector(".r4-journey-mobile-image");
      if (!source || !viewerImage) return;

      if(viewer.open)return;
      lastTrigger = trigger;
      lockPage();
      viewerImage.src = source.currentSrc || source.src;
      viewerImage.alt = source.alt || "Изображение Twin";
      if (typeof viewer.showModal === "function") {
        viewer.showModal();
      } else {
        viewer.setAttribute("open", "");
        viewer.classList.add("is-fallback-open");
      }
      try { closeButton?.focus({ preventScroll: true }); }
      catch { closeButton?.focus(); }
    };

    document.addEventListener("click", (event) => {
      const target = event.target;
      const trigger = target instanceof Element ? target.closest("[data-image-viewer-open]") : null;
      if (!trigger) return;
      event.preventDefault();
      openViewer(trigger);
    }, true);

    closeButton?.addEventListener("click", closeViewer);
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer || event.target.classList?.contains("r4-image-viewer__panel")) closeViewer();
    });
    viewer.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeViewer();
    });
    viewer.addEventListener("close", () => {
      viewerImage?.removeAttribute("src");
      if (viewerImage) viewerImage.alt = "";
      restoreFocus();
    });


    // Local image zoom: the page stays fixed; multi-touch never dismisses.
    let scale=1,x=0,y=0,gesture=null,ignoreClick=false;
    const panel=viewer.querySelector('.r4-image-viewer__panel');
    const hint=viewer.querySelector('.r4-image-viewer__hint');
    const clampZoom=(v,a,b)=>Math.max(a,Math.min(b,v));
    const paintZoom=()=>{
      const bx=Math.max(0,(viewerImage.offsetWidth*scale-panel.clientWidth)/2+16);
      const by=Math.max(0,(viewerImage.offsetHeight*scale-panel.clientHeight)/2+72);
      x=clampZoom(x,-bx,bx);y=clampZoom(y,-by,by);
      viewerImage.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
      viewer.dataset.zoomed=String(scale>1.01);
      if(hint)hint.textContent=scale>1.01?'Перемещайте изображение · Двойное нажатие — сброс':'Разведите пальцы для увеличения · Смахните, чтобы закрыть';
    };
    const resetZoom=()=>{scale=1;x=y=0;gesture=null;paintZoom();};
    viewerImage.addEventListener('load',resetZoom);
    viewer.addEventListener('close',resetZoom);
    viewerImage.addEventListener('dblclick',event=>{event.preventDefault();if(scale>1.01)resetZoom();else{scale=2;paintZoom();}});
    const point=t=>({x:t.clientX,y:t.clientY});
    const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    const midpoint=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
    viewer.addEventListener('touchstart',event=>{
      if(event.target.closest?.('button'))return;
      ignoreClick=false;
      if(event.touches.length===2){
        const a=event.touches[0],b=event.touches[1],m=midpoint(a,b),r=panel.getBoundingClientRect();
        gesture={mode:'pinch',distance:distance(a,b),scale,x,y,m,cx:r.left+r.width/2,cy:r.top+r.height/2};
        ignoreClick=true;
      }else if(event.touches.length===1){gesture={mode:scale>1.01?'pan':'swipe',start:point(event.touches[0]),x,y};}
    },{passive:true});
    viewer.addEventListener('touchmove',event=>{
      if(!gesture)return;
      if(event.cancelable)event.preventDefault();
      if(gesture.mode==='pinch'&&event.touches.length===2){
        const m=midpoint(event.touches[0],event.touches[1]);
        scale=clampZoom(gesture.scale*distance(event.touches[0],event.touches[1])/Math.max(1,gesture.distance),1,4);
        const ratio=scale/gesture.scale;
        x=m.x-gesture.cx-(gesture.m.x-gesture.cx-gesture.x)*ratio;
        y=m.y-gesture.cy-(gesture.m.y-gesture.cy-gesture.y)*ratio;
        paintZoom();ignoreClick=true;
      }else if(gesture.mode==='pan'&&event.touches.length===1){
        x=gesture.x+event.touches[0].clientX-gesture.start.x;
        y=gesture.y+event.touches[0].clientY-gesture.start.y;paintZoom();ignoreClick=true;
      }
    },{passive:false});
    viewer.addEventListener('touchend',event=>{
      if(!gesture)return;
      const g=gesture;
      if(g.mode==='swipe'&&event.touches.length===0&&event.changedTouches.length){
        const dx=event.changedTouches[0].clientX-g.start.x,dy=event.changedTouches[0].clientY-g.start.y;
        if(Math.abs(dy)>=76&&Math.abs(dy)>Math.abs(dx)*1.15){ignoreClick=true;closeViewer();}
      }
      if(event.touches.length===1&&g.mode!=='swipe')gesture={mode:'pan',start:point(event.touches[0]),x,y};
      else gesture=null;
      if(scale<1.02)resetZoom();
    },{passive:true});
    viewer.addEventListener('touchcancel',()=>{gesture=null;ignoreClick=true;},{passive:true});
    viewer.addEventListener('click',event=>{
      if(!event.target.closest?.('button')&&(ignoreClick||scale>1.01)){event.stopImmediatePropagation();ignoreClick=false;}
    },true);
    viewer.addEventListener('wheel',event=>{
      if(event.ctrlKey){event.preventDefault();scale=clampZoom(scale*Math.exp(-event.deltaY*.01),1,4);paintZoom();}
      else if(scale>1.01){event.preventDefault();x-=event.deltaX;y-=event.deltaY;paintZoom();}
      else if(Math.abs(event.deltaY)>=44){event.preventDefault();closeViewer();}
    },{passive:false});

  }

  // Mobile journey: scroll selects the scene crossing the viewport center.
  // All four details stay open on phones; desktop keeps the original pinned sequence.
  const journey = document.querySelector(".r4-journey");
  if (journey) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const mobileStory = window.matchMedia("(max-width: 767px)");
    let frame = 0;

    const getFigures = () => Array.from(journey.querySelectorAll(".r4-journey-mobile-media"));
    const syncMobileJourney = () => {
      const mobile = mobileStory.matches;
      journey.querySelectorAll(".r4-journey-options article").forEach((article) => {
        const detail = article.querySelector(".r4-journey-detail");
        const button = article.querySelector(":scope > button");
        const active = article.dataset.active === "true";
        const shouldBeHidden = !(mobile || active);
        if (detail) {
          if (shouldBeHidden && !detail.hasAttribute("hidden")) {
            detail.setAttribute("hidden", "");
          } else if (!shouldBeHidden && detail.hasAttribute("hidden")) {
            detail.removeAttribute("hidden");
          }
        }
        const expanded = String(mobile || active);
        if (button && button.getAttribute("aria-expanded") !== expanded) {
          button.setAttribute("aria-expanded", expanded);
        }
      });
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const updateImages = () => {
      frame = 0;
      syncMobileJourney();
      const figures = getFigures();
      if (!mobileViewport.matches || reducedMotion.matches) {
        figures.forEach((figure) => {
          figure.style.setProperty("--journey-scroll-scale", "1");
          delete figure.dataset.scrollPhase;
        });
        return;
      }

      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      figures.forEach((figure) => {
        const image = figure.querySelector(".r4-journey-mobile-image");
        if (!image || !figure.getClientRects().length) {
          delete figure.dataset.scrollPhase;
          return;
        }

        const rect = figure.getBoundingClientRect();
        const start = viewportHeight * 0.9;
        const finish = -rect.height * 0.16;
        const progress = clamp((start - rect.top) / (start - finish), 0, 1);
        const focus = Math.sin(Math.PI * progress);
        const scale = 1 + focus * 0.055;

        figure.style.setProperty("--journey-scroll-scale", scale.toFixed(3));
        figure.dataset.scrollPhase = progress < 0.12
          ? "approach"
          : progress > 0.88 ? "recede" : "focus";
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateImages);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener?.("change", scheduleUpdate);
    mobileViewport.addEventListener?.("change", scheduleUpdate);
    mobileStory.addEventListener?.("change", scheduleUpdate);

    const observer = "MutationObserver" in window
      ? new MutationObserver(() => {
          scheduleUpdate();
        })
      : null;
    observer?.observe(journey, {
      subtree: true,
      childList: true,
      attributes: true,
      // Observe React's active-state changes only. syncMobileJourney writes
      // hidden and aria-expanded; observing those writes would create a loop.
      attributeFilter: ["data-active"]
    });
    journey.addEventListener("load", scheduleUpdate, true);
    syncMobileJourney();
    scheduleUpdate();
  }
})();
