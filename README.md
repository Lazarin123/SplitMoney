# 💸 SplitMoney API

<p align="center">
  <img src="https://img.shields.io/badge/Fastify-4.26-black?style=for-the-badge&logo=fastify" alt="Fastify" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
</p>

> **SplitMoney API** é um motor back-end robusto e intuitivo inspirado em plataformas como o *Splitwise*. Ela permite criar grupos de despesas, gerenciar participantes, registrar transações com divisões personalizadas ou automáticas e calcular acertos de contas minimizando o número total de transferências bancárias.

---

## ⚡ Como Funciona o Algoritmo de Balanço

A API utiliza um algoritmo de liquidação financeira inteligente:
1. **Balanço Líquido**: Calcula quanto cada participante pagou no total versus quanto consumiu.
2. **Separação de Devedores e Credores**: Identifica os saldos negativos (quem deve) e positivos (quem tem a receber).
3. **Otimização de Transações**: Consolida as dívidas cruzadas em um fluxo otimizado de pagamentos **de Pessoas X para Pessoas Y**, garantindo a resolução de todas as pendências no menor número de pagamentos possível.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Framework Web**: Fastify
- **ORM**: Prisma ORM
- **Banco de Dados**: PostgreSQL / Supabase / NeonDB
- **Validação**: Zod

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js** v18+ instalado
- **PostgreSQL** rodando localmente ou uma URL do **Supabase / NeonDB**

### Passo a Passo

```bash
# 1. Clone ou extraia o repositório
cd splitmoney-api

# 2. Instale as dependências
npm install

# 3. Configure a variável de ambiente
cp .env.example .env
```

Edite o arquivo `.env` ajustando a string de conexão do PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/splitmoney?schema=public"
```

```bash
# 4. Execute as migrações do banco de dados
npx prisma migrate dev --name init

# 5. Inicie o servidor em modo de desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3333`.

---

## 📍 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Checagem de status da aplicação |
| `POST` | `/api/groups` | Criar novo grupo de despesas |
| `GET` | `/api/groups` | Listar todos os grupos |
| `GET` | `/api/groups/:id` | Obter detalhes de um grupo e participantes |
| `POST` | `/api/groups/:id/members` | Adicionar participante ao grupo |
| `POST` | `/api/groups/:id/expenses` | Registrar despesa (com divisão automática ou customizada) |
| `GET` | `/api/groups/:id/balances` | Obter relatório detalhado de balanço e quem deve para quem |

---

## 🌐 Como Hospedar Gratuitamente (Para Testes)

Para disponibilizar esta API publicamente e integrar com o seu front-end sem custos:

### Opção Recomendada: Render (API) + Supabase (Banco de Dados)

#### 1. Banco de Dados Gratuito no Supabase
1. Crie uma conta no [Supabase](https://supabase.com).
2. Crie um novo projeto e copie a **Connection String (URI)** no painel de configurações do banco.
3. Substitua em seu `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxxxxxx.supabase.co:5432/postgres"
   ```

#### 2. Deploy do Back-end no Render
1. Suba seu projeto para um repositório no **GitHub**.
2. Acesse o [Render](https://render.com) e clique em **New +** > **Web Service**.
3. Conecte seu repositório do GitHub.
4. Preencha as configurações:
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start`
5. Em **Environment Variables**, adicione a variável `DATABASE_URL` obtida do Supabase e `PORT` com valor `3333`.
6. Clique em **Create Web Service**. Pronto! Sua API estará no ar.

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para utilizar, modificar e integrar no seu ecossistema.
