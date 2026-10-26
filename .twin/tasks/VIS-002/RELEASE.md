# Отдельный выпуск V2
Разрешён preview только в /twin-web-concept/v2/. Основной сайт не переключать. Наличие этой папки ещё НЕ подтверждено: это target после реализации.
1. Исходники work/twin-v2, production route src/pages/v2/index.astro. Astro base=/twin-web-concept; все asset href через BASE_URL. V2 noindex, canonical не подменяет V1.
2. Не запускать существующий publish:preview: он заменяет root index и shared output. Сделать отдельный publish:v2 с fail-closed allowlist.
3. Build должен давать dist/v2/index.html; зависимости CSS/JS/fonts/media собирать в автономное dist/v2 subtree (перенос/переписывание ссылок build artifact допустимы с тестом). Все внутренние новые зависимости разрешаются внутри /v2/, viewer/demo может вести к существующему /demo. Не удалять shared /_astro или media V1.
4. Перед записью получить текущую twin-preview HEAD, создать свежий backup. Сохранить manifest sha256 ВСЕХ файлов вне v2/ и проверить после сборки нового deployment tree — ни одного изменённого/удалённого root/legacy asset. Не выполнять force push. При изменении HEAD остановить запись, fetch и пересобрать deployment поверх свежего Pages.
5. Копировать только подготовленное v2/; marker v2/build-version.json с version:v2, taskId:VIS-002, sourceCommit (коммит интерфейса, не старый V1), basedOnV1SourceCommit, previousPagesCommit, builtAt. Root build-version.json не менять.
6. Публиковать после проверок без согласования снимков. Дождаться Pages, сверить v2 marker и визуально новый маршрут; проверить старые root, demo, compare и загрузку их ассетов. Root marker прежний.
7. Rollback — удалить/вернуть только v2 subtree обычным новым deployment commit; не откатывать весь Pages к старому backup поверх чужих изменений.

В этом подготовительном пакете сайт не публикуется: нет реализованного v2/index.html. Исполнитель должен реализовать и проверить безопасный publisher, затем выпустить.
