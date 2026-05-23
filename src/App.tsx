import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sparkles, Grid3x3 as Grid3X3, Tag, Share2, ArrowRight, Zap, Shield, Layers, Search, SlidersHorizontal, MoreHorizontal, MonitorSmartphone, Undo2, Redo2, LayoutPanelLeft, Users, PanelLeft } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Header } from './components/layout/Header';
import { AuthForm } from './components/auth/AuthForm';
import { CardGrid } from './components/cards/CardGrid';
import { AddCardForm } from './components/cards/AddCardForm';
import { FilterBar } from './components/filters/FilterBar';
import { CollectionsSidebar } from './components/collections/CollectionsSidebar';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { DarkModeToggleSwitch } from './components/ui/DarkModeToggleSwitch';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, initialized } = useAuthStore();
  const { darkMode } = useThemeStore();

  if (!initialized) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ─── Feature cards data ──────────────────────────────────────────────────────
const features = [
  {
    icon: Grid3X3,
    title: 'Biblioteca Visual',
    desc: 'Organize os seus recursos em cartões visuais com imagens, descrições e tags geradas por IA.',
    glow: 'rgba(14,165,233,0.35)',
    gradientFrom: 'from-sky-500/20',
    gradientTo: 'to-cyan-400/5',
    border: 'border-sky-500/20',
    iconGradient: 'from-sky-400 to-cyan-300',
    iconBg: 'bg-sky-500/10',
    iconBorder: 'border-sky-500/20',
    iconColor: 'text-sky-400',
    tag: 'Visual',
    tagColor: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  },
  {
    icon: Sparkles,
    title: 'Descrições com IA',
    desc: 'Gere automaticamente descrições e tags para os seus links com inteligência artificial.',
    glow: 'rgba(16,185,129,0.35)',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-teal-400/5',
    border: 'border-emerald-500/20',
    iconGradient: 'from-emerald-400 to-teal-300',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    tag: 'GPT-4o',
    tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Layers,
    title: 'Coleções Personalizadas',
    desc: 'Crie coleções com nomes personalizados para organizar por tema.',
    glow: 'rgba(245,158,11,0.30)',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-orange-400/5',
    border: 'border-amber-500/20',
    iconGradient: 'from-amber-400 to-orange-300',
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    tag: 'Organização',
    tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Tag,
    title: 'Filtros Inteligentes',
    desc: 'Filtre e pesquise por tags, favoritos ou coleções para encontrar qualquer recurso.',
    glow: 'rgba(236,72,153,0.30)',
    gradientFrom: 'from-pink-500/20',
    gradientTo: 'to-rose-400/5',
    border: 'border-pink-500/20',
    iconGradient: 'from-pink-400 to-rose-300',
    iconBg: 'bg-pink-500/10',
    iconBorder: 'border-pink-500/20',
    iconColor: 'text-pink-400',
    tag: 'Pesquisa',
    tagColor: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
  },
  {
    icon: Share2,
    title: 'Partilha Fácil',
    desc: 'Partilhe as suas coleções de ferramentas com colegas via email com um clique.',
    glow: 'rgba(99,102,241,0.30)',
    gradientFrom: 'from-blue-500/20',
    gradientTo: 'to-cyan-500/5',
    border: 'border-blue-500/20',
    iconGradient: 'from-blue-400 to-cyan-300',
    iconBg: 'bg-blue-500/10',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    tag: 'Colaboração',
    tagColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    desc: 'Os seus dados pertencem apenas a si. Autenticação segura e dados isolados.',
    glow: 'rgba(20,184,166,0.30)',
    gradientFrom: 'from-teal-500/20',
    gradientTo: 'to-emerald-400/5',
    border: 'border-teal-500/20',
    iconGradient: 'from-teal-400 to-emerald-300',
    iconBg: 'bg-teal-500/10',
    iconBorder: 'border-teal-500/20',
    iconColor: 'text-teal-400',
    tag: 'Privacidade',
    tagColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
  },
];

