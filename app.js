import { setupRouter, registerRoute, navigate } from './utils/router.js';
import { homeView } from './views/home.js';
import { carsView } from './views/cars.js';
import { createView } from './views/create.js';
import { detailsView } from './views/details.js';
import { editView } from './views/edit.js';
import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { searchView } from './views/search.js';
import { api, userService } from './services/api.js';
import { getUserData, hydrateAuth, onAuthChange, clearUserData } from './services/auth.js';
import { el } from './utils/dom.js';

// Основна конфигурация на SPA-то: рутер + навигация + auth състояние
const outlet = document.getElementById('main-element');
const nav = document.querySelector('nav');

setupRouter(outlet);

// Маршрути: публични, защитени и auth
registerRoute('/', homeView);
registerRoute('/cars', carsView);
registerRoute('/details', detailsView); // очаква ID през hash/query при нужда
registerRoute('/create', guarded(createView));
registerRoute('/edit', guarded(editView));
registerRoute('/login', loginView);
registerRoute('/register', registerView);
registerRoute('/search', searchView);
registerRoute('/logout', logoutView);

onAuthChange(setNavState);
hydrateAuth();
wireNav();

// --------- Auth и навигация ---------
function wireNav() {
	if (!nav) return;

	nav.addEventListener('click', (ev) => {
		const target = ev.target;
		if (!target || target.tagName !== 'A') {
			return;
		}

		// Изходът се обработва ръчно, за да изчистим токена
		if (target.getAttribute('href') === '#/logout') {
			ev.preventDefault();
			handleLogout();
		}
	});
}

function setNavState(user) {
	if (!nav) return;
	const guestBox = nav.querySelector('.guest');
	const userBox = nav.querySelector('.user');
	if (guestBox) {
		guestBox.style.display = user ? 'none' : 'inline-flex';
	}
	if (userBox) {
		userBox.style.display = user ? 'inline-flex' : 'none';
	}
	const createLink = nav.querySelector('a[href="#/create"]');
	if (createLink) {
		createLink.style.display = user ? 'inline-block' : 'none';
	}
}

// Guard за маршрути, достъпни само за вписани потребители
function guarded(viewFactory) {
  return async function guardedView(params) {
    if (!getUserData()) {
      navigate('/login');
      return fallbackCard('Please log in to continue.');
    }
    return await viewFactory(params);
  };
}// Изход и визуализация за #/logout
function logoutView() {
  handleLogout();
  return fallbackCard('Logging out...');
}async function handleLogout() {
	try {
		await userService.logout();
	} catch (err) {
		// показан е alert в api.request; продължаваме с почистване
	}
	clearUserData();
	navigate('/');
}

// Малка помощна карта за съобщения
function fallbackCard(message) {
	return el('section', { className: 'card', text: message });
}
