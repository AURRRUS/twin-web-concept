# Что переносить из reference

TWIN_CORRECTED_COMPOSITION.png — эскиз композиции. Его нельзя вставлять целиком как сайт или вырезать из него изменённые планы/фотографии/текст.

salesStoryMotion.json + salesStoryFrame.mjs — согласованный пример вычисления фаз. Названия journeyStoryFrame/channelStoryFrame/qualityStoryFrame и их основные поля совместимы с прежним frame-модулем. Переносить как замену текущего вычислителя, не добавлять второй параллельный обработчик scroll. При обновлении декларации .d.mts сохранить корректные типы. Расширение localProgress можно использовать в driver или перенести в отдельный utility.

validate-motion.mjs — конечный тест математических инвариантов. Запуск в окружении с поддержкой import attributes: node reference/validate-motion.mjs. Успех не подтверждает шрифты, CSS, гидратацию, мобильный браузер и публикацию.

## Скелет DOM для Journey

```jsx
<section ref={host} className="story-journey" data-mode={mode}>
  <div className="story-panel">
    <div className="story-j4-frame">
      <div className="entry-shell" data-entry="story-frame">
        <header className="story-j4-header">{/* existing title/question slots */}</header>
        <div className="story-j4-visual">
          {/* existing route, media-stage, sales and MediaViewer trigger */}
        </div>
      </div>
    </div>
  </div>
  {/* existing readable SSR/NoJS fallback */}
</section>
```

entry-shell имеет width100%; его размеры естественные. Measure учитывать entry-shell.offsetHeight или scrollHeight всего frame. Transform внешней оболочки не должен участвовать в вычислении размеров: не измерять её getBoundingClientRect во время анимации. В финальном состоянии transform:none.

## Скелет DOM для Channels

```jsx
<section ref={host} className="story-channels" data-mode={mode}>
  <div className="story-panel">
    <div className="story-channel-layout entry-shell" data-entry="story-frame">
      <div className="story-channel-left">
        <header className="story-channel-heading">{/* H2, support line */}</header>
        <nav className="story-channel-nav">{/* four existing links */}</nav>
        <div className="story-channel-copy">{/* title + description slots */}</div>
        {/* one existing CTA */}
      </div>
      <div className="story-channel-art">{/* existing image layers */}</div>
    </div>
  </div>
  {/* preserve mobile stories; common mobile heading once */}
</section>
```

После переноса header текущий configure не должен повторно вычитать его как отдельный верхний пояс: он уже внутри left. Измерять max(leftHeight,rightHeight) единой композиции. Иначе фотография опять уменьшится по неверному бюджету высоты.

## SVG для правильной пропорции

```jsx
<svg viewBox="0 0 720 760" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <path pathLength="1" d="M360 124 L110 557.013" />
  <path pathLength="1" d="M110 557.013 L610 557.013" />
  <path pathLength="1" d="M610 557.013 L360 124" />
</svg>
```

Каждой грани оставить её текущий класс/переменную quality-edge, факты — DOM. Координаты canvas в02_LAYOUT, а не растягивание preserveAspectRatio:none. Сверить actualfactbbox после реальных шрифтов.
