import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

interface CollectionState {
  collections: Collection[];
  activeCollectionId: string | null;
  loading: boolean;
  error: string | null;

  fetchCollections: () => Promise<void>;
  createCollection: (name: string, description?: string, color?: string) => Promise<Collection | null>;
  updateCollection: (id: string, updates: Partial<Pick<Collection, 'name' | 'description' | 'color'>>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<void>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<void>;
  getCardCollections: (cardId: string) => Promise<string[]>;
  setActiveCollection: (id: string | null) => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  activeCollectionId: null,
  loading: false,
  error: null,

  fetchCollections: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ collections: data as Collection[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCollection: async (name, description = '', color = '#6366F1') => {
    try {
      set({ loading: true, error: null });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .insert([{ user_id: session.user.id, name, description, color }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        collections: [...state.collections, data as Collection],
        loading: false,
      }));
      return data as Collection;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCollection: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        collections: state.collections.map(c => c.id === id ? { ...c, ...updates } : c),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCollection: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        collections: state.collections.filter(c => c.id !== id),
        activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addCardToCollection: async (cardId, collectionId) => {
    try {
      const { error } = await supabase
        .from('card_collections')
        .insert([{ card_id: cardId, collection_id: collectionId }]);
      if (error && error.code !== '23505') throw error; // ignore duplicate
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  removeCardFromCollection: async (cardId, collectionId) => {
    try {
      const { error } = await supabase
        .from('card_collections')
        .delete()
        .eq('card_id', cardId)
        .eq('collection_id', collectionId);
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getCardCollections: async (cardId) => {
    try {
      const { data, error } = await supabase
        .from('card_collections')
        .select('collection_id')
        .eq('card_id', cardId);
      if (error) throw error;
      return (data || []).map(r => r.collection_id);
    } catch {
      return [];
    }
  },

  setActiveCollection: (id) => set({ activeCollectionId: id }),
}));
