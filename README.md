# Franquia Avalia

Plataforma de avaliação de franquias brasileiras. Franqueados avaliam franqueadoras, investidores pesquisam reputação antes de investir.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Autenticação:** NextAuth.js v5
- **Upload:** Cloudinary
- **E-mail:** Resend
- **Pagamento:** Stripe

## Setup Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- npm ou yarn

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/franquia-avalia.git
cd franquia-avalia

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Criar banco de dados e rodar migrations
npx prisma migrate dev --name init

# 5. Popular banco com dados de teste
npx prisma db seed

# 6. Rodar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Credenciais de teste (seed)

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@franquiaavalia.com.br | senha123 |
| Franqueado | franqueado1@email.com | senha123 |

## Deploy (Hostinger VPS)

```bash
# 1. Clone no servidor
git clone https://github.com/seu-usuario/franquia-avalia.git
cd franquia-avalia

# 2. Instalar dependências
npm install

# 3. Configurar .env com variáveis de produção

# 4. Rodar migrations
npx prisma migrate deploy

# 5. Build
npm run build

# 6. Iniciar com PM2
pm2 start npm --name "franquia-avalia" -- start

# 7. Configurar Nginx como reverse proxy (porta 3000 → 80/443)
# 8. SSL com Certbot (Let's Encrypt)
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── (public)/        # Páginas públicas (home, franquia, busca, ranking)
│   ├── (auth)/          # Login, registro
│   ├── dashboard/       # Painel do franqueado
│   ├── empresa/         # Painel da franqueadora
│   ├── admin/           # Painel administrativo
│   └── api/             # API Routes
├── components/
│   ├── ui/              # Componentes base
│   ├── layout/          # Header, Footer
│   └── providers/       # Context providers
├── lib/                 # Prisma, auth, utils
├── hooks/               # Custom hooks
└── types/               # TypeScript types + Zod schemas
```

## Licença

Projeto privado. Todos os direitos reservados.
