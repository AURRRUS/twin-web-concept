# WF-001 — inventory и план уборки без удаления

Дата: 2026-11-01. Автор: `/root/workflow_resume_check`. Ничего не удалялось, не перемещалось и не архивировалось. Runtime не менялся.

Источник размеров/числа файлов: `/workspace/scratch/836580cede91/audit/github-tree.json`, Git tree `08d6e9f865648bc4bc3f328cea30a3739c72d001`, `truncated=false`. Считаются только blob entries и их `size`, не Git pack/disk usage. Всего в снимке: **1524 файлов, 693,794,048 bytes**.

| Раздел | Blob count | Bytes |
|---|---:|---:|
| `artifacts/` | 618 | 482,765,210 |
| `docs/` | 302 | 85,499,123 |
| `.github/workflows/` | 8 | 17,477 |
| `scripts/` | 40 | 183,574 |

Числа относятся к исходному tree, а не изменяемому working tree: новые WF-001 files и изменённые scripts/workflows в эти суммы не входят. Checkout материализован частично: при инвентаризации artifacts содержал 0 локальных файлов, docs — 8, scripts — 41, workflows — 9. Поэтому **нулевой результат rg не доказывает отсутствие потребителей в полном репозитории**. Нельзя удалять remote blobs по результатам локального поиска.

Потребители проверены `rg -l --hidden -F` по `src scripts tests .github .twin docs package.json`, исключая `.git`, node_modules, artifacts и эти WF-001 отчёты. Для scripts использовано имя файла (покрывает относительные imports); для каталогов — полный префикс. Таблицы приводят до трёх примеров и общее число совпавших файлов; это ссылки/производители/исторические упоминания, не обязательно runtime read.

## Artifacts

Назначение: исторические browser captures, QA JSON и свидетельства итераций. Все оставлены сейчас. «Кандидат на архив» означает только последующую проверку полного дерева, перенос в долговечное хранилище с SHA/manifest и сохранение ссылок; удаление не разрешено.

| Группа | Count | Bytes | Найденные потребители | Решение |
|---|---:|---:|---|---|
| `artifacts/component-dialog.png` | 1 | 221,687 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/composition-desktop.png` | 1 | 762,829 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/correction-v2` | 8 | 7,929,192 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/craft-performance.json` | 1 | 337 | `scripts/check-craft.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/delivery-desktop.png` | 1 | 413,566 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/demo-desktop.png` | 1 | 681,131 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/design-browser-check.json` | 1 | 35,842 | `scripts/check-design.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/design-contrast.json` | 1 | 1,722 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/design-source-assets.json` | 1 | 842 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/design-visibility.json` | 1 | 406 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/desktop-1440.png` | 1 | 6,088,470 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/desktop-1920.png` | 1 | 6,210,280 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/dialog-type-verification.json` | 1 | 4,107 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/final-r2` | 36 | 26,654,932 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/first-screen.png` | 1 | 1,279,799 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/grid-review` | 52 | 82,677,496 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/interaction-stability.json` | 1 | 8,269 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-comparison` | 55 | 51,712,587 | `scripts/verify-journey-comparison.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/journey-composition.png` | 1 | 1,834,284 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-lot.png` | 1 | 1,559,298 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-project.png` | 1 | 1,916,996 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-space.png` | 1 | 1,835,086 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-v3-math.json` | 1 | 166 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/journey-v4-v6` | 75 | 53,130,657 | `scripts/verify-journey-v4-v6.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/layout-scroll-v3` | 47 | 19,814,354 | `.github/workflows/publish-layout-scroll.yml`; `scripts/verify-layout-scroll-v3.mjs` (2 files) | Кандидат на архив; сейчас оставить |
| `artifacts/motion-review` | 19 | 21,392,891 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/motion-v4-browser-check.json` | 1 | 8,471 | `scripts/check-motion-v4.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/online-first-screen.png` | 1 | 1,289,093 | `.github/workflows/verify-preview.yml` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/online-verification.json` | 1 | 617,003 | `.github/workflows/verify-preview.yml`; `scripts/verify-online.mjs` (2 files) | Кандидат на архив; сейчас оставить |
| `artifacts/repeat-layout` | 12 | 8,871,451 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/sales-story` | 52 | 19,145,179 | `scripts/verify-sales-story.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/scene-copy-review` | 9 | 6,548,973 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/scroll-recovery` | 20 | 13,207,860 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/test-results.json` | 1 | 37,158 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/top-v2-review` | 29 | 25,024,557 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/type-channels` | 42 | 26,064,655 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/visual-correction-r2` | 66 | 26,905,521 | `scripts/verify-visual-r2.mjs` (1 files) | Кандидат на архив; сейчас оставить |
| `artifacts/visual-motion-v3` | 10 | 9,467,660 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |
| `artifacts/visual-recovery` | 63 | 59,410,403 | Не найдены в частичном checkout | Кандидат на архив; сейчас оставить |

