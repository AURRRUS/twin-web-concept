# Journey performance / landscape / contact seam
Operator: fix slow journey images, desktop contact seam, landscape qualities overlap.
Original four WebP total 7,922,808 bytes. New 720px total 307,830 bytes; full detail 1,396,886 bytes. Originals retained. Responsive srcset in SSR and versioned hydrated runtime; dialog uses full detail source. No artwork/content changes.
Below 1100px qualities uses normal two-column grid with emblem/effect full-width; desktop motion remains intact. Contact image overscan and dark surface overlap cover fractional seam.
Syntax passed. Live visual QA pending.

Live QA: Pages succeeded at 68fd5769376c565ad58d715659098683e559670c. Chrome 844x390: time/budget equal top/bottom, effect below both with 18px gap; visually no overlap and no horizontal overflow. Desktop contact visually has no top light seam; new journey-fast image confirmed currentSrc and decoded. Physical Safari orientation not tested.
