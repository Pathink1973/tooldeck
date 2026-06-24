import React, { useState, useEffect, useRef } from 'react';
import { Plus, FolderOpen, Trash2, Pencil, Check, X, Loader2, ChevronDown, ChevronUp, Layers, Bookmark } from 'lucide-react';
import { useCollectionStore, type Collection } from '../../store/collectionStore';
import { useCardStore } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#6366F1', '#22D3EE', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16',
];

export const CollectionsSidebar: React.FC = () => {
  const {
    collections, activeCollectionId, loading,
    fetchCollections, createCollection, updateCollection, deleteCollection, setActiveCollection,
  } = useCollectionStore();
  const { cards, showReadLaterOnly, toggleReadLaterFilter } = useCardStore();
  const { darkMode } = useThemeStore();

  const [expanded, setExpanded] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchCollections(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (creating) setTimeout(() => inputRef.current?.focus(), 50);
  }, [creating]);

  const handleCreate = async () => {
    if (!newName.trim()) { setNameError(true); inputRef.current?.focus(); return; }
    setSaving(true);
    try {
      const col = await createCollection(newName.trim(), '', newColor);
      if (col) {
        toast.success(`Coleção "${col.name}" criada!`);
        setCreating(false);
        setNewName('');
        setNewColor(PRESET_COLORS[0]);
        setNameError(false);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao criar coleção');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelCreate = () => {
    setCreating(false);
    setNewName('');
    setNameError(false);
    setNewColor(PRESET_COLORS[0]);
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateCollection(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao renomear');
    }
  };

  const handleDelete = async (col: Collection) => {
    try {
      await deleteCollection(col.id);
      toast.success(`"${col.name}" eliminada`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao eliminar');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const dm = darkMode;
  const readLaterCount = cards.filter(c => c.read_later).length;
  const activeCount = activeCollectionId
    ? collections.find(c => c.id === activeCollectionId)?.name
    : 'Todos os cartões';

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header bar — always visible */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none ${dm ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
        onClick={() => setExpanded(v => !v)}
      >
        <Layers className={`h-4 w-4 flex-shrink-0 ${dm ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider flex-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
          Coleções
        </span>
        {!expanded && (
          <span className={`text-xs font-medium truncate max-w-[120px] ${dm ? 'text-gray-300' : 'text-gray-600'}`}>
            {activeCount}
          </span>
        )}
        <div className="flex items-center gap-1">
          {expanded && (
            <button
              onClick={e => { e.stopPropagation(); setCreating(v => !v); setConfirmDeleteId(null); }}
              title="Nova coleção"
              className={`p-1.5 rounded-lg transition-all duration-150 ${
                creating
                  ? dm ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
                  : dm ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
              }`}
            >
              <Plus className={`h-3.5 w-3.5 transition-transform duration-200 ${creating ? 'rotate-45' : ''}`} />
            </button>
          )}
          {expanded
            ? <ChevronUp className={`h-4 w-4 ${dm ? 'text-gray-500' : 'text-gray-400'}`} />
            : <ChevronDown className={`h-4 w-4 ${dm ? 'text-gray-500' : 'text-gray-400'}`} />
          }
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className={`border-t ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
          {/* Create form */}
          {creating && (
            <div className={`m-3 rounded-xl border overflow-hidden ${dm ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="p-3 space-y-3">
                <input
                  ref={inputRef}
                  value={newName}
                  onChange={e => { setNewName(e.target.value); if (nameError) setNameError(false); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') handleCancelCreate(); }}
                  placeholder="Nome da coleção..."
                  maxLength={40}
                  className={`w-full text-sm px-3 py-2 rounded-lg border outline-none transition-all duration-150 ${
                    nameError
                      ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-400'
                      : dm
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500'
                  }`}
                />
                {nameError && <p className="text-xs text-red-500 -mt-1 ml-1">Insere um nome.</p>}

                <div>
                  <p className={`text-xs mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Cor</p>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-110 focus:outline-none"
                        style={{ backgroundColor: color, boxShadow: newColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : undefined }}
                      >
                        {newColor === color && <Check className="h-3 w-3 text-white drop-shadow" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2.5 border-t ${dm ? 'border-gray-600 bg-gray-800/60' : 'border-gray-200 bg-gray-100/60'}`}>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#6366F1] text-white hover:bg-[#4f52d9] disabled:opacity-60 transition-colors duration-150"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Criar
                </button>
                <button
                  onClick={handleCancelCreate}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 ${dm ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Scrollable pill row */}
          <div className="px-3 pb-3 pt-2 flex gap-2 overflow-x-auto scrollbar-hide flex-nowrap">
            {/* Read later pill */}
            <button
              onClick={() => { toggleReadLaterFilter(); setActiveCollection(null); }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap border ${
                showReadLaterOnly
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/20'
                  : dm ? 'text-gray-400 border-gray-600 hover:bg-gray-700/60 hover:text-white' : 'text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${showReadLaterOnly ? 'fill-current' : ''}`} />
              Ler mais tarde
              {readLaterCount > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  showReadLaterOnly ? 'bg-white/20 text-white' : dm ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-600'
                }`}>
                  {readLaterCount}
                </span>
              )}
            </button>

            {/* All cards pill */}
            <button
              onClick={() => setActiveCollection(null)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap border ${
                activeCollectionId === null && !showReadLaterOnly
                  ? dm ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-900 text-white border-gray-900'
                  : dm ? 'text-gray-400 border-gray-600 hover:bg-gray-700/60 hover:text-white' : 'text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Todos
            </button>

            {/* Loading */}
            {loading && collections.length === 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> A carregar...
              </div>
            )}

            {/* Collection pills */}
            {collections.map(col => (
              <div key={col.id} className="flex-shrink-0">
                {confirmDeleteId === col.id ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs ${dm ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <span className="whitespace-nowrap">Eliminar?</span>
                    <button
                      onClick={() => handleDelete(col)}
                      className="font-semibold text-red-500 hover:text-red-600 px-1"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className={`px-1 ${dm ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Não
                    </button>
                  </div>
                ) : editingId === col.id ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEdit(col.id);
                        if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                      }}
                      className={`text-xs w-24 bg-transparent border-none outline-none ${dm ? 'text-white' : 'text-gray-900'}`}
                    />
                    <button
                      onClick={() => handleEdit(col.id)}
                      className="p-0.5 text-emerald-500 hover:text-emerald-400 flex-shrink-0"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditName(''); }}
                      className={`p-0.5 flex-shrink-0 ${dm ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap ${
                    activeCollectionId === col.id
                      ? 'text-white border-transparent'
                      : dm ? 'text-gray-400 border-gray-600 hover:bg-gray-700/60 hover:text-white' : 'text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                    style={activeCollectionId === col.id ? { backgroundColor: col.color, borderColor: col.color } : {}}
                    onClick={() => setActiveCollection(col.id)}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0 transition-all"
                      style={{ backgroundColor: activeCollectionId === col.id ? 'rgba(255,255,255,0.6)' : col.color }}
                    />
                    {col.name}
                    {/* Edit/delete — appear on hover inside pill */}
                    <span
                      className="hidden group-hover:flex items-center gap-0.5 ml-0.5"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => { setEditingId(col.id); setEditName(col.name); }}
                        title="Renomear"
                        className={`p-0.5 rounded transition-colors ${
                          activeCollectionId === col.id
                            ? 'text-white/70 hover:text-white'
                            : dm ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(col.id)}
                        title="Eliminar"
                        className={`p-0.5 rounded transition-colors ${
                          activeCollectionId === col.id
                            ? 'text-white/70 hover:text-white'
                            : dm ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Empty state inline */}
            {collections.length === 0 && !creating && !loading && (
              <button
                onClick={e => { e.stopPropagation(); setCreating(true); setExpanded(true); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed text-xs transition-colors ${dm ? 'border-gray-600 text-gray-500 hover:text-gray-300 hover:border-gray-400' : 'border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400'}`}
              >
                <Plus className="h-3.5 w-3.5" /> Nova coleção
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