Отдельно сохранить будущий `artifacts/hero-journey/` и `artifacts/v2-review/`: текущие `verify-hero-journey.mjs`, hero CI и visual gate используют эти пути; отсутствие их в исходном tree не разрешает удаление текущего evidence. Большие `grid-review`, `visual-recovery`, `journey-v4-v6` и `journey-comparison` требуют пофайлового manifest перед архивированием.

## Docs и snapshots

| Группа | Count | Bytes | Найденные потребители | Решение |
|---|---:|---:|---|---|
| `docs/ARCHIVE_FILE_AUDIT.json` | 1 | 91,509 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/ARCHIVE_FILE_MAP.md` | 1 | 16,541 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/ARCHIVE_FINDINGS_2026-10-20.md` | 1 | 15,082 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/ARCHIVE_UI_PROTOTYPE_CHECK.json` | 1 | 1,042 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/CHECKPOINT.md` | 1 | 7,199 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/CONTENT_GRID_2026-10-20.md` | 1 | 6,693 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/CORRECTIONS_2026-10-20.md` | 1 | 4,746 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/CORRECTIONS_MEDIA_2026-10-20.json` | 1 | 1,488 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/DESKTOP_REVIEW_2026-10-20.md` | 1 | 14,859 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/FONT_ASSETS_2026-10-20.json` | 1 | 1,209 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/HANDOFF_AUDIT.json` | 1 | 185 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/IMPLEMENTATION_MAP.md` | 1 | 6,902 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/MOTION_LAYOUT_2026-10-20.md` | 1 | 3,804 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/NEXT_DESKTOP_GOAL.md` | 1 | 11,360 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/ONLINE_PREVIEW.md` | 1 | 3,012 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/ORIGINAL_ARCHIVES_INDEX.json` | 1 | 9,013 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/QA_REPORT.md` | 1 | 13,931 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/README.md` | 1 | 722 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/SECOND_BLOCK_LARGE_SCENES_2026-10-20.md` | 1 | 2,842 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/SECOND_BLOCK_REWORK_2026-10-20.md` | 1 | 3,589 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/TOP_SCREENS_V2_ACCEPTANCE_2026-10-21.md` | 1 | 10,125 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/TYPOGRAPHY_IMPLEMENTED_2026-10-20.md` | 1 | 3,207 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/TYPOGRAPHY_LOCK_2026-10-21.md` | 1 | 2,480 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/VISUAL_DELIVERY.md` | 1 | 6,436 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/WORK_PACKAGES.json` | 1 | 5,356 | Не найдены в частичном checkout | Оставить документ/индекс; сверить историю перед архивом |
| `docs/correction-v2` | 3 | 10,516 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/craft-pass` | 5 | 28,417 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/design-handoff` | 7 | 53,026 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/final-r2` | 9 | 62,401 | `scripts/verify-online.mjs` (1 files) | Кандидат на архив snapshots; сейчас оставить |
| `docs/font-archive` | 2 | 43,331 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/handoff` | 78 | 55,798,905 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/handoff-v1.3-patch` | 11 | 215,751 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/history` | 2 | 34,137 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/journey-comparison` | 4 | 31,048 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/journey-craft` | 3 | 8,810 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/journey-v4-v6` | 9 | 47,298 | `scripts/verify-journey-v4-v6.mjs` (1 files) | Кандидат на архив snapshots; сейчас оставить |
| `docs/layout-scroll-v3` | 4 | 29,962 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/motion-v4` | 2 | 19,291 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/owner-updates` | 2 | 16,511 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/publish-fix-v2` | 9 | 46,985 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/repeat-layout` | 3 | 21,587 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/sales-story` | 13 | 93,611 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/scroll-recovery` | 3 | 19,457 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/top-screens-v2` | 27 | 17,182,859 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/type-channels` | 4 | 24,950 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/v2` | 35 | 4,698,810 | `.github/workflows/v2-vis002-release.yml`; `.github/workflows/vis004-transfer-check.yml`; `.github/workflows/workflow-foundation.yml` (22 files) | Оставить: действующие references, reviews, decisions, quality |
| `docs/visual-correction-r2` | 19 | 2,309,822 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/visual-motion-v3` | 13 | 4,409,596 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |
| `docs/visual-recovery` | 10 | 48,710 | Не найдены в частичном checkout | Кандидат на архив snapshots; сейчас оставить |

`docs/handoff` (55,798,905 bytes) и `docs/top-screens-v2` (17,182,859 bytes) — главные кандидаты на архив исходных snapshots, но полный локальный корпус отсутствует. `docs/v2/references/` прямо читают активные `.twin/v2/visual-requirements.json` и assets registry. `docs/v2/reviews/VIS-003` связан с историческим `.twin/v2/visual-review.json`, `VIS-004` — с task run/transfer-check; сохранить evidence с исторической областью. `.twin/tasks/VIS-004/reference-upper.jpg` — активный reference VIS-005, не мусор от старой задачи.

## Workflows

| Файл | Count | Bytes | Назначение и решение |
|---|---:|---:|---|
| `.github/workflows/hero-journey-qa.yml` | 1 | 888 | Оставить: действующий /v2/ browser harness; локальная версия расширена WF-001 |
| `.github/workflows/publish-layout-scroll.yml` | 1 | 2,782 | Исторический release branch codex/twin-layout-scroll-v3; есть deploy и verify-layout-scroll-v3. Кандидат на архив после решения по legacy branch; сейчас оставить |
| `.github/workflows/twin-system.yml` | 1 | 1,018 | Оставить: проверки project contracts |
| `.github/workflows/v2-vis002-extra.yml` | 1 | 884 | Историческая дополнительная V2 QA; кандидат на архив после замены покрытия; сейчас оставить |
| `.github/workflows/v2-vis002-qa.yml` | 1 | 1,773 | Исторический V2 harness verify-v2/verify-v2-extra; кандидат на архив после сопоставления DOM и замены покрытия; сейчас оставить |
| `.github/workflows/v2-vis002-release.yml` | 1 | 3,965 | Release branch work/twin-v2 плюс workflow_dispatch; deployment capability. Кандидат на пересмотр/архив только после проверки release consumers; сейчас оставить |
| `.github/workflows/verify-preview.yml` | 1 | 1,356 | Исторический branch codex/twin-desktop-v1-3; сохранённая V1 online проверка. Оставить до retirement V1 workflow |
| `.github/workflows/vis004-transfer-check.yml` | 1 | 4,811 | Проверяет сохранность production sources/review evidence VIS-004; оставить |

Новый `.github/workflows/workflow-foundation.yml` отсутствует в исходном inventory; оставить как действующий WF-001 contract CI. Никакой workflow не запускался/отключался этим документом. Наличие файла с publish в имени не разрешает выпуск WF-001.

## Scripts

| Файл | Count | Bytes | Найденные потребители (имя файла) | Решение |
|---|---:|---:|---|---|
| `scripts/assert-correction-metrics.mjs` | 1 | 5,247 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/assert-journey-transition.mjs` | 1 | 1,269 | `scripts/assert-scroll-recovery.mjs`; `scripts/capture-scroll-recovery.mjs`; `scripts/final-r2-qa.mjs` (3 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/assert-scroll-recovery.mjs` | 1 | 5,847 | `scripts/capture-scroll-recovery.mjs` (1 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/assert-twin-type.d.mts` | 1 | 124 | Внешние потребители не найдены локально | Оставить: текущая команда/gate/общая утилита |
| `scripts/assert-twin-type.mjs` | 1 | 2,085 | `scripts/check-design.mjs`; `scripts/verify-online.mjs` (2 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/bind-short-words.mjs` | 1 | 1,853 | Внешние потребители не найдены локально | Оставить: текущая команда/gate/общая утилита |
| `scripts/build-v2.mjs` | 1 | 2,881 | `.github/workflows/hero-journey-qa.yml`; `.github/workflows/vis004-transfer-check.yml`; `.twin/v2/visual-requirements.json` (4 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/capture-final-r2.mjs` | 1 | 3,326 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/capture-journey-comparison.mjs` | 1 | 1,874 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/capture-journey-v4-v6.mjs` | 1 | 1,670 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/capture-repeat-layout.mjs` | 1 | 2,335 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/capture-scroll-recovery.mjs` | 1 | 4,913 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/check-craft.mjs` | 1 | 2,641 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/check-design.mjs` | 1 | 5,085 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/check-journey-v3.mjs` | 1 | 1,309 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/check-motion-v4.mjs` | 1 | 5,100 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/final-r2-qa.mjs` | 1 | 9,909 | `scripts/capture-final-r2.mjs`; `scripts/verify-journey-comparison.mjs`; `scripts/verify-journey-v4-v6.mjs` (6 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/inspect-layout.mjs` | 1 | 3,294 | `scripts/verify-journey-comparison.mjs`; `scripts/verify-journey-v4-v6.mjs`; `scripts/verify-online.mjs` (3 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/journey-comparison-qa.mjs` | 1 | 6,823 | `scripts/capture-journey-comparison.mjs`; `scripts/verify-journey-comparison.mjs`; `scripts/verify-journey-v4-v6.mjs` (4 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/journey-craft-frame-check.mjs` | 1 | 1,012 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/journey-v4-v6-qa.mjs` | 1 | 7,178 | `scripts/capture-journey-v4-v6.mjs`; `scripts/verify-journey-v4-v6.mjs`; `tests/final-r2.spec.ts` (4 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/layout-scroll-qa.mjs` | 1 | 5,546 | `scripts/verify-layout-scroll-v3.mjs`; `tests/layout-scroll.spec.ts` (2 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/publish-preview.mjs` | 1 | 2,813 | `.twin/tasks/JRN-001/RESULT.md`; `package.json` (2 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/publish-v2.mjs` | 1 | 3,854 | `package.json` (1 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/sales-story-qa.mjs` | 1 | 8,327 | `scripts/verify-layout-scroll-v3.mjs`; `scripts/verify-sales-story.mjs`; `scripts/verify-visual-r2.mjs` (6 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/text-bind.mjs` | 1 | 248 | `scripts/bind-short-words.mjs` (1 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/twin-system.mjs` | 1 | 10,060 | `.twin/START.md`; `.twin/tasks/SYS-001/FORWARD_TEST.md`; `.twin/tasks/SYS-001/RESULT.md` (7 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/twin-system.test.mjs` | 1 | 2,384 | `.github/workflows/workflow-foundation.yml`; `.twin/tasks/SYS-001/FORWARD_TEST.md`; `package.json` (3 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/type-channels-qa.mjs` | 1 | 4,796 | `scripts/verify-journey-comparison.mjs`; `scripts/verify-journey-v4-v6.mjs`; `scripts/verify-online.mjs` (5 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/verify-hero-journey.mjs` | 1 | 3,198 | `.github/workflows/hero-journey-qa.yml` (1 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/verify-journey-comparison.mjs` | 1 | 4,711 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/verify-journey-v4-v6.mjs` | 1 | 5,275 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/verify-layout-scroll-v3.mjs` | 1 | 10,349 | `.github/workflows/publish-layout-scroll.yml` (1 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/verify-online.mjs` | 1 | 8,687 | `.github/workflows/verify-preview.yml`; `package.json` (2 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/verify-sales-story.mjs` | 1 | 9,194 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/verify-v2-extra.mjs` | 1 | 4,061 | `.github/workflows/v2-vis002-extra.yml`; `.github/workflows/v2-vis002-qa.yml`; `.github/workflows/v2-vis002-release.yml` (3 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/verify-v2.mjs` | 1 | 7,911 | `.github/workflows/v2-vis002-qa.yml`; `.github/workflows/v2-vis002-release.yml` (2 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |
| `scripts/verify-visual-r2.mjs` | 1 | 9,890 | Внешние потребители не найдены локально | Кандидат на архив; сначала полный dependency scan |
| `scripts/visual-gate-v2.mjs` | 1 | 3,660 | `.github/workflows/hero-journey-qa.yml`; `.github/workflows/v2-vis002-release.yml`; `docs/v2/QUALITY.md` (7 files) | Оставить: текущая команда/gate/общая утилита |
| `scripts/visual-r2-qa.mjs` | 1 | 2,835 | `scripts/verify-visual-r2.mjs` (1 files) | Оставить: legacy tests/CI; архив только вместе с их retirement |

Новые `scripts/workflow-check.mjs` и `scripts/workflow-state.mjs` отсутствуют в исходном tree; сохранить. Unit/helper PASS старой сцены не принимает ReferenceJourney, но это не причина удалять V1 tests или их вспомогательные scripts.

## Конкретный безопасный следующий шаг

В отдельной cleanup-задаче материализовать полный tree и повторить поиск basename/full path, включая Markdown, JSON manifests, import graphs и workflow artifact upload/download. Для каждого кандидата собрать SHA256, byte size, происхождение, потребителей и место долговечного архива; проверить восстановление и обновить ссылки одним пакетом. Только после этого предложить точный список removals отдельным diff. Git history не переписывать; текущие runtime assets/fonts, reference и evidence gates исключить из удаления. Ни один файл не признан безопасным для удаления этим аудитом.
