# VIS-007 — независимая проверка рабочего preview

Reviewer: `/root/preview_independent_check`. Реальный независимый проход 04.11.2026 по времени файлов среды. Код сайта и publisher reviewer не менял. Вердикт: **ready-for-owner-review** для этапа1, не финальная художественная приёмка и не новая приёмка нижних блоков.

## Браузер

Проверена та же `/v2/` в существующей оболочке `/review-stage1/index.html`: iframe1440×900 и390×844. На desktop повторно видны сохранённый морской master, читаемые H1/CTA и материальная терраса. Горный reference открыт отдельно; его иной объект не подменяет выбранный морской hero. Геометрия террасы отличается от reference и остаётся предметом решения владельца.

На обоих размерах реально нажаты все4режима. Изображение, раскрытая бронзовая карточка и пояснение согласованно переключаются. На390 используется обычный поток аккордеона; wrapper сообщает fonts:loaded, overflow:false. Мелкие надписи внутри растра остаются маленькими; существуют ссылки на полное изображение и demo.

Реальный native wheel-scroll1440 вывел в тёмный блок demo, обратный scroll вернул в Journey; кнопки выбора также синхронизируют положение сцены. Сами три кадра не выдаются за доказательство непрерывного движения: пользовательское действие описано здесь.

Текущие реальные кадры `evidence/hero.jpg`, `transition.jpg`, `compare.jpg`, `floor.jpg`, `mobile.jpg`, `mobile-journey.jpg`. Тестируемые viewport записаны в review.json; внешний браузерный screenshot1348×926, desktop iframe масштабирован оболочкой. `location-1920.jpg` — честно сохранённый кадр предыдущего независимого `/root/final_visual_check` из REVIEW.md при том же runtime. Новый location визуально получен, но его запись через общую папку не синхронизировалась, поэтому его не выдаём за приложенный файл.

## Код публикации

Проверены изменения scripts/publish-v2.mjs, workflow-state.mjs, visual-gate-v2.mjs и новый `.github/workflows/v2-working-preview.yml`.

- Gate читает requirements текущего candidate; прежние профили сохраняют старый default. Traversal/absolute и пути вне .twin отклоняются.
- Preview-only проекция откладывает только явно final-only pending checkpoint. Исходный ownerAcceptance остаётся pending; общий или фундаментальный checkpoint не пропускается. Final по-прежнему требует свежего отдельного одобрения.
- `--inspect` выходит до первого remote/git mutation; build/evidence/clean-source требования сохраняются.
- Publisher копирует только dist/v2, сравнивает SHA256 всего non-v2 дерева, сохраняет backup ветку и проверяет Pages HEAD перед обычным push; force-push отсутствует.
- Новый workflow ограничен текущей source-веткой, сначала проверяет авторизацию, затем evidence/tests, typecheck/build, publish:v2, online source marker и неизменность V1 HTML/version. Не запускает переоформление сайта или этап2.
- Старые тестовые сценарии VIS005 изолированы от активного candidate вместо подмены текущего VIS007 старым указателем.

Независимо выполнено `node --test scripts/workflow-state.preview.test.mjs tests/workflow-contract.test.mjs tests/visual-gate-v2.test.mjs`: **17/17 PASS**. В изменениях блокирующих дефектов не найдено. Полный CI/deployment в момент review ещё не выполнялся; root проверяет их отдельно после сохранения source.

NOT RUN: physical touch/iOS, OS reduced-motion emulation, screenreader,200%zoom,320px, instrumented performance. Это не WCAG-сертификация. Финальная приёмка владельца — pending. Этап2 — не разрешён.
