import type { IconSvgElement } from '@hugeicons/react';
import { CodeIcon } from '@hugeicons/core-free-icons';
import { BrainCircuitIcon } from '@hugeicons/core-free-icons';
import { PaintBrush01Icon } from '@hugeicons/core-free-icons';
import { Wallet01Icon } from '@hugeicons/core-free-icons';
import { Shield01Icon } from '@hugeicons/core-free-icons';
import { MusicNote01Icon } from '@hugeicons/core-free-icons';
import { VideoReplayIcon } from '@hugeicons/core-free-icons';
import { GameIcon } from '@hugeicons/core-free-icons';
import { RocketIcon } from '@hugeicons/core-free-icons';
import { Megaphone01Icon } from '@hugeicons/core-free-icons';
import { ShoppingBag01Icon } from '@hugeicons/core-free-icons';
import { Camera01Icon } from '@hugeicons/core-free-icons';
import { GraduationCapIcon } from '@hugeicons/core-free-icons';
import { Dumbbell01Icon } from '@hugeicons/core-free-icons';
import { HeartPulseIcon } from '@hugeicons/core-free-icons';
import { ChartIncreaseIcon } from '@hugeicons/core-free-icons';
import { DatabaseIcon } from '@hugeicons/core-free-icons';
import { GlobeIcon } from '@hugeicons/core-free-icons';
import { Message01Icon } from '@hugeicons/core-free-icons';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { CpuIcon } from '@hugeicons/core-free-icons';
import { SmartPhone01Icon } from '@hugeicons/core-free-icons';
import { Layers01Icon } from '@hugeicons/core-free-icons';
import { Book01Icon } from '@hugeicons/core-free-icons';
import { FlaskConicalIcon } from '@hugeicons/core-free-icons';
import { MapPinIcon } from '@hugeicons/core-free-icons';
import { Calendar01Icon } from '@hugeicons/core-free-icons';
import { HeadphonesIcon } from '@hugeicons/core-free-icons';
import { MicroscopeIcon } from '@hugeicons/core-free-icons';
import { PenTool01Icon } from '@hugeicons/core-free-icons';
import { Settings01Icon } from '@hugeicons/core-free-icons';
import { ApiIcon } from '@hugeicons/core-free-icons';
import { ChipIcon } from '@hugeicons/core-free-icons';
import { RoboticIcon } from '@hugeicons/core-free-icons';
import { Analytics01Icon } from '@hugeicons/core-free-icons';
import { Plug01Icon } from '@hugeicons/core-free-icons';
import { GiftIcon } from '@hugeicons/core-free-icons';
import { Link01Icon } from '@hugeicons/core-free-icons';
import { MagicWand01Icon } from '@hugeicons/core-free-icons';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { LockIcon } from '@hugeicons/core-free-icons';
import { Atom01Icon } from '@hugeicons/core-free-icons';
import { Dollar01Icon } from '@hugeicons/core-free-icons';
import { BankIcon } from '@hugeicons/core-free-icons';
import { PieChart01Icon } from '@hugeicons/core-free-icons';
import { Compass01Icon } from '@hugeicons/core-free-icons';
import { AiGenerativeIcon } from '@hugeicons/core-free-icons';
import { Image01Icon } from '@hugeicons/core-free-icons';
import { Satellite01Icon } from '@hugeicons/core-free-icons';

interface CategoryEntry {
  icon: IconSvgElement;
  keywords: string[];
}

