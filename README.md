# ♻️ Reciclaspot

O **Reciclaspot** é um aplicativo móvel desenvolvido para conectar cidadãos de Osvaldo Cruz - SP a pontos de coleta seletiva e ecopontos, incentivando o descarte consciente de resíduos específicos e o acompanhamento de contribuições ambientais.

---

## 📱 Funcionalidades

- **Autenticação e Cadastro Real:** Fluxo inicial com tela de abertura (*Splash*), *Login* e *Cadastro* de cidadãos integrado à API REST (`POST /usuarios`) com validação de formulários.
- **Exploração Dinâmica de Ecopontos:** Listagem em tempo real via API (`GET /ecopontos`) organizada por categorias de resíduos (Eletrônicos, Óleo Usado, Pilhas/Baterias, Medicamentos, entre outros) com busca por nome ou bairro.
- **Resiliência de Rede:** Atualização rápida via *Pull-to-Refresh* (`RefreshControl`), limite de espera (*timeout* de 8s) e tela amigável de fallback com botão para tentar novamente em caso de falha de conexão.
- **Mapa Interativo:** Tela dedicada para localização visual dos pontos de coleta e integração com rotas externas.
- **Detalhes do Ponto de Coleta:** Sincronização de dados aprofundados do ecoponto (`GET /ecopontos/:id`), incluindo endereço, horário, regras de descarte e telefone de contato.
- **Favoritos e Modo Offline:** Persistência local com `AsyncStorage` para salvar pontos favoritos e histórico de descartes mesmo sem internet.
- **Registro de Descartes e Perfil:** Sistema de pontuação e histórico de contribuições onde o usuário registra seus descartes (com opção de anexar foto) e acompanha seu impacto ambiental.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas e bibliotecas:

- **[React Native](https://reactnative.dev)** (v0.88) & **[Expo](https://expo.dev)** (SDK 58)
- **[TypeScript](https://typescriptlang.org)**
- **[Axios](https://axios-http.com)** & **JSON Server** (Consumo e simulação de API RESTful)
- **[AsyncStorage](https://github.io)** (Persistência local offline)
- **[React Navigation](https://reactnavigation.org)** (*Native Stack* e *Bottom Tabs*)
- **[Jest](https://jestjs.io)** & `jest-expo` (Testes unitários automatizados)
- **[EAS Build](https://expo.dev)** (Geração do pacote Android APK)
- **[Expo Image Picker](https://expo.dev)** & **[Expo Vector Icons](https://expo.dev)**

---

## 📂 Estrutura do Projeto

```text
Reciclaspot/
├── docs/               # Documentação, capturas de tela e links do protótipo (Figma)
├── img/                # Imagens e recursos visuais do repositório
├── src/
│   ├── assets/         # Arquivos estáticos internos
│   ├── components/     # Componentes reutilizáveis (Header, ScreenWrapper)
│   ├── hooks/          # Gerenciamento de estado global e API (useReciclaContext)
│   ├── navigation/     # Configuração de rotas (AppNavigator)
│   ├── screens/        # Telas da aplicação (Home, Cadastro, Detalhes, Mapa, Perfil, etc.)
│   ├── services/       # Cliente HTTP Axios (api.ts) e dados de referência (mockPontos.ts)
│   ├── types/          # Tipagens TypeScript e tema visual
│   └── utils/          # Funções puras de validação e testes unitários (validadores.ts / .test.ts)
├── db.json             # Banco de dados JSON da API REST local
├── eas.json            # Configuração de build para distribuição Android (APK)
├── jest.config.js      # Configuração da suíte de testes unitários
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
   git clone https://github.com/Raissa-Fernandes17/Reciclaspot.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd Reciclaspot
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor da API REST (JSON Server):**
   ```bash
   npx json-server --watch db.json --host 0.0.0.0 --port 3000
   ```
   *(Lembre-se de configurar o IP da sua máquina no arquivo `src/services/api.ts`).*

5. **Execute os testes unitários:**
   ```bash
   npx jest
   ```

6. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

7. **Abra o aplicativo:**
   - Escaneie o QR Code exibido no terminal utilizando o aplicativo **Expo Go** (Android) ou a câmera nativa (iOS).
   - Ou pressione `a` para abrir no emulador Android / `w` para abrir na versão Web.

---

## 📲 Download do APK (Android)

## 📲 Download do APK (Android)

Para instalar a versão compilada diretamente em um dispositivo Android:
- **Download Direto:** [Baixar ReciclaSpot (.apk)](https://expo.dev/artifacts/eas/W1srxIL_2pbdFN4f-XgGm9Bf8u_uKGNZEipXD7s5-hQ.apk)


---

## 📸 Capturas de Tela

*(Adicione aqui as imagens das telas do aplicativo e o resultado dos testes Jest)*

---

## 🎨 Protótipo (Design)

O layout e a identidade visual do aplicativo foram planejados previamente no Figma. Os links e referências de design estão disponíveis na pasta [`docs/`](./docs).

---

## ✅ Evolução das Sprints

- [x] **Sprint 1 & 2:** Prototipação no Figma, navegação completa, acessibilidade WCAG e persistência local com `AsyncStorage`.
- [x] **Sprint 3:** Integração com API REST (`Axios`), resiliência de rede (*timeout* e *Pull-to-Refresh*), refatoração Clean Code, testes unitários com `Jest` e build do APK via `EAS Build`.

---

## 👩‍💻 Autoria

Desenvolvido por **Raissa Fernandes** e equipe.  
🔗 [GitHub](https://github.com/Raissa-Fernandes17/Reciclaspot.git)
