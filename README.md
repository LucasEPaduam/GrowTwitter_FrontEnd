# Growtwitter — Conectando ideias em tempo real

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</div>

---

## 📖 Sobre o Projeto

O **Growtwitter** é uma aplicação de rede social inspirada no X (antigo Twitter), desenvolvida como um desafio técnico proposto pela **Growdev** dentro do currículo de formação Desenvolvimento com VTEX IO. O projeto visa consolidar conhecimentos avançados no ecossistema React, focando em performance, escalabilidade e arquitetura de software moderna.

A aplicação permite que usuários compartilhem mensagens em tempo real, interajam com conteúdos de outros usuários através de curtidas e construam uma rede de conexões (seguidores/seguindo).

---

## 🎯 Requisitos Solicitados

Para atender às demandas do desafio proposto pela Growdev, foram implementados os seguintes requisitos técnicos:

- [x] **Single Page Application (SPA)**: Navegação fluida e responsiva sem recarregamento de página.
- [x] **Gerenciamento de Estado Global**: Uso de Redux Toolkit para persistência e consistência de dados entre componentes complexos.
- [x] **Integração com API Externa**: Persistência de dados real-time através de comunicação com backend dedicado.
- [x] **Sistema de Autenticação**: Fluxo completo de Login e Cadastro com proteção de sessões via Token JWT.
- [x] **Interações**: Criação e listagem de tweets, além de sistemas de Like e Follow.

---

## 🌐 Integração com a API

O frontend consome uma **API RESTful** dedicada fornecida pela Growdev. 

- **Comunicação Assíncrona**: Implementada com **Axios** para garantir chamadas performáticas.
- **Segurança**: Uso de **Interceptors** para injeção automática do Token JWT nos cabeçalhos das requisições após a autenticação.
- **Tratamento de Erros**: Sistema de interceptação de respostas para lidar com expiração de sessão (401) e conflitos (409).

---

## 🚀 Funcionalidades Implementadas

| Funcionalidade | Descrição |
| :--- | :--- |
| **Feed Dinâmico** | Listagem de tweets em tempo real com ordenação cronológica decrescente. |
| **Gestão de Tweets** | Interface para criação de novos conteúdos e posts autorais. |
| **Exploração e Trends** | Página dedicada para busca de conteúdos e painel de Trending Topics (estática). |
| **Perfil de Usuário** | Exibição de estatísticas detalhadas (Seguidores/Seguindo) e histórico de postagens. |
| **Interatividade** | Sistema de curtidas otimistas e funcionalidade de seguir/deixar de seguir outros usuários. |
| **UX Responsiva** | Layout adaptável para Desktop, Tablet e Mobile com navegação inferior customizada para smartphones. |

---

## 🛠 Desafios Técnicos Superados

### Arquitetura de Slices (Redux)
Organização do estado global em Slices modulares (`auth`, `feed`, `profile`), permitindo uma separação clara de responsabilidades e facilitando a manutenção.

### Proteção de Rotas
Implementação de um componente wrapper de `PrivateRoute` que utiliza o estado global para validar o acesso a páginas internas, garantindo a integridade dos dados do usuário.

---

## 💻 Como Executar o Projeto

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/growtwitter-frontend.git
   cd growtwitter-frontend
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```bash
   VITE_API_URL=URL_DA_API_GROWDEV
   ```

4. **Rodar em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```

---

<div align="center">
  <sub>Desenvolvido como parte do desafio técnico da <b>Growdev</b>.</sub>
</div>
