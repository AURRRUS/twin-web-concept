# Кодовые опоры
scripts/scene-progress.mjs — независимые чистые функции расстояние→progress→кадр, без wheel-lock, DOM и зависимостей. Проверка: node scripts/scene-progress.test.mjs. Подключать только если совместимо с текущим controller; не создавать второго владельца.
progressAt использует document scrollY и document hostTop. hostHeight — высота трека; panelHeight — фактическая высота sticky-панели. Resize пересчитывает геометрию. При travel<=0 переходить в обычный поток; значение функции не является командой pin.
frameAt содержит пример диапазонов каскада, не утверждённый motion Twin. Настроить phases/holds по заданию. Функция задаёт входы; переход между сценами и отсутствие readable text overlap реализовать отдельными масками/узлами и проверить в браузере.
Обычный scroll не блокировать. Слушатель passive; DOM writes через один rAF только при изменении progress; cleanup отменяет rAF и listeners. Геометрию не измерять в каждой записи.
Grid: container → текстовая колонка minmax(280px, .30fr), визуальная minmax(0,.70fr), gap из токена. Это пример пропорций, не новый канон. На узкой ширине менять поток, не сжимать desktop целиком.
Слои: внешний viewport overflow:hidden для медиа, внутренний transform для смены фото; entry-анимация принадлежит отдельному wrapper. У текста собственная mask, поэтому opacity двух читаемых абзацев не складывается.
CSS surface задавать по роли: paper/base, elevated-panel, active-bronze. Contact shadow и ambient shadow отдельно; не назначать одинаковую «премиальную» тень всем секциям.
