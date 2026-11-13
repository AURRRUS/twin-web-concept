(()=>{if(window.__twinMobileMenuReady)return;window.__twinMobileMenuReady=true;
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

})();