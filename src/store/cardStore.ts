import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateDescriptionAndTags } from '../lib/openai';

export interface Card {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  tags: string[];
  favorite: boolean;
  created_at: string;
}

interface CardState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'kanban' | 'list';
  filterTags: string[];
  searchQuery: string;
  showFavoritesOnly: boolean;
  
  fetchCards: () => Promise<void>;
  addCard: (card: Omit<Card, 'id' | 'created_at'>) => Promise<Card | null>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  setViewMode: (mode: 'grid' | 'kanban' | 'list') => void;
  setFilterTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  toggleFavoritesFilter: () => void;
  
  processNewCard: (url: string, imageUrl?: string) => Promise<Card | null>;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,
  error: null,
  viewMode: 'grid',
  filterTags: [],
  searchQuery: '',
  showFavoritesOnly: false,
  
  fetchCards: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ cards: data as Card[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  addCard: async (card) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('cards')
        .insert([card])
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        cards: [data as Card, ...state.cards],
        loading: false 
      }));
      
      return data as Card;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  updateCard: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        cards: state.cards.map(card => 
          card.id === id ? { ...card, ...updates } : card
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  deleteCard: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        cards: state.cards.filter(card => card.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  toggleFavorite: async (id) => {
    const card = get().cards.find(c => c.id === id);
    if (!card) return;
    
    const newFavoriteStatus = !card.favorite;
    
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('cards')
        .update({ favorite: newFavoriteStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        cards: state.cards.map(card => 
          card.id === id ? { ...card, favorite: newFavoriteStatus } : card
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilterTags: (tags) => set({ filterTags: tags }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleFavoritesFilter: () => set(state => ({ showFavoritesOnly: !state.showFavoritesOnly })),
  
  processNewCard: async (url, imageUrl) => {
    try {
      set({ loading: true, error: null });
      
      // Generate description and tags with OpenAI
      const { description, tags } = await generateDescriptionAndTags(url, imageUrl);
      
      // Create a title from the URL
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname.split('/').filter(Boolean).join(' ');
      const title = path ? `${domain} - ${path}` : domain;
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Create the card
      const newCard = {
        user_id: user.id,
        title,
        description,
        image_url: imageUrl || '',
        link_url: url,
        tags,
        favorite: false
      };
      
      const card = await get().addCard(newCard);
      if (!card) throw new Error('Failed to create card');
      
      return card;
    } catch (error: any) {
      console.error('Error in processNewCard:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  }
}));