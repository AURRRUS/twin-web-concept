# Публикация и фактическая онлайн-проверка

- Сайт: https://aurrrus.github.io/twin-web-concept/
- Production sourceCommit: `ccce17dacd1481a4f32f4931df4d7a63ca978d90`.
- Deployment commit: `7059cc28dfc2499f81d0159db9db3d2967e76d99`.
- GitHub Pages workflow: https://github.com/AURRRUS/twin-web-concept/actions/runs/39979259659 — success.
- build-version.json реально вернул новый sourceCommit. `TWIN_EXPECTED_COMMIT=ccce17dacd1481a4f32f4931df4d7a63ca978d90 npm run verify:online` — PASS.

## Computed styles опубликованной страницы,1440×900

| Элемент | Фактические параметры |
|---|---|
| Journey H2 | Twin Dewi Expanded / реальный Black900;60px; line-height68.4px; letter-spacing0; font-synthesis:none; transform:none |
| Прочие H2 | Black900;46px; line-height53.36px; tracking0 |
| Все3описания Journey | Inter Tight450;18px; line-height27.9px; letter-spacing0.27px (.015em); ровно2строки, высота55.78px |
| Карточки Composition | Заголовки Inter60020px/27px; описания Inter45016px/24px |
| Composition: заголовок+схема |744.84px при900px высоте viewport, запас более64px |
| Delivery | position:static; host/panel768.33px; нет420svh, sticky или отдельной пустой высоты |

## Реально пройденные сценарии

-28 промежуточных DOM-кадров Journey туда/обратно: непересекающиеся маски title/body, opacity текста только0/1; старое изображение сохраняется, постоянный z-rank. Проверена геометрия кириллицы реального Black.
- Повторный вход после полного выхода снизу: новый каскад, состояние Лот. Частичный проход не перезапускает.
- Однократный временной треугольник:22 живых промежуточных замера, завершение на1.0000/Эффективно, все факты видимы. Возврат сохраняет complete, высота не меняется.
- Матрица1920×1080/1440×900/1363×936/1280×800/1366×768/1280×720/1024×768/768×1024/390×844/360×740/320×844. На desktop от1280 описания ровно2строки. Проверены computed styles, габариты Composition, отсутствие горизонтального скролла и висящих коротких слов.
- Reduced-motion: desktop-композиция с кнопками, читаемый окончательный треугольник.
- Диалоги оригинальных картинок/компонентов, каналы, выбор и переход в /demo работают.
-5ключевых изображений совпали с исходными SHA256-ревизиями. ШрифтыHTTP200. Ошибок JS и HTTP4xx/5xx в проверке нет.
- Снимки из artifacts/repeat-layout/online сделаны именно с опубликованной страницы и просмотрены.

Полные численные результаты: [online-verification.json](../../artifacts/online-verification.json). Скриншоты: [online](../../artifacts/repeat-layout/online).

Safari/iOS и реальные устройства не проверены. Backend формы/настоящий viewer остаются неподключёнными, это отражено на сайте. Отдельное согласование не требовалось: публикация прямо разрешена владельцем.

Этот отчёт — отдельный commit доказательств; frontend после указанного production sourceCommit не изменялся.
