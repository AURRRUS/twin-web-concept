# Опубликовано и проверено онлайн

Результат опубликован: https://aurrrus.github.io/twin-web-concept/

sourceCommit: `092841fb93139c4432df5f8fcb330e81fabd0082`.
Pages commit: `d10effd3d3e0a3396acc7ac6a6a97182c7a613f6`.
Отчётные commit после публикации не меняют frontend и не подменяют sourceCommit.

[PR16](https://github.com/AURRRUS/twin-web-concept/pull/16) · [Успешная сборка/публикация/онлайн-проверка](https://github.com/AURRRUS/twin-web-concept/actions/runs/40283657532) · [Фактический online QA](../../artifacts/layout-scroll-v3/online/verification.json) · [Снимки Pages](../../artifacts/layout-scroll-v3/online).

[Journey4](https://aurrrus.github.io/twin-web-concept/#journey-variant-4) · [Каналы](https://aurrrus.github.io/twin-web-concept/#channels) · [Качества](https://aurrrus.github.io/twin-web-concept/#delivery) · [Запуск](https://aurrrus.github.io/twin-web-concept/#launch) · [Сравнение](https://aurrrus.github.io/twin-web-concept/?compare=journey).

- `npm run typecheck`, `npm run build` — PASS.
- Полная серия `npm test`:64/64PASS. После финальной правки мобильных кнопок/интервалов — повторные32/32PASS: layout-scroll, sales-story, type-channels. Общая серия также проверяет неизменённые исходный Journey и варианты1–6,7диалогов, selection, форму и no-JS.
- Browser QA:12размеров1920×1080,1440×900,1366×768,1280×720,1100×680,1024×768,768×1024,390×844,360×800,320×568,844×390 и430×932. Pin Journey/Channels на пяти desktop; narrow/reduced без длинного трека.
- Проверены все четыре сцены, полный contain-кадр, отсутствие двойного изображения, прямой/обратный ход, holds, остановка внутри каскада, повторный вход, переходы по пунктам, resize, быстрая прокрутка/Back/ошибка animation-init, медленный decode и error/retry без изменения progress/геометрии/scroll.
- Delivery: собственная видимость каждой группы, неизменный progress на resize, сохранение финала, пропорции/модель, отсутствие пересечений. Launch — четыре строки, локальное появление, реальные поля для крупных номеров.
- Реальные шрифты подтверждены CSS Platform Fonts/CDP: Black900, Bold700, Semibold600, variable Inter450/500. Computed size/leading на каждом viewport, tracking0/.015em, synthesis:none.1440:H236/42,H322/28,body18/28,route18/26,CTA16/22.1920:H242/48,body19/29;390:H228/34,body17/26,route16/24.
- Сравнение7реализаций, старые якоря и query, мобильные detail/full/zoom/Back/возврат фокуса, отдельная /demo, честная валидация формы сохранены. На проверенных размерах нет horizontal overflow, ошибок JS или HTTP4xx/5xx.

Доказательства: [локальная проверка](../../artifacts/layout-scroll-v3/local/verification.json), [полная серия](../../artifacts/layout-scroll-v3/full-test-results.json), [повторная серия](../../artifacts/test-results.json). Снимки четырёх состояний и промежуточного кадра — в artifacts/layout-scroll-v3/local. Они просмотрены исполнителем; это не визуальное одобрение владельца.

Резервы: [BASELINE](BASELINE.md). Исходники43fe3d801c2e14825df61d1cedb0193690d4decb; прежний source341832c5dfbadf1b65d4c70e6b389f661f6ef607; прежний Pagesdbcf85406462270b19eceba489603468c8793004. Неразрушающие резервные ветки отправлены и сверены повторно перед публикацией.

Ограничения: приложение остаётся демонстрационным, настоящий Twin/backend формы не подключены. Проверки выполнены системным Chromium, физические iOS/Safari/Android не использовались. Проверка200% выполнена как эквивалент720×450CSSpx/DPR2. Старый bind-short-words --check не идемпотентен для общихJSON/кода, применяющего bindShortWords во время вывода; массовый rewrite старых файлов не выполнялся, затронутые тексты привязываются при рендере.

После локального QA политика выполнения изменилась: socket/network из терминала заблокированы, запрос сетевого разрешения не предоставил доступ, расширенный запуск отклонён автоматической проверкой. GitHub API продолжил работать. Все файлы перенесены через штатные Git Data API; дерево848891bbc92f307dc55be02800883fc678822d25 точно совпало с локальным commit2b3877715c5519d1ca73c5fc9819cfeec95bffba. Для завершения публикации штатным scripts/publish-preview.mjs и фактической браузерной сверки добавлен отдельный GitHub Actions workflow. API создаёт commit со своим авторством: итоговый remote sourceCommit будет отличаться от локального2b38777, дерево кода сверяется отдельно. Ограничение не объявляется недоступностью GitHub.


## Фактическая сверка Pages

GitHub Actions повторно выполнил typecheck/build и32браузерных регрессии — PASS; затем штатный build:preview/publish:preview, фактический online verifier — PASS. Все12viewport из таблицы подтверждены на публичномURL. Manifest содержит092841fb, SHA256HTML=c6f2e6482051f8ab1d411aa769a7333b2186ee9555c992cdfb2a5ec634a50905 совпал с собранным dist. Не только push/ref: проверка дождалась появления именно новой версии.

На опубликованной1440:H236/42/900, H322/28/700, body18/28/450, buyer18/28/500, route18/26/600, CTA16/22/600.1920H242/48;390H228/34. Реальные custom-файлы подтверждены CDP, Inter tracking0.27px при18px=.015em, Dewi0, synthesis:none. Отрицательного tracking/искусственного сжатия нет.

Journey и Channels сохраняют pin на1920×1080,1440×900,1366×768,1280×720 и1100×680. Narrow/reduced используют обычный поток/кнопки. Прямой/обратный проход, промежуточные holds, reentry, nav, geometry/typography, MediaViewer/Back/focus, demo, старые входы comparison и эквивалент zoom200% — PASS. ОшибокJS0, HTTP400+0.

Снимки с Pages скачаны из артефакта Actions и осмотрены: четыре desktopJourney и промежуточный кадр совпали с локально просмотренными PNG побайтово; дополнительно просмотрены финальный Delivery, мобильные Journey/Launch и канал офиса. Композиции и полные тексты доступны; это QA исполнителя, не одобрение владельца. Артефакт12632794625, SHA256архива1e2747700060de424d11608d9aca979b1ade87c40209f493a5578eb65eb8eedd.

Ограничение прямой сети среды преодолено разрешённым GitHub API/Actions. Итоговая онлайн-проверка выполнена реальным Chromium на runner; физические iOS/Safari/Android остаются непроверенными. Backend формы и настоящий viewer по-прежнему не подключены и не выдаются за работающие.
