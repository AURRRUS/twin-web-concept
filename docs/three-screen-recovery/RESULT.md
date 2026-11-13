# VIS-009 — первые три экрана

2026-11-13. Статус: IMPLEMENTED, BROWSER_VALIDATION_BLOCKED, NOT_RELEASED.

## База и восстановление
Точная база — Pages 5e9639f7039fdfbd405431d00b71202bdf4e909f (11 ноября + видео 13 ноября). work/twin-v2 содержит устаревший интерфейс. Указанные опубликованным build-version.json sourceCommit 5f17ae1 и runtimeSourceCommit 14f04d6 не доступны через GitHub Git или API. Поэтому эта ветка сохраняет фактический статический runtime, а не подменяет его старым Astro build. Полное восстановление авторских TSX исходников НЕ выполнено.

## Изменения
- В существующем ReferencePage controller вычисление доступной высоты media теперь применяется на всех desktop высотах, а не только ниже 740px. CSS ограничивает медиаполе по этой величине. Исходные тексты 5 ноября, DOM, сцены и controller сохранены.
- Film: двухколоночная шапка над крупным видео, реальные гарнитуры runtime, собственная ступенчатая polygon mask, progress от scroll position, sticky 65svh, reverse. Mobile/reduced-motion — обычный поток и прямоугольное видео.
- Постер: ffmpeg кадр 45 секунды исходного опубликованного MP4. Новая генерация не использована; маска точная CSS geometry.
- Запуск видео только кнопкой или нативным player; pause вне экрана и скрытой вкладки.
- CTA: блик при hover/focus и небольшое поднятие.

## Реальные проверки
node --check: оба изменённых JS файла PASS.
ffmpeg: кадр 45 секунды извлечён успешно.
Browser: NOT RUN. Chromium process_singleton_posix socket() Operation not permitted. Облачный браузер localhost:8123 ERR_CONNECTION_REFUSED. Визуальный PASS отсутствует, quality gate не изменён, основная публикация не обновлена.

## Следующий обязательный шаг
Браузерная проверка 1440×900, 1366×768, 1920×1080, 1280×720, 768×1024, 390×844; вся обычная прокрутка вперёд/назад; полный panel в viewport; все 4 состояния; clip reveal; click карточек; быстрый scroll; resize; reduced-motion; видео play/pause/fullscreen; отсутствие overflow и console errors. Исправить дефекты до переноса v2 subtree в twin-preview. Проверить сохранность всех V1 файлов. Опубликованный сайт пока НЕ содержит эти правки.
