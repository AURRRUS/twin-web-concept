# Сохранённая база и возврат

До изменения исходников рабочая директория была чистой. Отправлены две отдельные резервные ветки, существующие ссылки не перемещались:

- [Исходники](https://github.com/AURRRUS/twin-web-concept/tree/backup/before-final-handoff-2026-10-23), commit4207d1c3e60493fef4e5629c2ba8bccf7f030b6b.
- [Готовая прежняя сборка](https://github.com/AURRRUS/twin-web-concept/tree/backup/pages-before-final-handoff-2026-10-23), deployment8a5813f2ac2bfed98962c617e6867e67f3baa3c4.
- Прежний production sourceCommit8ad56176929f7d27f373fc7164202ff3456795bf. Его [build-version](PREVIOUS_BUILD_VERSION.json) сохранён дословно; исходники/сборка различались только последующим отчётом.

Для повторной публикации прежней версии использовать отдельный worktree и обычный publisher, который сохраняет историю twin-preview. Этот пример — инструкция возврата, сейчас он НЕ выполнялся:

```sh
git worktree add /tmp/twin-before-final-r2 8ad56176929f7d27f373fc7164202ff3456795bf
cd /tmp/twin-before-final-r2
npm ci
npm run build:preview
npm run publish:preview
```

Затем проверить sourceCommit в https://aurrrus.github.io/twin-web-concept/build-version.json и реальную страницу. Backup-ветки не передвигать, не применять reset --hard или force-push. Исходная готовая сборка доступна в резервной ветке независимо от возможности заново собрать зависимости. Новая работа находится в codex/twin-final-r2 поверх сохранённой4207d1c; репозиторий не заменялся архивом.
