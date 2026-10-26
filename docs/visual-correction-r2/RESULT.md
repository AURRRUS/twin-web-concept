# Visual Correction R2 — результат

Основной URL: https://aurrrus.github.io/twin-web-concept/
Journey4: https://aurrrus.github.io/twin-web-concept/#journey-variant-4
Каналы: https://aurrrus.github.io/twin-web-concept/#channels
Качества: https://aurrrus.github.io/twin-web-concept/#delivery
Сравнение: https://aurrrus.github.io/twin-web-concept/?compare=journey

**Опубликовано и проверено онлайн: PASS.**

sourceCommit: `341832c5dfbadf1b65d4c70e6b389f661f6ef607`.
Pages commit: `dbcf85406462270b19eceba489603468c8793004`.

[Source](https://github.com/AURRRUS/twin-web-concept/commit/341832c5dfbadf1b65d4c70e6b389f661f6ef607) · [Pages](https://github.com/AURRRUS/twin-web-concept/commit/dbcf85406462270b19eceba489603468c8793004) · [PR15](https://github.com/AURRRUS/twin-web-concept/pull/15).

[Фактический online-отчёт](../../artifacts/visual-correction-r2/online/verification.json) · [Снимки с Pages](../../artifacts/visual-correction-r2/online). HTML публичной страницы совпал с dist по SHA256; manifest подтвердил именно этот sourceCommit. Отчётный commit после публикации не меняет frontend и не подменяет sourceCommit сборки.

## Что исправлено

Journey — общий измеряемый frame, единые внешние направляющие header/route/media/sales, без отдельного уменьшения картинки/canvas.measureText. Каналы — единый левый блок,42/58 и навигация2×2 при16px, целая естественная фотография справа. Качества — left-copy/right-canvas720/760, равносторонний SVG, та же модель как52.78%сцены и DOM-факты по заданным координатам. Generic entry и внутренние scroll-слои имеют разных владельцев.

Readiness больше не подменяет progress. Decode/error запрашивают repaint без scroll и layout; есть placeholder/retry/оригинал. Resize сохраняет выбранную сцену. Pure frame и motion JSON перенесены из reference как замена старого вычислителя; математика отдельно от интеграции. Подробности: IMPLEMENTATION.md.

## Фактические локальные проверки

Typecheck и build PASS. Полный Playwright:62/62 PASS без skipped/flaky; после завершающей защиты от отложенных callbacks при unmount повторно10/10 R2-проверок PASS. Полный результат и повтор — artifacts/visual-correction-r2/full-suite.json и last-regression.json. Reference validate-motion PASS — это только математическая проверка, не замена браузера.

Браузерная матрица12размеров PASS, геометрия/реальные шрифты/сцены/сравнение/Back/reduced-motion. Машинные кадры и снимки: artifacts/visual-correction-r2/local. Отдельно проверены медленная сеть, ошибка изображения и retry на остановленном scroll, неизменность layout-count/scrollY после decode, resize внутри сцены, остановки, оба направления и re-entry, fast-scroll/Back/focus, ошибка entry.animate, fallback, no-JS, демо/selection, все dialogs и валидация формы.

| Viewport | Journey | Channels |
|---|---|---|
|1920×1080|pin,frame≈1273px|pin|
|1440×900|pin,frame≈1002px|pin|
|1366×768|switch|pin|
|1280×720|switch|pin|
|1100×680|switch|pin|
|1024×768|switch|switch,4истории|
|768×1024|switch|switch,4истории|
|430×932|switch|switch,4истории|
|390×844|switch|switch,4истории|
|360×800|switch|switch,4истории|
|320×568|switch|switch,4истории|
|844×390|switch|switch,4истории|

Pin не навязан низким окнам: корректный switch прямо разрешён R2. Фактический frame на1440 немного уже ориентира1050–1200 из-за реальных переносов максимального H2/применения; кегли не уменьшены. Всё содержимое одного frame. Проверены допуск2px общих краёв, render-равенство сторон<1%, model/canvas52.78%,≥16px между моделью и текстом,≥12px нижний резерв.

## Сохранность

Исходный Journey и1–6 доступны в ?compare=journey; modern4 обновлён, остальные движки сохранены. Старые якоря и query работают. Hero, MediaViewer, selection config, исходный Journey, вычислитель5–6, media.json, core.webp и composition-core PNG побайтно не изменены — preservation.json. В составе/демо/контакте изменены только внешние entry-атрибуты. Тексты/мобильные функции/полный просмотр/честные статусы сохранены.

Все15ассетов пакета совпали с существующими файлами, включая реальные TTF/WOFF2 и quality-model.webp=core.webp. Новые изображения не генерировались. Генеративный эскиз не стал ассетом сайта, лишний текст из него не переносился.

## Резервы и восстановление

До правок сверены и отправлены:
- [backup/before-visual-correction-r2-2026-10-26](https://github.com/AURRRUS/twin-web-concept/tree/backup/before-visual-correction-r2-2026-10-26) — `7d0a628d637af02c5c3f9d807a5b19bc805c0543`.
- [backup/pages-before-visual-correction-r2-2026-10-26](https://github.com/AURRRUS/twin-web-concept/tree/backup/pages-before-visual-correction-r2-2026-10-26) — `7ad69df00765bcbed015669a501d3272df573e4a`, source`ebca1258da38b473d51d7067d353832ae2463743`.

База чистая, более свежий7d0a628 сохранён. Старые ветки не двигались, force/reset не применялись. Обычный просмотр/rollback через отдельную ветку/worktree описан в BASELINE.md; публикацию история не переписывает.

## Ограничения

Физические Safari/iOS/Android недоступны и не проверены. Zoom200% проверен через CSS-viewport/DPR2; отдельная системная настройка увеличения только текста200% не проверена. Это не подменяется испытанием физического устройства. Тест ясности на респондентах не проводился, визуальное одобрение владельцем не заявляется.

Viewer/API и приём обращений по-прежнему не подключены; UI честно сообщает demo-статус. АналитическогоSDK нет. Эти существующие зависимости не блокируют публикацию preview. Других блокирующих зависимостей нет.

## Команды

npm run typecheck; npm run build; npm test. Preview: npm run preview -- --port 4360. Браузер: node scripts/verify-visual-r2.mjs. Публикация из чистого commit: npm run build:preview && npm run publish:preview. Онлайн: NODE_USE_ENV_PROXY=1 TWIN_URL=https://aurrrus.github.io/twin-web-concept/ TWIN_EXPECTED_COMMIT=<SHA> TWIN_QA_DIR=artifacts/visual-correction-r2/online node scripts/verify-visual-r2.mjs.

## Фактическая онлайн-сверка

Все12размеров — PASS. Для каждого записаны mode и измеренные bbox. Проверены общие края Journey±2px, grid42/58, равенство rendered-сторон<1%, исходный ratio720/760, модель52.78%, model/text gap≥16px и нижний запас≥12px. На низких окнах mode совпадает с таблицей выше. Все4состояния, обратный ход, паузы, re-entry и nav проверены на странице, а не только в pure math.

CDP подтвердил реальные custom RFDewiExpanded-Black900, Expanded-Bold700, Expanded-Semibold600, InterTight-Regular variable450/500. На1440 JourneyH2=40px, вопрос20px/500, nav16px/600, применение17px/450, H3каналов24px/700, H2каналов40px/900. На1920 локальныеH2=48px. Font-synthesis:none; отрицательного tracking и scaleX нет.

Обычный сайт содержит1Journey, сравнение7вариантов. Старые6входов на исходный/1/2/3/5/6 включают compare и сохраняют query; прямой4 работает без compare. Выход из сравнения сохраняет view/campaign и убирает только compare. MediaViewer zoom/Back/фокус, отдельная /demo, reduced-motion и zoom200%CSS-viewport/DPR2 — PASS. JavaScript-ошибок0, HTTP400+0.

Опубликованные конечные и промежуточные кадры осмотрены: Journey сохраняет общий frame, план/карточка целиком; фото каналов не обрезает людей и устройства; треугольник пропорционален, факты отделены от модели; mobile сохраняет естественную высоту и крупную деталь. Это внутренний QA, не утверждение визуального одобрения владельцем.
