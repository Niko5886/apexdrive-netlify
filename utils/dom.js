export function toArray(collection) {
  return Array.from(collection || []);
}

export function el(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  if (options.children) {
    toArray(options.children).forEach((child) => element.appendChild(child));
  }
  return element;
}
