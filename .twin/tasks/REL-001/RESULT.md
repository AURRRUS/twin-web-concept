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

## Дополнительные проверки (2026-11-26)
- Попиксельное сравнение исходника (`twin-preview`, `/v2/motion-preview/`) и релиза при прокрутке всей страницы, 1920×1080, 1440×900, 1024×768, 768×1024, 390×844, 360×800 (iframe 3D исключён): на десктопе отличается только левое крыло видеоблока, на телефонах — только блок формы и всё ниже него (страница длиннее на 51px из-за подсказки под кнопкой).
- Меню на телефоне: открывается, ссылка ведёт к разделу и закрывает меню — как в исходнике.
- Карточки каналов: на 390×844 свайпы переключают 0→1→2→3 и отпускают страницу дальше; на 1440×900 колесо и кнопки переключают карточки. Последовательности совпадают с исходником.
- Сдвиги при загрузке (CLS, без прокрутки): 1440×900 — 0,065 (текст и кнопки первого экрана при подмене шрифта, `font-display: swap`; в исходнике 0,067); 390×844 — 0. Порог «хорошо» у Google — 0,1.
- 3D: iframe разрешает полноэкранный режим (`allow="fullscreen"`, `allowfullscreen`), запрос полного экрана изнутри срабатывает. Своей кнопки полного экрана у встроенного приложения нет. Верхние ~49px iframe (шапка приложения) срезаны намеренно (`twin-embed-v1.css`).
- Карточка ссылки: Telegram, Facebook, WhatsApp, Twitter, VK, Яндекс и Google получают 200 и полный набор og/twitter-тегов; og:image `hero.webp` отдаётся (200, image/webp, 2574×1459, 841 КБ). opengraph.xyz: карточка строится (картинка, домен, заголовок), картинка грузится; предупреждения — пропорции 2574×1459 (1,76:1 вместо 1,91:1, возможна обрезка) и description 157 символов (в превью на телефонах видно ~125). Описание по ТЗ не менялось.
- Заголовки: один H1, порядок H1 → H2 → H3 верный.

## Старая копия на GitHub Pages (решение 2026-11-26)
На `aurrrus.github.io/twin-web-concept/` корень (старый V1), `/journey-craft/` и `/journey-craft/review.html` были открыты для индексации и могли конкурировать с доменом. По решению владельца релиза в `twin-preview` им добавлен `noindex` (коммит `ebac29c`), в release-ветке — `review.html` (остальные уже были закрыты). Проверено после сборки Pages: на github.io все HTML-страницы отдают noindex, на домене открыта только главная. Важно: `npm run publish:preview` из `work/twin-site-system` перезаписывает корневой `index.html` превью — после следующей публикации V1 `noindex` на корне пропадёт, если не добавить его в исходник V1. Файлы `.md` в `.twin/` и `docs/` на GitHub Pages остаются доступны (мета-тег к ним не применим).

## Дубли заголовков и картинка превью (решение 2026-11-26)
- Подписи «Покупателю / Команде продаж» в Journey (8 в скрытой копии для замеров + 8 в панелях состояний) и 7 названий в скрытой текстовой версии состава (`details.composition-descriptions`, display:none) больше не `h3`, а `div.r4-journey-audience` и `div.composition-desc-title`. Правила стилей этих `h3` повторены в `v2/enhancements/heading-labels-v1.css` в том же порядке (`h3` → `:where(.класс)`, умолчания браузера для `h3` — в слое). Анимация подписей в бандле переведена на новый класс.
- Изменённые бандлы сохранены под новыми именами (`ReferencePage.mobile-v5.js`, `ContactForm.composition-v3.js`), потому что `/v2/_astro/` кешируется как immutable; старые файлы не тронуты. Правка в HTML главной и `/v2/motion-preview/` (общие бандлы).
- Проверка: вычисленные стили и положение всех 23 элементов совпадают с прежними `h3` на 9 размерах и во всех 4 состояниях Journey (1035 сравнений, 0 расхождений); попиксельная прокрутка 1440, 1280, 1024, 390, 360 — без различий; ошибок гидратации и консоли нет; меню, каналы, форма, окно состава работают. В HTML осталось 26 заголовков без повторов (было 49).
- Превью ссылки: `og:image` и `twitter:image` — `v2/media/top-v2/og-1200x630.jpg`, та же утверждённая `hero.webp`, обрезанная по центру до 1,91:1 (по 54px сверху и снизу) и уменьшенная до 1200×630, JPEG 164 КБ; добавлены `og:image:type`, `og:image:width`, `og:image:height`. Описание (157 символов) не менялось — по ТЗ.
- На домене (коммит `1e59c57`): картинка превью 200 image/jpeg, в HTML 26 заголовков без повторов, на 1440 и 390 без ошибок консоли и горизонтального скролла. opengraph.xyz: ошибок 0 (было 1), «1200×630 — matches what every major platform expects»; остались два предупреждения — длина описания (по ТЗ не меняется) и совет добавить на картинку рекламный текст (не делали: это новый визуальный материал).

