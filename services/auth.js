import { setAuthToken, clearAuthToken } from './api.js';

const authListeners = [];

export function getUserData() {
  const raw = sessionStorage.getItem('userData');
  return raw ? JSON.parse(raw) : null;
}

export function setUserData(data) {
  if (!data) return;
  sessionStorage.setItem('userData', JSON.stringify(data));
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  notify(data);
}

export function clearUserData() {
  sessionStorage.removeItem('userData');
  clearAuthToken();
  notify(null);
}

export function hydrateAuth() {
  const user = getUserData();
  if (user && user.accessToken) {
    setAuthToken(user.accessToken);
  }
  notify(user || null);
}

export function isOwner(ownerId) {
  const user = getUserData();
  return user && user._id === ownerId;
}

export function onAuthChange(listener) {
  if (typeof listener === 'function') {
    authListeners.push(listener);
  }
}

function notify(user) {
  for (let i = 0; i < authListeners.length; i += 1) {
    authListeners[i](user);
  }
}
