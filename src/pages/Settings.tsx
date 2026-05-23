import React, { useState } from 'react';
import { Moon, Sun, HelpCircle, X } from 'lucide-react';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { useThemeStore } from '../store/themeStore';

export const Settings = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-2xl font-bold font-manrope mb-8 ${darkMode ? 'text-white' : ''}`}>Configurações</h1>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-[12px] shadow-md p-6 space-y-6`}>
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : ''}`}>Aparência</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {darkMode ? (
                    <Moon className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  ) : (
                    <Sun className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Modo escuro
                  </span>
                </div>
                <Toggle
                  pressed={darkMode}
                  onClick={toggleDarkMode}
                >
                  <span className="sr-only">Toggle dark mode</span>
                </Toggle>
              </div>
            </div>

            <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : ''}`}>Ajuda</h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowHelpModal(true)}
                leftIcon={<HelpCircle className="h-4 w-4" />}
              >
                Como utilizar o Tooldeck
              </Button>
            </div>

            <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tooldeck v.2.0 — Patrício Brito © 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-[12px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold font-manrope ${darkMode ? 'text-white' : ''}`}>
                Como utilizar o Tooldeck
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                  Adicionar Recursos
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Para adicionar um novo recurso, utilize o formulário no topo da página principal. Cole o URL do recurso e, opcionalmente, adicione uma imagem personalizada. O Tooldeck irá automaticamente gerar uma descrição e tags utilizando IA.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                  Organização
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Os seus recursos podem ser visualizados em três formatos diferentes:
                </p>
                <ul className={`list-disc pl-5 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Grelha: Visualização em cartões com imagens</li>
                  <li>Lista: Visualização detalhada em formato de lista</li>
                  <li>Kanban: Organização por tags em colunas</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                  Filtros e Pesquisa
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Utilize a barra de pesquisa para encontrar recursos específicos. Pode filtrar por tags e marcar recursos como favoritos para acesso rápido.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                  Partilha
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Cada recurso pode ser partilhado individualmente através de email. Clique no ícone de partilha em qualquer cartão para enviar o link para os seus contactos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};