# Параллакс и движение слоёв
Кодовая опора без зависимостей: scripts/parallax-geometry.mjs; проверки node scripts/parallax-geometry.test.mjs. Функции считают только геометрию, не управляют браузером.
Назначение: пространственная глубина реальных независимых слоёв. Это не скролл-сглаживание, не обязательный pin и не масштабирование всей страницы.

## Контракт
Для сцены задать host, начало/конец scroll, p∈[0,1], центр неподвижной опоры, layers[id, fromX/Y, toX/Y, scale, z, origin], направление и fallback. Слои мира движутся; body-текст и controls сохраняют стабильную опору. Амплитуды — предложенные параметры, не универсальные брендовые токены.
Минимальный пример: фон 0→-12px, объект +16→-16px, передний край +28→-28px; выбирать по референсу и после проверки. Не наклонять интерфейс ради глубины. Для реального orbit/изменения ракурса нужны 3D/многовидовые материалы — parallax по PNG этого не даёт.

## Геометрия и overscan
На каждой оси запас должен закрывать максимальное смещение. Для равномерного scale от центра минимальный коэффициент покрытия прямоугольного viewport:
max(1 + 2*maxAbsX/width, 1 + 2*maxAbsY/height).
Это формула покрытия плоского фона при центрированном одинаковом aspect-ratio. Для contain/cover с другим ratio, rotation/perspective и прозрачных foreground применять реальный bbox; формула не гарантирует заполнение alpha.
Сначала получить clean plate. Не двигать cutout поверх фотографии, где тот же объект остался запечён: получится двоение.
Один объект может иметь несколько вложенных wrapper: layout → reveal → parallax → image. Один controller на transform каждого узла. Размещение через Grid/Flex остаётся в layout-wrapper.
Не ставить transform на предка sticky-панели без проверки containing block. Не анимировать сам pin; двигать его внутренние layers.

## Исполнение
Использовать текущий motion engine. Для простой сцены достаточно native scroll + passive listener + один rAF; measure отдельно, DOM writes отдельно. Не создавать вечный rAF вне сцены. На resize пересчитать размеры/hostTop/overscan, сохранив выбранное состояние.
Если в проекте уже есть GSAP, ScrollTrigger может вести progress/scrub/pin; для responsive lifecycle использовать gsap.matchMedia и cleanup, не устаревший ScrollTrigger.matchMedia. Новую зависимость не добавлять ради одной небольшой сцены.
При прямом scroll progress остановка должна фиксировать кадр. Scrub с догоняющим временем применять только если контракт разрешает движение после остановки: это не тот же режим.
На reduced-motion отключить декоративные перемещения, сохранить выбранную сцену и доступные controls. Mobile по умолчанию получает статичную глубину или меньшую амплитуду, без обязательного pin и hover-only.
Проверить p=0/.25/.5/.75/1, оба направления, pause/re-entry/resize, конец pinned-сцены и нормальную прокрутку следующего блока. Край фона не должен показываться ни на одном из этих состояний. Unit tests проверяют формулу, не плавность.

## Проверенные первичные источники
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform — transform и containing block
- https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame — rAF lifecycle
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — pin/scrub/refresh, анимировать внутренности pin
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ — responsive cleanup
Проверено 27.10.2026; не считать эти ссылки доказательством реализации на Twin.
