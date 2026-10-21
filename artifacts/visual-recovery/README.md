# Twin — визуальное восстановление

Эта итерация находится в `codex/twin-visual-recovery`, а не на production.

## Сравнить

| | До | После |
|---|---|---|
| Hero1440 | [До](before/1440-hero.png) | [После](after/1440-hero.png) |
| Проект1440 | [До](before/1440x900-p0.1.png) | [После](after/1440-project.png) |
| Пространство1440 | [До](before/1440x900-p0.5.png) | [После](after/1440-space.png) |
| Лот1440 | [До](before/1440x900-p0.9.png) | [После](after/1440-lot.png) |
| Переход | [Прежняя схема](before/1440x900-p0.28.png) | [Заголовок раньше картинки](after/1440-text.png), [непрозрачная маска](after/1440-wipe.png) |
| Mobile390 | [До](before/390x844-full.png) | [Все сцены](after/390-static.png), [Hero](after/390-hero.png) |

[Референс](reference.png) · [Запись прямой/обратной прокрутки](scroll-forward-back.webm) · [Диалог оригинала](after/original-dialog.png).

Ноутбуки: [1366×768](after/1366-project.png), [1280×800](after/1280-project.png). Широкий экран: [1920×1080](after/1920-project.png). Планшет: [768×1024](after/768-static.png).

Мобильные кадры390×844: [Проект](after/390-scene-1.png), [Пространство](after/390-scene-2.png), [Лот](after/390-scene-3.png).

Дополнительные JPEG: остановки двух переходов в q=.1/.25/.5/.75/.95 и все четыре канала. Проверки: [layout](after/layout.json), [base path](basepath-checks.json), [контраст](contrast.json), [каденс записи](motion-profile.json).

[Таблица приёмки и ограничения](../../docs/visual-recovery/ACCEPTANCE.md). Font-lock не установлен; Safari/iOS и полный WCAG не проверены. Запись не является гарантией60fps.
