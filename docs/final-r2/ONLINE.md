# FINAL R2 — опубликованная версия и приёмка

URL: https://aurrrus.github.io/twin-web-concept/

Фактический sourceCommit: `c9fa164939af0b821fd103a5321f6f902c297851`. Проверен через публичный build-version.json и браузером после завершения Pages. Deployment commit: `b1026259be5c16c80d2c9f4f3a3d400400657ae8`.

База: `4207d1c3e60493fef4e5629c2ba8bccf7f030b6b`; [резерв исходников](https://github.com/AURRRUS/twin-web-concept/tree/backup/before-final-handoff-2026-10-23). Прежняя публикация: source `8ad56176929f7d27f373fc7164202ff3456795bf`, build `8a5813f2ac2bfed98962c617e6867e67f3baa3c4`; [резерв сборки](https://github.com/AURRRUS/twin-web-concept/tree/backup/pages-before-final-handoff-2026-10-23). Ветки не перемещались. PR: https://github.com/AURRRUS/twin-web-concept/pull/10.

## Фактические параметры онлайн

| Viewport | Journey H2 размер / вес | Описание размер / вес / tracking | Обе механики |
|---|---|---|---|
| 1920×1080 | 72px / 900 | 18px / 450 / 0.27px | PASS |
| 1920×900 | 72px / 900 | 18px / 450 / 0.27px | PASS |
| 1440×900 | 60px / 900 | 18px / 450 / 0.27px | PASS |
| 1366×768 | 58.15px / 900 | 18px / 450 / 0.27px | PASS |
| 1366×700 | 58.15px / 900 | 18px / 450 / 0.27px | PASS |
| 1280×800 | 56px / 900 | 18px / 450 / 0.27px | PASS |
| 1024×768 | 36px / 900 | 18px / 450 / 0.27px | PASS |

H1 проверен через Chrome CSS.getPlatformFontsForNode: реально отрисован RFDewiExpanded-Black, custom font, вес900. Крупные заголовки: нулевой tracking, font-synthesis:none. Браузер может сериализовать нулевой tracking как normal; в JSON сохранены и исходное значение, и числовое0. Описание Journey: Inter Tight450/18px/1.55/.015em. Названия карточек каналов: настоящий Inter Tight600. Фон контактов: rgb(32,39,47).

Journey: четыре состояния и три перехода; host473svh/panel100svh. Каналы: host400/panel100svh, чтения0–45/85–130/170–215/255–300svh, непрозрачные листы, постоянный порядок слоёв, масштаб1/.96/.92, резерв32px. Треугольник: поздний scroll55→15%H, достигнутое раскрытие сохраняется, минимальные измеренные зазоры32px.

## Проверено

Сборка и typecheck; полная серия24 Playwright PASS, затем9 проверок после очистки CSS и отдельная мобильная регрессия переноса надзаголовка. Математические10001 кадров Journey/каналов PASS; NBSP check0 изменений. Все девять оригинальных файлов пакета совпадают с публичными по полному SHA-256; hero, фасад и прежнее ядро треугольника сохранены.

На опубликованной странице все семь размеров из таблицы прошли прямой и обратный проход, промежуточные маски, паузу без autoplay, повторный вход, клики по четырём пунктам, доступность полной CTA, неподвижную левую колонку, проверку типографики и переполнений.390×844 и reduced-motion: четыре полные сцены Journey и четыре карточки в потоке, без длинного трека и inert. Проверены новый прозрачный core/диалог, #launch, точная подводка hero и /demo с существующим example-project/building-1/floor-4/lot-4-2. Ошибок JS и HTTP400+ нет.

Тест первого раскрытия треугольника выполняется на свежей загрузке: проход до конца каналов может уже раскрыть однократный треугольник. Это учтено в QA, без изменения рабочей механики. Проверки no-JS, формы, resize, задержанной/ошибочной фотографии и клавиатуры — в локальной серии.

## Снимки опубликованной страницы

[Все снимки](../../artifacts/final-r2/online). Journey1440×900: [Проект](../../artifacts/final-r2/online/journey-project-1440.png), [Корпус](../../artifacts/final-r2/online/journey-corpus-1440.png), [Этаж](../../artifacts/final-r2/online/journey-floor-1440.png), [Лот](../../artifacts/final-r2/online/journey-lot-1440.png), [промежуточный кадр](../../artifacts/final-r2/online/journey-transition.png). [Стопка в переходе](../../artifacts/final-r2/online/channel-transition.png), [mobile390×844](../../artifacts/final-r2/online/phone-journey.png), [треугольник](../../artifacts/final-r2/online/triangle-0.14.png).

Полный машинный онлайн-отчёт: [online-verification.json](../../artifacts/online-verification.json). Локальная серия: [full-suite.json](../../artifacts/final-r2/full-suite.json). Доказательства сохранены отдельным последующим коммитом без изменения опубликованного frontend.

## Реальные ограничения

Проверено в Chromium с эмуляцией размеров; физические устройства и Safari/iOS не проверены. Visibility lifecycle проверен синтетически. CRM/реальная отправка формы и API двойника не подключены; существующие честные демонстрационные статусы сохранены. Длинный заголовок «Корпус» естественно занимает дополнительную визуальную строку: сохранены две смысловые части и бронзовая вторая часть, без сжатия шрифта.
