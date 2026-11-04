# WF-001 — фактические исполнители и среда

Завершение пакета: 01.11.2026. База GitHub: 981b95758c58b876e7a7c1e0092def5190e38579; source runtime: 56905ee4030f25cf6e992e7c5049e63e373ddc3e. Локальный Git — частичный текстовый snapshot для diff/tests, не полный clone; remote reads/writes выполняются GitHub connector. В бинарные исходники и runtime не вносились изменения.

| Фактический canonical ID | Роль и выход | Статус/evidence |
|---|---|---|
| /root/workflow_memory_fix | Отдельный исполнитель: state, входы, роли и Twin Site adapter | Файлы сохранены; итог интегрирован/проверен координатором. Сессия не используется как независимая приёмка |
| /root/workflow_contract_fix | Отдельный исполнитель: VIS-005 migration, typography, numeric motion | Файлы сохранены; финальный ответ прервался ограничением среды. Результат проверен координатором; не заявляется completed review |
| /root/workflow_qa_fix | Отдельный исполнитель: browser harness и CI | Сохранены scripts/verify-hero-journey.mjs и workflows; browser этой сессией не запускался |
| /root | Координатор, интеграция, JS validators/release guards, regression tests | Фактические команды и итог в RESULT.md; это авторская проверка |
| /root/workflow_final_review | Независимое code review, не автор реализации | CODE_REVIEW.md содержит замечания, исправления и повторную проверку |
| /root/workflow_resume_check | Новая сессия без истории: восстановление контекста; карта тестов и inventory | RESUME_CHECK.md, TEST_MAP.md, CLEANUP.md; отдельно от code/visual review |

Это реальные вызовы collaboration в GPT Work, а не переименованная последовательная самопроверка. ID записаны в форме, возвращаемой средой; другого opaque идентификатора нет. Среда поддерживает реальные подагенты, Node24/Python и GitHub connector. Команда codex в локальной среде отсутствует; загрузку custom .codex/agents/*.toml в отдельном Codex-клиенте здесь проверить нельзя. Непроверенные конфигурации не устанавливались. На новом клиенте Codex проверяет фактический запуск исполнителя/reviewer и сохраняет свои ID; существующие имена навыков не считаются работающими агентами.

Сайт не собирался и браузер не запускался: бинарные assets не скачивались, runtime не менялся. Генерация и deployment не запускались. Отсутствие визуальной приёмки сайта не закрывается code review этого пакета.
