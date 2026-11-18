import { useSyncExternalStore } from 'react';

/**
 * Scelte del visitatore sui servizi esterni (Google Maps, Bokun).
 * Nulla viene caricato prima di un clic: questa memoria serve solo a non chiedere ogni volta,
 * se il visitatore spunta "ricorda la scelta". Salvata in localStorage (dato tecnico, nessun cookie).
 */
export type Service = 'maps' | 'bokun';
const KEY = 'wt-consent';
const listeners = new Set<() => void>();

function read(): Record<Service, boolean> {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { maps: v.maps === true, bokun: v.bokun === true };
  } catch {
    return { maps: false, bokun: false };
  }
}
let state = typeof window === 'undefined' ? { maps: false, bokun: false } : read();

export function setConsent(service: Service, value: boolean) {
  state = { ...state, [service]: value };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export function clearConsent() {
  state = { maps: false, bokun: false };
  try {
    localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

export function useConsent(service: Service): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state[service],
    () => false,
  );
}
