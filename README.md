# ♻️ Reciclaspot

O **Reciclaspot** é um aplicativo móvel desenvolvido para conectar cidadãos a pontos de coleta seletiva e ecopontos, incentivando o descarte consciente de resíduos específicos e o acompanhamento de contribuições ambientais.

---

## 📱 Funcionalidades

- **Autenticação:** Fluxo inicial com tela de abertura (*Splash*), *Login* e *Cadastro* de usuário.
- **Exploração de Ecopontos:** Visualização de locais de descarte organizados por categorias de resíduos (Eletrônicos, Óleo Usado, Pilhas/Baterias, Medicamentos, entre outros).
- **Mapa Interativo:** Tela dedicada para localização visual dos pontos de coleta.
- **Detalhes do Ponto de Coleta:** Informações completas sobre endereço, materiais aceitos e detalhes de cada ecoponto.
- **Favoritos:** Possibilidade de salvar e gerenciar os pontos de coleta mais utilizados.
- **Registro de Descartes:** Sistema de pontuação e histórico de contribuições onde o usuário registra seus descartes (com opção de anexar foto) e acumula pontos de reciclagem.
- **Perfil do Usuário:** Acompanhamento do progresso e estatísticas de impacto ambiental.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas e bibliotecas:

- **[React Native](https://reactnative.dev)** (v0.88)
- **[Expo](https://expo.dev)** (SDK 58)
- **[TypeScript](https://typescriptlang.org)**
- **[React Navigation](https://reactnavigation.org)** (*Native Stack* e *Bottom Tabs*)
- **[Expo Image Picker](https://expo.dev)** (captura e seleção de imagens)
- **[Expo Vector Icons](https://expo.dev)**

---

## 📂 Estrutura do Projeto

```text
Reciclaspot/
├── docs/               # Documentação e links do protótipo (Figma)
├── img/                # Imagens e recursos visuais do repositório
├── src/
│   ├── assets/         # Arquivos estáticos internos
│   ├── components/     # Componentes reutilizáveis (Header, ScreenWrapper)
│   ├── hooks/          # Gerenciamento de estado global (useReciclaContext)
│   ├── navigation/     # Configuração de rotas (AppNavigator)
│   ├── screens/        # Telas da aplicação
│   ├── services/       # Dados simulados (mockPontos)
│   ├── types/          # Tipagens TypeScript e tema visual
│   └── utils/          # Funções utilitárias
├── App.tsx             # Ponto de entrada do componente principal
├── index.ts            # Registro raiz do Expo
└── package.json        # Dependências e scripts do projeto
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org)
- [Git](https://git-scm.com)
- Aplicativo **Expo Go** instalado no seu smartphone (Android ou iOS) ou um emulador configurado.

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd Reciclaspot
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

5. **Abra o aplicativo:**
   - Escaneie o QR Code exibido no terminal utilizando o aplicativo **Expo Go** (Android) ou a câmera nativa (iOS).
   - Ou pressione `a` para abrir no emulador Android / `w` para abrir na versão Web.

---

## 🎨 Protótipo (Design)

O layout e a identidade visual do aplicativo foram planejados previamente no Figma. Os links e referências de design estão disponíveis na pasta [`docs/`](./docs).

---

## 🔮 Próximas Melhorias

- [ ] Persistência local de dados com `AsyncStorage` (favoritos, histórico e sessão do usuário).
- [ ] Integração com API de mapas nativos e geolocalização em tempo real.
- [ ] Conexão com banco de dados/API externa para substituir os dados simulados (*mock*).

---

## 👩‍💻 Autoria

Desenvolvido por **Raissa Fernandes** e equipe.  
🔗 [GitHub](https://github.com/Raissa-Fernandes17/Reciclaspot.git)