import { Media } from './Media';

export function Journey() {
  return <section className="journey" aria-labelledby="journey-heading">
    <div className="journey-facade"><Media name="facade" alt="Фасад демонстрационного проекта с террасами" /><span className="facade-mark mark-one" aria-hidden="true" /><span className="facade-mark mark-two" aria-hidden="true" /></div>
    <div className="journey-story">
      <div className="journey-intro"><h2 id="journey-heading">Покажите, что делает проект ценным.</h2><p>Окружение, архитектура, инфраструктура, планировка и вид — в связи с конкретным выбором покупателя.</p></div>
      <article id="project" className="story-step"><span className="step-number">01</span><div><h3>Проект</h3><p>Окружение и архитектура</p></div><span className="story-connector" aria-hidden="true" /></article>
      <Media name="interior" alt="Иллюстративное пространство с террасой и видом на море" className="journey-interior" />
      <article id="space" className="story-step"><span className="step-number">02</span><div><h3>Пространство</h3><p>Территория и пространство</p></div><span className="story-connector" aria-hidden="true" /></article>
      <div className="journey-lot"><article id="lot" className="story-step"><span className="step-number">03</span><div><h3>Лот</h3><p>Планировка, положение и вид</p></div><span className="story-connector" aria-hidden="true" /></article><Media name="lot" alt="Демонстрационная объёмная планировка, не архитектурный чертёж" /></div>
    </div>
  </section>;
}
