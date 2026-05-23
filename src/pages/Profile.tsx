import React from 'react';
import { User, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const { darkMode } = useThemeStore();
  const [loading, setLoading] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.display_name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ display_name: displayName });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update local state when user data changes
  React.useEffect(() => {
    if (user?.display_name !== undefined) {
      setDisplayName(user.display_name || '');
    }
  }, [user?.display_name]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-2xl font-bold font-manrope mb-8 ${darkMode ? 'text-white' : ''}`}>
            Perfil
          </h1>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-[12px] shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${darkMode ? 'shadow-indigo-500/20 hover:shadow-indigo-500/30' : 'shadow-indigo-500/10 hover:shadow-indigo-500/20'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : ''}`}>
              Informações Básicas
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={user?.email}
                disabled
                leftIcon={<Mail className="h-4 w-4" />}
                className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};