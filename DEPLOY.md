# Deploy - Hostinger Web App Node.js

## 1. Criar banco MySQL no Hostinger

No painel Hostinger: **Databases > MySQL Databases**

- Criar banco: `franquia_avalia`
- Criar usuário e senha
- Anotar: host (normalmente algo como `srv-xxx.hstgr.io`), usuário, senha, nome do banco

## 2. Criar o Web App Node.js

No painel Hostinger: **Advanced > Node.js**

- **Node.js version**: 20.x
- **Startup file**: `npm run start`
- **Conectar ao GitHub**: selecionar repositório `brunolanzo/franquiaavalia`, branch `main`
- **Auto deploy**: ativar (faz deploy automático a cada push)

## 3. Configurar variáveis de ambiente

No painel do Web App, seção **Environment Variables**, adicionar:

```
DATABASE_URL=mysql://USUARIO:SENHA@HOST:3306/franquia_avalia
NEXTAUTH_URL=https://seudominio.com.br
NEXTAUTH_SECRET=gerar_com_openssl_rand_-base64_32
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
PORT=3000
```

Para gerar o NEXTAUTH_SECRET, rode no terminal:
```bash
openssl rand -base64 32
```

## 4. Primeiro deploy

Após conectar o GitHub, o Hostinger vai rodar automaticamente:
1. `npm install` (instala dependências)
2. `npm run build` (gera Prisma client + build Next.js)

Depois do build, via **SSH** ou **Terminal** do Hostinger, rode uma vez:
```bash
cd ~/domains/seudominio.com.br
npx prisma migrate dev --name init
npx prisma db seed
```

## 5. Deploys seguintes

Basta fazer `git push origin main` — o Hostinger detecta e faz redeploy automaticamente.

## Estrutura de arquivos importante

- `package.json` — `build` roda `prisma generate && next build`; `start` roda `node .next/standalone/server.js`
- `next.config.mjs` — `output: "standalone"` gera bundle otimizado
- `ecosystem.config.js` — config PM2 (caso queira usar manualmente)

## Troubleshooting

- **Erro de conexão MySQL**: verifique se o host do banco está correto (não é `localhost` no Hostinger, é o endereço do servidor MySQL)
- **Build falha**: verifique se `DATABASE_URL` está configurada nas variáveis de ambiente antes do build
- **Página em branco**: verifique se `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` estão com o domínio correto com `https://`
