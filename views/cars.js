import { el } from '../utils/dom.js';
import { carService } from '../services/api.js';
import { navigate } from '../utils/router.js';

// Demo data shown when the API is unreachable (e.g., deployed without a backend)
const demoCars = [
  {
    model: 'Porsche 911 GT3',
    price: 172000,
    weight: 1435,
    speed: 318,
    imageUrl: './images/car-logo.png'
  },
  {
    model: 'BMW M4 Competition',
    price: 79900,
    weight: 1730,
    speed: 280,
    imageUrl: './images/car-logo.png'
  },
  {
    model: 'Audi RS6 Avant',
    price: 129000,
    weight: 2050,
    speed: 305,
    imageUrl: './images/car-logo.png'
  }
];

export function carsView() {
  const wrapper = el('div');
  const heading = el('h3', { className: 'heading', text: 'Our Cars' });
  const section = el('section', { id: 'dashboard' });

  wrapper.appendChild(heading);
  wrapper.appendChild(section);

  section.textContent = 'Loading...';
  loadCars(section);

  return wrapper;
}

async function loadCars(list) {
  try {
    const cars = await carService.all();
    renderList(list, cars);
  } catch (err) {
    renderList(list, demoCars);
    list.appendChild(el('p', { className: 'notice', text: 'Showing demo cars because the API is unreachable.' }));
  }
}

function renderList(list, cars) {
  clear(list);
  if (!cars || cars.length === 0) {
    const nothing = el('h3', { className: 'nothing', text: 'Nothing to see yet' });
    list.appendChild(nothing);
    return;
  }

  for (let i = 0; i < cars.length; i += 1) {
    list.appendChild(renderItem(cars[i]));
  }
}
function renderItem(car) {
  const box = el('div', { className: 'car' });
  const img = el('img', { attrs: { src: car.imageUrl || './images/car-logo.png', alt: car.model } });
  const model = el('h3', { className: 'model', text: car.model || 'No model' });
  
  const specs = el('div', { className: 'specs' });
  const price = el('p', { className: 'price', text: `Price: €${car.price || 'n/a'}` });
  const weight = el('p', { className: 'weight', text: `Weight: ${car.weight || 'n/a'} kg` });
  const speed = el('p', { className: 'top-speed', text: `Top Speed: ${car.speed || 'n/a'} kph` });
  
  specs.appendChild(price);
  specs.appendChild(weight);
  specs.appendChild(speed);
  
  const detailsBtn = el('a', { className: 'details-btn', text: 'More Info', attrs: { href: '#' } });
  detailsBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (car._id) {
      navigate(`/details?id=${car._id}`);
    }
  });

  box.appendChild(img);
  box.appendChild(model);
  box.appendChild(specs);
  box.appendChild(detailsBtn);
  return box;
}

function clear(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}
