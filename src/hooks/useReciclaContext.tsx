import React, { createContext, useContext, useState } from 'react';
import { PONTOS_COLETA_MOCK, USUARIO_MOCK } from '../services/mockPontos';
import { PontoColeta, Usuario } from '../types';

interface ReciclaContextData {
  pontos: PontoColeta[];
  favoritosIds: string[];
  usuario: Usuario;
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
  adicionarDescarte: () => void;
}

const ReciclaContext = createContext<ReciclaContextData>({} as ReciclaContextData);

export function ReciclaProvider({ children }: { children: React.ReactNode }) {
  const [favoritosIds, setFavoritosIds] = useState<string[]>(['1', '2', '3']);
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_MOCK);

  function toggleFavorito(id: string) {
    setFavoritosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function isFavorito(id: string) {
    return favoritosIds.includes(id);
  }

  function adicionarDescarte() {
    setUsuario((prev) => ({
      ...prev,
      pontosReciclagem: prev.pontosReciclagem + 1,
    }));
  }

  return (
    <ReciclaContext.Provider
      value={{
        pontos: PONTOS_COLETA_MOCK,
        favoritosIds,
        usuario,
        toggleFavorito,
        isFavorito,
        adicionarDescarte,
      }}
    >
      {children}
    </ReciclaContext.Provider>
  );
}

export function useRecicla() {
  return useContext(ReciclaContext);
}
