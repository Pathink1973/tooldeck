import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'register' | 'reset';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword, error } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/dashboard');
        toast.success('Login realizado com sucesso!');
      } else if (mode === 'register') {
        await signUp(email, password);
        toast.success('Conta criada com sucesso!');
        navigate('/dashboard');
      } else if (mode === 'reset') {
        await resetPassword(email);
        toast.success('Email de recuperação enviado!');
        setMode('login');
      }
    } catch {
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className={`transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
      tabIndex={-1}
      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 space-y-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-2xl shadow-xl transition-all duration-300`}>
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#22D3EE] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            TD
          </div>
        </div>

        <div className="text-center">
          <h2 className={`text-2xl font-bold font-manrope ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mode === 'login' ? 'Entrar no Tooldeck' :
             mode === 'register' ? 'Criar uma conta' :
             'Recuperar senha'}
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {mode === 'login' ? 'Acesse a sua biblioteca de ferramentas' :
             mode === 'register' ? 'Comece a organizar as suas ferramentas' :
             'Enviaremos um link para o seu email'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            leftIcon={<Mail className="h-4 w-4" />}
            className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
          />

          {mode !== 'reset' && (
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={passwordToggle}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
              />
            </div>
          )}

          {error && (
            <div className={`text-sm px-3 py-2 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={submitting}
            leftIcon={mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          >
            {mode === 'login' ? 'Entrar' :
             mode === 'register' ? 'Registrar' :
             'Enviar link de recuperação'}
          </Button>
        </form>

        <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-center text-sm`}>
          {mode === 'login' ? (
            <div className="flex justify-center items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`font-medium transition-colors ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#6366F1] hover:text-indigo-700'}`}
              >
                Criar uma conta
              </button>
              <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>|</span>
              <button
                type="button"
                onClick={() => setMode('reset')}
                className={`font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Esqueceu a senha?
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`font-medium transition-colors ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#6366F1] hover:text-indigo-700'}`}
            >
              Já tem uma conta? Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
