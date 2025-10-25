// Save/Load System using LocalStorage and IndexedDB
import { GameState } from './worldgen';

const STORAGE_KEY = 'geosynthesis_save';
const AUTOSAVE_KEY = 'geosynthesis_autosave';
const SETTINGS_KEY = 'geosynthesis_settings';

export interface GameSettings {
  autosaveEnabled: boolean;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  autosaveEnabled: true,
  theme: 'dark',
  soundEnabled: true,
  animationsEnabled: true
};

export function saveGame(state: GameState, slot: string = STORAGE_KEY): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(slot, serialized);
    localStorage.setItem(`${slot}_timestamp`, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

export function loadGame(slot: string = STORAGE_KEY): GameState | null {
  try {
    const serialized = localStorage.getItem(slot);
    if (!serialized) return null;
    
    const state = JSON.parse(serialized) as GameState;
    return state;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function autosave(state: GameState): void {
  const settings = loadSettings();
  if (settings.autosaveEnabled) {
    saveGame(state, AUTOSAVE_KEY);
  }
}

export function listSaves(): Array<{ slot: string; timestamp: string }> {
  const saves: Array<{ slot: string; timestamp: string }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('geosynthesis_save') && !key.endsWith('_timestamp')) {
      const timestamp = localStorage.getItem(`${key}_timestamp`) || 'Unknown';
      saves.push({ slot: key, timestamp });
    }
  }
  
  return saves;
}

export function deleteSave(slot: string): boolean {
  try {
    localStorage.removeItem(slot);
    localStorage.removeItem(`${slot}_timestamp`);
    return true;
  } catch (error) {
    console.error('Failed to delete save:', error);
    return false;
  }
}

export function exportSaveToFile(state: GameState): void {
  const serialized = JSON.stringify(state, null, 2);
  const blob = new Blob([serialized], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `geosynthesis_save_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function importSaveFromFile(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const state = JSON.parse(content) as GameState;
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): GameSettings {
  try {
    const serialized = localStorage.getItem(SETTINGS_KEY);
    if (!serialized) return DEFAULT_SETTINGS;
    
    return { ...DEFAULT_SETTINGS, ...JSON.parse(serialized) };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function clearAllData(): void {
  const confirmed = confirm('Are you sure you want to clear all saved data? This cannot be undone.');
  if (confirmed) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('geosynthesis'));
    keys.forEach(key => localStorage.removeItem(key));
  }
}
