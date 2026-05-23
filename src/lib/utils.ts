import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch (error) {
    return url;
  }
}

export function generatePlaceholderImage(text: string): string {
  const colors = [
    '6366F1', // primary
    '22D3EE', // secondary
    '8B5CF6',
    'EC4899',
    'F43F5E',
    'F97316',
    'EAB308'
  ];
  
  const colorIndex = Math.abs(text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  const color = colors[colorIndex];
  
  const initials = text
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || '')
    .join('');
  
  return `https://placehold.co/400x300/${color}/FFFFFF?text=${encodeURIComponent(initials || 'TD')}`;
}