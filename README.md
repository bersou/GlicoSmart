# 🩺 GlicoSmart

> Aplicativo PWA moderno para monitoramento e controle de glicemia com assistente virtual inteligente.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Screenshots](#-screenshots)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**GlicoSmart** é um Progressive Web App (PWA) desenvolvido para auxiliar pessoas com diabetes no monitoramento diário da glicemia. Com uma interface moderna e intuitiva, o aplicativo oferece:

- 📊 **Registro de medições** com data e hora personalizadas
- 📈 **Gráficos interativos** para visualização de tendências
- 🤖 **Assistente Virtual (Nutri AI)** com conhecimento especializado em saúde
- 💾 **Armazenamento local** - seus dados ficam no seu dispositivo
- 📱 **PWA** - instale no celular como um app nativo
- 🎨 **Design moderno** com modo escuro e animações suaves

---

## ✨ Funcionalidades

### 📊 Dashboard Completo
- Visualização da última leitura de glicemia
- Estatísticas gerais (média, mínima, máxima)
- Gráfico de tendências dos últimos 7 dias
- Gráfico de distribuição (normal, baixo, alto)
- **Novo:** Botão de configurações para editar seu perfil (nome, idade, peso, foto).
- **Novo:** Opção de compartilhar a última leitura de glicemia diretamente do card.

### 📝 Registro de Medições
- Adicionar novas leituras com valor, período e notas
- Definir data e hora manualmente (útil para backdate)
- **Melhoria:** Editar ou excluir medições existentes diretamente no histórico.
- Ordenação automática por timestamp

### 🤖 Nutri AI - Assistente Virtual Inteligente
O chatbot oferece orientações sobre:
- 💪 **Exercícios físicos** e atividades recomendadas
- 🥗 **Alimentação** e nutrição para controle glicêmico
- 💧 **Hidratação** com cálculo personalizado baseado no peso
- 🚨 **Sintomas de emergência** e protocolos de hipoglicemia
- 😴 **Sono e estresse** e seu impacto na glicemia
- 📊 **Interpretação de resultados** e faixas de referência
- 🔬 **Hemoglobina Glicada (A1C)** e controle a longo prazo
- 💊 **Medicamentos** e orientações gerais
- 📈 **Estatísticas** e análise de histórico

**Recursos especiais:**
- Reconhece erros de digitação comuns
- Avisos específicos para alimentos prejudiciais
- Respostas contextualizadas baseadas na última leitura
- Análise proativa ao adicionar novas medições

### 👤 Perfil do Usuário
- Cadastro com nome, idade, peso e foto
- Avatar personalizado com iniciais no chat
- Cálculos personalizados (ex: hidratação baseada no peso)
- **Melhoria:** Edição de perfil acessível via ícone de engrenagem no Dashboard.

### 📱 PWA (Progressive Web App)
- Instalável no celular e desktop
- Funciona offline
- Ícones e splash screen personalizados
- Experiência nativa

### 📜 Histórico e Exportação
- Visualização detalhada de todas as medições.
- Filtros por data e período.
- **Novo:** Opção de baixar o histórico de medições em formato Excel (.xlsx) com as colunas: Valor, Período, Data, Horário e Status. (Nota: A inclusão de gráficos e formatação condicional avançada diretamente no arquivo Excel gerado no navegador possui limitações técnicas e não está implementada).

---

## 🛠 Tecnologias

### Frontend
- **React 18.2** - Biblioteca JavaScript para interfaces
- **Vite 5.0** - Build tool ultrarrápido
- **TailwindCSS 3.4** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **TypeScript** - Linguagem de programação para maior segurança e escalabilidade (todos os novos arquivos são em `.tsx`)

### Gráficos & Visualização
- **Chart.js 4.4** - Biblioteca de gráficos
- **React Chart.js 2** - Wrapper React para Chart.js
- **date-fns** - Manipulação de datas

### Armazenamento
- **LocalStorage** - Persistência de dados no navegador
- Sem backend necessário - 100% client-side

### Utilitários
- **clsx** - Utilitário para classes condicionais
- **tailwind-merge** - Merge de classes Tailwind
- **xlsx** - Para exportação de dados para Excel

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/glicosmart.git
   cd glicosmart
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

---

## 💻 Como Usar

### Primeiro Acesso

1. **Tela de Introdução**: Clique em "Começar" para prosseguir
2. **Onboarding**: Preencha seus dados (nome, idade, peso) e adicione uma foto (opcional)
3. **Dashboard**: Você será direcionado para o painel principal

### Adicionando Medições

1. Clique no botão **"+ Novo Registro"** no dashboard
2. Insira o valor da glicemia (mg/dL)
3. Selecione o período (Jejum, Pré-refeição, Pós-refeição, etc.)
4. (Opcional) Defina data e hora customizadas
5. (Opcional) Adicione notas sobre a medição
6. Clique em **"Salvar Registro"**

### Editando Perfil

1. No Dashboard, clique no ícone de **engrenagem** no canto superior direito.
2. Edite seu nome, idade, peso ou foto.
3. Clique em "Salvar" para aplicar as mudanças.

### Compartilhando a Última Leitura

1. No Dashboard, no card da "Última Leitura", clique no ícone de **compartilhamento** (seta para cima).
2. Escolha a plataforma para compartilhar sua leitura.

### Usando o Nutri AI

1. Clique no botão **"Nutri AI"** no canto inferior direito
2. Digite sua pergunta ou dúvida
3. Receba orientações personalizadas em tempo real

**Exemplos de perguntas:**
- "Me fale sobre exercícios"
- "Bolachas fazem mal?"
- "Sobre minha média geral"
- "O que fazer se sentir tontura?"
- "Quanto de água devo beber?"

### Visualizando Histórico

1. Navegue até a aba **"Histórico"** na barra de navegação inferior.
2. Veja todas as suas medições ordenadas por data.
3. Clique em uma medição para editar ou excluir.
4. Use os filtros de data e período para refinar a visualização.
5. Clique no ícone de **download** para exportar o histórico para Excel.

---

## 📸 Screenshots

### 1. Tela Inicial (Homescreen)
Tela de boas-vindas do aplicativo com introdução ao GlicoSmart.

![Tela Inicial](public/screenshots/screenshots%20().png)

### 2. Onboarding - Cadastro de Perfil
Tela de cadastro onde o usuário insere seus dados pessoais (nome, idade, peso) e foto.

![Onboarding](public/screenshots/screenshots%20(1).png)

### 3. Dashboard Principal
Painel principal com última leitura, estatísticas e gráficos de tendência.

![Dashboard](public/screenshots/screenshots%20(2).png)

### 4. Novo Registro
Formulário para adicionar uma nova medição de glicemia com data, hora e notas.

![Novo Registro](public/screenshots/screenshots%20(3).png)

### 5. Histórico de Medições
Lista completa de todas as medições registradas, ordenadas por data.

![Histórico](public/screenshots/screenshots%20(4).png)

### 6. Nutri AI - Assistente Virtual
Chatbot inteligente fornecendo orientações personalizadas sobre saúde e diabetes.

![Nutri AI](public/screenshots/screenshots%20(6).png)

### 7. Estatísticas e Gráficos
Visualização detalhada com gráfico de distribuição e análise de tendências.

![Estatísticas](public/screenshots/screenshots%20(7).png)

---

## 📁 Estrutura do Projeto

```
glicosmart/
├── public/              # Arquivos estáticos
│   ├── icons/          # Ícones PWA
│   └── manifest.json   # Manifesto PWA
├── src/
│   ├── components/     # Componentes React
│   │   ├── AIChat.tsx          # Chatbot Nutri AI
│   │   ├── BottomNavigationBar.tsx # Barra de navegação inferior
│   │   ├── Dashboard.tsx       # Painel principal
│   │   ├── ErrorBoundary.tsx   # Componente de tratamento de erros
│   │   ├── Intro.tsx           # Tela de introdução
│   │   ├── Login.tsx           # Componente de login
│   │   ├── Onboarding.tsx      # Tela de cadastro
│   │   ├── StatsCard.tsx       # Cards de estatísticas
│   │   └── ...
│   ├── hooks/          # Custom hooks
│   │   ├── useAppStore.ts      # Gerenciamento de estado
│   │   └── useGlucoseData.ts   # Hook de dados de glicose (legado)
│   ├── pages/          # Páginas da aplicação
│   │   ├── HealthTipsPage.tsx  # Página de dicas de saúde
│   │   ├── HistoryPage.tsx     # Página de histórico de medições
│   │   └── StatisticsPage.tsx  # Página de estatísticas
│   ├── utils/          # Funções utilitárias
│   │   ├── glucoseLogic.ts     # Lógica de análise de glicose
│   │   └── healthTipsData.ts   # Dados para dicas de saúde
│   ├── App.tsx         # Componente raiz com roteamento
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── package.json        # Dependências
├── vite.config.js      # Configuração Vite
├── tailwind.config.js  # Configuração Tailwind
└── README.md           # Este arquivo
```

---

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Deploy automático!

### Opção 2: Netlify

1. Faça push do código para o GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Conecte o repositório
4. Configure build command: `npm run build`
5. Configure publish directory: `dist`

### Opção 3: GitHub Pages

```bash
npm run build
# Faça deploy da pasta 'dist' para GitHub Pages
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é **privado** e de uso pessoal.

---

## 👨‍💻 Autor

**Bernardo**

---

## 🙏 Agradecimentos

- Ícones por [Lucide](https://lucide.dev/)
- Gráficos por [Chart.js](https://www.chartjs.org/)
- UI inspirada em design moderno de aplicativos de saúde

---

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, abra uma [issue](https://github.com/seu-usuario/glicosmart/issues).

---

<div align="center">
  <p>Feito com ❤️ e ☕</p>
  <p>GlicoSmart - Seu aliado no controle da glicemia</p>
</div>