# Motion-ТЗ

Заполнить только релевантные части. Не выдавать шаблон с пустыми полями как готовое ТЗ.

## Паспорт

Бренд/проект; носитель (сайт/презентация/social); цель и понятный итог для зрителя; источник контента; deliverables (ТЗ/HTML/MP4); размеры; fps; длительность; safe area; язык; loop/once; sound/silent. Утверждённые числа/строки хранить дословно, source/status рядом. Для демонстрации явно поставить sample label.

## Сценарий по времени

| От–до, секунды | Объект и точный контент | Начальное → конечное состояние | Движение и easing | Назначение/пауза |
|---|---|---|---|---|
| 0–1 | Утверждённый заголовок | opacity 0→1; Y 20→0 | easeInOutCubic | Сформулировать тему |
| 1–4 | Схема из реальных сущностей | Поочерёдное проявление связей | cubic-bezier(.25,.1,.25,1) | Показать последовательность |
| 4–6 | Утверждённый вывод | Плавный переход к финалу | opacity | Оставить время на чтение |

Это демонстрация формата, не обязательные длительности. Задать абсолютные границы, overlap, задержки, hold и exit; для loop сопоставить позиции/скорость/opacity начала и конца. Указать mask/reveal paths, anchor/origin, текстовые переносы и минимальные размеры на целевом носителе. Отделять реальные финансовые значения от анимационного интерполированного счётчика. Не демонстрировать промежуточные числа как факты.

## Web-интеграция

Указать selector/component API, trigger (enter viewport/scroll/click), playback once/loop, scroll progress mapping, pause/resume, loading/ready/error, resize, hidden tab, reduced-motion, static fallback, keyboard и screen-reader summary. Сохранить SEO-текст и CTA в DOM. Не перехватывать штатный скролл без обоснованной отдельной задачи.

## Готовый prompt-контракт

Build a self-contained HTML motion piece for the supplied brand and approved content. Default video format: 1920×1080, specified duration, 60 fps. Expose window.CFG, window.ready and window.render(t). Render every frame from absolute t with no timers, CSS animations, mutable simulation or unseeded randomness inside the core. Keep wrappers/text as HTML/CSS and scene graphics as Canvas 2D. Inline scripts, styles and required assets; no network dependencies. Preserve brand palette, typography, official assets, factual values and statuses. Use the supplied storyboard, purposeful easing and reading holds. Check repeat and out-of-order frames and inspect transitions. When MP4 is requested, capture frames at i/fps with Playwright and encode using ffmpeg; verify actual dimensions, duration, frame count, fps and full decode. For a website, add a separate live/scroll driver, accessible DOM content and reduced-motion fallback; do not replace interactive UI with video.

Добавить конкретный visual brief и timeline; для ПИН включить его действующий FINAL VISUAL ENFORCEMENT. Не передавать generic Apple blue style как дефолт ПИН.

## Приёмка

Тексты и данные совпадают с source; отсутствуют шрифтовые замены без отметки; transitions/hold читаемы; повтор render(t) стабилен; нет state drift, clipping и page errors; проверено на целевых размерах. Для MP4 — фактические параметры и decode; для live — measured frame cost, reduced-motion, keyboard, resize, visibility, zero blocked CTA. Handoff включает зависимости, asset ownership, API и static fallback.

## Shared web-motion references and implementation handoff

For live website motion use `code-motion` together with the target brand profile and the implementation skill available in the session. `web-concept-studio` owns concept/composition; `pinwebconceptsystem` owns PIN-specific art direction; neither alone certifies working code. Use `ui-ux-pro-max` for readability, responsive behavior and interaction details. Use Material 3 only where the target task asks for its component behavior or system, preserving approved brand and type. Load only the relevant skill resources.

External references: https://prompt-motion.com/ (motion videos/prompts/skills), https://kinetics.colorion.co/ (CSS/React interface motion). Read the actual relevant example; record the URL and the mechanism reused. Adapt it to DOM interaction, scroll progress, reverse/re-entry, keyboard, mobile and reduced motion. A rendered video is not an interactive website; do not render MP4 unless requested. For browser inspection and interaction use the available browser skill/tools, not an imagined MCP. If a reference cannot be read, name that gap and continue independent work using the existing verified specification. Never claim an unavailable plugin, hook, render or test was used.

For implementation of the chosen website/component use the installed `frontend-engineer` entry point; it owns code integration, responsive layout and browser verification. Keep this skill as its composition/brand/motion specialist. Resolve it by skill name in the current environment.
