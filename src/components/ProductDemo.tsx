import { useId } from 'react';
import { Media, Arrow } from './Media';
import { Icon } from './Icon';
import { fixture, initialSelection, publicSelectionUrl, type Selection } from '../lib/config';

export function ProductDemo({ selection, onChange, full = false }: { selection: Selection; onChange: (s: Selection) => void; full?: boolean }) {
  const id = useId();
  const chooseBuilding = (value: string) => onChange({ ...selection, buildingId: value || null, floorId: null, lotId: null });
  const chooseFloor = (value: string) => onChange({ ...selection, floorId: value || null, lotId: null });
  const selectLot = () => onChange({ ...selection, lotId: fixture.lotId });
  const chooseView = (view: Selection['view']) => onChange({ ...selection, view });
  return <section className={`product section ${full ? 'full-demo' : ''}`} id="product" aria-labelledby={`${id}-title`}>
    <div className="section-heading"><div><span data-craft-reveal="" className="eyebrow">TWIN В РАБОТЕ</span>{full ? <h1 id={`${id}-title`}>Исследуйте проект<br />Рассмотрите конкретный лот</h1> : <h2 data-craft-reveal="" data-craft-delay="60" id={`${id}-title`}>Исследуйте проект<br />Рассмотрите конкретный лот</h2>}</div>
      <button className="text-link" onClick={() => onChange({ ...selection, buildingId: null, floorId: null, lotId: null })}><Icon name="arrow" className="back-arrow" />Вернуться к проекту</button></div>
    <p data-craft-reveal="" data-craft-delay="120" className="demo-label"><span className="status-dot" />Демонстрационный интерфейс · один корпус, один этаж, один лот</p>
    {full && <div className="viewer-notice"><strong>Настоящий Twin пока не подключён.</strong><p>Здесь можно проверить пример выбора и материалы лота. Изображения иллюстративные; цены и наличие не предоставлены.</p><a className="text-link" href="#demo-catalog">Перейти к доступному примеру ↓</a></div>}
    <div data-craft-reveal="" data-craft-delay="180" className="product-workspace" id={full ? 'demo-catalog' : undefined}>
      <div className="workspace-toolbar"><span><Icon name="layers" />Цифровой двойник</span><span className="workspace-mode"><span />Демонстрационный проект</span></div>
      <aside className="project-controls" aria-label="Выбор в демонстрационном проекте">
        <Media name="hero" alt="Демонстрационный проект" />
        <p className="project-name">Демонстрационный проект<span>Корпус · Этаж · Лот</span></p>
        <label>Корпус<span className="select-wrap"><select value={selection.buildingId || ''} onChange={e => chooseBuilding(e.target.value)}><option value="">Весь проект</option><option value={fixture.buildingId}>Корпус 1</option></select><Icon name="down" /></span></label>
        <label>Этаж<span className="select-wrap"><select disabled={!selection.buildingId} value={selection.floorId || ''} onChange={e => chooseFloor(e.target.value)}><option value="">Выберите этаж</option><option value={fixture.floorId}>Этаж 4</option></select><Icon name="down" /></span></label>
        <button className={`lot-choice ${selection.lotId ? 'selected' : ''}`} disabled={!selection.floorId} aria-pressed={!!selection.lotId} onClick={selectLot}>Лот 4.2 <Arrow /></button>
        {!selection.lotId && <button className="text-link restore-example" onClick={() => onChange(initialSelection)}>Открыть пример лота</button>}
      </aside>
      <div className="product-stage">
        <ol className="breadcrumbs" aria-label="Текущий выбор"><li>Проект</li>{selection.buildingId && <li>Корпус 1</li>}{selection.floorId && <li>Этаж 4</li>}{selection.lotId && <li>Лот 4.2</li>}</ol>
        <div className="product-canvas" role="tabpanel" id={`${id}-panel`} aria-labelledby={selection.view === 'plan' ? `${id}-plan` : `${id}-view`}>
          <Media key={selection.lotId ? selection.view : selection.buildingId || 'project'} name={selection.lotId ? selection.view === 'plan' ? 'lot' : 'interior' : selection.buildingId ? 'facade' : 'hero'} alt={selection.lotId ? selection.view === 'plan' ? 'Иллюстративная планировка лота 4.2' : 'Иллюстративное пространство и вид; соответствие реальному лоту не подтверждено' : 'Обзор демонстрационного проекта'} />
          <span className="canvas-caption">Иллюстрация · не проектная документация</span><span className="canvas-compass" aria-hidden="true"><span>N</span><Icon name="compass" /></span>
        </div>
      </div>
      <aside className="lot-card" aria-label="Карточка выбранного лота">
        <span className="lot-eyebrow">ВАШ ВЫБОР</span><h3>{selection.lotId ? 'Выбранный лот' : 'Материалы проекта'}</h3>
        <div className="tabs" role="tablist" aria-label="Материалы лота" onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const view = e.key === 'Home' ? 'plan' : e.key === 'End' ? 'view' : selection.view === 'plan' ? 'view' : 'plan'; chooseView(view); document.getElementById(`${id}-${view}`)?.focus(); } }}>
          {(['plan', 'view'] as const).map(view => <button key={view} id={`${id}-${view}`} type="button" role="tab" aria-controls={`${id}-panel`} aria-selected={selection.view === view} tabIndex={selection.view === view ? 0 : -1} disabled={!selection.lotId} onClick={() => chooseView(view)}><Icon name={view === 'plan' ? 'plan' : 'eye'} />{view === 'plan' ? 'Планировка' : 'Вид'}</button>)}
        </div>
        <Media name="hero" alt="Иллюстративный проект у моря" />
        <dl><div><dt>Корпус</dt><dd>{selection.buildingId ? '1' : 'Не выбран'}</dd></div><div><dt>Этаж</dt><dd>{selection.floorId ? '4' : 'Не выбран'}</dd></div><div><dt>Лот</dt><dd>{selection.lotId ? '4.2' : 'Не выбран'}</dd></div><div><dt>Цены и наличие</dt><dd>Нет данных</dd></div></dl>
        <a className="text-link" href={publicSelectionUrl('/' , selection) + '#contact'}>Обсудить проект<Arrow /></a>
      </aside>
    </div>
    <div className="product-bottom"><p>Одна цифровая основа — от общего вида до конкретного выбора.</p>{!full && <a className="button secondary" href={publicSelectionUrl('/demo', selection)}>Открыть демо<Arrow /></a>}</div>
    <noscript><p className="notice">Интерактивный выбор работает с JavaScript. Выше показан пример лота; описание продукта и форма доступны для чтения.</p></noscript>
  </section>;
}
