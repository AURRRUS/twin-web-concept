/* Twin by TALENT — mobile experience pass 01
   Menu, scroll-led image focus and in-page image viewer.
   Scoped to the motion-preview page; no external dependencies. */
(() => {
  if (window.__twinMobileExperienceV1) return;
  window.__twinMobileExperienceV1 = true;

  // Mobile navigation: keep native <details> behavior, close reliably on iOS taps.
  const menu = document.querySelector(".r4-menu");
  if (menu) {
    const summary = menu.querySelector("summary");
    const syncMenuState = () => {
      if (!summary) return;
      summary.setAttribute("aria-expanded", String(menu.open));
      summary.setAttribute("aria-label", menu.open ? "Закрыть меню" : "Открыть меню");
    };
    const closeMenu = () => {
      if (menu.open) menu.open = false;
      syncMenuState();
    };

    menu.addEventListener("toggle", syncMenuState);
    document.addEventListener("click", (event) => {
      const target = event.target;
      const menuLink = target instanceof Element ? target.closest(".r4-menu nav a") : null;
      if (menuLink) {
        closeMenu();
        return;
      }
      if (menu.open && target instanceof Node && !menu.contains(target)) closeMenu();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) {
        closeMenu();
        summary?.focus();
      }
    });
    window.addEventListener("hashchange", closeMenu);
    syncMenuState();
  }

  // Full-size image viewer: modal, close button, backdrop, Escape and vertical swipe.
  const viewer = document.getElementById("r4-image-viewer");
  if (viewer) {
    const viewerImage = viewer.querySelector(".r4-image-viewer__image");
    const closeButton = viewer.querySelector(".r4-image-viewer__close");
    let lastTrigger = null;
    let touchStart = null;

    const restoreFocus = () => {
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

      lastTrigger = trigger;
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
      if (event.target === viewer) closeViewer();
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
      if (Math.abs(event.deltaY) >= 44) closeViewer();
    }, { passive: true });
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
        if (detail) {
          if (mobile || active) detail.removeAttribute("hidden");
          else detail.setAttribute("hidden", "");
        }
        if (button) button.setAttribute("aria-expanded", String(mobile || active));
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
          syncMobileJourney();
          scheduleUpdate();
        })
      : null;
    observer?.observe(journey, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["hidden", "data-active", "aria-expanded"]
    });
    journey.addEventListener("load", scheduleUpdate, true);
    syncMobileJourney();
    scheduleUpdate();
  }
})();
