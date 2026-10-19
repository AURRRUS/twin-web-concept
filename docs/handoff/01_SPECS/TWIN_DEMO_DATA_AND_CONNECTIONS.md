---
document_id: TWIN_DEMO_DATA_AND_CONNECTIONS
version: "1.2"
updated: "2026-10-18"
status: specified_not_implemented
owner: "Владелец продукта Talent"
---

# Данные демо и подключения

## C00. Ответственность за сведения
| Сведения | Источник | Правило |
|---|---|---|
| Оффер и тексты сайта | content JSON и frontend spec | Сохранять утверждённые формулировки |
| Демозаписи выбора | отдельный fixture | Маркировать EXAMPLE, без придуманных коммерческих условий |
| Геометрия и объекты viewer | предоставленный Twin | Карта внешних ID, без сопоставления по названию «на глаз» |
| Цены и доступность | назначенный источник клиента | Пока не подключён: null и явное отсутствие данных |
| Обращения | сервер доставки → выбранная CRM | Пока нет backend: форма честно сообщает отсутствие отправки |

## C01. Каноническая запись
Lot: id, projectId, buildingId, floorId, layoutId (nullable), roomTypeId (nullable), mediaRefs, commercial (nullable), dataMode, sourceRef, updatedAt. Дополнительная физическая иерархия — по W06 master. Для гостиницы тип номера, планировка и конкретный лот различаются; количество спальных мест фиксируется типом, не диапазоном.
Mapping: provider, externalProjectId, externalLotId, canonicalLotId, mappingVersion, verifiedAt. Уникальность пары provider/externalProjectId/externalLotId обязательна. Неполное соответствие отключает зависимое действие и создаёт диагностическую запись.

## C02. Выбор и материалы
Карточка, список, шахматка и viewer используют canonicalLotId. Привязка медиа проверяется отдельно: иллюстративный вид из концепта не объявляется точным видом реального лота. Не связывать демонстрационный фасад с реальным проектом без проверки геометрии и прав.

## C03. Обращение
Payload: submissionId, contact fields, consentVersion, sourcePage, entryPoint, demoMode, selection (если есть), attribution по согласованным правилам. Сервер валидирует и доставляет; повтор использует тот же submissionId. Ответ success допустим только после подтверждённого принятия системой доставки. Статус очереди и подтверждение CRM различать. Контакты, тексты формы и секреты не входят в события аналитики.

## C04. Аналитика
События: demo_open, demo_load_started, demo_ready, demo_error, demo_fallback, selection_changed, lot_card_open, contact_started, lead_accepted. Общие поля: eventId, sessionId, mode, entryPoint, projectId, lotId при наличии, adapterVersion, errorCode без чувствительного текста. Политику согласия и срок хранения задать перед production.
Определения: успешный запуск = demo_ready после старта; время до готовности = разность этих событий; переход к обращению = contact_started после демо в согласованном окне. До настройки окна/фильтра ботов показатели не интерпретировать как конверсию. lead_accepted не означает продажу.

## C05. Комплектация
`../04_DATA/twin-demo-config.json` — неактивный шаблон интеграции. Секретов и настоящего endpoint нет. Значение connected разрешается только после QA; fixture не превращается в connected при простой смене строки конфигурации.
