export type CategoriaResiduo =
  | 'Eletrônicos'
  | 'Óleo Usado'
  | 'Pilhas/Baterias'
  | 'Recicláveis Gerais'
  | 'Medicamentos';

export interface PontoColeta {
  id: string;
  nome: string;
  categoria: CategoriaResiduo;
  endereco: string;
  bairro: string;
  horarioFuncionamento: string;
  latitude: number;
  longitude: number;
  imagemUri: string;
  telefoneContato: string;
  aceitaEntulho: boolean;
  regrasDescarte: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  pontosReciclagem: number;
  fotoPerfilUri: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  MainTabs: undefined;
  DetalhesEcoponto: { ponto: PontoColeta };
};


export type BottomTabParamList = {
  Favoritos: undefined;
  Home: undefined;
  Perfil: undefined;
  Mapa: undefined;
};

