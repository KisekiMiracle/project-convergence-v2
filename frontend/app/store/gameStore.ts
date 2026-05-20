// ~/store/gameStore.ts
import { create } from "zustand";

export interface CharacterData {
  id: string;
  firstMetAt: string;
  metadata: Record<string, any> | null;
  equipSlot1?: string;
  equipSlot2?: string;
  equipSlot3?: string;
  equipSlot4?: string;
  equipSlot5?: string;
  equipSlot6?: string;
  stats: {
    name: string;
    lastName: string;
    level: number;
    experience: number;
    experienceToLvlUp: number;
    currentHp: number;
    maxHp: number;
    currentMp: number;
    maxMp: number;
    [key: string]: any; // Allow other fields from your schema mapping
  };
}

interface GameState {
  // Collections stored as dictionaries for instant O(1) lookups
  characters: Record<string, CharacterData>;
  items: Record<string, any>;

  // Actions to load baseline data
  setCharacters: (charactersArray: CharacterData[]) => void;
  setItems: (itemsArray: any[]) => void;

  // Granular mutation actions accessible from anywhere
  updateCharacterHp: (characterId: string, currentHp: number) => void;
  updateCharacterMp: (characterId: string, currentMp: number) => void;
  updateCharacterXp: (characterId: string, xp: number, level?: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  characters: {},
  items: {},

  // Convert array from backend into indexed map
  setCharacters: (array) =>
    set({
      characters: array.reduce(
        (acc, char) => ({ ...acc, [char.id]: char }),
        {},
      ),
    }),

  setItems: (array) =>
    set({
      items: array.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    }),

  // Target exactly one sub-property cleanly
  updateCharacterHp: (id, currentHp) =>
    set((state) => {
      if (!state.characters[id]) return {};
      return {
        characters: {
          ...state.characters,
          [id]: {
            ...state.characters[id],
            stats: { ...state.characters[id].stats, currentHp },
          },
        },
      };
    }),

  updateCharacterMp: (id, currentMp) =>
    set((state) => {
      if (!state.characters[id]) return {};
      return {
        characters: {
          ...state.characters,
          [id]: {
            ...state.characters[id],
            stats: { ...state.characters[id].stats, currentMp },
          },
        },
      };
    }),

  updateCharacterXp: (id, experience, level) =>
    set((state) => {
      if (!state.characters[id]) return {};
      const currentStats = state.characters[id].stats;
      return {
        characters: {
          ...state.characters,
          [id]: {
            ...state.characters[id],
            stats: {
              ...currentStats,
              experience,
              level: level ?? currentStats.level,
            },
          },
        },
      };
    }),
}));
