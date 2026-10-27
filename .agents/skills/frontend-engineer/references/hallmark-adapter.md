# Использованные методы и границы
Источник: https://github.com/nutlope/hallmark
Зафиксированная версия: 7ec868225c6caa040558c321ee0fefa0e73f83a8
Изучены SKILL.md, references/comp.md, layout.md, review-finish.md, scroll-choreography.md.
Адаптированы: comp→code, инвентаризация medium каждого региона, сравнение mass/interval/entry, отдельный verdict rebuild/fix/recapture, крупный визуальный вес, различие технической проверки и визуального суждения.
Лицензия upstream MIT сохранена в hallmark-license.txt. Это компактный адаптер, а не полная установка Hallmark. sloplint, theme dealer, фотокаталог, Together imagegen и hooks не установлены и не считаются выполненными.

Дополнительно изучен Impeccable: https://github.com/pbakaus/impeccable
Версия: d34c87e1a00989ae8dbdd7f6b30b70f23319e860, .agents/skills/impeccable/SKILL.md.
Методические выводы: brief выше личного вкуса; refinement сохраняет мир, redesign меняет его; Persuade и Operate требуют разной выразительности; смотреть реальный rendered result и объединять исправления.
Impeccable CLI и команды не установлены. Не заявлять запуск typeset/polish/critique без реального инструмента.

## Явные отличия от upstream
- Существующий бренд выше внешней темы: бронзовые акценты заголовков Twin сохранять
- Не навязывать случайную тему, другие шрифты, запрет рубрик или универсальные размеры
- Несколько согласованных scroll-сцен допустимы: владелец выбрал Journey и stack каналов. Не переносить лимит одной сцены Hallmark как закон
- Текущий code-motion отвечает за progress/reverse/holds/cleanup; браузер — через разрешённый навык текущей среды
- Built-in ImageGen допустим; Together API key не нужен для уже имеющегося референса
- Согласование макетов не добавляется, когда направление выбрано и публикация разрешена
- Не делать CSS append-only: исправлять каноническую реализацию вместо накопления overrides
- Не импортировать их автоматические PASS как доказательство художественного совпадения

Читать эту заметку при использовании Hallmark/Impeccable или конфликте правил; остальные задачи не требуют перечитывать внешний корпус.
