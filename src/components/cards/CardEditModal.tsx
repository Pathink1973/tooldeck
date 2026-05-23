import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../../store/cardStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useCardStore } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';

interface CardEditModalProps {
  card: Card;
  onClose: () => void;
}

export const CardEditModal: React.FC<CardEditModalProps> = ({ card, onClose }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [linkUrl, setLinkUrl] = useState(card.link_url);
  const [imageUrl, setImageUrl] = useState(card.image_url);
  const [tags, setTags] = useState(card.tags.join(', '));
  const { updateCard, loading } = useCardStore();
  const { darkMode } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const processedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    await updateCard(card.id, {
      title,
      description,
      link_url: linkUrl,
      image_url: imageUrl,
      tags: processedTags,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-[12px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
          <h2 className={`text-xl font-bold font-manrope ${darkMode ? 'text-white' : ''}`}>Editar Cartão</h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do recurso"
            required
          />
          
          <Textarea
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do recurso"
            rows={4}
            required
          />
          
          <Input
            label="URL"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://exemplo.com"
            required
          />
          
          <Input
            label="URL da imagem"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          
          <Input
            label="Tags (separadas por vírgula)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, produtividade, ferramenta"
          />
          
          <div className={`flex justify-end space-x-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};