import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useCardStore, type Card } from '../../store/cardStore';
import { useCollectionStore } from '../../store/collectionStore';
import { CardItem } from './CardItem';
import { CardEditModal } from './CardEditModal';
import { useThemeStore } from '../../store/themeStore';

export const CardGrid: React.FC = () => {
  const { cards, loading, error, fetchCards, filterTags, searchQuery, showFavoritesOnly, viewMode } = useCardStore();
  const { activeCollectionId } = useCollectionStore();
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [collectionCardIds, setCollectionCardIds] = useState<Set<string> | null>(null);
  const { darkMode } = useThemeStore();

  useEffect(() => {
    fetchCards();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch card IDs for the active collection
  useEffect(() => {
    if (activeCollectionId === null) {
      setCollectionCardIds(null);
      return;
    }
    supabase
      .from('card_collections')
      .select('card_id')
      .eq('collection_id', activeCollectionId)
      .then(({ data }) => {
        setCollectionCardIds(new Set((data || []).map((r: any) => r.card_id)));
      });
  }, [activeCollectionId]);

  const filteredCards = cards.filter(card => {
    if (collectionCardIds !== null && !collectionCardIds.has(card.id)) return false;
    if (showFavoritesOnly && !card.favorite) return false;
    if (filterTags.length > 0 && !filterTags.some(tag => card.tags.includes(tag))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        card.tags.some(tag => tag.toLowerCase().includes(q)) ||
        card.link_url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading && cards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-10 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
        <p>Erro ao carregar os cartões: {error}</p>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p className="text-lg font-medium">Nenhum cartão encontrado.</p>
        {(filterTags.length > 0 || searchQuery || showFavoritesOnly || activeCollectionId) && (
          <p className="mt-2 text-sm">Tente ajustar os seus filtros de busca.</p>
        )}
      </div>
    );
  }

  if (viewMode === 'kanban') {
    const groupedCards = filteredCards.reduce((acc, card) => {
      const group = card.tags[0] || 'Sem tag';
      if (!acc[group]) acc[group] = [];
      acc[group].push(card);
      return acc;
    }, {} as Record<string, Card[]>);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedCards).map(([group, groupCards]) => (
            <div key={group} className={`p-4 rounded-2xl ${darkMode ? 'glass-kanban-dark' : 'glass-kanban-light'}`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {group}
                <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>({groupCards.length})</span>
              </h3>
              <div className="space-y-3">
                {groupCards.map(card => (
                  <CardItem key={card.id} card={card} onEdit={setEditingCard} viewMode={viewMode} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {editingCard && <CardEditModal card={editingCard} onClose={() => setEditingCard(null)} />}
      </>
    );
  }

  const gridClassName = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    list: 'flex flex-col space-y-4',
  }[viewMode];

  return (
    <>
      <div className={gridClassName}>
        {filteredCards.map(card => (
          <CardItem key={card.id} card={card} onEdit={setEditingCard} viewMode={viewMode} />
        ))}
      </div>
      {editingCard && <CardEditModal card={editingCard} onClose={() => setEditingCard(null)} />}
    </>
  );
};
