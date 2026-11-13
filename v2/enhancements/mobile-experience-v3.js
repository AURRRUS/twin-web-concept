/* Twin by TALENT — mobile experience pass 01
   Menu, scroll-led image focus and in-page image viewer.
   Scoped to the motion-preview page; no external dependencies. */
(() => {
  if (window.__twinMobileExperienceV3) return;
  window.__twinMobileExperienceV3 = true;

  // Explicit button state: no competing native details toggle on touch browsers.
  const menu=document.querySelector(".r4-menu");
  if(menu){
    const toggle=menu.querySelector(".r4-menu-toggle"),nav=menu.querySelector("nav");
    function setMenu(open,focus=false){menu.dataset.open=String(open);nav.hidden=!open;toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Закрыть меню":"Открыть меню");if(focus)toggle.focus({preventScroll:true});}
    document.addEventListener("click",event=>{const target=event.target instanceof Element?event.target:null;if(!target)return;if(target.closest(".r4-menu-toggle")){event.preventDefault();setMenu(menu.dataset.open!=="true");return;}if(target.closest(".r4-menu nav a")){setMenu(false);return;}if(menu.dataset.open==="true"&&!menu.contains(target))setMenu(false);},true);
    document.addEventListener("keydown",event=>{if(event.key==="Escape"&&menu.dataset.open==="true"){event.preventDefault();setMenu(false,true);}});
    addEventListener("hashchange",()=>setMenu(false));addEventListener("pageshow",()=>setMenu(false));addEventListener("resize",()=>{if(innerWidth>=1100)setMenu(false)});
    setMenu(false);
  }

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

    viewer.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) {
        touchStart = null;
        return;
      }
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });

    viewer.addEventListener("touchend", (event) => {
      if (!touchStart || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dy) >= 76 && Math.abs(dy) > Math.abs(dx) * 1.15) closeViewer();
    }, { passive: true });

    viewer.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
    viewer.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) >= 44) { event.preventDefault(); closeViewer(); }
    }, { passive: false });
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
