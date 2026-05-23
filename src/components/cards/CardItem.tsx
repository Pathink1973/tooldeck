import React, { useState } from 'react';
import { ExternalLink, Heart, CreditCard as Edit, Trash2, Share2, Check } from 'lucide-react';
import { CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CardCollectionPicker } from '../collections/CardCollectionPicker';
import { formatDate, extractDomain, generatePlaceholderImage } from '../../lib/utils';
import { useCardStore, type Card as CardType } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

interface CardItemProps {
  card: CardType;
  onEdit?: (card: CardType) => void;
  viewMode?: 'grid' | 'list' | 'kanban';
}

export const CardItem: React.FC<CardItemProps> = ({ card, onEdit, viewMode = 'grid' }) => {
  const { toggleFavorite, deleteCard } = useCardStore();
  const { darkMode } = useThemeStore();
  const [shareCopied, setShareCopied] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(card.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(card);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      await deleteCard(card.id);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({ title: card.title, text: card.description, url: card.link_url });
      } catch {
        // user dismissed the share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(card.link_url);
      setShareCopied(true);
      toast.success('Link copiado!', { duration: 2000 });
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // clipboard not available — fall back to mailto
      window.location.href = `mailto:?subject=${encodeURIComponent(card.title)}&body=${encodeURIComponent(card.link_url)}`;
    }
  };

  const glassClass = darkMode ? 'glass-card-dark' : 'glass-card-light';

  const actionBtnClass = darkMode
    ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70';

  const deleteBtnClass = darkMode
    ? 'text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50';

  const footerBorderClass = darkMode ? 'border-white/[0.07]' : 'border-slate-200/60';

  const tagClass = darkMode
    ? 'border-sky-500/25 bg-sky-500/10 text-sky-300'
    : 'border-sky-300/40 bg-sky-50 text-sky-600';

  const overflowTagClass = darkMode
    ? 'border-white/10 bg-white/5 text-slate-400'
    : 'border-slate-200 bg-slate-50 text-slate-500';

  const favBtn = (size: 'sm' | 'md' = 'md') => (
    <button
      onClick={handleFavoriteToggle}
      className={`shrink-0 p-1.5 rounded-full transition-all duration-200 ${
        card.favorite
          ? 'text-rose-400 bg-rose-500/15 border border-rose-400/30'
          : darkMode
            ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent'
            : 'text-slate-300 hover:text-rose-400 hover:bg-rose-50 border border-transparent'
      } ${size === 'sm' ? 'p-1' : ''}`}
    >
      <Heart className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${card.favorite ? 'fill-current' : ''}`} />
    </button>
  );

  // ── List view ──────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <div className={`relative ${glassClass} rounded-2xl overflow-hidden flex flex-col sm:flex-row`}>
        <div
          className="glass-card-glow"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, transparent 70%)' }}
        />
        <div className="relative w-full sm:w-44 h-36 sm:h-auto overflow-hidden shrink-0">
          <img
            src={card.image_url || generatePlaceholderImage(card.title)}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = generatePlaceholderImage(card.title); }}
          />
          <div className={`absolute inset-y-0 right-0 w-8 hidden sm:block ${darkMode ? 'bg-gradient-to-r from-transparent to-[#0c111c]/60' : 'bg-gradient-to-r from-transparent to-white/30'}`} />
        </div>
        <div className="flex-1 flex flex-col p-4 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <div className="min-w-0 pr-2">
              <h3 className={`text-base font-semibold line-clamp-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {card.title}
              </h3>
              <div className={`text-xs flex items-center mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <ExternalLink className="h-3 w-3 mr-1 shrink-0" />
                <span className="truncate">{extractDomain(card.link_url)}</span>
              </div>
            </div>
            {favBtn()}
          </div>
          <p className={`text-sm line-clamp-2 flex-grow ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {card.description}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {card.tags.map((tag, index) => (
              <span key={index} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagClass}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className={`flex justify-between items-center mt-3 pt-3 border-t ${footerBorderClass}`}>
            <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatDate(card.created_at)}</span>
            <div className="flex items-center gap-0.5">
              <CardCollectionPicker cardId={card.id} />
              <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg transition-colors ${shareCopied ? (darkMode ? 'text-emerald-400' : 'text-emerald-500') : actionBtnClass}`} onClick={handleShare} title="Compartilhar">
                {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg ${actionBtnClass}`} onClick={handleEdit}><Edit className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg ${deleteBtnClass}`} onClick={handleDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Kanban view ────────────────────────────────────────────────────────────
  if (viewMode === 'kanban') {
    return (
      <div className={`relative ${glassClass} rounded-xl overflow-hidden group`}>
        <div
          className="glass-card-glow w-20 h-20"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.45) 0%, transparent 70%)' }}
        />
        <a href={card.link_url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="p-3.5">
            <div className="flex justify-between items-start mb-1.5">
              <h3 className={`text-sm font-semibold line-clamp-2 pr-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{card.title}</h3>
              {favBtn('sm')}
            </div>
            <div className={`text-xs flex items-center mb-2.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <ExternalLink className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{extractDomain(card.link_url)}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagClass}`}>{tag}</span>
              ))}
              {card.tags.length > 2 && (
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${overflowTagClass}`}>+{card.tags.length - 2}</span>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-0.5 px-3 py-2 border-t ${footerBorderClass}`}>
            <CardCollectionPicker cardId={card.id} />
            <Button variant="ghost" size="sm" className={`p-1 h-6 w-6 rounded-md transition-colors ${shareCopied ? (darkMode ? 'text-emerald-400' : 'text-emerald-500') : actionBtnClass}`} onClick={handleShare} title="Compartilhar">
              {shareCopied ? <Check className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" className={`p-1 h-6 w-6 rounded-md ${actionBtnClass}`} onClick={handleEdit}><Edit className="h-3 w-3" /></Button>
            <Button variant="ghost" size="sm" className={`p-1 h-6 w-6 rounded-md ${deleteBtnClass}`} onClick={handleDelete}><Trash2 className="h-3 w-3" /></Button>
          </div>
        </a>
      </div>
    );
  }

  // ── Grid view (default) ────────────────────────────────────────────────────
  return (
    <div className={`relative ${glassClass} rounded-2xl overflow-hidden h-full flex flex-col group`}>
      <div
        className="glass-card-glow"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, transparent 70%)' }}
      />

      <a href={card.link_url} target="_blank" rel="noopener noreferrer" className="flex-grow flex flex-col">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={card.image_url || generatePlaceholderImage(card.title)}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = generatePlaceholderImage(card.title); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Favourite */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md border transition-all duration-200 shadow-sm ${
              card.favorite
                ? 'bg-rose-500/90 border-rose-400/50 text-white shadow-rose-500/30'
                : darkMode
                  ? 'bg-black/40 border-white/10 text-slate-300 hover:text-rose-400 hover:bg-black/60 hover:border-rose-400/30'
                  : 'bg-white/80 border-white/60 text-slate-400 hover:text-rose-500 hover:bg-white/95'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${card.favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <CardHeader className="pb-1.5">
          <CardTitle className={darkMode ? 'text-slate-100' : 'text-slate-800'}>
            {card.title}
          </CardTitle>
          <div className={`text-xs flex items-center mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <ExternalLink className="h-3 w-3 mr-1 shrink-0" />
            <span className="truncate">{extractDomain(card.link_url)}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className={`text-sm line-clamp-3 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {card.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {card.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagClass}`}>
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${overflowTagClass}`}>
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </a>

      <CardFooter className={`border-t ${footerBorderClass} justify-between`}>
        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {formatDate(card.created_at)}
        </span>
        <div className="flex items-center gap-0.5">
          <CardCollectionPicker cardId={card.id} />
          <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg transition-colors ${shareCopied ? (darkMode ? 'text-emerald-400' : 'text-emerald-500') : actionBtnClass}`} onClick={handleShare} title="Compartilhar">
            {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg ${actionBtnClass}`} onClick={handleEdit}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className={`p-1 h-7 w-7 rounded-lg ${deleteBtnClass}`} onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};
