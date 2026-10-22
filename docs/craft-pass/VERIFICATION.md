# Реализованный craft pass

Основа: `985a642`, продолжение опубликованного `a81a2a4`. Рабочая ветка: `codex/twin-craft-pass`. Исходные четыре шрифта побайтно совпали с новым архивом; manifest архива проверен полностью.

Включены: Expanded Regular400 hero; desktop hero100svh; контурный контакт в header, один CTA в hero, заданный перенос подзаголовка; полная grid-навигация с раздельными строками; новый reversible journeyFrame с правым inset, 340svh и единственным progress driver; однократные leaf reveals с cleanup, focus/reduced-motion обработкой. Старые observers/entrance-анимации заменены.

Typecheck и сборка успешны; 21 Playwright-тест пройден. Проверены 1280×800,1366×768,1440×900,1920×1080,768×1024,390×844,320×844; низкий viewport, no-JS, reduced-motion, полные тексты и реальные custom-глифы. Навигация не пересекает медиа. Просмотрены hero, Journey, product, composition, channels, delivery, contact. Положение рамки Journey сохраняется при прямом и обратном ходе. Все существующие сценарии диалогов, выбора, каналов и локальной формы сохранены.

Короткий Performance trace снят в Chromium при нативном wheel вперёд/назад. 105 кадров, median/p95 интервала16.7ms, зарегистрированных long tasks нет. Детали: artifacts/craft-performance.json. Trace временный `/tmp/twin-craft-performance-trace.json`; не входит в web build. Это один облачный прогон, не обещание60fps на реальных устройствах. Safari/iOS и физический trackpad не проверены.

Авторитетное подтверждение публикации — artifacts/online-verification.json с точным sourceCommit; предыдущий отчёт относится к предыдущей публикации до нового verify:online.
