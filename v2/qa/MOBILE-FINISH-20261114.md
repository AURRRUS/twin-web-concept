# Mobile final pass
Owner: free exit from channels without auto-scroll; remove black gap above contact; generated confirmation illustration. Desktop accepted, unchanged visually.
Channel first/last state anchored at corresponding sticky boundary, so exit gesture can remain native with zero destination scroll. Mid states remain deliberate. Wheel burst holds last state until idle.
Contact mobile padding-top computed40px caused black band; reset mobile contact padding to0 only <=767px.
Generated champagne envelope/navy check illustration, optimized640 WebP18,842bytes, under contact-v1/request-prepared-v1.webp. Prompt: refined B2B envelope in brushed champagne gold on ivory plinth, navy glass check, architectural shadows, no text/logos. Generated via built-in imagegen.
Mobile submit confirmation listens after existing validation. Shows Request prepared, explicit need to send email, open-mail link, close/back. No delivery claim, no backend change, desktop form unchanged.
Syntax passed; live QA pending.

Live QA Chrome390x664: last-state next section started664.8px; small native scroll moved it140px to524.8px and stopped without auto completion. Contact image offset0px, padding0. Mobile form valid dummy input opens prepared dialog with loaded generated image; URL stays site; back closes, resubmit opens. Mobile mail navigation is now explicit link only (contact-legal-v2); desktop retains old auto mailto. No message sent. Physical iPhone gesture not tested. Pages success.
