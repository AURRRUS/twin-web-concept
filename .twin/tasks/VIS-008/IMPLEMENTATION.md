# VIS-008 — инженерное завершение

Дата:04.11.2026. Исполнитель продолжения: `/root/vis008_finish_engineer`. Предыдущий исполнитель `/root/vis008_frontend_executor` создал основную реализацию в предыдущем проходе; эта запись не подменяет его историю и не выдаёт его browser-проверки за новые. Source baseline: `eb31192ac84fb2d9cdacce2212685d0cc376cb9c`, та же рабочая V2 `/v2/`.

## Реализованный пакет

Исходники первых двух экранов: `src/pages/v2/index.astro`, `src/styles/v2/hero-journey.css`, только `ReferenceJourney` в `src/components/v2/ReferencePage.tsx`, новый `src/lib/openingJourneyFrame.mjs`. Реальные файлы Black/Semibold/Inter подключены адресно для hero/menu/CTA; Journey сохраняет RF Dewi и возвращает две смысловые группы buyer/sales из существующего JRN-001 content. Стабильная максимальная высота карточки измеряется по четырём копиям; общий H2 не участвует в смене сцен. Motion использует нативный scroll, детерминированный frame и отдельные reveal/hold интервалы.

Готовность двух ТЗ: MASTER_TZ.md и DETAIL_TZ.md; числовая партитура — MOTION.md. Они описывают исполнение текущей пары и план нижних блоков, не объявляют весь сайт переделанным.

## Что проверено в этом продолжении

- Прочитаны AGENTS, текущие state/task, MASTER/DETAIL/MOTION, решение владельца и фактические изменения.
- `node --test scripts/opening-journey-frame.test.mjs scripts/workflow-state.preview.test.mjs tests/workflow-contract.test.mjs tests/visual-gate-v2.test.mjs scripts/twin-system.test.mjs`:27/27PASS до двух локальных исправлений; после исправлений3/3целевых motion-теста PASS, включая регрессию нулевой opacity в точке смены текста.
- `npm run typecheck`:PASS до и после исправлений.
- `node scripts/workflow-check.mjs`, `node scripts/verify-opening-invariants.mjs`, `node --check scripts/verify-hero-journey.mjs`, `git diff --check`:PASS.
- Guard подтвердил неизменность оригинальных hero/террасы, принятых camera/crop/mask правил, V1, общего CSS и нижнего React-tail начиная с ReferenceChannels.

## Найдено и исправлено сейчас

1. При pin→fallback из середины reveal layout выключал enabled, но оставлял inline opacity/transform/clipPath переходного кадра. Добавлен вызов `apply(openingFrame(holdTarget(selected)))` в disabled-ветке: текст и изображение стабилизируются в выбранном читаемом состоянии. Это кодовое исправление; фактический resize/reduced-motion сценарий отдельно подтверждает reviewer.
2. ТЗ задаёт single-column accordion768–1099, но CSS mobile-media блок был ограничен1023. Исправлена только граница этого Journey media query на1099. Принятые фото/терраса и остальные блоки не изменены.

## Исторические browser-наблюдения, не повторённые этим агентом

Предыдущий FE сообщил:1440×900 и1366×768 pin=true,panel670px; четыре состояния через реальные клики, стабильная высота;390×844 normal-flow,fontsloaded,no overflow. Эти сведения хранятся как история авторского прохода и не заменяют новый независимый REVIEW.md.

## Freeze и ограничения

Также канон дополнен фактической narrow-mobile ролью28/36 ниже374px и уточнено устаревшее пояснение tablet40/50. Это не изменение CSS; оно согласует существующий browser-QA с фактическим responsive-контрактом.

Runtime после двух исправлений передан root для независимой проверки. Этот агент браузерную матрицу, physical iOS/touch, OS reduced-motion, screenreader,200%zoom и performance benchmark не выполнял. Сборку/публикацию и свежий визуальный/motion verdict фиксирует root/reviewer отдельно. Коммит и push не выполнялись. Финальная приёмка владельца pending; следующая пара не начиналась.
