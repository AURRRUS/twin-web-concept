# Контракт событий — план интеграции

Текущий config.integrations.analytics.enabled=false; действующего событийного слоя/SDK нет. В этой итерации внешний сбор не подключён. Ниже контракт будущей интеграции, а не уже собираемые данные.

- journey_scene_view: variant=4, scene=project/corpus/floor/lot; завершённое состояние видно≥1сек, уникально за визит.
- journey_nav_click: scene, input=pointer/keyboard.
- media_expand: scene, source_section=journey.
- demo_open: source_section=hero/product/channels/qualities; selection только публичные fixture IDs.
- channel_view: channel=site/online/agent/office, завершённое состояние видно≥1сек, уникально за визит.
- qualities_view: финальная схема, уникально за визит.
- contact_start: первый ввод, без содержимого.
- contact_demo_complete: локальная валидация завершена; не lead_sent.

Контакты, имена, введённые URL и тексты полей не включать. Будущая интеграция обязана учитывать действующую модель согласий. Конверсия/baseline/ROI не измерены; тест с3–5представителями аудитории не проводился и не выдаётся за исследование. Viewer/API и приём обращений остаются отдельными реальными зависимостями.
