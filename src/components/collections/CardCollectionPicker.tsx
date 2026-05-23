import React, { useState, useEffect } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import { useCollectionStore } from '../../store/collectionStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

interface Props {
  cardId: string;
}

export const CardCollectionPicker: React.FC<Props> = ({ cardId }) => {
  const { collections, addCardToCollection, removeCardFromCollection, getCardCollections } = useCollectionStore();
  const { darkMode } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [assigned, setAssigned] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getCardCollections(cardId).then(setAssigned);
    }
  }, [open, cardId, getCardCollections]);

  const toggle = async (collectionId: string) => {
    if (assigned.includes(collectionId)) {
      await removeCardFromCollection(cardId, collectionId);
      setAssigned(prev => prev.filter(id => id !== collectionId));
      toast.success('Removido da coleção');
    } else {
      await addCardToCollection(cardId, collectionId);
      setAssigned(prev => [...prev, collectionId]);
      toast.success('Adicionado à coleção');
    }
  };

  if (collections.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v); }}
        className={`p-1 h-7 w-7 flex items-center justify-center rounded-md transition-colors ${
          darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
        }`}
        title="Adicionar a coleção"
      >
        <FolderPlus className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className={`absolute bottom-full mb-1 right-0 z-20 min-w-[160px] rounded-xl shadow-lg border py-1 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {collections.map(col => (
              <button
                key={col.id}
                type="button"
                onClick={(e) => { e.stopPropagation(); toggle(col.id); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                <span className="flex-1 text-left truncate">{col.name}</span>
                {assigned.includes(col.id) && <Check className="h-3 w-3 text-emerald-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
