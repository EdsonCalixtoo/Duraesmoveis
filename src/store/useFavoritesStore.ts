import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: ['sofa-externo-riviera-3-lugares', 'guarda-sol-lateral-3m'], // pre-populado conforme mockup tela 09

      toggleFavorite: (productId: string) => {
        set((state) => {
          const exists = state.favoriteIds.includes(productId);
          if (exists) {
            return {
              favoriteIds: state.favoriteIds.filter((id) => id !== productId),
            };
          } else {
            return {
              favoriteIds: [...state.favoriteIds, productId],
            };
          }
        });
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'outdoorstyle-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
