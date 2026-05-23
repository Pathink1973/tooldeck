import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, User, Settings, Grid2x2 as Grid, List, Columns2 as Columns } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCardStore } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { DarkModeToggleSwitch } from '../ui/DarkModeToggleSwitch';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { viewMode, setViewMode, setSearchQuery } = useCardStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#E5E7EB]'} border-b shadow-sm sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#22D3EE] rounded-md flex items-center justify-center text-white font-bold">
                TD
              </div>
              <span className={`ml-2 text-xl font-bold font-manrope ${darkMode ? 'text-white' : 'text-[#111827]'} hidden sm:inline`}>
                Tooldeck
              </span>
            </Link>
          </div>

          {/* Search bar - show on desktop and as full width on mobile menu */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <Input
                placeholder="Buscar ferramentas, tags..."
                className={`w-full ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                leftIcon={<Search className="h-4 w-4" />}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* View mode toggles */}
                <div className={`flex border rounded-[12px] p-1 mr-2 ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
                  <Toggle
                    pressed={viewMode === 'grid'}
                    onClick={() => setViewMode('grid')}
                    size="sm"
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                    size="sm"
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={viewMode === 'kanban'}
                    onClick={() => setViewMode('kanban')}
                    size="sm"
                    aria-label="Kanban view"
                  >
                    <Columns className="h-4 w-4" />
                  </Toggle>
                </div>

                {/* Dark mode toggle */}
                <DarkModeToggleSwitch />

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                    onClick={() => setUserMenuOpen(prev => !prev)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden z-[200] ${
                        darkMode
                          ? 'bg-gray-900 border-white/10 shadow-black/60'
                          : 'bg-white border-slate-200/80 shadow-slate-200/60'
                      }`}
                    >
                      {/* User email header */}
                      <div className={`px-4 py-3 border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                        <p className={`text-[11px] font-medium uppercase tracking-wider mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Conta</p>
                        <p className={`text-sm truncate font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          to="/profile"
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                            darkMode ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 shrink-0 text-sky-400" />
                          Perfil
                        </Link>
                        <Link
                          to="/settings"
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                            darkMode ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                          Configurações
                        </Link>
                      </div>

                      {/* Sign out */}
                      <div className={`border-t py-1.5 ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                          onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                            darkMode ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300' : 'text-rose-500 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Registrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#E5E7EB]'} border-t`}>
          {user && (
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
              <Input
                placeholder="Buscar ferramentas, tags..."
                className="w-full"
                leftIcon={<Search className="h-4 w-4" />}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <div className="px-4 py-2 space-y-1">
            {user ? (
              <>
                <div className={`flex items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
                  <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center text-white text-lg mr-3">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* View mode toggles in mobile */}
                <div className={`flex justify-center gap-2 p-4 border-b ${darkMode ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    leftIcon={<Grid className="h-4 w-4" />}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    leftIcon={<List className="h-4 w-4" />}
                  >
                    Lista
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    leftIcon={<Columns className="h-4 w-4" />}
                  >
                    Kanban
                  </Button>
                </div>
                
                <Link 
                  to="/profile" 
                  className={`block px-4 py-3 text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} rounded-lg`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    Perfil
                  </div>
                </Link>
                
                <Link 
                  to="/settings" 
                  className={`block px-4 py-3 text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} rounded-lg`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-3" />
                    Configurações
                  </div>
                </Link>
                
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                  <span className={`text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {darkMode ? 'Modo escuro' : 'Modo claro'}
                  </span>
                  <DarkModeToggleSwitch />
                </div>
                
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} rounded-lg`}
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sair
                  </div>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 p-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Registrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};