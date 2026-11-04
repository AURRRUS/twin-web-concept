# WF-001 — карта действующих проверок

Снимок 2026-11-01; автор `/root/workflow_resume_check`. Это статический разбор фактических импортов, селекторов и CI. **Browser NOT RUN в этой сессии**; ниже описано покрытие кода проверок, а не полученный PASS. Runtime не редактировался.

| Звено | Фактический источник / потребитель | Граница проверки |
|---|---|---|
| Route | `src/pages/v2/index.astro` → `/v2/` (production base `/twin-web-concept`) | Hero/header/footer и `ResizeObserver` измерения hero живут в Astro entry |
| React/controller | Astro импортирует `ReferenceJourney`, `ReferenceRest` из `src/components/v2/ReferencePage.tsx`, оба `client:load` | `ReferenceJourney` содержит собственные scroll/resize/ResizeObserver handlers, travel=1800, четыре дискретных состояния; это не `src/components/v2/Journey.tsx` |
| Pin/fallback | В `ReferenceJourney`: width≥1100, высота окна≥panel scrollHeight+48, reduced-motion=false; иначе переключение кнопками | Нужны viewport/height/fallback, keyboard, reverse и естественный выход; helper unit tests это не исполняют |
| CSS | Route импортирует `src/styles/v2/reference-page.css`, затем `src/styles/v2/hero-journey.css` | Реальный cascade, шрифты, `.r4-*`, foreground и responsive проверяются на собранном route |
| Контент/ассеты | `VIS-002/content.json`, `salesStoryContent.json`, `public/media/top-v2/hero.webp`, approved-20261027 media; downstream Composition/ProductDemo/ContactForm | Имя исторической задачи в import не делает её старый controller текущим |
| Канон/контракт | `.twin/v2/typography.json`, `VIS-005/visual-contract.json`, наследование `VIS-004/ENGINEERING.md` | Verify-скрипт читает типографику и travel; канон не подменяет CSS и не доказывает visual acceptance |
| Текущий browser harness | `scripts/verify-hero-journey.mjs`, CI `.github/workflows/hero-journey-qa.yml` | Селекторы `.r4-hero-copy`, `#journey`, `.r4-journey-options`, `.r4-demo` соответствуют текущему route |
| Workflow validation | `scripts/workflow-check.mjs`, `workflow-state.mjs`, `twin-system.mjs`; `tests/workflow-contract.test.mjs`, `.github/workflows/workflow-foundation.yml` | Указатели, scope, schema, типографика/контракт, provenance; не художественное качество |
| Review gate | `scripts/visual-gate-v2.mjs`, `.twin/v2/visual-requirements.json`, `VIS-005/review.json` | Fingerprint `src/`, `public/`, config/package/lock/content/type + contract/reference/evidence; machine validation не подтверждает истинность записи агента и не заменяет visual review |
| Release | `scripts/build-v2.mjs` → `scripts/publish-v2.mjs`, `publish:v2` | Публикация отдельна от technical/visual/owner approval; WF-001 её запрещает |

`verify-hero-journey.mjs` задаёт 1440×900, 1366×768, 1920×1080, 390×844, 360×800, 768×900, 1099×900, 1100×900; compact сокращает до трёх. Проверяет отсутствие initial scroll jump/overflow, computed H1 size/line-height/weight, четыре click-state, стабильность программно выбранных forward/reverse позиций. Отдельная `naturalExit` стартует с установленной позиции, затем именно `page.mouse.wheel` ведёт до demo и собирает состояния; программная подготовка не выдается за естественный выход. Reduced-motion проверяет unpinned и keyboard End/Enter. Выходной JSON прямо отделяет technical PASS от `visualAcceptance: NOT_PERFORMED`.

Ограничения harness: screenshots не принимают точность mask/объекта; программные reverse samples не равны непрерывному пользовательскому reverse/re-entry; последовательные reload по viewport не доказывают сохранение активного состояния при live resize. Полный проход до footer, touch, owner acceptance и художественная плавность требуют отдельного просмотра. Прочтение скрипта не является его запуском.

## Legacy и сохранённый V1

| Проверка | Что действительно проверяет | Применимость к текущему ReferenceJourney |
|---|---|---|
| `tests/journey-accordion.test.mjs` | `src/lib/journeyAccordionFrame.mjs`; потребитель `src/components/JourneyAccordion.tsx` | Не принимает текущий controller |
| `tests/v2-motion.spec.ts` | `src/lib/v2/journeyFrame`; потребитель `src/components/v2/Journey.tsx` | Имя V2 не означает текущий `/v2/`; helper не импортирован ReferenceJourney |
| `scripts/check-journey-v3.mjs`, `journey-craft-frame-check.mjs` | Старые frame-модели и математические состояния | Не доказывают текущий native scroll/pin/resize |
| `tests/journey-comparison.spec.ts`, `journey-v4-v6.spec.ts`, `final-r2.spec.ts` и соответствующие QA/capture/verify scripts | Сохранённый root/comparison `/?compare=journey`, другие DOM/controller | Сохранить для V1/comparison; не переносить PASS на `/v2/` |
| `tests/desktop.spec.ts`, `sales-story.spec.ts`, `layout-scroll.spec.ts`, `type-channels.spec.ts` | Root route, `.story-*` и сохранённые компоненты/контролы | Полезны в собственной области, не полная приёмка ReferenceJourney |
| `scripts/verify-v2.mjs`, `verify-v2-extra.mjs` и workflows `v2-vis002-*` | Исторические V2 suites со своими селекторами и release branch | Проверить соответствие текущему DOM перед повторным использованием; название не гарантия покрытия |
| `tests/visual-gate-v2.test.mjs`, `scripts/twin-system.test.mjs` | Поведение gate/validator на фикстурах | Unit PASS не является visual PASS сайта |

Для следующего runtime-изменения запускать текущий hero harness на собранном route и отдельную визуальную приёмку по актуальному fingerprint/reference; сохранять старые тесты в исходной области. Результаты команд WF-001 и независимого code review должен фиксировать итоговый RESULT, а не эта статическая карта.
