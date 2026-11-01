# Производство Twin — адаптация общего процесса

Главный координатор — [Web Production](../../web-production/SKILL.md). Frontend Engineer выполняет инженерный разбор и реализацию, Twin Site обеспечивает источники и ограничения проекта. Канонический [контракт команды](../../web-production/references/factory-contract.md), [workflow](../../web-production/references/workflow.md) и [handoff Codex](../../web-production/references/codex-handoff.md) не копируются сюда.

Вход Twin: AGENTS.md → .twin/START.md → .twin/state.json. Workflow-задача, site candidate, V1/V2, исходная и опубликованная версии — разные поля единого реестра. Scope задачи определяет, что разрешено исполнять. Текущие TASK/contract/review и решения выше исторических инструкций.

Для V2 читать действующую типографическую ссылку из реестра, ENGINEERING в наследуемой области, источники выбранного рендера и открытые дефекты. Не заменять архитектуру или полный рендер без решения владельца. Бренд ПИН не переносить.

Для нового запуска скопировать [канонический run-template.json](../../web-production/references/run-template.json), заполнить schemaVersion=2, mode/targetStage и реальное evidence. `twin-site/references/run-template.json` — только указатель на канон, не шаблон запуска. CLI compatibility wrapper `twin-site/scripts/production_next.py` выполняет маршрутизатор Web Production; новой логики в нём нет. Старые run мигрировать по фактическим данным, без фиктивных accepted/done.

Графические заказы, контрольная проба до серии, objectLock, проверка слоёв в сцене и числовой motion — общий контракт. Проектные примеры слоёв: docs/v2/ASSET_PRODUCTION_PLAN.md; наличие плана не означает готовность файлов. Публикационная авторизация candidate читается по publicationAuthority.source; инфраструктурная задача не публикует сайт. Финал утверждает владелец после команды.
