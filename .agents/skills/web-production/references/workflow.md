# Производство: роли и артефакты
| Этап | Ответственный | Выход |
|---|---|---|
| Цель/сценарий | product-creative-producer при открытой смысловой задаче | аудитория, содержание, CTA, ограничения |
| Концепт | web-concept-studio; ПИН — pinwebconceptsystem | выбранный reference, точные тексты, композиционные отношения |
| Инженерный разбор | frontend-engineer + code-motion | сетка, числовая типографика, слои, адаптив, фазы |
| Пробная сцена | frontend-engineer + графический исполнитель, ведёт web-production | один сложный образец desktop/mobile перед серией и решение владельца |
| Графика | исполнитель по image-routing.md | файлы, реальные размеры, alpha/стыки, сравнение качества |
| Пригодность графики | frontend-engineer как заказчик | acceptance crop/scale/anchor/alpha в сцене |
| Код | frontend-engineer / Codex | статика → адаптив → motion |
| Визуальная приёмка | design-review отдельным проходом | recapture/rebuild/fix/ready-for-owner-review и дефекты |
| Выпуск | frontend + web-production | сценарии, разрешённая публикация, точная версия, ограничения |

## Память одной задачи
TASK.md: цель/mode/scope/baseline/публикация.
content.json: точные тексты и источники.
visual-contract.json: reference+viewport/state, сейчас→целевое→способ, bbox/допуски, реальные шрифты/числовые веса/кегли/leading/tracking/measure, поверхности, responsive и motion.
asset-jobs.json: заказы графике.
run.json: стадии, обязательства и evidence.
review.json: reference/runtime/viewport/state, наблюдение, дефект, вердикт и независимость.
RESULT.md: изменения, проверки, URL/версия и ограничения.
Сохранять проектные форматы вместо дублей. Статус/хеш/скриншот не доказывают художественное качество.
Общие полномочия и контрольные точки — [контракт команды](factory-contract.md); текущие указатели/версии/память и Codex — [handoff](codex-handoff.md). Единственный общий координатор — Web Production; профильный адаптер хранит бренд и проектные пути.

## Заказ графики
id, scene, requester, producerSkill, purpose, sourcePaths, reference, protected, operation, targetCSSSize, targetPixels, alpha, anchor, crop, overscan, shadowMode, qualityReason, maxCalls, attemptsUsed, outputs, status, acceptedBy, observed.
Фронтендер заполняет заказ самостоятельно; «сделать красивее» не является спецификацией.
Для простой панели/линии/тени operation=css-svg, producerSkill=frontend-engineer, maxCalls=0.
Высокое разрешение выбирать по фактическому масштабу и дефекту, не автоматически для всех фотографий.

## Вопросы ответственных
Фронтендер: где главный вес, направляющие и группы; не сохранён ли старый layout вопреки redesign; сколько ролей типографики и необъяснимых отклонений; какой layer отсутствует?
Графика: что защищено; camera/свет/crop/alpha/стык; стало ли лучше при одинаковом масштабе; сохранена ли лучшая версия?
Reviewer: масса/интервалы/первое внимание/материал соответствуют reference; читаемы ли все states; нет ли маленькой картинки в пустом поле?
Координатор: есть ли у блокера ответственный; актуален ли review; не превышен ли бюджет; не выдумана ли независимость и готовность?

## Возвраты
Композиция → frontend/concept.
Маленький объект → сначала рамка/crop/прозрачные поля у frontend.
Недостаток реальных деталей → графика.
Шов/двойной объект/alpha → сборка layers.
15 случайных кеглей → канонические роли/CSS.
Scroll trap → frontend + code-motion.
Не закрывать дефект «адаптацией» без разрешающего решения. Существенное расхождение = rebuild, локальное = fix, неверный кадр = recapture.
Сайт пройти обычной прокруткой до footer, reverse/re-entry/resize, mobile/keyboard/reduced-motion и controls. Screenshot не доказывает плавность.

## Маршрутизация обязательств
Скопировать run-template.json в папку задачи. Команда: python3 <skill-root>/scripts/production_next.py <task>/run.json <project-root>.
Использовать schemaVersion=2 и явный targetStage. prepare завершается на brief/spec, review делает только review, execute идёт до заданного этапа. Скрипт не разрешает расширять scope. Старый run мигрировать по фактическим данным; не дорисовывать done для прохождения проверки.
taskEvidence ссылается на scope. stages содержит status/evidence; sample — доказательная проба перед серией assets. Для незатронутых sample/assets/responsive/motion допустим not-applicable с reason/evidence; обязательные asset jobs от этого не исчезают. Необязательный job: required=false, status=skipped, reason/evidence. Принятый job: status=accepted, outputs, acceptedBy, observed.
ownerCheckpoints: id, beforeStage, status, subjectFingerprint, approvedFingerprint, evidence. Для нового производства использовать точки шаблона; для локальной правки переиспользовать действующие решения либо записать not-applicable с причиной/источником. Нельзя выдумать согласование. После изменения предмета checkpoint становится stale.
agents: реальные {id, role, status, evidence}; implementer и review.reviewer ссылаются на разные завершённые запуски. review требует reference, evidence, runtimeFingerprint, contractFingerprint, verdict и список ID unresolved. Внешний проектный gate должен вычислять fingerprint по реальным входам; этот маршрутизатор проверяет только согласованность записей и доступность файлов. Имя/ID/boolean не доказывают истинность отчёта.
publication: kind=preview|final, allowed, evidence, runtimeFingerprint/contractFingerprint. Working preview с fix/rebuild возможен только при allowKnownDefects=true и явном acceptedDefects, покрывающем открытые defects. Вердикт сохраняется. Для final требуется ownerAcceptance approved на тот же предмет с evidence. Смена fingerprint требует сверки действующей авторизации, а не автоматического повторного вопроса владельцу.
Результат complete означает завершение записанного scope, не готовность всего сайта. Режим review может завершиться с fix; он не даёт разрешения на исправления или выпуск. Отсутствие evidence публикации оставляет обязательство release открытым.
Агент исполняет доступные шаги; скрипт только определяет следующего ответственного. Нет API внешнего Codex или imagegen — сохранить конкретный заказ/блокер и подготовить передачу, не имитировать вызов.
Полный прогон один раз на candidate, после правки повторять затронутое. Согласование затрат требуется только по правилам выбранного режима, если авторизация ещё не дана. Согласование снимков не добавлять автоматически.
