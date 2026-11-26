# SEO-001 — результат

- `src/pages/index.astro`: в `<head>` добавлен `<meta name="robots" content="noindex" />`. Больше ничего не менялось.
- Проверки: `npm run typecheck` PASS; `TWIN_BASE_PATH=/twin-web-concept npm run build` PASS — `dist/index.html` и `dist/demo/index.html` содержат robots noindex; `npm run twin:test` 14/14 PASS; `npm run twin:check` PASS.
- Публикация не выполнялась: опубликованная копия уже закрыта тем же тегом (twin-preview `ebac29c`). Следующий `npm run publish:preview` сохранит запрет.
- `journey-craft` не входит в сборку V1; его noindex живёт только в twin-preview и publish:preview его не трогает.
