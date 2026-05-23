import { supabase } from './supabase';
import toast from 'react-hot-toast';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function generateDescriptionAndTags(
  url: string,
  imageUrl?: string
): Promise<{ description: string; tags: string[] }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-card-meta`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url, imageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error || `HTTP ${response.status}`;
      console.error('Edge function error:', response.status, data);
      toast.error(`Erro na análise IA: ${errMsg}`);
      return { description: 'Recurso web guardado', tags: ['sem-tag'] };
    }

    return {
      description: data.description ?? 'Recurso web guardado',
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['sem-tag'],
    };
  } catch (error: any) {
    console.error('Error calling generate-card-meta:', error?.message || error);
    toast.error('Não foi possível contactar o serviço de IA');
    return {
      description: 'Recurso web guardado',
      tags: ['sem-tag'],
    };
  }
}
