import { writable } from "svelte/store";

const TOKEN_STORAGE_KEY = "token";

export const authState = writable<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));

export const setAuthState = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  authState.set(token);
};

export const clearAuthState = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  authState.set(null);
};