// ─── Mock card previews ───────────────────────────────────────────────────────
const mockCards = [
  { title: 'Midjourney', tag: 'IA', color: '#6366F1', img: 'https://ik.imagekit.io/8gvnjnrjr/tooldeck/midjourney.png' },
  { title: 'Figma', tag: 'Design', color: '#22D3EE', img: 'https://ik.imagekit.io/8gvnjnrjr/tooldeck/figma.png' },
  { title: 'ChatGPT', tag: 'IA', color: '#10B981', img: 'https://ik.imagekit.io/8gvnjnrjr/tooldeck/chat-gpt.png' },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { user } = useAuthStore();
  const { darkMode } = useThemeStore();

  return (
    <div className={`landing-page min-h-screen overflow-x-hidden${darkMode ? '' : ' landing-light'}`}>
      {/* Hero */}
      <section className="relative z-10">
        {/* Ambient background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-glow-1 absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-[120px] bg-blue-600" />
          <div className="hero-glow-2 absolute top-80 -left-60 w-[500px] h-[400px] rounded-full opacity-10 blur-[100px] bg-cyan-500" />
          <div className="hero-glow-2 absolute top-40 -right-60 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-sky-500" />
        </div>

        {/* Dark mode toggle top right */}
        <div className="absolute top-6 right-6 z-20">
          <DarkModeToggleSwitch />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 md:px-6 md:pt-16">
          <div className="max-w-3xl text-center mx-auto">
            {/* Badge */}
            <p className="hero-badge mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <Zap className="h-4 w-4 text-sky-400" />
              Powered by GPT-4o
            </p>

            <h1 className="hero-headline text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white leading-tight">
              A sua biblioteca{' '}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                criativa
              </span>
              <br />com inteligência artificial
            </h1>

            <p className="hero-body mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Guarde links, organize ferramentas e deixe a IA criar descrições e tags automaticamente.
              Coleções personalizadas para cada projeto.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row mt-8 items-center justify-center">
              {user ? (
                <Link to="/dashboard" className="aura-btn">
                  <span className="aura-btn-points">
                    {Array.from({ length: 10 }).map((_, i) => <i key={i} className="aura-point" style={{ left: `${[10,30,25,44,50,75,88,58,98,65][i]}%`, opacity: [1,0.7,0.8,0.6,1,0.5,0.9,0.8,0.6,1][i], animationDuration: `${[2.35,2.5,2.2,2.05,1.9,1.5,2.2,2.25,2.6,2.5][i]}s`, animationDelay: `${[0.2,0.5,0.1,0,0,1.5,0.2,0.2,0.1,0.2][i]}s` }} />)}
                  </span>
                  <span className="aura-btn-inner">
                    Ir para o Dashboard
                    <ArrowRight className="h-[18px] w-[18px] stroke-white aura-btn-icon" />
                  </span>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="aura-btn">
                    <span className="aura-btn-points">
                      {Array.from({ length: 10 }).map((_, i) => <i key={i} className="aura-point" style={{ left: `${[10,30,25,44,50,75,88,58,98,65][i]}%`, opacity: [1,0.7,0.8,0.6,1,0.5,0.9,0.8,0.6,1][i], animationDuration: `${[2.35,2.5,2.2,2.05,1.9,1.5,2.2,2.25,2.6,2.5][i]}s`, animationDelay: `${[0.2,0.5,0.1,0,0,1.5,0.2,0.2,0.1,0.2][i]}s` }} />)}
                    </span>
                    <span className="aura-btn-inner">
                      Começar gratuitamente
                      <ArrowRight className="h-[18px] w-[18px] stroke-white aura-btn-icon" />
                    </span>
                  </Link>
                  <Link to="/login" className="ghost-btn-light group relative inline-flex items-center justify-center min-w-[120px] cursor-pointer rounded-xl px-[17px] py-[12px] text-white/70 font-semibold transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] hover:-translate-y-[3px] hover:scale-[1.1] hover:text-white"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', background: 'radial-gradient(ellipse at bottom, rgba(71,81,92,1) 0%, rgba(0,0,0,1) 100%)' }}>
                    <span className="relative z-10 font-normal">Entrar</span>
                    <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 opacity-20 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] group-hover:opacity-80"
                      style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)' }} />
                  </Link>
                </>
              )}
            </div>

            <div className="hero-social mt-6 flex items-center justify-center gap-3 text-sm text-slate-400">
              <div className="flex -space-x-2">
                <img className="h-6 w-6 rounded-full ring-2 ring-black/60 object-cover" src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64" alt="" />
                <img className="h-6 w-6 rounded-full ring-2 ring-black/60 object-cover" src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64" alt="" />
                <img className="h-6 w-6 rounded-full ring-2 ring-black/60 object-cover" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64" alt="" />
              </div>
              <span>Usado por criativos e equipas modernas</span>
            </div>
          </div>
        </div>

        {/* Editor preview */}
        <div className="-mb-8 max-w-7xl md:px-6 mx-auto px-4">
          <div className="editor-shell relative w-full overflow-hidden shadow-black/50 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border-white/10 border rounded-2xl shadow-2xl backdrop-blur-lg">
            {/* Topbar */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <div className="ml-3 hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 sm:flex">
                  <LayoutPanelLeft className="h-3.5 w-3.5 text-slate-200" />
                  Tooldeck — A sua biblioteca criativa
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden rounded-md border border-white/10 bg-white/5 p-1.5 text-slate-200 hover:bg-white/10 sm:inline-flex">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="hidden rounded-md border border-white/10 bg-white/5 p-1.5 text-slate-200 hover:bg-white/10 sm:inline-flex">
                  <Users className="h-4 w-4" />
                </button>
                <button className="rounded-md bg-sky-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500">Publicar</button>
              </div>
            </div>

            {/* Editor body */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left panel */}
              <aside className="hidden md:block md:col-span-3 bg-black/30 border-white/10 border-r p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-300">
                    <PanelLeft className="h-3.5 w-3.5" />
                    Ferramentas
                  </div>
                  <button className="rounded-md border border-white/10 bg-white/5 p-1 text-slate-300 hover:bg-white/10">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="bg-white/5 rounded-lg p-2 space-y-2">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1">Categorias</p>
                    {[
                      { label: 'Todas', color: 'text-sky-400', active: true },
                      { label: 'IA', color: 'text-emerald-400', active: false },
                      { label: 'Design', color: 'text-cyan-400', active: false },
                      { label: 'Produtividade', color: 'text-amber-400', active: false },
                      { label: 'Favoritos', color: 'text-pink-400', active: false },
                    ].map(item => (
                      <div key={item.label} className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer ${item.active ? 'bg-sky-500/10' : 'hover:bg-white/5'}`}>
                        <Layers className={`h-3.5 w-3.5 ${item.color}`} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 space-y-2 mt-2">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1">Coleções</p>
                    <div className="grid grid-cols-3 gap-2">
                      {mockCards.map(card => (
                        <div key={card.title} className="aspect-video overflow-hidden rounded-md bg-white/5">
                          <img src={card.img} className="h-full w-full object-cover opacity-90" alt={card.title} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Canvas */}
              <main className="relative md:col-span-6 bg-black/20">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-slate-300">
                  <MonitorSmartphone className="h-4 w-4 text-sky-400" />
                  <span>Vista</span>
                  <span className="rounded-md bg-white/5 px-1.5 py-0.5">Grade</span>
                  <span className="text-slate-500">|</span>
                  <span>3 ferramentas</span>
                  <div className="ml-auto flex items-center gap-1">
                    <button className="rounded-md border border-white/10 bg-white/5 p-1 hover:bg-white/10"><Undo2 className="h-4 w-4" /></button>
                    <button className="rounded-md border border-white/10 bg-white/5 p-1 hover:bg-white/10"><Redo2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="sm:p-6 p-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ring-1 ring-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                      {mockCards.map((card, i) => (
                        <div key={card.title} className={`group relative overflow-hidden transition-all duration-300 hover:z-10 ${i < 2 ? 'sm:border-r border-white/10' : ''}`}>
                          <div className="h-36 overflow-hidden">
                            <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <div className="p-3 border-t border-white/10">
                            <p className="text-sm font-semibold text-white">{card.title}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: card.color }}>
                              {card.tag}
                            </span>
                          </div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-inset ring-2 ring-sky-400/40 rounded-none" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </main>

              {/* Right panel */}
              <aside className="hidden md:block md:col-span-3 border-l border-white/10 bg-black/30 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-300">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Propriedades
                  </div>
                  <button className="rounded-md border border-white/10 bg-white/5 p-1 text-slate-300 hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {/* Favourites */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">Favoritos</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">Relativo</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-300 hover:bg-white/10 flex items-center justify-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-pink-400" />Todos
                      </button>
                      <button className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-sky-300 flex items-center justify-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-sky-400" />Fixos
                      </button>
                      <button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-300 hover:bg-white/10 flex items-center justify-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-amber-400" />Recentes
                      </button>
                    </div>
                  </div>

                  {/* AI Tags */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Tags com IA</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">Auto</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {[
                        { label: '#design', color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10' },
                        { label: '#ia', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
                        { label: '#figma', color: 'text-sky-300 border-sky-500/30 bg-sky-500/10' },
                        { label: '#produtividade', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
                        { label: '#gpt-4o', color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' },
                        { label: '#criativo', color: 'text-violet-300 border-violet-500/30 bg-violet-500/10' },
                      ].map(t => (
                        <span key={t.label} className={`rounded-full border px-2 py-0.5 font-medium ${t.color}`}>{t.label}</span>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-[11px] text-slate-400">
                      <Sparkles className="h-3 w-3 text-sky-400 shrink-0" />
                      <span className="truncate">IA a gerar tags…</span>
                      <span className="ml-auto shrink-0 rounded bg-white/5 px-1 py-0.5 text-[10px]">GPT-4o</span>
                    </div>
                  </div>

                  {/* Card metadata */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">Metadados</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">3</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Grid3X3 className="h-3.5 w-3.5 text-sky-400" />Coleção
                        </span>
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">Academia crIA</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Share2 className="h-3.5 w-3.5 text-amber-400" />Partilha
                        </span>
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">Via email</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Shield className="h-3.5 w-3.5 text-emerald-400" />Acesso
                        </span>
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">Privado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-4 bg-[#080c14]">
        {/* Subtle section glow */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-10 blur-[120px] bg-sky-500 pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <p className="features-badge mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              Funcionalidades
            </p>
            <h2 className="features-headline text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
              Tudo o que precisa<br />para organizar
            </h2>
            <p className="features-body text-base md:text-lg text-slate-400 max-w-xl mx-auto">
              Funcionalidades pensadas para criativos, developers e equipas que precisam de ordem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card group relative overflow-hidden rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradientFrom} ${f.gradientTo} p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default`}
                style={{
                  '--card-glow': f.glow,
                  animationDelay: `${i * 80}ms`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
                } as React.CSSProperties}
              >
                {/* Glow blob on hover */}
                <div
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                  style={{ background: f.glow }}
                />
                {/* Top shimmer line */}
                <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`} />

                {/* Icon */}
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${f.iconBg} border ${f.iconBorder}`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                  {/* Icon inner glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: `inset 0 0 12px ${f.glow}` }} />
                </div>

                {/* Tag pill */}
                <span className={`inline-flex items-center mb-3 rounded-full border px-2 py-0.5 text-[10px] font-medium ${f.tagColor}`}>
                  {f.tag}
                </span>

                <h3 className="text-base font-semibold mb-2 text-white leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {f.desc}
                </p>

                {/* Bottom motion frame line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-transparent to-transparent`}
                  style={{ background: `linear-gradient(90deg, transparent, ${f.glow}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#080c14]">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="cta-card relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl">
            {/* Layered background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-white/[0.01]" />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-cyan-500/5" />

            {/* Animated glow orbs */}
            <div className="absolute -top-32 left-1/4 w-[300px] h-[300px] rounded-full opacity-25 blur-[80px] bg-sky-500 pointer-events-none" />
            <div className="absolute -bottom-32 right-1/4 w-[280px] h-[280px] rounded-full opacity-20 blur-[80px] bg-cyan-400 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] rounded-full opacity-10 blur-[60px] bg-blue-400 pointer-events-none" />

            {/* Top shimmer border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            {/* Bottom shimmer border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Grid texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Content */}
            <div className="relative px-8 py-16 sm:px-16 sm:py-20">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                Começa agora — é gratuito
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4 leading-tight">
                Pronto para<br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  começar?
                </span>
              </h2>

              <p className="mb-10 text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                Gratuito. Sem cartão de crédito.<br />Comece a organizar em segundos.
              </p>

              {/* Stats row */}
              <div className="mb-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm">
                {[
                  { value: 'GPT-4o', label: 'Motor de IA' },
                  { value: '100%', label: 'Privacidade' },
                  { value: '∞', label: 'Ferramentas' },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-semibold text-white">{stat.value}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!user && (
                  <>
                    <Link to="/register" className="aura-btn">
                      <span className="aura-btn-points">
                        {Array.from({ length: 10 }).map((_, i) => <i key={i} className="aura-point" style={{ left: `${[10,30,25,44,50,75,88,58,98,65][i]}%`, opacity: [1,0.7,0.8,0.6,1,0.5,0.9,0.8,0.6,1][i], animationDuration: `${[2.35,2.5,2.2,2.05,1.9,1.5,2.2,2.25,2.6,2.5][i]}s`, animationDelay: `${[0.2,0.5,0.1,0,0,1.5,0.2,0.2,0.1,0.2][i]}s` }} />)}
                      </span>
                      <span className="aura-btn-inner">
                        Criar conta gratuita
                        <ArrowRight className="h-[18px] w-[18px] stroke-white aura-btn-icon" />
                      </span>
                    </Link>
                    <Link to="/login"
                      className="cta-secondary-btn group relative inline-flex items-center justify-center min-w-[140px] cursor-pointer rounded-xl px-[17px] py-[12px] text-white/70 font-semibold transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] hover:-translate-y-[3px] hover:scale-[1.05] hover:text-white"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', background: 'radial-gradient(ellipse at bottom, rgba(71,81,92,1) 0%, rgba(0,0,0,1) 100%)' }}>
                      <span className="relative z-10 font-normal">Já tenho conta</span>
                      <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 opacity-20 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] group-hover:opacity-80"
                        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)' }} />
                    </Link>
                  </>
                )}
                {user && (
                  <Link to="/dashboard" className="aura-btn">
                    <span className="aura-btn-points">
                      {Array.from({ length: 10 }).map((_, i) => <i key={i} className="aura-point" style={{ left: `${[10,30,25,44,50,75,88,58,98,65][i]}%`, opacity: [1,0.7,0.8,0.6,1,0.5,0.9,0.8,0.6,1][i], animationDuration: `${[2.35,2.5,2.2,2.05,1.9,1.5,2.2,2.25,2.6,2.5][i]}s`, animationDelay: `${[0.2,0.5,0.1,0,0,1.5,0.2,0.2,0.1,0.2][i]}s` }} />)}
                    </span>
                    <span className="aura-btn-inner">
                      Ir para o Dashboard
                      <ArrowRight className="h-[18px] w-[18px] stroke-white aura-btn-icon" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-[#080c14]">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              TD
            </div>
            <span className="text-sm font-semibold text-slate-400">Tooldeck</span>
          </div>
          <p className="text-xs text-slate-600">
            Tooldeck v.2.0 — Patrício Brito © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { darkMode } = useThemeStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <AddCardForm />
        <CollectionsSidebar />
        <FilterBar />
        <CardGrid />
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const { initAuth } = useAuthStore();
  const { darkMode } = useThemeStore();

  React.useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: darkMode ? {
              background: '#1F2937',
              color: '#fff',
              borderColor: '#374151',
            } : undefined,
          }}
        />
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
