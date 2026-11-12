import React, { createContext, useContext, useState } from 'react';
import { PONTOS_COLETA_MOCK, USUARIO_MOCK } from '../services/mockPontos';
import { CategoriaResiduo, PontoColeta, Usuario } from '../types';

export interface Contribuicao {
  id: string;
  material: CategoriaResiduo;
  local: string;
  data: string;
  emoji: string;
  fotoUri?: string;
}

interface ReciclaContextData {
  pontos: PontoColeta[];
  favoritosIds: string[];
  usuario: Usuario;
  contribuicoes: Contribuicao[];
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
  registrarNovoDescarte: (dados: {
    material: CategoriaResiduo;
    local: string;
    fotoUri?: string;
  }) => void;
}

const CONTRIBUICOES_INICIAIS: Contribuicao[] = [
  {
    id: 'c1',
    material: 'Eletrônicos',
    local: 'Ecoponto Central Vargas • Centro',
    data: 'Há 2 dias',
    emoji: '🖥️',
  },
  {
    id: 'c2',
    material: 'Óleo Usado',
    local: 'Cooperativa Verde • Jd. Bandeiras',
    data: '12/Out',
    emoji: '🛢️',
  },
  {
    id: 'c3',
    material: 'Pilhas/Baterias',
    local: 'Ponto Eco • Jd. Paulista',
    data: '05/Set',
    emoji: '🔋',
  },
];

const ReciclaContext = createContext<ReciclaContextData>({} as ReciclaContextData);

export function ReciclaProvider({ children }: { children: React.ReactNode }) {
  const [favoritosIds, setFavoritosIds] = useState<string[]>(['1', '2', '3']);
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_MOCK);
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>(CONTRIBUICOES_INICIAIS);

  function toggleFavorito(id: string) {
    setFavoritosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function isFavorito(id: string) {
    return favoritosIds.includes(id);
  }

  function obterEmoji(categoria: CategoriaResiduo) {
    if (categoria === 'Eletrônicos') return '🖥️';
    if (categoria === 'Óleo Usado') return '🛢️';
    if (categoria === 'Pilhas/Baterias') return '🔋';
    if (categoria === 'Medicamentos') return '💊';
    return '♻️';
  }

  function registrarNovoDescarte(dados: {
    material: CategoriaResiduo;
    local: string;
    fotoUri?: string;
  }) {
    const nova: Contribuicao = {
      id: String(Date.now()),
      material: dados.material,
      local: dados.local,
      data: 'Agora mesmo',
      emoji: obterEmoji(dados.material),
      fotoUri: dados.fotoUri,
    };

    setContribuicoes((prev) => [nova, ...prev]);
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
        contribuicoes,
        toggleFavorito,
        isFavorito,
        registrarNovoDescarte,
      }}
    >
      {children}
    </ReciclaContext.Provider>
  );
}

export function useRecicla() {
  return useContext(ReciclaContext);
}
