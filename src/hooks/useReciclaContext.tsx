
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { CategoriaResiduo, PontoColeta, Usuario } from '../types';

const FAVORITOS_STORAGE_KEY = '@reciclaspot:favoritos';
const CONTRIBUICOES_STORAGE_KEY = '@reciclaspot:contribuicoes';
const USUARIO_STORAGE_KEY = '@reciclaspot:usuario';

const EMOJI_POR_CATEGORIA: Record<string, string> = {
  Eletrônicos: '🖥️',
  'Óleo Usado': '🛢️',
  'Pilhas/Baterias': '🔋',
  Medicamentos: '💊',
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

interface UsuarioCadastro extends Usuario {
  senha: string;
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

  carregarPontos: (
    material?: string,
    isRefresh?: boolean
  ) => Promise<void>;

  buscarPontoPorId: (id: string) => Promise<PontoColeta | null>;

  cadastrarUsuario: (dados: NovoUsuarioDTO) => Promise<void>;

  loginUsuario: (email: string, senha: string) => Promise<void>;

  logoutUsuario: () => Promise<void>;

  toggleFavorito: (id: string) => void;

  isFavorito: (id: string) => boolean;

  registrarNovoDescarte: (dados: {
    material: CategoriaResiduo;
    local: string;
    fotoUri?: string;
  }) => void;
}

const USUARIO_VAZIO: Usuario = {
  id: '',
  nome: '',
  email: '',
  pontosReciclagem: 0,
  fotoPerfilUri: '',
};

const ReciclaContext = createContext<ReciclaContextData>(
  {} as ReciclaContextData
);

export function ReciclaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_VAZIO);
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPontos = useCallback(
    async (material?: string, isRefresh = false) => {
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

        const response = await api.get<PontoColeta[]>('/ecopontos', {
          params,
        });

        setPontos(response.data);
      } catch (error) {
        setErro('Erro ao carregar dados. Verifique sua conexão.');
        console.error('Erro ao carregar ecopontos:', error);
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    []
  );

  async function buscarPontoPorId(
    id: string
  ): Promise<PontoColeta | null> {
    try {
      const response = await api.get<PontoColeta>(`/ecopontos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);

      return pontos.find((p) => String(p.id) === String(id)) || null;
    }
  }

  async function cadastrarUsuario(
    dados: NovoUsuarioDTO
  ): Promise<void> {
    const email = dados.email.trim().toLowerCase();

    try {
      const consulta = await api.get<UsuarioCadastro[]>('/usuarios', {
        params: { email },
      });

      const emailJaExiste = consulta.data.some(
        (item) => item.email.toLowerCase() === email
      );

      if (emailJaExiste) {
        throw new Error('Este e-mail já está cadastrado.');
      }

      const novoUsuario = {
        nome: dados.nome.trim(),
        email,
        senha: dados.senha || '',
        cidade: dados.cidade || 'Osvaldo Cruz - SP',
        pontosReciclagem: 0,
        fotoPerfilUri: '',
      };

      const response = await api.post<UsuarioCadastro>(
        '/usuarios',
        novoUsuario
      );

      const usuarioAtual: Usuario = {
        id: String(response.data.id),
        nome: response.data.nome,
        email: response.data.email,
        pontosReciclagem: response.data.pontosReciclagem,
        fotoPerfilUri: response.data.fotoPerfilUri || '',
      };

      setUsuario(usuarioAtual);

      await AsyncStorage.setItem(
        USUARIO_STORAGE_KEY,
        JSON.stringify(usuarioAtual)
      );

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        'Não foi possível realizar o cadastro. Verifique sua conexão.'
      );
    }
  }

  async function loginUsuario(
    email: string,
    senha: string
  ): Promise<void> {
    const emailNormalizado = email.trim().toLowerCase();

    try {
      const response = await api.get<UsuarioCadastro[]>('/usuarios', {
        params: { email: emailNormalizado },
      });

      const encontrado = response.data.find(
        (item) =>
          item.email.toLowerCase() === emailNormalizado &&
          item.senha === senha
      );

      if (!encontrado) {
        throw new Error('E-mail ou senha incorretos.');
      }

      const usuarioAtual: Usuario = {
        id: String(encontrado.id),
        nome: encontrado.nome,
        email: encontrado.email,
        pontosReciclagem: encontrado.pontosReciclagem,
        fotoPerfilUri: encontrado.fotoPerfilUri || '',
      };

      setUsuario(usuarioAtual);

      await AsyncStorage.setItem(
        USUARIO_STORAGE_KEY,
        JSON.stringify(usuarioAtual)
      );

    } catch (error) {
      console.error('Erro ao realizar login:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        'Não foi possível entrar. Verifique sua conexão.'
      );
    }
  }

  async function logoutUsuario(): Promise<void> {
    await AsyncStorage.removeItem(USUARIO_STORAGE_KEY);
    setUsuario(USUARIO_VAZIO);
  }

  useEffect(() => {
    carregarPontos();

    async function carregarDadosSalvos() {
      try {
        const [
          favsSalvos,
          contribSalvas,
          usuarioSalvo,
        ] = await Promise.all([
          AsyncStorage.getItem(FAVORITOS_STORAGE_KEY),
          AsyncStorage.getItem(CONTRIBUICOES_STORAGE_KEY),
          AsyncStorage.getItem(USUARIO_STORAGE_KEY),
        ]);

        if (favsSalvos) {
          setFavoritosIds(JSON.parse(favsSalvos));
        }

        if (contribSalvas) {
          setContribuicoes(JSON.parse(contribSalvas));
        }

        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }

    carregarDadosSalvos();
  }, [carregarPontos]);

  async function toggleFavorito(id: string) {
    const novaLista = favoritosIds.includes(id)
      ? favoritosIds.filter((item) => item !== id)
      : [...favoritosIds, id];

    setFavoritosIds(novaLista);

    try {
      await AsyncStorage.setItem(
        FAVORITOS_STORAGE_KEY,
        JSON.stringify(novaLista)
      );
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

    const usuarioAtualizado: Usuario = {
      ...usuario,
      pontosReciclagem: usuario.pontosReciclagem + 1,
    };

    setUsuario(usuarioAtualizado);

    try {
      await Promise.all([
        AsyncStorage.setItem(
          CONTRIBUICOES_STORAGE_KEY,
          JSON.stringify(listaAtualizada)
        ),
        AsyncStorage.setItem(
          USUARIO_STORAGE_KEY,
          JSON.stringify(usuarioAtualizado)
        ),
      ]);
    } catch (error) {
      console.error('Erro ao salvar contribuição:', error);
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
        loginUsuario,
        logoutUsuario,
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
