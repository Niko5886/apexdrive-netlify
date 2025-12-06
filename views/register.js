import { el } from '../utils/dom.js';
import { userService } from '../services/api.js';
import { setUserData } from '../services/auth.js';
import { navigate } from '../utils/router.js';

export function registerView() {
  const section = el('section', { id: 'register' });
  const formDiv = el('div', { className: 'form' });
  const heading = el('h2', { text: 'Register' });
  const form = el('form', { className: 'register-form' });

  form.innerHTML = `
    <input type="text" name="email" id="register-email" placeholder="email"/>
    <input type="password" name="password" id="register-password" placeholder="password"/>
    <input type="password" name="re-password" id="repeat-password" placeholder="repeat password"/>
    <button type="submit">register</button>
    <p class="message">Already registered? <a href="#/login">Login</a></p>
  `;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.email || !payload.password) {
      alert('Please fill in all fields.');
      return;
    }
    if (payload.password !== payload['re-password']) {
      alert('Passwords do not match.');
      return;
    }
    doRegister(payload, form);
  });

  formDiv.appendChild(heading);
  formDiv.appendChild(form);
  section.appendChild(formDiv);
  return section;
}

async function doRegister(payload, form) {
  try {
    const clean = { email: payload.email, password: payload.password };
    const result = await userService.register(clean);
    setUserData(result);
    form.reset();
    navigate('/cars');
  } catch (err) {
    // alert вече е показан от api слоя
  }
}
