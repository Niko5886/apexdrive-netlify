import { el } from '../utils/dom.js';

// Данни за броячите в hero секцията
const STATS = [
  { target: 100, suffix: '+', label: 'Premium Vehicles' },
  { target: 15, suffix: '+', label: 'Brands' },
  { target: 500, suffix: '+', label: 'Satisfied Customers' },
  { target: 10, suffix: '+', label: 'Years of Experience' },
];

export function homeView() {
  const section = el('section', { id: 'hero' });
  const logo = el('img', { className: 'hero-logo', attrs: { src: './images/car-logo.png', alt: 'logo' } });
  const heading = el('h1', { text: 'Peak performance on four wheels. Your ultimate destination for innovation, power, and an unparalleled driving experience.' });

  section.appendChild(logo);
  section.appendChild(heading);

  // Самостоятелна секция с анимирани броячи
  const stats = el('section', { id: 'stats' });
  STATS.forEach((item) => {
    const card = el('div', { className: 'stat' });
    const number = el('span', {
      className: 'stat-number',
      text: `1${item.suffix}`,
      attrs: { 'data-target': String(item.target), 'data-suffix': item.suffix },
    });
    const label = el('span', { className: 'stat-label', text: item.label });
    card.appendChild(number);
    card.appendChild(label);
    stats.appendChild(card);
  });

  setupCountUp(stats);

  // Обвиваме двете секции в един фрагмент-контейнер, за да ги върнем заедно
  const wrapper = el('div', { id: 'home' });
  wrapper.appendChild(section);
  wrapper.appendChild(stats);
  return wrapper;
}

// Плавно отброяване от 1 до крайната стойност с easeOutExpo
function setupCountUp(statsEl) {
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const numbers = () => statsEl.querySelectorAll('.stat-number');

  const runCountUp = (numberEl) => {
    const target = Number(numberEl.dataset.target) || 0;
    const suffix = numberEl.dataset.suffix || '';
    const start = 1;
    const duration = 1800;
    const startTime = performance.now();

    cancelAnimationFrame(numberEl._raf);
    const frame = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.round(start + (target - start) * easeOutExpo(progress));
      numberEl.textContent = `${value}${suffix}`;
      if (progress < 1) {
        numberEl._raf = requestAnimationFrame(frame);
      }
    };
    numberEl._raf = requestAnimationFrame(frame);
  };

  const reset = (numberEl) => {
    cancelAnimationFrame(numberEl._raf);
    numberEl.textContent = `1${numberEl.dataset.suffix || ''}`;
  };

  // Достъпност: при предпочитание за намалено движение показваме крайните стойности
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    numbers().forEach((n) => {
      n.textContent = `${n.dataset.target}${n.dataset.suffix || ''}`;
    });
    return;
  }

  // Fallback за среди без IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    requestAnimationFrame(() => numbers().forEach(runCountUp));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Секцията е премахната от DOM (навигация към друга страница) -> спираме
        if (!entry.target.isConnected) {
          observer.disconnect();
          return;
        }
        if (entry.isIntersecting) {
          statsEl.querySelectorAll('.stat-number').forEach(runCountUp);
        } else {
          // Напуска viewport-а -> нулираме, за да се анимира пак при връщане
          statsEl.querySelectorAll('.stat-number').forEach(reset);
        }
      });
    },
    { threshold: 0.4 }
  );

  // Изчакваме елементът да бъде вмъкнат в DOM, за да сработи първият callback
  requestAnimationFrame(() => observer.observe(statsEl));
}
