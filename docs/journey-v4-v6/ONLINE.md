# Опубликованный Journey V4–V6 R1

Страница: https://aurrrus.github.io/twin-web-concept/

- [4 — Большая сцена](https://aurrrus.github.io/twin-web-concept/?v=7a91cec#journey-variant-4)
- [5 — Горизонтальный маршрут](https://aurrrus.github.io/twin-web-concept/?v=7a91cec#journey-variant-5)
- [6 — Архитектурные плоскости](https://aurrrus.github.io/twin-web-concept/?v=7a91cec#journey-variant-6)

Фактический sourceCommit сборки: `7a91cece7ffc3fb66edb9aa6d2a81b044846101d`.
Deployment commit: `bc8ef83b66789765c2b62618f52b2a66a2ebf1f7`.
Рабочая ветка: codex/twin-journey-v4-v6. [PR13](https://github.com/AURRRUS/twin-web-concept/pull/13).
Последующий commit с отчётом и снимками не меняет frontend и не подменяет sourceCommit опубликованной сборки.

## Резервы до изменений

- [Исходники](https://github.com/AURRRUS/twin-web-concept/tree/backup/before-journey-v4-v6-2026-10-25): `64dab7d8162cdbad758dda26ff8594ffce378edf`.
- [Готовая прежняя сборка](https://github.com/AURRRUS/twin-web-concept/tree/backup/pages-before-journey-v4-v6-2026-10-25): `0c438e7ba70cfaf55f308530705a9dc378a398b2`, source `794a265c90c975cf5390a73e34a3c1bcee9caa18`.

База была чистой; актуальные изменения сохранены, старые ветки не передвигались.

## Проверки

Локально: typecheck PASS; Astro build PASS;45/45 Playwright PASS, без пропусков и flaky. [Полный результат](../../artifacts/journey-v4-v6/full-suite.json). Чистая timeline проверена на20001кадре. [Сохранность существующих блоков](../../artifacts/journey-v4-v6/preservation.json).

Матрица:1920×1080,1440×900,1366×768,1280×720,390×844. Дополнительно1440×550 и reduced-motion. Проверены все4состояния, прямые и обратные переходы, паузы внутри переходов, повторный вход с обеих сторон, клики1→4, стрелки/Home/End, resize,12диалогов оригиналов/Escape/возврат фокуса, уникальность IDs, отсутствие горизонтального переполнения. No-JS сохраняет4статьи.

Онлайн: **PASS** на всех5размерах, reduced-motion и прямых якорях4/5/6; JavaScript-ошибок0, HTTP≥400:0. Проверен именно sourceCommit7a91cece7ffc3fb66edb9aa6d2a81b044846101d. См. [машинный отчёт](../../artifacts/journey-v4-v6/online-verification.json). Проверяются точный sourceCommit, SHA256 HTML сборки и4PNG, реальные custom fonts через CDP, computed styles,5размеров, прямые якоря4/5/6, reduced-motion,12диалогов, исходный Journey/варианты1–2, каналы и поздний треугольник после последовательного скролла; JS-ошибки и HTTP≥400 учитываются отдельно.

Канонические роли новых вариантов: H2 Expanded Black900, tracking0, line-height1.12; навигация Expanded Semibold600, tracking0, line-height1.25; описания Inter Tight450, tracking.015em, line-height1.55. Font-synthesis:none. H2 на1440: V4/V5 44px, V6 40px; на1920:54/52/50px; в низких окнах36/36/34px. Все4исходных PNG целиком через contain. [Метаданные реальных файлов](../../artifacts/journey-v4-v6/font-files.json).

## Снимки с опубликованного сайта

Сняты60кадров чтения плюс3промежуточных кадра1440. [Папка снимков](../../artifacts/journey-v4-v6/online), [URL и время съёмки](../../artifacts/journey-v4-v6/online/capture.json).

| Вариант1440×900 | Проект | Корпус | Этаж | Лот | Переход |
|---|---|---|---|---|---|
|4|[PNG](../../artifacts/journey-v4-v6/online/v4-project-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v4-corpus-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v4-floor-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v4-lot-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v4-transition-1440.png)|
|5|[PNG](../../artifacts/journey-v4-v6/online/v5-project-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v5-corpus-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v5-floor-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v5-lot-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v5-transition-1440.png)|
|6|[PNG](../../artifacts/journey-v4-v6/online/v6-project-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v6-corpus-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v6-floor-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v6-lot-1440.png)|[PNG](../../artifacts/journey-v4-v6/online/v6-transition-1440.png)|

Визуально просмотрены опубликованные чтения/промежуточные состояния, мобильная и низкая композиции: V5 абзац под H2, V6 плоскость не перекрывает подпись, планы целиком. На переходе допустимо остановиться с частично открытым новым абзацем/изображением: это детерминированная маска, а не загрузка или autoplay.

## Реальные ограничения

V6 intrinsic minimum расширяет текстовую колонку примерно до37–41% вместо буквальных34%, чтобы настоящий Black с заданным кеглем сохранял максимум3строки. V4 аналогично немного расширяет заголовочную часть для2строк. Подробные измерения и причины — [IMPLEMENTATION](IMPLEMENTATION.md). На1920 max-width1760 даёт фактические внешние поля80px при переменной gutter64px. Содержимое изображений демонстрационное; данные и интерфейс на PNG не выданы за функциональность сайта. Физические iOS/Safari и другие browser engines в этой итерации не проверялись. Внешних зависимостей, блокирующих публикацию, нет.

Фактические computed styles1440×900: H2 V4/V5 44px/49.28px, V6 40px/44.8px, weight900/spacing0. Описания18px/27.9px, weight450/spacing0.27px. Навигация16px/20px, weight600/spacing0. CDP подтвердил реальные RFDewiExpanded-Black, RFDewiExpanded-Semibold и InterTight-Regular с customFont=true.
