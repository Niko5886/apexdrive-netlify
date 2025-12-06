const routes = new Map();
let outlet = null;

export function setupRouter(root) {
  outlet = root;
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
}

export function registerRoute(path, viewFactory) {
  routes.set(path, viewFactory);
}

export function navigate(path) {
  // Remove leading # if present
  const cleanPath = path.startsWith('#') ? path.slice(1) : path;
  window.location.hash = `#${cleanPath}`;
}

export function getRouteInfo() {
  const raw = window.location.hash.slice(1) || '/';
  const parts = raw.split('?');
  const path = parts[0] || '/';
  const query = parts.length > 1 ? parts[1] : '';
  const params = {};
  if (query) {
    const search = new URLSearchParams(query);
    search.forEach((value, key) => {
      params[key] = value;
    });
  }
  return { path, params };
}

async function handleRoute() {
  const info = getRouteInfo();
  const viewFactory = routes.get(info.path);

  if (!viewFactory) {
    renderFallback(info.path);
    return;
  }

  if (!outlet) {
    throw new Error('Router outlet not configured. Call setupRouter(rootEl).');
  }

  const view = await viewFactory(info.params || {});
  clearOutlet();
  outlet.appendChild(view);
}

function renderFallback(path) {
  if (!outlet) return;
  const msg = `<h2>Not Found</h2><p>No view for route "${path}".</p>`;
  const unknown = document.createElement('div');
  unknown.className = 'card';
  unknown.innerHTML = msg;
  clearOutlet();
  outlet.appendChild(unknown);
}

function clearOutlet() {
  while (outlet.firstChild) {
    outlet.removeChild(outlet.firstChild);
  }
}
