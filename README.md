# Pokédex

Aplicação Web Full Stack, foi desenvolvida para a disciplina de Desenvolvimento de Interfaces e Aplicações Web (DIAW), integrando uma interface interativa em **React + Vite** a uma **API REST em Java / Spring Boot** persistida em banco de dados NoSQL (**MongoDB Atlas**).

## Arquitetura do Projeto

```text
Pokedex/
├── backend/                  # API REST em Java + Spring Boot + Spring Data MongoDB
│   ├── src/main/java/com/pokedex/backend/
│   │   ├── config/           # DataLoader (carga inicial automática a partir do SQL)
│   │   ├── controller/       # Endpoints REST (/api/pokemons)
│   │   ├── model/            # Entidade/Documento MongoDB (Pokemon)
│   │   ├── repository/       # Interface MongoRepository
│   │   └── service/          # Regras de negócio e operações CRUD
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # Aplicação SPA em React + Vite
│   └── src/
│       ├── components/       # Componentes visuais (Cards, Filtros, Detalhes, Toolbar)
│       ├── services/         # Comunicação HTTP (fetch) com a API REST
│       └── App.jsx           # Gerenciamento de estado, busca, filtros e CRUD
├── Script_Pokedex.sql        # Script relacional original utilizado como fonte de dados
└── README.md
```

## Tecnologias Utilizadas

* **Front-end:** React, Vite, JavaScript (ES6+), CSS3
* **Back-end:** Java 25, Spring Boot 4, Spring Web MVC, Spring Data MongoDB
* **Banco de Dados:** MongoDB Atlas (NoSQL orientado a documentos)

## Funcionalidades

* **Listagem e Consulta (`GET /api/pokemons`):** Carregamento dinâmico dos Pokémon armazenados no MongoDB Atlas, com busca por nome ou número, filtro por tipo, ordenação por atributos e favoritos.
* **Cadastro (`POST /api/pokemons`):** Formulário na interface para inserir novos Pokémon diretamente no banco de dados.
* **Edição (`PUT /api/pokemons/{id}`):** Atualização de nome, tipos e estatísticas de qualquer Pokémon existente.
* **Exclusão (`DELETE /api/pokemons/{id}`):** Remoção de Pokémon da coleção no MongoDB.
* **Carga Inicial Automática (`DataLoader`):** Na primeira inicialização (quando a coleção `pokemons` está vazia), o back-end lê o arquivo `Script_Pokedex.sql`, converte os registros relacionais (`Pokemon`, `Types`, `Rel_Pokemon_Type`) em documentos JSON e popula o MongoDB automaticamente.

## Como Executar o Projeto Localmente

### Pré-requisitos
* **Java JDK 21+**
* **Node.js 18+** e **npm**
* Conta ou instância do **MongoDB / MongoDB Atlas**

### 1. Configurar e iniciar o Back-end

1. Acesse a pasta `backend/src/main/resources/` e crie o arquivo `application-local.properties` (ignorado pelo Git) com a sua string de conexão do MongoDB:
   ```properties
   spring.mongodb.uri=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pokedex?retryWrites=true&w=majority
   spring.mongodb.database=pokedex
   ```
   *(Alternativamente, defina a variável de ambiente `MONGODB_URI` no sistema operacional).*

2. No terminal, dentro da pasta `backend/`, execute:
   ```bash
   # Windows (PowerShell/CMD)
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"

   # Linux / macOS
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```
   A API ficará disponível em `http://localhost:8080/api/pokemons`.

### 2. Instalar dependências e iniciar o Front-end

1. Em um novo terminal, acesse a pasta `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Acesse no navegador o endereço exibido pelo Vite (geralmente `http://localhost:5173`).

## Endpoints da API REST

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/pokemons` | Lista todos os Pokémon cadastrados |
| `GET` | `/api/pokemons/{id}` | Busca um Pokémon específico pelo ID |
| `POST` | `/api/pokemons` | Cadastra um novo Pokémon |
| `PUT` | `/api/pokemons/{id}` | Atualiza os dados de um Pokémon existente |
| `DELETE` | `/api/pokemons/{id}` | Remove um Pokémon pelo ID |

-Repositório e atividade utilizadas para estudos de código, não foquei em commits constantes!