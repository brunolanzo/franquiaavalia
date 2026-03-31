# Deploy - Hostinger VPS

## 1. Configurar o VPS (primeira vez)

SSH no seu VPS:
```bash
ssh root@SEU_IP_VPS
```

### Instalar Node.js 20, PM2 e Nginx:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
```

### Configurar MySQL:
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Criar banco e usuário:
sudo mysql -e "CREATE DATABASE franquia_avalia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'franquia'@'localhost' IDENTIFIED BY 'SUA_SENHA_FORTE';"
sudo mysql -e "GRANT ALL PRIVILEGES ON franquia_avalia.* TO 'franquia'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### Clonar o projeto:
```bash
sudo mkdir -p /var/www/franquiaavalia
sudo chown $USER:$USER /var/www/franquiaavalia
cd /var/www
git clone https://github.com/brunolanzo/franquiaavalia.git
cd franquiaavalia
```

### Criar `.env` no servidor:
```bash
cat > .env << 'EOF'
DATABASE_URL="mysql://franquia:SUA_SENHA_FORTE@localhost:3306/franquia_avalia"
NEXTAUTH_URL="https://seudominio.com.br"
NEXTAUTH_SECRET="GERAR_COM_openssl_rand_-base64_32"
NEXT_PUBLIC_SITE_URL="https://seudominio.com.br"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF
```

### Instalar, migrar e buildar:
```bash
npm ci --production=false
npx prisma generate
npx prisma migrate dev --name init
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true
```

### Seed (dados iniciais):
```bash
npx prisma db seed
```

### Iniciar com PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Configurar Nginx:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/franquiaavalia
sudo ln -s /etc/nginx/sites-available/franquiaavalia /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
# Editar o arquivo e substituir "seudominio.com.br" pelo seu domínio
sudo nano /etc/nginx/sites-available/franquiaavalia
sudo nginx -t
sudo systemctl restart nginx
```

### SSL com Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

---

## 2. Deploy automático via GitHub Actions

### Configurar Secrets no GitHub:

Vá em **Settings > Secrets and variables > Actions** no repositório e adicione:

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP do seu VPS Hostinger |
| `VPS_USER` | `root` (ou seu usuário) |
| `VPS_PORT` | `22` (ou sua porta SSH) |
| `VPS_SSH_KEY` | Sua chave SSH privada (gerar com `ssh-keygen`) |

### Gerar chave SSH (no VPS):
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # Copiar este conteúdo para o secret VPS_SSH_KEY
```

### Fluxo:
1. `git push origin main` → GitHub Actions dispara
2. Conecta via SSH no VPS
3. Pull, install, migrate, build, restart PM2

---

## 3. Deploy manual (alternativa)

SSH no VPS e execute:
```bash
cd /var/www/franquiaavalia
./deploy.sh
```
