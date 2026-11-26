# REL-001 — Twin на twin.bytalent.ru

Запрос владельца 2026-11-26: production-перенос Motion Preview на собственный домен.

- Источник: `twin-preview` @ `d9ff0f1`, файл `v2/motion-preview/index.html` (blob `97528313`).
- Работа только в `release/twin-bytalent-domain`. `twin-preview` и `main` не меняются; точка отката — `backup/twin-preview-before-domain-release-20261126`.
- Хостинг: кластер (ArgoCD `twin-bytalent`, ветка `infra/twin-bytalent`), не GitHub Pages. DNS `twin.bytalent.ru → 85.193.82.51` и HTTPS уже работают; GitHub Pages остаётся превью `twin-preview`.
- Объём: главная = Motion Preview без редиректа; пути без `/twin-web-concept/`; canonical, og:url, robots.txt, sitemap.xml; юридические страницы с адресом домена; стык видеоблока «Twin в действии».
- Не менять: тексты, композицию, медиа, 3D-двойник, логику формы (бэкенд не подключать), юридическое содержание.
