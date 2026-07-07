import { create } from 'zustand';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { generateCardMetadata } from '../lib/openai';
import { inferIconKey } from '../lib/iconMap';

const READ_LATER_TAG = '__read_later__';
const ICON_TAG_PREFIX = '__icon:';

export interface Card {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  tags: string[];
  favorite: boolean;
  read_later: boolean;
  icon_key: string;
  created_at: string;
}

interface RawCard {
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

function rawToCard(raw: RawCard): Card {
  const hasReadLater = raw.tags.includes(READ_LATER_TAG);
  const iconTag = raw.tags.find(t => t.startsWith(ICON_TAG_PREFIX));
  const iconKey = iconTag ? iconTag.slice(ICON_TAG_PREFIX.length, -2) : '';

  return {
    ...raw,
    tags: raw.tags.filter(t => t !== READ_LATER_TAG && !t.startsWith(ICON_TAG_PREFIX)),
    read_later: hasReadLater,
    icon_key: iconKey || inferIconKey(raw.tags.filter(t => !t.startsWith('__')), raw.title),
  };
}

interface CardState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'kanban' | 'list';
  filterTags: string[];
  searchQuery: string;
  showFavoritesOnly: boolean;
  showReadLaterOnly: boolean;

  fetchCards: () => Promise<void>;
  addCard: (card: Omit<Card, 'id' | 'created_at' | 'read_later' | 'icon_key'> & { icon_key?: string }) => Promise<Card | null>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleReadLater: (id: string) => Promise<void>;

  setViewMode: (mode: 'grid' | 'kanban' | 'list') => void;
  setFilterTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  toggleFavoritesFilter: () => void;
  toggleReadLaterFilter: () => void;

  processNewCard: (url: string, imageUrl?: string) => Promise<Card | null>;
  reprocessIcons: () => Promise<void>;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,
  error: null,
  viewMode: 'grid',
  filterTags: [],
  searchQuery: '',
  showFavoritesOnly: false,
  showReadLaterOnly: false,

  fetchCards: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('cards')
        .select('id, user_id, title, description, image_url, link_url, tags, favorite, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cards = (data as RawCard[]).map(rawToCard);
      set({ cards, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCard: async (card) => {
    try {
      set({ loading: true, error: null });

      const dbTags = [...card.tags];
      if (card.icon_key) {
        dbTags.push(`${ICON_TAG_PREFIX}${card.icon_key}__`);
      }

      const { icon_key: _, ...rest } = card as any;
      const dbCard = { ...rest, tags: dbTags };

      const { data, error } = await supabase
        .from('cards')
        .insert([dbCard])
        .select('id, user_id, title, description, image_url, link_url, tags, favorite, created_at')
        .single();

      if (error) throw error;

      const newCard = rawToCard(data as RawCard);
      set(state => ({
        cards: [newCard, ...state.cards],
        loading: false,
      }));

      return newCard;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateCard: async (id, updates) => {
    const { read_later: _, icon_key: _ik, ...dbUpdates } = updates as any;
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('cards').update(dbUpdates).eq('id', id);

      if (error) throw error;

      set(state => ({
        cards: state.cards.map(card => card.id === id ? { ...card, ...updates } : card),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCard: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('cards').delete().eq('id', id);

      if (error) throw error;

      set(state => ({
        cards: state.cards.filter(card => card.id !== id),
        loading: false,
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
        cards: state.cards.map(c => c.id === id ? { ...c, favorite: newFavoriteStatus } : c),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  toggleReadLater: async (id) => {
    const card = get().cards.find(c => c.id === id);
    if (!card) return;

    const newStatus = !card.read_later;

    const { data } = await supabase
      .from('cards')
      .select('tags')
      .eq('id', id)
      .single();

    const currentDbTags: string[] = data?.tags ?? [];
    const updatedTags = newStatus
      ? [...currentDbTags, READ_LATER_TAG]
      : currentDbTags.filter(t => t !== READ_LATER_TAG);

    set(state => ({
      cards: state.cards.map(c => c.id === id ? { ...c, read_later: newStatus } : c),
    }));

    try {
      const { error } = await supabase
        .from('cards')
        .update({ tags: updatedTags })
        .eq('id', id);
      if (error) throw error;
    } catch {
      set(state => ({
        cards: state.cards.map(c => c.id === id ? { ...c, read_later: !newStatus } : c),
      }));
      toast.error('Erro ao guardar para ler mais tarde');
    }
  },

  reprocessIcons: async () => {
    const cards = get().cards;
    const toProcess = cards.filter(c => !c.icon_key || c.icon_key === 'web');

    let processed = 0;
    for (const card of toProcess) {
      const newIconKey = inferIconKey(card.tags, card.title);
      if (newIconKey === 'web') continue;

      const { data } = await supabase
        .from('cards')
        .select('tags')
        .eq('id', card.id)
        .single();

      if (!data) continue;

      const dbTags: string[] = data.tags.filter((t: string) => !t.startsWith(ICON_TAG_PREFIX));
      dbTags.push(`${ICON_TAG_PREFIX}${newIconKey}__`);

      const { error } = await supabase
        .from('cards')
        .update({ tags: dbTags })
        .eq('id', card.id);

      if (!error) {
        processed++;
        set(state => ({
          cards: state.cards.map(c => c.id === card.id ? { ...c, icon_key: newIconKey } : c),
        }));
      }
    }

    if (processed > 0) {
      toast.success(`${processed} icone(s) actualizados`);
    } else {
      toast.success('Todos os cards ja tem icones adequados');
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setFilterTags: (tags) => set({ filterTags: tags }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleFavoritesFilter: () => set(state => ({ showFavoritesOnly: !state.showFavoritesOnly })),
  toggleReadLaterFilter: () => set(state => ({ showReadLaterOnly: !state.showReadLaterOnly })),

  processNewCard: async (url, imageUrl) => {
    try {
      set({ loading: true, error: null });

      const { description, tags, icon_key } = await generateCardMetadata(url, imageUrl);

      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname.split('/').filter(Boolean).join(' ');
      const title = path ? `${domain} - ${path}` : domain;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newCard = {
        user_id: user.id,
        title,
        description,
        image_url: imageUrl || '',
        link_url: url,
        tags,
        favorite: false,
        icon_key,
      };

      const card = await get().addCard(newCard);
      if (!card) throw new Error('Failed to create card');

      return card;
    } catch (error: any) {
      console.error('Error in processNewCard:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },
}));
