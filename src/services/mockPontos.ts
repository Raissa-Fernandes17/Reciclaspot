import { PontoColeta, Usuario } from '../types';

export const USUARIO_MOCK: Usuario = {
  id: 'u1',
  nome: 'Matheus',
  email: 'matheus.oc@gmail.com',
  pontosReciclagem: 14,
  fotoPerfilUri:
    'https://wikimedia.org',
};

export const PONTOS_COLETA_MOCK: PontoColeta[] = [
  {
    id: '1',
    nome: 'Ecoponto Central Vargas',
    categoria: 'Eletrônicos',
    endereco: 'Av. Presidente Vargas, 850',
    bairro: 'Centro - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Seg a Sáb: 08h às 18h',
    latitude: -21.7963,
    longitude: -50.8791,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-1100',
    aceitaEntulho: true,
    regrasDescarte: 'Descarregar pilhas e eletrônicos separados de resíduos orgânicos.',
  },
  {
    id: '2',
    nome: 'Cooperativa Verde Bandeiras',
    categoria: 'Óleo Usado',
    endereco: 'Rua Armando Salles, 420',
    bairro: 'Jardim Bandeiras - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Seg a Sex: 08h às 17h',
    latitude: -21.7918,
    longitude: -50.8842,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-2210',
    aceitaEntulho: false,
    regrasDescarte: 'Armazenar o óleo de cozinha frio em garrafas PET bem fechadas.',
  },
  {
    id: '3',
    nome: 'Ponto Eco Jardim Paulista',
    categoria: 'Pilhas/Baterias',
    endereco: 'Rua São Paulo, 1120',
    bairro: 'Jardim Paulista - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Todos os dias: 07h às 19h',
    latitude: -21.8012,
    longitude: -50.8755,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-3340',
    aceitaEntulho: false,
    regrasDescarte: 'Isolar os polos das baterias com fita adesiva antes do descarte.',
  },
  {
    id: '4',
    nome: 'Estação Sustentável Califórnia',
    categoria: 'Recicláveis Gerais',
    endereco: 'Av. Estados Unidos, 640',
    bairro: 'Vila Califórnia - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Seg a Sáb: 08h às 17h',
    latitude: -21.7895,
    longitude: -50.8730,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-4450',
    aceitaEntulho: true,
    regrasDescarte: 'Lavar embalagens plásticas e amassar caixas de papelão.',
  },
  {
    id: '5',
    nome: 'Farmácia Ponto Seguro Roosevelt',
    categoria: 'Medicamentos',
    endereco: 'Av. Presidente Roosevelt, 510',
    bairro: 'Jardim Alvorada - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Seg a Dom: 08h às 22h',
    latitude: -21.7985,
    longitude: -50.8868,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-5560',
    aceitaEntulho: false,
    regrasDescarte: 'Depositar cartelas vencidas e frascos no coletor específico.',
  },
  {
    id: '6',
    nome: 'Ecoponto Santa Mônica',
    categoria: 'Eletrônicos',
    endereco: 'Rua Felipe Carmona, 930',
    bairro: 'Residencial Park Santa Mônica - Osvaldo Cruz/SP',
    horarioFuncionamento: 'Seg a Sáb: 08h às 18h',
    latitude: -21.8041,
    longitude: -50.8825,
    imagemUri:
      'https://wikimedia.org',
    telefoneContato: '(18) 3528-6670',
    aceitaEntulho: true,
    regrasDescarte: 'Aceita computadores, celulares, cabos e eletrodomésticos pequenos.',
  },
];
