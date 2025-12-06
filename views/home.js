import { el } from '../utils/dom.js';

export function homeView() {
  const section = el('section', { id: 'hero' });
  const logo = el('img', { className: 'hero-logo', attrs: { src: './images/car-logo.png', alt: 'logo' } });
  const heading = el('h1', { text: 'Peak performance on four wheels. Your ultimate destination for innovation, power, and an unparalleled driving experience.' });
  
  section.appendChild(logo);
  section.appendChild(heading);
  return section;
}
