import { el } from '../utils/dom.js';
import { carService } from '../services/api.js';
import { navigate } from '../utils/router.js';

export function createView() {
  const section = el('section', { id: 'create' });
  const formDiv = el('div', { className: 'form form-auto' });
  const heading = el('h2', { text: 'Share Your Car' });
  const form = el('form', { className: 'create-form' });

  form.innerHTML = `
    <input type="text" name="model" id="model" placeholder="Model"/>
    <input type="text" name="imageUrl" id="car-image" placeholder="Your Car Image URL"/>
    <input type="text" name="price" id="price" placeholder="Price in Euro"/>
    <input type="number" name="weight" id="weight" placeholder="Weight in Kg"/>
    <input type="text" name="speed" id="speed" placeholder="Top Speed in Kmh"/>
    <textarea id="about" name="about" placeholder="More About The Car" rows="10" cols="50"></textarea>
    <button type="submit">Add</button>
  `;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const clean = normalizePayload(payload);
    if (!clean) {
      return;
    }
    createCar(clean, form);
  });

  formDiv.appendChild(heading);
  formDiv.appendChild(form);
  section.appendChild(formDiv);
  return section;
}

function normalizePayload(payload) {
  const model = (payload.model || '').trim();
  const imageUrl = (payload.imageUrl || '').trim();
  const price = (payload.price || '').trim();
  const weight = (payload.weight || '').trim();
  const speed = (payload.speed || '').trim();
  const about = (payload.about || '').trim();
  
  if (!model || !imageUrl || !price || !weight || !speed) {
    alert('All fields are required.');
    return null;
  }
  return { model, imageUrl, price, weight, speed, about };
}

async function createCar(data, form) {
  try {
    await carService.create(data);
    form.reset();
    navigate('/cars');
  } catch (err) {
    // alert е показан от api слоя
  }
}
