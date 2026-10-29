# Аудит веб-производства: Twin, PIN, GPT Work и Codex

29.10.2026. Проверены организация репозитория Twin, код/проверки и контракты навыков. Это не визуальная приёмка сайта и не измерение производительности.

## Вывод

Инженерная основа уже есть. Основной сбой — разные файлы рассказывают Codex о разных версиях проекта, а наличие навыков, успешной сборки и отчёта принимается за исполнение всего процесса. Нужны один источник состояния, реальные исполнения ролей, проверяемая передача и независимая приёмка.

Web Production становится главным координатором; Frontend Engineer подключается до производства графики как инженерный соавтор. Twin Site хранит правила конкретного проекта. PIN Web Concept System применяется только к PIN; универсальный метод Web Concept Studio не переносит его бренд в Talent.

## Проверенный срез GitHub

Репозиторий: [AURRRUS/twin-web-concept](https://github.com/AURRRUS/twin-web-concept).

| Ветка | Проверенный HEAD |
|---|---|
| work/hero-journey-original-render | 56905ee4030f25cf6e992e7c5049e63e373ddc3e |
| work/vis004-execute-20261028 | 3b5b38188e23b64ef51ceb0bb24791be0a1d8dad |
| work/twin-v2 | 62b293b6abe7196041a2573baacd139c312a80cc |
| main | 6d06f0930059bc453d77337722083f0c342b10dd |
| twin-preview | 96802e9739725fb9997ec73e5fbf90794194f7c4 |

Проверка branch heads повторена перед подготовкой WF-001. У candidate подтверждён успешный [Actions run 40762128082](https://github.com/AURRRUS/twin-web-concept/actions/runs/40762128082). Это не факт обновления live-сайта: ветка twin-preview относится к прежнему source 7436ce9. Live runtime и настройка Pages в этом аудите не проверялись.

## Найденные разрывы

| Приоритет | Подтверждённое наблюдение | Последствие и исправление |
|---|---|---|
| P0 | В candidate V2_START указывает VIS-003/work/twin-v2; project registry — VIS-004; фактическая новая задача — VIS-005. В main сохранён ещё более старый вход | Новая сессия может выполнить старое ТЗ. Один реестр и проверка фактической ветки; входные файлы только ссылаются на него |
| P0 | VIS-005/task.json разрешает рабочую публикацию; TASK/run/RESULT сохраняют запрет или отсутствие авторизации | Разрешение есть, но процесс противоречит сам себе. Разделить рабочий preview и финал, сохранить один канон авторизации |
| P0 | В GitHub TASK.md VIS-005 нет обещанного в переписке раздела 8; ENGINEERING.md не включён в sources | Сообщение в чате не стало наследуемым правилом. Внести явную ссылку и приоритет типографического канона |
| P1 | run VIS-005 не соответствует схеме production_next; VIS-004 использует ready вместо accepted и неявный пропуск слоя | Маршрутизатор не может достоверно продолжить работу. Версионировать схему и мигрировать фактические статусы |
| P1 | Контракт hero — 48/56.64; CSS и QA — 58/68 | Три независимых копии чисел. Один источник ролей/токенов и проверяемое наследование |
| P1 | Часть motion-тестов проверяет helpers, которые текущий ReferenceJourney не импортирует | Их PASS не принимает текущую сцену. Карта route→controller→contract→test |
| P1 | Web Production отсутствует в .agents; repo Twin Site и FE конкурируют за ведение; runtime-запуски агентов не закреплены | Роли существуют в тексте, но команда не воспроизводится. Обновить поставку, назначение и реальные execution records |
| P1 | Глобальный visual-review относится к старому VIS-003; новый VIS-005 честно имеет fix/self-review | Сохранить честный дефект; связать актуальный review с runtime/contract и отдельным проверяющим |
| P2 | Только artifacts/ содержит 618 tracked файлов, 482 765 210 байт | Основной вес — история evidence. Инвентаризировать зависимости и подготовить перенос истории, не удалять всё вслепую |

Размеры — сумма исходных blob-файлов рабочего дерева, не размер ZIP или clone. Дерево целиком: 1692 записи, из них 1508 файлов; около 693,7 MB незапакованных данных. Из наличия старого файла не следует, что он не используется.

Основные доказательства на закреплённом source:

- [V2_START.md](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/V2_START.md) и [.twin/v2/project.json](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/v2/project.json).
- [VIS-005/task.json](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/tasks/VIS-005/task.json), [TASK.md](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/tasks/VIS-005/TASK.md), [run.json](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/tasks/VIS-005/run.json).
- [visual-contract.json](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/tasks/VIS-005/visual-contract.json), [hero-journey.css](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/src/styles/v2/hero-journey.css), [verify-hero-journey.mjs](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/scripts/verify-hero-journey.mjs).
- [ReferencePage.tsx](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/src/components/v2/ReferencePage.tsx), [motion tests](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/tests/v2-motion.spec.ts), [source QA workflow](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.github/workflows/hero-journey-qa.yml).
- [AGENTS.md](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/AGENTS.md), [skill tree](https://github.com/AURRRUS/twin-web-concept/tree/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.agents/skills), [visual review](https://github.com/AURRRUS/twin-web-concept/blob/56905ee4030f25cf6e992e7c5049e63e373ddc3e/.twin/v2/visual-review.json).

## Что сохранить

Разделение V1/V2 и publish:v2, реальные шрифты/ассеты, измеримые визуальные контракты, порядок статика→адаптив→motion, native scroll и fallback, исторические evidence с их настоящей версией, честный отрицательный визуальный verdict. Не менять критерии, чтобы получить зелёный отчёт.

## Что усилено в поставляемых навыках

Web Production: единый контракт с FE, разные проектные приоритеты, память/handoff, операторские контрольные точки, представительская проба до серийной графики, реальные исполнители и reviewer, разные состояния preview/final. Маршрутизатор v2 учитывает scope, пропуски необязательных работ, свежесть записей и подтверждения; prepare больше не требует довести сайт до публикации.

Frontend Engineer: самостоятельный разбор сцены и заказа материалов, objectLock, источник/уверенность измерений, один канон типографики, общий canvas слоёв, mobile, проверка реального controller. Motion validator отклоняет строковое «четыре состояния», требует числовую партитуру и бюджет пути/времени.

Гиперреализм не равен фиксированному числу прогонов. Сохранение архитектуры проверяется отдельно, исходник и лучшая версия остаются доступны. Многопроходное усиление имеет план фрагментов и реальный лимит вызовов; сначала проверяется один образец в контексте сцены.

Проверки поставки: 17 regression tests Web Production, 7 Frontend Engineer; обе структуры skills валидны; локальные ссылки проверены; отдельный code review и отдельная сценарная проверка handoff. Найденный TypeError при неверном типе visual verdict исправлен и покрыт тестом. Это проверка инструкций/скриптов, не доказательство готовности всей фабрики или качества сайта.

## Отдельные ограничения PIN

Исходный репозиторий PIN среди доступных результатов текущего поиска не определён. Проверены предоставленные проектные документы и установленные визуальные методики; код PIN не аудировался.

В установленном PIN Web Concept System brand-profile остаётся v1.0 с разделами 1–7, тогда как приложенный PIN_VISUAL_WEB_PROFILE_v1_1_2026-10-15.md содержит патчи 8–9 от 15–16.10. Они касаются графитовых денежных/аналитических сцен, точного UI, оптики, логотипа и публичных формулировок. До PIN-пилота нужно синхронизировать этот профиль. Также старое разрешение свободно применять альтернативу должно уступать новому правилу владельца: показать сравнение и получить выбор. Текущая работа обновляет два основных навыка, не объявляет эти отдельные PIN-источники уже исправленными.

## Граница внедрения

Эта ветка поставляет обновлённые инструкции и готовое задание WF-001. Старые указатели и код сайта ещё не мигрированы. Следующий исполнитель выполняет TASK.md, проверяет восстановление контекста в новой сессии и возвращает результат. Затем — отдельные реальные пилоты Twin и PIN.

Возможности custom agents проверены по [официальной документации OpenAI](https://learn.chatgpt.com/docs/agent-configuration/subagents). Поддержка в конкретной сессии Codex всё равно проверяется фактическим запуском; инструкция не создаёт недоступный runtime.
