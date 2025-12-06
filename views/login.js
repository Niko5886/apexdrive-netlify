import { el } from '../utils/dom.js';
import { userService } from '../services/api.js';
import { setUserData } from '../services/auth.js';
import { navigate } from '../utils/router.js';

export function loginView() {
  const section = el('section', { id: 'login' });
  const formDiv = el('div', { className: 'form' });
  const heading = el('h2', { text: 'Login' });
  const form = el('form', { className: 'login-form' });

  form.innerHTML = `
    <input type="text" name="email" id="email" placeholder="email" />
    <input type="password" name="password" id="password" placeholder="password" />
    <button type="submit">login</button>
    <p class="message">Not registered? <a href="#/register">Create an account</a></p>
  `;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.email || !payload.password) {
      alert('Please fill in all fields.');
      return;
    }
    doLogin(payload, form);
  });

  formDiv.appendChild(heading);
  formDiv.appendChild(form);
  section.appendChild(formDiv);
  return section;
}

async function doLogin(payload, form) {
  try {
    const result = await userService.login(payload);
    setUserData(result);
    form.reset();
    navigate('/cars');
  } catch (err) {
    // грешката вече е показана с alert
  }
}
