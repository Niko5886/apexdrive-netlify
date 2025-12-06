import { el } from '../utils/dom.js';
import { carService } from '../services/api.js';
import { navigate } from '../utils/router.js';
import { isOwner } from '../services/auth.js';

export async function editView(params) {
  const id = params.id;
  const section = el('section', { id: 'edit' });

  if (!id) {
    const msg = el('p', { text: 'Missing identifier for editing.' });
    section.appendChild(msg);
    return section;
  }

  const formDiv = el('div', { className: 'form' });
  const title = el('h2', { text: 'Edit Your Car' });
  const form = el('form', { className: 'edit-form' });

  form.innerHTML = `
    <input type="text" name="model" id="model" placeholder="Model" />
    <input type="text" name="imageUrl" id="car-image" placeholder="Your Car Image URL"/>
    <input type="text" name="price" id="price" placeholder="Price in Euro"/>
    <input type="number" name="weight" id="weight" placeholder="Weight in Kg"/>
    <input type="text" name="speed" id="speed" placeholder="Top Speed in Kmh"/>
    <textarea id="about" name="about" placeholder="More About The Car" rows="10" cols="50"></textarea>
    <button type="submit">Edit</button>
  `;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const clean = normalize(payload);
    if (!clean) return;
    updateCar(id, clean);
  });

  formDiv.appendChild(title);
  formDiv.appendChild(form);
  section.appendChild(formDiv);
  
  // Load data AFTER form is created
  await loadCar(id, form);
  
  return section;
}

async function loadCar(id, form) {
  try {
    const car = await carService.byId(id);
    if (!isOwner(car._ownerId)) {
      alert('You do not have permission to edit this record.');
      navigate(`/details?id=${id}`);
      return;
    }
    const inputs = Array.from(form.getElementsByTagName('input'));
    const textareas = Array.from(form.getElementsByTagName('textarea'));
    for (let i = 0; i < inputs.length; i += 1) {
      const inp = inputs[i];
      if (inp.name === 'model') inp.value = car.model || '';
      if (inp.name === 'imageUrl') inp.value = car.imageUrl || '';
      if (inp.name === 'price') inp.value = car.price || '';
      if (inp.name === 'weight') inp.value = car.weight || '';
      if (inp.name === 'speed') inp.value = car.speed || '';
    }
    for (let i = 0; i < textareas.length; i += 1) {
      const ta = textareas[i];
      if (ta.name === 'about') ta.value = car.about || '';
    }
  } catch (err) {
    // alert е показан от api слоя
  }
}

async function updateCar(id, data) {
  try {
    await carService.update(id, data);
    navigate(`/details?id=${id}`);
  } catch (err) {
    // alert е показан от api слоя
  }
}

function normalize(payload) {
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
