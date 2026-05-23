import React, { useState } from 'react';
import { Link2, Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useCardStore } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

export const AddCardForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const { processNewCard, loading } = useCardStore();
  const { darkMode } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }
    
    try {
      // Validate URL format
      new URL(url);
      
      const result = await processNewCard(url, imageUrl);
      
      if (result) {
        toast.success('Cartão adicionado com sucesso!');
        // Reset form
        setUrl('');
        setImageUrl('');
        setManualDescription('');
      } else {
        toast.error('Erro ao adicionar cartão');
      }
    } catch (error) {
      toast.error('URL inválida. Por favor, insira uma URL completa (ex: https://exemplo.com)');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-[12px] shadow-md p-6 mb-8`}>
      <h2 className={`text-xl font-bold font-manrope mb-4 ${darkMode ? 'text-white' : ''}`}>Adicionar Novo Recurso</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="URL do recurso"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemplo.com"
          required
          leftIcon={<Link2 className="h-4 w-4" />}
        />
        
        <Input
          label="URL da imagem (opcional)"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
          leftIcon={<Link2 className="h-4 w-4" />}
        />
        
        <div className="flex items-center">
          <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <button
            type="button"
            className={`mx-4 text-sm ${darkMode ? 'text-gray-400 hover:text-[#6366F1]' : 'text-gray-500 hover:text-[#6366F1]'}`}
            onClick={() => setIsManualMode(!isManualMode)}
          >
            {isManualMode ? 'Usar IA para descrição' : 'Adicionar descrição manual'}
          </button>
          <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
        </div>
        
        {isManualMode && (
          <Textarea
            label="Descrição manual (opcional)"
            value={manualDescription}
            onChange={(e) => setManualDescription(e.target.value)}
            placeholder="Descreva este recurso..."
          />
        )}
        
        <Button
          type="submit"
          className="w-full"
          isLoading={loading}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          Adicionar Recurso
        </Button>
      </form>
    </div>
  );
};