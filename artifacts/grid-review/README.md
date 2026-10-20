# Снимки до и после — общая сетка Twin

До: `9262dc5629d46d848faee1ba258c2928214ff9cd`. После: CSS из этой ветки. Chromium, масштаб 1, desktop высота 1000 px, 390/768 — 900 px. Снимки получены локально; сайт не публиковался.

| Ширина | Главная до | Главная после | Hero до | Hero после | Демо до | Демо после |
|---|---|---|---|---|---|---|
| 1280 | [до](before/1280/home.png) | [после](after/1280/home.png) | [до](before/1280/hero.png) | [после](after/1280/hero.png) | [до](before/1280/demo.png) | [после](after/1280/demo.png) |
| 1440 | [до](before/1440/home.png) | [после](after/1440/home.png) | [до](before/1440/hero.png) | [после](after/1440/hero.png) | [до](before/1440/demo.png) | [после](after/1440/demo.png) |
| 1920 | [до](before/1920/home.png) | [после](after/1920/home.png) | [до](before/1920/hero.png) | [после](after/1920/hero.png) | [до](before/1920/demo.png) | [после](after/1920/demo.png) |
| 390 | [до](before/390/home.png) | [после](after/390/home.png) | [до](before/390/hero.png) | [после](after/390/hero.png) | [до](before/390/demo.png) | [после](after/390/demo.png) |
| 768 | [до](before/768/home.png) | [после](after/768/home.png) | [до](before/768/hero.png) | [после](after/768/hero.png) | [до](before/768/demo.png) | [после](after/768/demo.png) |

## Детали на 1440 px

| Блок | До | После |
|---|---|---|
| Центральная модель | [до](before/1440/composition.png) | [после](after/1440/composition.png) |
| Треугольник и этапы | [до](before/1440/delivery.png) | [после](after/1440/delivery.png) |
| Каналы | [до](before/1440/channels.png) | [после](after/1440/channels.png) |
| Форма | [до](before/1440/form.png) | [после](after/1440/form.png) |
| Сцена: проект | [до](before/1440/scene-project.png) | [после](after/1440/scene-project.png) |
| Сцена: пространство | [до](before/1440/scene-space.png) | [после](after/1440/scene-space.png) |
| Сцена: лот | [до](before/1440/scene-lot.png) | [после](after/1440/scene-lot.png) |
| Сцена: обратный проход | [до](before/1440/scene-reverse.png) | [после](after/1440/scene-reverse.png) |

## Проверки

[Геометрия до](before-metrics.json) · [Геометрия после](after-metrics.json) · [Интерактивные проверки на пяти ширинах](actions.json) · [10 существующих тестов](test-results.json) · [SHA-256 снимков](screenshots-sha256.json)

Значения `overflow` в исходной диагностике перечисляют также намеренно выходящие SVG и декоративные соединители. Проверка горизонтального переполнения документа отдельно прошла на всех пяти ширинах и на странице демо.