## «Эффективно» и карточка превью (решение 2026-11-26)
- Третья карточка качеств: в HTML и бандле теперь «Эффективно» (было «Эффектно»; без JS и для поисковиков). Анимация `emblem-v5.js` сама собирает слово «Эффект[ив]но» и, как раньше, на десктопе при прокрутке превращает «Эффектно» в «Эффективно»; на телефоне сразу «Эффективно». Бандл — `ReferencePage.mobile-v6.js` (кеш immutable). Попиксельно 1440 и 390 — без различий.
- Превью ссылки: `og-card-1200x630.jpg` — карточка 1200×630 с заголовком страницы, кнопкой «Посмотреть Twin →» (текст кнопки сайта) и утверждёнными логотипом и фото, шрифты и цвета сайта; добавлены `og:image:alt` и `twitter:image:alt`. `og:description` и `twitter:description` — 118 символов: «Цифровой двойник девелоперского проекта: интерактивная презентация, подбор лотов и продажи на сайте, онлайн и в офисе.» Описание для поиска (`meta description`) прежнее.
- На домене (коммит `d7278b0`): opengraph.xyz — 0 ошибок, 0 предупреждений, 12 проверок пройдено; карточка 200 image/jpeg 137 КБ; в HTML «Эффективно»; на 1440 и 390 без ошибок консоли и горизонтального скролла.

## Найдено, не исправлено (нужно решение)
- На реальных устройствах (iPhone Safari, safe-area) и в самих мессенджерах не проверялось.

## Файлы
Создано (12):
- `.twin/tasks/REL-001/RESULT.md`
- `.twin/tasks/REL-001/SEARCH_CONSOLE.md`
- `.twin/tasks/REL-001/TASK.md`
- `.twin/tasks/REL-001/screens/film-after-1440.png`
- `.twin/tasks/REL-001/screens/film-before-1440.png`
- `robots.txt`
- `sitemap.xml`
- `v2/_astro/ContactForm.composition-v3.js`
- `v2/_astro/ReferencePage.mobile-v5.js`
- `v2/_astro/ReferencePage.mobile-v6.js`
- `v2/enhancements/heading-labels-v1.css`
- `v2/media/top-v2/og-card-1200x630.jpg`

Изменено (42):
- `_astro/App.QVf-QQ1Q.js`
- `_astro/inter-tight-variable.CDPOEas9.css`
- `build-version.json`
- `demo/index.html`
- `index.html`
- `journey-craft/index.html`
- `journey-craft/review.html`
- `v2/_astro/ContactForm.B53is37X.js`
- `v2/_astro/ContactForm.composition-v2.js`
- `v2/_astro/ContactForm.legal-v1.js`
- `v2/_astro/ReferencePage.connect-v1.js`
- `v2/_astro/ReferencePage.connect-v2.js`
- `v2/_astro/ReferencePage.footer-legal-v1.js`
- `v2/_astro/ReferencePage.footer-v1.js`
- `v2/_astro/ReferencePage.glass-v1.js`
- `v2/_astro/ReferencePage.launch-type-v1.js`
- `v2/_astro/ReferencePage.launch-v3.js`
- `v2/_astro/ReferencePage.mobile-v1.js`
- `v2/_astro/ReferencePage.mobile-v2.js`
- `v2/_astro/ReferencePage.mobile-v3.js`
- `v2/_astro/ReferencePage.mobile-v4.js`
- `v2/_astro/ReferencePage.morph-v1.js`
- `v2/_astro/ReferencePage.release-v1.js`
- `v2/_astro/index.56Q9_F5-.css`
- `v2/_astro/inter-tight-variable.CDPOEas9.css`
- `v2/consent/index.html`
- `v2/enhancements/channels-polish-v1.css`
- `v2/enhancements/contact-legal-v2.js`
- `v2/enhancements/emblem-v1.css`
- `v2/enhancements/mobile-completion-v1.css`
- `v2/enhancements/mobile-completion-v1.js`
- `v2/enhancements/mobile-completion-v2.js`
- `v2/enhancements/mobile-request-v1.js`
- `v2/enhancements/portal-scene-v2.css`
- `v2/enhancements/qualities-glass-v1.css`
- `v2/enhancements/qualities-v1.css`
- `v2/enhancements/release-polish-v1.css`
- `v2/index.html`
- `v2/legal/index.html`
- `v2/motion-preview/index.html`
- `v2/motion-preview/legal.html`
- `v2/privacy/index.html`

## Открытые вопросы
- Google Search Console и Яндекс Вебмастер — нужен владелец аккаунтов; инструкция в `SEARCH_CONSOLE.md`.