const ICON_CATEGORIES: Record<string, CategoryEntry> = {
  dev: { icon: CodeIcon, keywords: ['code', 'developer', 'programming', 'github', 'git', 'vscode', 'ide', 'npm', 'javascript', 'typescript', 'python', 'rust', 'golang', 'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'node', 'deno', 'bun', 'webpack', 'vite', 'frontend', 'backend', 'fullstack', 'web dev', 'software'] },
  ai: { icon: BrainCircuitIcon, keywords: ['ai', 'inteligencia artificial', 'machine learning', 'ml', 'deep learning', 'neural', 'gpt', 'chatgpt', 'openai', 'anthropic', 'claude', 'llm', 'nlp', 'modelo', 'transformer'] },
  genai: { icon: AiGenerativeIcon, keywords: ['generative', 'midjourney', 'dall-e', 'stable diffusion', 'imagen', 'copilot', 'ai assistant', 'prompt'] },
  design: { icon: PaintBrush01Icon, keywords: ['design', 'figma', 'sketch', 'ui', 'ux', 'interface', 'wireframe', 'prototype', 'layout', 'typography', 'grafico', 'visual', 'adobe', 'photoshop', 'illustrator', 'canva'] },
  illustration: { icon: PenTool01Icon, keywords: ['illustration', 'draw', 'vector', 'svg', 'icon', 'logo', 'branding', 'ilustracao'] },
  photo: { icon: Camera01Icon, keywords: ['photo', 'fotografia', 'camera', 'lightroom', 'editing', 'imagem', 'gallery'] },
  image: { icon: Image01Icon, keywords: ['image', 'picture', 'wallpaper', 'background', 'screenshot', 'visual'] },
  finance: { icon: Dollar01Icon, keywords: ['finance', 'financa', 'fintech', 'money', 'dinheiro', 'investment', 'investimento', 'stock', 'trading', 'forex', 'bolsa'] },
  banking: { icon: BankIcon, keywords: ['bank', 'banco', 'banking', 'payment', 'pagamento', 'stripe', 'paypal', 'pix'] },
  wallet: { icon: Wallet01Icon, keywords: ['wallet', 'carteira', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 'web3', 'nft', 'defi'] },
  security: { icon: Shield01Icon, keywords: ['security', 'seguranca', 'cybersecurity', 'firewall', 'antivirus', 'protection', 'vulnerability', 'pentest'] },
  privacy: { icon: LockIcon, keywords: ['privacy', 'privacidade', 'encryption', 'vpn', 'password', 'auth', 'oauth', '2fa', 'mfa'] },
  music: { icon: MusicNote01Icon, keywords: ['music', 'musica', 'spotify', 'audio', 'sound', 'podcast', 'song', 'playlist', 'beat'] },
  audio: { icon: HeadphonesIcon, keywords: ['headphone', 'fone', 'listening', 'audiobook', 'asmr'] },
  video: { icon: VideoReplayIcon, keywords: ['video', 'youtube', 'streaming', 'film', 'movie', 'cinema', 'netflix', 'twitch', 'vimeo', 'obs'] },
  gaming: { icon: GameIcon, keywords: ['game', 'jogo', 'gaming', 'steam', 'esports', 'unity', 'unreal', 'godot', 'gamedev'] },
  productivity: { icon: RocketIcon, keywords: ['productivity', 'produtividade', 'workflow', 'automation', 'notion', 'obsidian', 'todoist', 'trello', 'asana', 'jira', 'linear', 'monday', 'clickup', 'task'] },
  marketing: { icon: Megaphone01Icon, keywords: ['marketing', 'seo', 'social media', 'ads', 'publicidade', 'growth', 'analytics', 'campaign', 'branding', 'content'] },
  ecommerce: { icon: ShoppingBag01Icon, keywords: ['ecommerce', 'loja', 'store', 'shop', 'marketplace', 'shopify', 'woocommerce', 'product', 'dropshipping'] },
  education: { icon: GraduationCapIcon, keywords: ['education', 'educacao', 'learn', 'aprender', 'course', 'curso', 'tutorial', 'academy', 'university', 'school', 'study', 'udemy', 'coursera'] },
  reading: { icon: Book01Icon, keywords: ['book', 'livro', 'reading', 'leitura', 'ebook', 'kindle', 'library', 'article', 'artigo', 'blog', 'medium'] },
  fitness: { icon: Dumbbell01Icon, keywords: ['fitness', 'gym', 'exercise', 'exercicio', 'workout', 'treino', 'crossfit', 'yoga', 'sport', 'desporto'] },
  health: { icon: HeartPulseIcon, keywords: ['health', 'saude', 'medical', 'medicine', 'hospital', 'doctor', 'wellness', 'mental', 'therapy', 'meditation', 'mindfulness'] },
  analytics: { icon: ChartIncreaseIcon, keywords: ['chart', 'grafico', 'metrics', 'metricas', 'kpi', 'dashboard', 'report', 'relatorio', 'statistics'] },
  data: { icon: DatabaseIcon, keywords: ['data', 'database', 'sql', 'postgres', 'mysql', 'mongodb', 'redis', 'supabase', 'firebase', 'storage', 'backup'] },
  cloud: { icon: Satellite01Icon, keywords: ['cloud', 'aws', 'azure', 'gcp', 'vercel', 'netlify', 'heroku', 'docker', 'kubernetes', 'devops', 'ci/cd', 'deploy'] },
  communication: { icon: Message01Icon, keywords: ['chat', 'message', 'mensagem', 'slack', 'discord', 'teams', 'communication', 'comunicacao', 'whatsapp', 'telegram'] },
  email: { icon: Mail01Icon, keywords: ['email', 'mail', 'newsletter', 'inbox', 'smtp', 'mailchimp', 'sendgrid'] },
  hardware: { icon: CpuIcon, keywords: ['cpu', 'hardware', 'processor', 'ram', 'gpu', 'computer', 'computador', 'build', 'tech'] },
  mobile: { icon: SmartPhone01Icon, keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'smartphone'] },
  layers: { icon: Layers01Icon, keywords: ['layers', 'stack', 'architecture', 'microservices', 'framework', 'library', 'sdk', 'platform'] },
  science: { icon: FlaskConicalIcon, keywords: ['science', 'ciencia', 'research', 'pesquisa', 'experiment', 'lab', 'laboratory', 'biologia', 'quimica'] },
  physics: { icon: Atom01Icon, keywords: ['physics', 'fisica', 'quantum', 'energy', 'energia', 'particle', 'space', 'cosmos'] },
  microscopy: { icon: MicroscopeIcon, keywords: ['microscope', 'biotech', 'genomics', 'dna', 'genome', 'pharma', 'clinical'] },
  travel: { icon: MapPinIcon, keywords: ['travel', 'viagem', 'map', 'mapa', 'location', 'gps', 'navigation', 'tourism', 'hotel', 'flight'] },
  explore: { icon: Compass01Icon, keywords: ['explore', 'explorar', 'discover', 'discovery', 'compass', 'adventure'] },
  calendar: { icon: Calendar01Icon, keywords: ['calendar', 'calendario', 'schedule', 'agenda', 'event', 'evento', 'date', 'booking', 'meeting', 'reuniao'] },
  tools: { icon: Settings01Icon, keywords: ['tool', 'ferramenta', 'utility', 'config', 'settings', 'admin', 'panel', 'management'] },
  api: { icon: ApiIcon, keywords: ['api', 'rest', 'graphql', 'endpoint', 'webhook', 'integration', 'integracao', 'zapier', 'make'] },
  chip: { icon: ChipIcon, keywords: ['chip', 'iot', 'embedded', 'arduino', 'raspberry', 'sensor', 'electronics'] },
  robot: { icon: RoboticIcon, keywords: ['robot', 'automation', 'automacao', 'bot', 'rpa', 'scraping', 'crawler'] },
  charts: { icon: PieChart01Icon, keywords: ['pie', 'distribution', 'survey', 'poll', 'comparison', 'breakdown'] },
  reporting: { icon: Analytics01Icon, keywords: ['reporting', 'insight', 'bi', 'business intelligence', 'looker', 'tableau', 'power bi', 'metabase'] },
  plugin: { icon: Plug01Icon, keywords: ['plugin', 'extension', 'addon', 'module', 'integration', 'connector'] },
  gift: { icon: GiftIcon, keywords: ['gift', 'presente', 'reward', 'bonus', 'promo', 'coupon', 'discount', 'free', 'deal'] },
  search: { icon: Search01Icon, keywords: ['search', 'busca', 'pesquisa', 'find', 'filter', 'algolia', 'elasticsearch', 'meilisearch'] },
  magic: { icon: MagicWand01Icon, keywords: ['magic', 'magia', 'template', 'generator', 'builder', 'no-code', 'low-code', 'nocode'] },
  web: { icon: GlobeIcon, keywords: ['web', 'website', 'site', 'internet', 'online', 'browser', 'chrome', 'firefox', 'safari'] },
  link: { icon: Link01Icon, keywords: ['link', 'url', 'bookmark', 'shortener', 'redirect', 'share'] },
};

export const VALID_ICON_KEYS = Object.keys(ICON_CATEGORIES);

const GRADIENTS_45 = [
  'linear-gradient(135deg, #0EA5E9, #6366F1)',
  'linear-gradient(135deg, #10B981, #0D9488)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #EC4899, #8B5CF6)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
  'linear-gradient(135deg, #F97316, #F59E0B)',
  'linear-gradient(135deg, #14B8A6, #22D3EE)',
  'linear-gradient(135deg, #6366F1, #EC4899)',
  'linear-gradient(135deg, #84CC16, #10B981)',
  'linear-gradient(135deg, #E11D48, #F97316)',
  'linear-gradient(135deg, #0284C7, #06B6D4)',
  'linear-gradient(135deg, #7C3AED, #3B82F6)',
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getIconComponent(iconKey: string): IconSvgElement {
  return ICON_CATEGORIES[iconKey]?.icon ?? GlobeIcon;
}

export function getIconGradient(iconKey: string): string {
  const idx = hashStr(iconKey) % GRADIENTS_45.length;
  return GRADIENTS_45[idx];
}

export function inferIconKey(tags: string[], title: string): string {
  const text = [...tags, title].join(' ').toLowerCase();

  let bestKey = 'web';
  let bestScore = 0;

  for (const [key, entry] of Object.entries(ICON_CATEGORIES)) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey;
}
