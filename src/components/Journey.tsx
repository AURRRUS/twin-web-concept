import { useEffect, useRef } from 'react';
import { Media } from './Media';

const chapters = [
  { id: 'project', title: 'Проект', detail: 'Окружение и архитектура', media: 'project', alt: 'Панорама демонстрационного курорта и его окружение' },
  { id: 'space', title: 'Пространство', detail: 'Территория и пространство', media: 'interior', alt: 'Терраса и интерьер демонстрационного проекта с видом на море' },
  { id: 'lot', title: 'Лот', detail: 'Планировка, положение и вид', media: 'lot', alt: 'Объёмная планировка демонстрационной квартиры с террасой' },
] as const;

export function Journey() {
  const host = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    host.current?.querySelectorAll('.journey-chapter').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <section ref={host} className="journey journey-editorial" aria-labelledby="journey-heading">
    <div className="journey-building"><Media name="facade" alt="Вертикальный фасад демонстрационного курорта над морем" /></div>
    <div className="journey-narrative">
      <div className="journey-heading"><h2 id="journey-heading">Покажите, что делает проект ценным.</h2><p>Окружение, архитектура, инфраструктура, планировка и вид — в связи с конкретным выбором покупателя.</p></div>
      {chapters.map((chapter, index) => <article className={`journey-chapter journey-chapter-${chapter.id}`} id={chapter.id} key={chapter.id}>
        <div className="journey-chapter-label"><span className="journey-chapter-number">0{index + 1}</span><div><h3>{chapter.title}</h3><p>{chapter.detail}</p></div><span className="journey-chapter-connection" aria-hidden="true" /></div>
        <Media name={chapter.media} alt={chapter.alt} className="journey-chapter-image" />
      </article>)}
    </div>
  </section>;
}
