import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PONTOS_COLETA_MOCK, USUARIO_MOCK } from '../services/mockPontos';
import { CategoriaResiduo, PontoColeta, Usuario } from '../types';

const FAVORITOS_STORAGE_KEY = '@reciclaspot:favoritos';
const CONTRIBUICOES_STORAGE_KEY = '@reciclaspot:contribuicoes';

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

  // Carrega favoritos e contribuições salvos offline ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const favsSalvos = await AsyncStorage.getItem(FAVORITOS_STORAGE_KEY);
        if (favsSalvos !== null) {
          setFavoritosIds(JSON.parse(favsSalvos));
        }

        const contribSalvas = await AsyncStorage.getItem(CONTRIBUICOES_STORAGE_KEY);
        if (contribSalvas !== null) {
          setContribuicoes(JSON.parse(contribSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar dados offline:', error);
      }
    })();
  }, []);

  async function toggleFavorito(id: string) {
    try {
      const novaLista = favoritosIds.includes(id)
        ? favoritosIds.filter((item) => item !== id)
        : [...favoritosIds, id];

      setFavoritosIds(novaLista);
      await AsyncStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
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

  async function registrarNovoDescarte(dados: {
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

    const listaAtualizada = [nova, ...contribuicoes];
    setContribuicoes(listaAtualizada);
    setUsuario((prev) => ({
      ...prev,
      pontosReciclagem: prev.pontosReciclagem + 1,
    }));

    try {
      await AsyncStorage.setItem(CONTRIBUICOES_STORAGE_KEY, JSON.stringify(listaAtualizada));
    } catch (error) {
      console.error('Erro ao salvar contribuição offline:', error);
    }
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
