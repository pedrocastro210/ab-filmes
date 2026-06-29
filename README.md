# AbFilmes

Aplicação full stack para gerenciamento de filmes, desenvolvida como projeto de estudo e consolidação de conhecimentos em **Angular 22** e **Node.js/Express**. O sistema permite cadastro e autenticação de usuários, exploração de catálogo, avaliação de filmes, favoritos personalizados e criação de novos títulos com upload de imagem.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do repositório](#estrutura-do-repositório)
- [API REST](#api-rest)
- [Conceitos e aprendizados](#conceitos-e-aprendizados)
- [Como clonar e executar](#como-clonar-e-executar)
- [Testes](#testes)
- [Melhorias futuras](#melhorias-futuras)

---

## Sobre o projeto

O **AbFilmes** é um gerenciador de filmes inspirado em desafios de formação full stack. A proposta foi construir uma aplicação completa — do backend à interface — aplicando boas práticas de separação de responsabilidades, autenticação com JWT, comunicação HTTP tipada e organização modular de código.

O frontend consome uma API REST desenvolvida em paralelo, com persistência em arquivos JSON versionados no repositório (`server/data/`). A interface adota um tema escuro com **Tailwind CSS 4**, componentes standalone do Angular e recursos modernos do framework, como **Signals**, **rxResource** e **Signal Forms**.

> **Aviso sobre dados:** usuários, filmes e favoritos são armazenados em arquivos JSON dentro do código-fonte. **Não cadastre dados sensíveis ou pessoais reais** — utilize apenas informações fictícias para testes e demonstração.

---

## Funcionalidades

### Autenticação
- Cadastro de usuário com validação de formulário (e-mail, senha mínima de 8 caracteres, confirmação de senha)
- Login com geração de token JWT
- Proteção de rotas com guards (`authGuard` e `guestGuard`)
- Persistência de sessão via `localStorage`
- Validação de token no servidor a cada acesso à área autenticada

### Filmes
- Listagem do catálogo completo
- Filtro client-side por título e gênero
- Página de detalhes com informações completas do filme
- Sistema de avaliação por estrelas (nota de 1 a 5) com cálculo incremental de média
- Cadastro de novos filmes com upload de imagem (`multipart/form-data`)

### Favoritos
- Adicionar e remover filmes dos favoritos do usuário logado
- Listagem dedicada de filmes favoritos
- Estado de favorito sincronizado na tela de detalhes

### UX e layout
- Layout responsivo com header e navegação entre seções
- Lazy loading de rotas e componentes para otimizar o carregamento inicial
- Feedback visual de erros e sucesso nas operações
- Preview de imagem antes do envio no cadastro de filme

---

## Tecnologias

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 22 | Framework SPA, roteamento, formulários, HTTP |
| TypeScript | 6.x | Tipagem estática em todo o frontend |
| RxJS | 7.8 | Programação reativa e integração com `rxResource` |
| Tailwind CSS | 4.1 | Estilização utilitária e design system |
| Vitest | 4.x | Testes unitários via Angular CLI |

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | — | Runtime JavaScript |
| Express | 5.x | Servidor HTTP e roteamento da API |
| TypeScript | 5.9 | Tipagem no servidor |
| jsonwebtoken | 9.x | Autenticação stateless com JWT |
| Multer | 2.x | Upload e armazenamento de imagens |
| CORS | 2.x | Comunicação cross-origin com o Angular |

### Ferramentas auxiliares
- **Nodemon** — hot reload do servidor em desenvolvimento
- **Prettier** — formatação de código
- **Insomnia** — coleção de requisições em `server/collection-insomnia-gerenciador-filmes.yaml`

---

## Arquitetura

A aplicação segue uma arquitetura **cliente-servidor** com separação clara entre camadas:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Angular)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Pages   │  │Components│  │  Guards  │  │ Interceptor │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬─────┘  │
│       │             │             │                │        │
│       └─────────────┴──────┬──────┴────────────────┘        │
│                            │                                │
│                     ┌──────▼───────┐                        │
│                     │ API Services │                        │
│                     │ (HttpClient) │                        │
│                     └──────┬───────┘                        │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP (JSON / FormData)
                             │ Authorization: Bearer <token>
┌────────────────────────────▼────────────────────────────────┐
│                    Backend (Express)                        │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │  Routes  │→ │  Middlewares  │→ │     Controllers      │  │
│  └──────────┘  │ (auth,upload) │  └─────────┬────────────┘  │
│                └───────────────┘            │               │
│                                      ┌──────▼─────┐         │
│                                      │  Services  │         │
│                                      └──────┬─────┘         │
│                                             │               │
│                   ┌─────────────────────────▼─────────────┐ │
│                   │ JSON Files (users, movies, favorites) │ │
│                   └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Frontend — organização por features

O Angular está organizado em três camadas principais:

- **`core/`** — infraestrutura transversal: guards, interceptors, layout, serviços de autenticação e stores de estado
- **`features/`** — módulos de negócio isolados por domínio (`authentication`, `movies`, `favorites`)
- **`shared/`** — componentes, modelos e utilitários reutilizáveis

**Fluxo de autenticação no frontend:**

1. Usuário faz login → `UserApi` envia credenciais ao backend
2. Token JWT é salvo em `UserTokenStore` (localStorage)
3. `authInterceptor` injeta o header `Authorization: Bearer <token>` em todas as requisições HTTP
4. `authGuard` verifica a existência do token e valida com o endpoint `/users/validate-token` antes de liberar rotas protegidas
5. Em caso de token inválido, o guard remove o token e redireciona para `/auth/login`

### Backend — padrão em camadas

Cada domínio (`users`, `movies`, `favorites`) segue o padrão:

| Camada | Responsabilidade |
|---|---|
| **Routes** | Define endpoints e aplica middlewares |
| **Controller** | Recebe requisição HTTP, valida entrada, retorna resposta |
| **Service** | Regras de negócio e acesso aos dados (arquivos JSON) |
| **Middleware** | Autenticação JWT (`authMiddleware`) e upload de arquivos (`multer`) |

---

## Estrutura do repositório

```
ab-filmes/
├── public/images/          # Ícones e assets estáticos do frontend
├── src/                    # Código-fonte Angular
│   ├── app/
│   │   ├── core/           # Guards, interceptors, layout, stores
│   │   ├── features/       # Autenticação, filmes e favoritos
│   │   └── shared/         # Componentes e serviços compartilhados
│   └── environments/       # URLs da API por ambiente
├── server/                 # API REST em Node.js/Express
│   ├── data/               # Persistência em JSON (users, movies, favorites)
│   ├── public/uploads/     # Imagens enviadas pelos usuários
│   └── src/
│       ├── features/       # Domínios: users, movies, favorites
│       └── middlewares/    # Auth JWT e upload Multer
└── angular.json            # Configuração do projeto Angular
```

---

## API REST

Base URL: `http://localhost:3000`

### Usuários (`/users`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/users` | Não | Cadastro de usuário |
| `POST` | `/users/login` | Não | Login — retorna `{ token, user }` |
| `GET` | `/users/validate-token` | Sim | Valida token e retorna dados do usuário |

### Filmes (`/movies`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/movies` | Sim | Lista todos os filmes |
| `GET` | `/movies/:id` | Sim | Detalhes de um filme |
| `POST` | `/movies` | Sim | Cria filme (FormData com campo `image`) |
| `POST` | `/movies/:id/rate` | Sim | Avalia filme — body: `{ "rating": 1-5 }` |

### Favoritos (`/favorites`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/favorites` | Sim | Lista favoritos do usuário logado |
| `POST` | `/favorites/:movieId` | Sim | Adiciona filme aos favoritos |
| `DELETE` | `/favorites/:movieId` | Sim | Remove filme dos favoritos |

> Uma coleção completa para testes manuais está disponível em `server/collection-insomnia-gerenciador-filmes.yaml`.

---

## Conceitos e aprendizados

Este projeto foi pensado para exercitar e demonstrar competências técnicas em um contexto real de desenvolvimento full stack.

### Angular moderno (v22)

- **Standalone components** — sem NgModules; cada componente declara suas próprias dependências via `imports`
- **Signals** — estado reativo local com `signal()`, `computed()` e `linkedSignal()` para derivar dados de forma declarativa
- **rxResource** — integração entre RxJS e Signals para carregar dados assíncronos com estados de loading, erro e valor
- **Signal Forms** — formulários reativos com validação declarativa (`form()`, `required()`, `email()`, validadores customizados)
- **Functional guards e interceptors** — `CanActivateFn` e `HttpInterceptorFn` com `inject()` no lugar de classes
- **Lazy loading** — rotas e componentes carregados sob demanda com `loadChildren` e `loadComponent`
- **Component input binding** — parâmetros de rota vinculados diretamente a `input()` via `withComponentInputBinding()`

### Backend e API

- **RESTful API** — endpoints semânticos com verbos HTTP corretos e códigos de status adequados (201, 400, 401, 404, 409)
- **JWT (JSON Web Token)** — autenticação stateless com expiração de 1 hora
- **Middleware pattern** — desacoplamento de autenticação e upload da lógica dos controllers
- **Upload de arquivos** — `multipart/form-data` com Multer, validação de MIME type e nomes únicos
- **Separação Controller/Service** — controllers orquestram HTTP; services encapsulam regras de negócio e persistência

### Padrões e boas práticas aplicadas

- **Feature-based folder structure** — código organizado por domínio, facilitando manutenção e escalabilidade
- **Tipagem end-to-end** — interfaces TypeScript compartilhadas entre camadas do frontend e modelos no backend
- **Injeção de dependência** — `inject()` para obter serviços sem construtores verbosos
- **Tratamento de erros HTTP** — utilitário `setErrorMessage` para mapear respostas de erro da API em mensagens amigáveis
- **Stores leves** — `UserTokenStore` e `UserInfosStore` como camada simples de estado de sessão

### Decisões conscientes (contexto educacional)

Algumas escolhas foram intencionalmente simplificadas para focar no aprendizado da arquitetura, com consciência das limitações em produção:

| Aspecto | Implementação atual | Em produção |
|---|---|---|
| Banco de dados | Arquivos JSON versionados em `server/data/` | PostgreSQL, MongoDB, etc. |
| Senhas | Texto puro (visíveis nos arquivos de dados) | Hash com bcrypt/argon2 |
| JWT Secret | Constante no código | Variável de ambiente (`.env`) |
| Filtro de filmes | Client-side | Query params no backend |
| Testes | Estrutura com Vitest | Cobertura ampliada de integração |

---

## Como clonar e executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado 20+)
- [npm](https://www.npmjs.com/) 10+

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/ab-filmes.git
cd ab-filmes
```

### 2. Instalar dependências

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Iniciar o backend

```bash
cd server
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### 4. Iniciar o frontend

Em outro terminal, na raiz do projeto:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

### 5. Primeiro acesso

#### Acesso rápido com usuário de teste

O repositório já inclui um usuário pré-cadastrado em `server/data/users.json`. Após subir backend e frontend, acesse `http://localhost:4200/auth/login` e utilize:

| Campo | Valor |
|---|---|
| E-mail | `pedro@teste.com` |
| Senha | `angular123` |

#### Cadastro de nova conta (opcional)

1. Acesse `http://localhost:4200/auth/register` e crie uma conta
2. Faça login em `http://localhost:4200/auth/login`
3. Explore o catálogo, avalie filmes, adicione favoritos e cadastre novos títulos

> Lembre-se: os dados criados são persistidos nos arquivos JSON do projeto (`server/data/`). Use somente dados fictícios para testes — **nunca informações reais ou sensíveis**.

### Build de produção

```bash
# Frontend
npm run build

# Backend
cd server
npm run build
npm start
```

---

## Testes

O frontend utiliza **Vitest** integrado ao Angular CLI:

```bash
npm test
```

Cada componente e serviço possui arquivo `.spec.ts` correspondente, seguindo a convenção do Angular CLI.

---

## Licença

Projeto de uso pessoal e educacional.
