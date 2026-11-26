# REL-001 — результат

## Изменения в release-ветке
- `index.html` — копия Motion Preview: без noindex, canonical и og:url `https://twin.bytalent.ru/`, OG/Twitter image на домене, JSON-LD WebSite с издателем — существующей Organization (`@id` `https://bytalent.ru/#organization`).
- Префикс `/twin-web-concept/` и адрес `aurrrus.github.io` убраны из 37 файлов: HTML, `v2/enhancements`, юридические страницы, собранные Astro (`_astro`, `v2/_astro`, включая базу `` `/twin-web-concept` ``).
- `v2/motion-preview/` остаётся резервной страницей с noindex. `/v2/`, `/demo/` — noindex как было; `/journey-craft/` получил noindex.
- `v2/motion-preview/legal.html` ведёт на `/v2/privacy/`. Privacy, consent, legal: адрес сайта `https://twin.bytalent.ru/`, шапка ведёт на главную, noindex сохранён, текст документов не менялся.
- `robots.txt`, `sitemap.xml` (только главная).
- Видеоблок: «боковое изображение» — левое крыло `.r4-film-wing-left` (`architecture-wings.webp`, добавляет `portal-scene-v2.js`). На десктопе оно было поднято на 12px (`translateY(-12px)`) и заканчивалось выше нижней границы блока. Сдвиг убран, остальное без изменений. На ≤1099px сдвига не было.

## Проверка (локально, nginx как в кластере)
- 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 490×375, 390×844, 375×812, 360×800: нет ответов 4xx/5xx, ошибок консоли и шрифтов, горизонтального скролла, запросов к старому адресу; один видимый H1.
- Нижний край левого крыла = нижний край блока на 1920/1440/1366/1280 (было на 12px выше); 1024 и 390 не менялись.
- Видео: MP4 отдаётся (206, video/mp4), poster, playsinline, своя кнопка воспроизведения.
- 3D: iframe `3dagoi.bytalent.ru/?view=3d&viewpoint=01a143c5-…` отвечает 200, allow fullscreen.
- Форма на десктопе: валидация и письмо через mailto на bytalentru@gmail.com, ссылки на согласие и политику.
- Обход: 124 адреса, ссылок на старый адрес нет. 404 только у старой страницы `/journey-craft/` (`_astro/App.B2c2DZ0o.js`, `_astro/inter-tight-variable.D_4iulR6.css`) — так же на GitHub Pages.

## Проверка на домене (2026-11-26, после переключения git-sync, infra `f1da105`)
- `http://` → 308 на `https://`; сертификат Let's Encrypt (CN twin.bytalent.ru) до 24.02.2027.
- `/` 200: canonical и og:url `https://twin.bytalent.ru/`, robots не запрещает, ссылок на старый адрес 0. `robots.txt` и `sitemap.xml` 200, XML валиден.
- noindex: `/v2/motion-preview/`, `/v2/privacy/`, `/v2/consent/`, `/v2/legal/`, `/v2/`, `/demo/`, `/journey-craft/`. `legal.html` → `/v2/privacy/`.
- `/.git/config`, `/.twin/…`, `/docs/…` — 404.
- Те же браузерные проверки на 10 разрешениях, что и локально: без 4xx/5xx, ошибок консоли, горизонтального скролла и запросов к старому адресу.
- Видео в Chromium с H.264: воспроизводится, 1280×720, 3:29. 3D iframe 200. Форма на десктопе — mailto.
- Левое крыло: нижний край = нижний край блока (1440×900). Скриншоты: `screens/film-before-1440.png`, `screens/film-after-1440.png`.
- GitHub Pages (`twin-preview`) не изменился.

## Форма на телефоне (решение 2026-11-26)
В Motion Preview на ≤767px форма показывала «Спасибо за обращение» при любом вводе, включая пустой, и ничего не отправляла. По решению владельца релиза телефон работает как десктоп: та же проверка полей, письмо через mailto на bytalentru@gmail.com, видны подсказка «Откроется ваш почтовый сервис…» и запасная ссылка на письмо. Кнопка — «Подготовить запрос», как на десктопе. Изменены `mobile-completion-v2.js` (убрано демо-окно), `contact-legal-v2.js` (mailto и на телефоне), `mobile-completion-v1.css` (подсказка и результат не скрываются). Проверено на 1440, 768, 490×375, 390, 375, 360: ошибки при пустой форме, переход на mailto при заполненной, без горизонтального скролла.

## Открытые вопросы
- Google Search Console и Яндекс Вебмастер — нужен владелец аккаунтов.
