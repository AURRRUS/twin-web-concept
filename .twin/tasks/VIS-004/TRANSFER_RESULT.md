# VIS-004 — сохранение переданных исходников
28.10.2026. Это перенос без изменения дизайна и без публикации сайта.

База:102bda11a11289ea93a98d0be3e6ca358a3b2b6f (work/vis004-recovery-20261027).
Исходная сборка пакета:432544c8771dda828b2b1ec9014768d68e457da7.
Перенос: c384ec8b7eab5a4558d80b4c2049cbebde4366a8 в work/vis004-execute-20261028.

Все75файлов из трёх RAR перенесены с исходными путями и скрытыми каталогами, без удаления остальных файлов базы. Локально SHA256 совпал с предоставленным TRANSFER_MANIFEST.json для75/75. Затем GitHub runner клонировал ветку (checkout fetch-depth0) и заново вычислил SHA256 всех75файлов:75/75 совпали с манифестом. Удалённые Git blob IDs также совпали. Оригиналы изображений включены.

Проверки GitHub Actions40753020186: npm ci PASS; npm run typecheck PASS; npm run build PASS. Логи:https://github.com/AURRRUS/twin-web-concept/actions/runs/40753020186 .
Дополнительно сохранён только технический workflow .github/workflows/vis004-transfer-check.yml и этот отчёт. Архивы и служебный TRANSFER_MANIFEST.json не коммитились. Переданные75файлов не редактировались, включая исходные TASK/ENGINEERING/REVIEW/RESULT.

Прямой clone локального терминала не сработал: Failed to connect to proxy port8080. Запись выполнена штатным GitHub connector; полноценный clone и сборочные команды выполнены GitHub runner. Force push/reset не использовались.

Это технически проверенное сохранение HTML-примерки на Astro+React+TypeScript, а не визуальная приёмка. Существенные расхождения с референсами остаются; дизайн не принят владельцем. Реальная отправка заявок и viewer не подключены. Публикация не выполнялась; ветки V1, work/twin-v2 и Pages не обновлялись.
