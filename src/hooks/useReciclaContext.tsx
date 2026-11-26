import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USUARIO_MOCK } from '../services/mockPontos';
import { api } from '../services/api';
import { CategoriaResiduo, PontoColeta, Usuario } from '../types';

const FAVORITOS_STORAGE_KEY = '@reciclaspot:favoritos';
const CONTRIBUICOES_STORAGE_KEY = '@reciclaspot:contribuicoes';

const EMOJI_POR_CATEGORIA: Record<string, string> = {
  'Eletrônicos': '🖥️',
  'Óleo Usado': '🛢️',
  'Pilhas/Baterias': '🔋',
  'Medicamentos': '💊',
};

export interface Contribuicao {
  id: string;
  material: CategoriaResiduo;
  local: string;
  data: string;
  emoji: string;
  fotoUri?: string;
}

export interface NovoUsuarioDTO {
  nome: string;
  email: string;
  senha?: string;
  cidade?: string;
}

interface ReciclaContextData {
  pontos: PontoColeta[];
  favoritosIds: string[];
  usuario: Usuario;
  contribuicoes: Contribuicao[];
  carregando: boolean;
  atualizando: boolean;
  erro: string | null;
  carregarPontos: (material?: string, isRefresh?: boolean) => Promise<void>;
  buscarPontoPorId: (id: string) => Promise<PontoColeta | null>;
  cadastrarUsuario: (dados: NovoUsuarioDTO) => Promise<void>;
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
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>(['1', '2', '3']);
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_MOCK);
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>(CONTRIBUICOES_INICIAIS);

  // Estados de resiliência de rede (Sprint 3)
  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // 1. GET /ecopontos (com suporte a filtro por material e Pull-to-Refresh)
  const carregarPontos = useCallback(async (material?: string, isRefresh = false) => {
    try {
      if (isRefresh) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }
      setErro(null);

      const params =
        material && material !== 'Todos'
          ? { material: material.toLowerCase() }
          : {};

      const response = await api.get<PontoColeta[]>('/ecopontos', { params });
      setPontos(response.data);
    } catch (error) {
      setErro('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // 2. GET /ecopontos/:id (detalhes aprofundados)
  async function buscarPontoPorId(id: string): Promise<PontoColeta | null> {
    try {
      const response = await api.get<PontoColeta>(`/ecopontos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do ecoponto:', error);
      return pontos.find((p) => p.id === id) || null;
    }
  }

  // 3. POST /usuarios (cadastro de novo cidadão)
  async function cadastrarUsuario(dados: NovoUsuarioDTO): Promise<void> {
    const response = await api.post('/usuarios', dados);
    setUsuario((prev) => ({
      ...prev,
      ...response.data,
    }));
  }

  // Carrega dados da API e armazenamento offline ao iniciar
  useEffect(() => {
    carregarPontos();

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
  }, [carregarPontos]);

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
      emoji: EMOJI_POR_CATEGORIA[dados.material] || '♻️',
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
        pontos,
        favoritosIds,
        usuario,
        contribuicoes,
        carregando,
        atualizando,
        erro,
        carregarPontos,
        buscarPontoPorId,
        cadastrarUsuario,
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
