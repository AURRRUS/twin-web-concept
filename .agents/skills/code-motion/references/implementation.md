# Implementation contract

## Core

`window.CFG = { width, height, fps, duration, seed, palette, fontFamily, copy, scenes }`.
`window.ready` завершать после загрузки fonts и decode всех image assets; отклонять при отсутствии обязательного ресурса.
`window.render(t)` синхронно: validate/clamp t, clear Canvas, reset transform/globalAlpha/shadows, вычислить каждое состояние из t, обновить все DOM значения. Избегать «если вошли в сцену, добавь класс», потому что backward seek оставляет старое состояние.

Ключевые времена: 0, границы сцен ±1/fps, середины transitions, удержания, duration−1/fps. Repeated and out-of-order captures должны совпадать байт-в-байт в одной среде. Между ОС/версиями браузера шрифтовой raster может отличаться; не обещать переносимую pixel identity.

Для cubic-bezier вычислять y при найденном x=t (инверсия x методом bisection/Newton), а не просто брать y(t) параметрической кривой. Для back/bounce/elastic ограничивать overshoot осмысленно и не использовать их без дизайн-основания. Для loops задавать периодические функции и непрерывность, без несеяного random.

## Toolchain

Использовать установленный Node и `playwright` из активной среды, при Work Mode искать также CODEX_PRIMARY_RUNTIME_NODE_MODULES. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` допустим для установленного Chrome. При отсутствии binary не выдавать export за выполненный; установить доступный runtime только если среда/задача позволяют.

Запуск:

```
node scripts/render_motion.cjs --html /absolute/motion.html --out /absolute/new-preview --mode preview
node scripts/render_motion.cjs --html /absolute/motion.html --out /absolute/new-video --mode video
```

Папка output должна быть новой. Renderer сохраняет checkpoints, QA hashes, HTML SHA256, фактический CFG, параметры environment, PNG кадры и report. Все внешние сетевые запросы блокируются: embed assets заранее. Trusted local HTML выполняет собственный JS; не запускать чужие неизвестные файлы как доверенный шаблон.

PNG sequence с deterministic screenshots надёжнее realtime capture, но медленнее. 30 секунд×60 fps=1800 изображений: оценить storage и время по короткому пробному рендеру. Не сохранять обещание «30 секунд готово за 30 секунд». При streaming в encoder контролировать backpressure и frame count, не пропускать кадры.

## Export

Input frame index 000000..N−1; t=i/fps; N=duration×fps целое. `ffmpeg -framerate FPS -start_number 0 -i frame-%06d.png -frames:v N -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart motion.mp4`. Тестировать RGB→YUV color при цветокритичных задачах, согласовать tagged color pipeline; дефолт не является HDR/цветовым master. H.264 4:2:0 может ослабить тонкие цветные линии; при необходимости отдельно выдать PNG/master, не завышать качество обещанием lossless MP4.

`ffprobe -count_frames -show_streams -show_format -of json`; затем ffmpeg full decode. Видео без audio по умолчанию. Для alpha использовать согласованный codec/format, не H.264 MP4.

## Web driver

Внешний requestAnimationFrame переводит elapsed time в t и вызывает core; scroll driver маппит progress в t. Изолировать driver от export, не включать его автоматически до mode selection. При resize фиксировать logical Canvas size и CSS scale либо корректно обновлять backing store с ограниченным DPR. Для live не рендерить весь 1080p canvas на маленьком телефоне без причины. Pause вне viewport/hidden, reduced-motion static state, доступная кнопка остановки для продолжительного autoplay.

## Primary references

- Playwright Page screenshot API: https://playwright.dev/docs/api/class-page#page-screenshot
- FFmpeg image2 and input framerate: https://ffmpeg.org/ffmpeg-formats.html#image2-1
- FFmpeg encoding options: https://ffmpeg.org/ffmpeg.html
