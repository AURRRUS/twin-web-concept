# Mobile gestures
Owner instruction: implement pinch zoom in journey viewer and scroll switching in mobile channels.
Backup: rescue/before-mobile-gestures-20261114 at 3afd6521ebe61f64c64512dc7e34e090390533a3.
Scope: Motion Preview only. One channels scroll owner, phone pin only when natural scene fits; reduced motion and short screens retain buttons. 310svh travel, four equal states, reverse and manual jump. No touch/wheel interception on the page.
Viewer: local 1–4x pinch, focal point, bounded pan, double click reset, close always available; zoomed/multitouch gestures do not dismiss. Page position restored on close. Mutation observer still observes data-active only.
Validation: JS syntax passed; browser verification pending. Physical iPhone multitouch needs device acceptance.
