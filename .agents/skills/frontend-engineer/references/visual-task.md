# Исполнимая визуальная задача
Заполнять исполнителю на основании источников, не перекладывать CSS-решения на владельца. Для мелкой правки достаточно затронутых полей; для redesign/reproduce использовать полную форму. Хранить в папке одной задачи.

1. Режим, цель, scope, актуальная ветка/commit, маршрут, публикация и сохранение других версий
2. Источники: референс с размером и состоянием, фактические тексты, токены/шрифты/ассеты, приоритет последних решений
3. Таблица изменений: элемент → сейчас → целевое расположение/размер → сохраняемая функция. «Сделать как на картинке» таблицу не заменяет
4. Сетка и якоря: viewport, контейнер, колонки, gaps, bbox групп; unit px либо доля секции, допуски и источник каждого значения
5. Типографические роли: файл/axis, weight, size, leading, tracking, measure, переносы и акценты по размерам
6. Слои: DOM/CSS/SVG/raster/viewer, путь, crop/focal point, z-order, поверхность/тени/границы/маски
7. Адаптив: reading order, смена layout, unpin, доступность всех состояний в низком окне
8. Motion: trigger, progress в расстоянии, фазы/holds, transform owner, once/reverse, click/keyboard, reduced-motion/fallback
9. Приёмка: измеримые якоря + масса/интервалы/первое внимание, недопустимые замены
10. Выпуск: существующий механизм, проверяемый URL/commit и ограничения. Снимки внутренние; соблюдать явно выбранные владельцем контрольные точки, не добавлять повторное согласование к уже разрешённому выпуску

## Форма JSON для scripts/check_visual_contract.py
Поля:
- mode: reproduce или redesign
- baseline: актуальный source commit; route: целевой путь
- reference: {path: реальный локальный файл, viewport:[width,height]}
- changes: [{element, before, after, implementation}]
- anchors: [{element, box:[x,y,width,height], tolerancePx, source:owner|measured-estimate|proposed}]
- typeRoles: [{role, file:реальный шрифт, weight:число, size:число, lineHeight:число, tracking:число, maxWidth:число}]
- layers: [{element, medium:dom|css|svg|raster|viewer, asset:путь для raster, fit:contain|cover для raster}]
- responsive: {mobile:правила, lowHeight:правила}
- motion: {changed:false, preserve:что сохраняется} либо {changed:true, contract:{driver:scroll|time|interaction,progress,phases,reverse,reducedMotion,exit}}. Для scroll: scrollDistancePx > 0 и resizeRule; для time: durationMs > 0. phases: [{start:0,end:0.2,kind:enter|hold|transition|exit,state:видимый результат,purpose:смысл}]. Все границы в [0,1], строго возрастают, фазы без пробелов/наложений покрывают [0,1]. Это общая временная шкала сцены; независимые анимации слоёв описывать дополнительно внутри фаз
- acceptance: [конкретный критерий суждения, …]
- publication: {allowed:boolean, reason:основание}

Числа обязан выбрать инженер по референсу и канону; не подставлять универсальные размеры из чужой темы. При изменении движения phases — массив диапазонов с началом, концом и содержимым кадра.
В производственном пакете также указать project profile, ревизию принятых решений, objectLock, scene/asset manifest и route→controller→test по [контракту команды](production-contract.md). Не превращать необязательные поля локальной правки в перепроектирование всей страницы. Старые строковые phases требуется развернуть в числовой контракт перед изменением motion; validator намеренно их отклоняет.
Скрипт проверяет заполненность, типы и доступность файлов. Он не проверяет красоту, честность baseline или фактическое соответствие макету.
