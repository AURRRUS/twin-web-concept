# Twin V2 — проверка и выпуск

Актуальный порядок WF-001, 01.11.2026. Вход — `.twin/state.json`; требования evidence — `.twin/v2/visual-requirements.json`. Историческая версия этого документа сохранена в `.twin/tasks/WF-001/QUALITY.legacy.md` и не назначает текущего проверяющего/задачу.

## Раздельные результаты
Technical PASS проверяет сборку/поведение. Visual verdict описывает соответствие reference и остаётся fix при открытых дефектах. Owner acceptance — отдельное решение владельца. Deployment — отдельный факт с source/Pages SHA и проверкой URL. Ни один из этих статусов не подменяет другой.

## Рабочий цикл
1. Восстановить задачу, scope и решения из реестра. Профиль и типографика V2 наследуют ENGINEERING и `profiles.v2.typographySource`; V1 не переносить в V2.
2. Подготовить слои и статичную сцену, затем адаптив и motion. Сохранять объект/архитектуру. Отсутствующий cutout записать как job; CSS feather не закрывает точную alpha-маску.
3. Перед серийной графикой предъявить один сложный образец в контексте; ранее принятые решения не спрашивать заново.
4. Проверить актуальный route/controller, обычную прокрутку, выход из сцены, reverse/re-entry, resize, mobile, клавиатуру и reduced-motion. Старый helper-test не является проверкой ReferenceJourney.
5. Передать фактический candidate независимому reviewer. Reviewer заполняет файл по `reviewPath` в requirements; исторический `.twin/v2/visual-review.json` не является текущей приёмкой. Автор не принимает себя под новым именем.
6. После исправления повторить затронутые проверки. Не запускать полную матрицу ради неизменного runtime и нового Markdown. После двух неудачных визуальных итераций изменить диагностику.

## Evidence contract
В актуальном review нужны реальные implementer/reviewer ID, отдельные completed records с evidence, independent=true, inputFingerprint и contractFingerprint. Для каждого id из requirements: referencePath/referenceSha256, observed, remaining, evidence[{path,sha256,viewport:[w,h],state}]. Motion — минимум три разных кадра, но сами кадры не доказывают движение: приложить результат пользовательского ввода. Не использовать reference как screenshot.
`node scripts/visual-gate-v2.mjs --fingerprint` вычисляет SHA по фактическим runtime-файлам (src/public, fonts, package/lock/config, контент и build). Контракт хешируется отдельно; reference проверяется по каждому критерию. Изменённые входы делают прежний review stale. Валидатор проверяет согласованность/evidence, но не истинность наблюдений или существования указанного агента.
`npm run quality:v2` требует текущего визуального pass без открытых проблем. Исторические отчёты сохраняются и не исправляются задним числом.

## Публикация
Разрешение candidate берётся только по `publicationAuthority.source`, проекции в run/visual-contract сверяются автоматом. Текущая workflow-задача имеет собственный scope: настройка workflow не запускает публикацию сайта.
`npm run publish:v2 -- --kind=preview` проверяет scope, авторизацию, свежесть независимого review и список явно разрешённых для просмотра defects. Разрешённый preview может сохранить verdict=fix; никакой подмены на pass. `--kind=final` требует отдельного final-разрешения и свежего ownerAcceptance с evidence. Ни одна команда не обходит технические проверки и сохранение V1.
После разрешённого выпуска проверить live URL и build-version; Git push не равен deploy. Согласование каждого screenshot с владельцем не добавляется.

Для preview исключение незавершённого asset job допустимо только по точной паре jobId/defectId в task.publication.assetExceptions, совпадающей с acceptedDefects и текущим review.unresolved. Publisher строит временное представление обязательств для маршрутизатора; исходный job остаётся blocked, visual verdict остаётся fix. Другие jobs/stages, независимость, свежесть и evidence обязательны. Для final исключение не применяется.
