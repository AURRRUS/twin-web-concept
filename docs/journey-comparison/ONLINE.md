# Опубликованное сравнение Journey

[PR№12](https://github.com/AURRRUS/twin-web-concept/pull/12).

URL: https://aurrrus.github.io/twin-web-concept/?v=794a265#journey-comparison

Фактический sourceCommit: `794a265c90c975cf5390a73e34a3c1bcee9caa18`. Deployment commit: `0c438e7ba70cfaf55f308530705a9dc378a398b2`. Публичный build-version.json совпал с ожидаемым исходным commit, а HTML побайтно совпал с dist/index.html. Исходные четыре PNG совпали по полному SHA-256. Репозиторий и публикация сохранены до изменений в двух резервных ветках.

## Прямые ссылки

- [Исходный вариант](https://aurrrus.github.io/twin-web-concept/?v=794a265#journey-original)
- [Вариант1 — Два масштаба](https://aurrrus.github.io/twin-web-concept/?v=794a265#journey-variant-1)
- [Вариант2 — Одно окно в проект](https://aurrrus.github.io/twin-web-concept/?v=794a265#journey-variant-2)
- [Вариант3 — Четыре главы](https://aurrrus.github.io/twin-web-concept/?v=794a265#journey-variant-3)

Победитель не выбран. Исходный Journey остаётся перед тремя новыми вариантами; все существующие нижние секции следуют за ними в прежнем порядке. Есть общий индекс и четыре возврата «К сравнению». Служебные подписи вынесены за пределы сцен.

## Результаты

Typecheck/build и [полная серия38 Playwright](../../artifacts/journey-comparison/full-suite.json) PASS. Сохранены все30 прежних функциональных проверок, добавлены8 сравнительных.10001 математический кадр подтверждает непрозрачные изображения, наличие текста и комплементарные маски. [Контроль13 неизменённых файлов](../../artifacts/journey-comparison/preserved-files.json) включает исходный Journey, его движок, общие стили, hero, каналы/треугольник, JSON и четыре исходника; SHA совпадают с сохранённой актуальной базой.

[Онлайн-отчёт](../../artifacts/journey-comparison/online-verification.json):

| Viewport | Варианты1/2 | Вариант3 | Нижние блоки |
|---|---|---|---|
|1920×1080|4сцены, pin, reverse/reentry/nav PASS|4главы, правильный указатель PASS|Каналы + последовательный треугольник PASS|
|1440×900|4сцены, промежуточные маски, паузы,8разворотов/фокус PASS|4главы PASS|Каналы + последовательный треугольник PASS|
|1366×700|4сцены, полная панель/подпись/кнопка PASS|4главы PASS|Каналы + последовательный треугольник PASS|
|390×844|Переключение4сцен, без pin/длинного трека PASS|4главы в потоке PASS|Прежняя мобильная база сохранена|

Reduced-motion: switch вместо длинного трека, без обязательных переходов. Проверены отсутствие повторяющихся ID, клавиатурная навигация, прямые якоря после гидрации,12разворотов оригиналов локально (8повторены онлайн) и Escape/возврат фокуса; источник/соседние варианты не получают чужих обработчиков. Нижний треугольник не набирал прогресс при прохождении сравнений, затем показал видимые фазы при обычном wheel-проходе через каналы. Ошибок JavaScript, HTTP400+ и горизонтального переполнения нет.

Chrome подтвердил реально используемые custom-файлы RFDewiExpanded-Black и Semibold: H2 вес900, названия600, tracking0, synthesis:none. Описания — Inter Tight450/1.55/.015em. На1440px H2 вариантов1/2 примерно38.16/36px, описания18px; на1366×700 H2 первых двух30px. Размеры рассчитаны под собственные колонки, текущий Journey с его типографикой не сжимался.

## Снимки

[Все опубликованные состояния и адаптив](../../artifacts/journey-comparison/online): [Два масштаба1440](../../artifacts/journey-comparison/online/variant-1-project-1440.png), [Одно окно1440](../../artifacts/journey-comparison/online/variant-2-project-1440.png), [Четыре главы — этаж](../../artifacts/journey-comparison/online/variant-3-floor-1440.png), [промежуточная маска](../../artifacts/journey-comparison/online/variant-1-transition.png), [mobile](../../artifacts/journey-comparison/online/variant-1-project-390.png). Просмотрены реальные снимки, не imagegen-макеты.

## Резерв и ограничения

[Исходники](https://github.com/AURRRUS/twin-web-concept/tree/backup/before-journey-comparison-2026-10-24) → `f4a1c17512d1b1c2098336cb809ac5c295f05a79` поверх45e9135; [готовая прежняя публикация](https://github.com/AURRRUS/twin-web-concept/tree/backup/pages-before-journey-comparison-2026-10-24) → `5b0663eab761fd3967e40eb1290e03ae55652721`, source45e91358d7e05b025ead7031baede574832cda5b. Старые резервы не перемещались; без force-push/reset.

Три упомянутых визуальных макета в сообщении не были приложены, поэтому композиции выполнены по подробному текстовому ТЗ. Проверено в Chromium с эмуляцией размеров; Safari/iOS, физические устройства и реальный trackpad не проверены. Mobile — база для сравнения, не заявление о полном mobile redesign. Неподключённые интеграции и честные статусы сохранены. Отчёт и снимки добавлены после публикации отдельным коммитом без изменения frontend.
