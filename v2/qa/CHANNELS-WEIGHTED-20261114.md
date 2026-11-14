# Mobile weighted channels
Operator: one deliberate scroll changes one state; hold each; next gesture after fourth releases. Desktop contact accepted and untouched.
Phone portrait >=560px gets compact frame. One touch gesture threshold72–112px; at most one step on touchend. Wheel burst threshold120px; one step until220ms idle. Boundaries release on separate gesture. Reverse symmetric. Native scrolling outside fully pinned scene and in reduced motion/short landscape. No global wheel/touch lock.
Syntax checked. Live QA pending; physical iPhone touch not available.

Live Chrome 390x664: three separate large wheel bursts (2 pages each) moved first→second(p.375)→third(p.625)→fourth(p.875), sceneTop0 throughout. At fourth qualitiesTop838>viewport664. Separate next burst released to qualitiesTop232. Reverse fourth→third confirmed. No physical iPhone touch PASS claimed. Pages deployment succeeded.
