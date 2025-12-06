import { el } from '../utils/dom.js';
import { carService } from '../services/api.js';
import { navigate } from '../utils/router.js';

export function searchView() {
  const section = el('section', { id: 'search' });
  
  const formDiv = el('div', { className: 'form' });
  const heading = el('h4', { text: 'Search' });
  const form = el('form', { className: 'search-form' });
  
  form.innerHTML = `
    <input type="text" name="search" id="search-input" />
    <button class="button-list" type="submit">Search</button>
  `;
  
  formDiv.appendChild(heading);
  formDiv.appendChild(form);
  
  const resultDiv = el('div', { className: 'search-result' });
  const noResult = el('h2', { className: 'no-avaliable', text: 'No result.' });
  resultDiv.appendChild(noResult);
  
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const query = formData.get('search');
    if (query) {
      searchCars(query, resultDiv, noResult);
    }
  });
  
  section.appendChild(formDiv);
  section.appendChild(resultDiv);
  return section;
}

async function searchCars(query, resultDiv, noResult) {
  try {
    const results = await carService.search(query);
    
    clear(resultDiv);
    
    if (!results || results.length === 0) {
      resultDiv.appendChild(noResult);
    } else {
      results.forEach(car => {
        resultDiv.appendChild(renderSearchItem(car));
      });
    }
  } catch (err) {
    clear(resultDiv);
    resultDiv.appendChild(noResult);
  }
}

function renderSearchItem(car) {
  const div = el('div', { className: 'car' });
  const img = el('img', { attrs: { src: car.imageUrl || './images/car-logo.png', alt: car.model } });
  const model = el('h3', { className: 'model', text: car.model || 'Unknown' });
  const btn = el('a', { className: 'details-btn', text: 'More Info', attrs: { href: '#' } });
  
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (car._id) {
      navigate(`/details?id=${car._id}`);
    }
  });
  
  div.appendChild(img);
  div.appendChild(model);
  div.appendChild(btn);
  return div;
}

function clear(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
