import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Arrow } from './Media';
import type { Selection } from '../lib/config';

type Fields = 'name' | 'company' | 'contact' | 'project' | 'consent';
export function ContactForm({ topic, onTopic, selection }: { topic: string; onTopic: (value: string) => void; selection: Selection }) {
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [status, setStatus] = useState('');
  const form = useRef<HTMLFormElement>(null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    const next: Partial<Record<Fields, string>> = {};
    if (!String(values.get('name') || '').trim()) next.name = 'Укажите ваше имя.';
    if (!String(values.get('company') || '').trim()) next.company = 'Укажите компанию.';
    const contact = String(values.get('contact') || '').trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const phone = /^[+\d\s()−-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 10 && contact.replace(/\D/g, '').length <= 15;
    if (!email && !phone) next.contact = 'Укажите корректный телефон или email.';
    const project = String(values.get('project') || '').trim();
    if (project) { try { const url = new URL(project); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); } catch { next.project = 'Укажите ссылку, начинающуюся с https:// или http://.'; } }
    if (!values.get('consent')) next.consent = 'Отметьте согласие для проверки формы.';
    setErrors(next);
    if (Object.keys(next).length) { setStatus('Проверьте отмеченные поля. Введённые данные сохранены.'); requestAnimationFrame(() => document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus()); return; }
    // No endpoint: never transmit or persist personal data, never show a fictional success state.
    setStatus('Демонстрационная форма: данные не отправлены. Приём обращений пока не подключён.');
  }
  return <section className="contact section" id="contact" aria-labelledby="contact-heading"><div className="contact-copy"><span className="eyebrow">ДАВАЙТЕ ОБСУДИМ ВАШ ПРОЕКТ</span><h2 id="contact-heading">Посмотрите, как Twin может работать на вашем проекте.</h2><p>Обсудим задачи и подготовим конфигурацию решения.</p></div>
    <form ref={form} onSubmit={submit} noValidate aria-label="Запрос демонстрации">
      <div className="form-fields">{([['name', 'Имя', 'given-name'], ['company', 'Компания', 'organization'], ['contact', 'Телефон или email', 'off'], ['project', 'Ссылка на проект', 'url']] as const).map(([name, label, complete]) => <label key={name} htmlFor={`contact-${name}`}>{label}{name !== 'project' ? ' *' : ' (необязательно)'}<input id={`contact-${name}`} name={name} autoComplete={complete} type={name === 'project' ? 'url' : 'text'} required={name !== 'project'} maxLength={name === 'project' ? 1000 : 200} placeholder={label} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} />{errors[name] && <span className="field-error" id={`error-${name}`}>{errors[name]}</span>}</label>)}</div>
      <label className="topic-label" htmlFor="contact-topic">Тема обращения<input id="contact-topic" name="topic" value={topic} onChange={e => onTopic(e.target.value)} placeholder="Обсудить конфигурацию Twin" maxLength={300} /></label>
      {selection.lotId && <p className="form-context">Контекст примера: Корпус 1 / Этаж 4 / Лот 4.2 <span>· демонстрационные данные</span></p>}
      <label className="consent-label"><input id="contact-consent" type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby="consent-note" /><span>Я согласен на обработку персональных данных</span></label>
      <p className="form-note" id="consent-note">Локальный пример: данные не отправляются. Политика обработки данных будет добавлена перед подключением приёма обращений.</p>
      {errors.consent && <span className="field-error">{errors.consent}</span>}
      <button className="button" type="submit">Запросить демонстрацию<Arrow /></button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
      <noscript><p>Для проверки заполнения включите JavaScript. Отправка обращений пока не подключена.</p><style>{'form button[type="submit"]{display:none}'}</style></noscript>
    </form>
  </section>;
}
