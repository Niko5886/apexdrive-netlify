import { el } from '../utils/dom.js';
import { carService } from '../services/api.js';
import { isOwner } from '../services/auth.js';
import { navigate } from '../utils/router.js';

export function detailsView(params) {
  const id = params.id;
  const section = el('section', { id: 'details' });
  const wrapper = el('div', { id: 'details-wrapper' });

  section.appendChild(wrapper);

  if (!id) {
    wrapper.textContent = 'Missing car identifier.';
    return section;
  }

  wrapper.textContent = 'Loading...';
  loadDetails(id, wrapper);
  return section;
}

async function loadDetails(id, container) {
  try {
    const car = await carService.byId(id);
    renderDetails(container, car);
  } catch (err) {
    container.textContent = 'Failed to load details.';
  }
}

function renderDetails(container, car) {
  clear(container);
  
  const img = el('img', { id: 'details-img', attrs: { src: car.imageUrl || './images/car-logo.png', alt: car.model } });
  const title = el('p', { id: 'details-title', text: car.model || 'No model' });
  
  const infoWrapper = el('div', { id: 'info-wrapper' });
  const description = el('div', { id: 'details-description' });
  
  const price = el('p', { className: 'price', text: `Price: €${car.price || 'n/a'}` });
  const weight = el('p', { className: 'weight', text: `Weight: ${car.weight || 'n/a'} kg` });
  const speed = el('p', { className: 'top-speed', text: `Top Speed: ${car.speed || 'n/a'} kph` });
  const about = el('p', { id: 'car-description', text: car.about || 'No description' });
  
  description.appendChild(price);
  description.appendChild(weight);
  description.appendChild(speed);
  description.appendChild(about);
  
  infoWrapper.appendChild(description);

  if (isOwner(car._ownerId)) {
    const actions = el('div', { id: 'action-buttons' });
    const editBtn = el('a', { id: 'edit-btn', text: 'Edit', attrs: { href: '#' } });
    const deleteBtn = el('a', { id: 'delete-btn', text: 'Delete', attrs: { href: '#' } });

    editBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      navigate(`/edit?id=${car._id}`);
    });
    deleteBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      handleDelete(car._id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    infoWrapper.appendChild(actions);
  }
  
  container.appendChild(img);
  container.appendChild(title);
  container.appendChild(infoWrapper);
}

async function handleDelete(id) {
  const confirmed = window.confirm('Are you sure you want to delete this car?');
  if (!confirmed) return;
  try {
    await carService.remove(id);
    navigate('/cars');
  } catch (err) {
    //  alert е показан от api слоя
  }
}

function clear(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
