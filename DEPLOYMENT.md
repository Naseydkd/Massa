# 🚀 Guide de Déploiement - Chez Hadjo

## Table des matières
1. [Préparation](#préparation)
2. [Déploiement Local](#déploiement-local)
3. [Déploiement Production](#déploiement-production)
4. [Configuration Docker](#configuration-docker)
5. [Hébergement Cloud](#hébergement-cloud)

---

## 📋 Préparation

### Checklist Pré-Déploiement

- [ ] Code pushé sur GitHub
- [ ] `.env` configuré avec variables d'environnement
- [ ] Base de données MySQL créée
- [ ] Dépendances Python installées
- [ ] Tests passés (`python3 test_features.py`)
- [ ] Certificat SSL pour HTTPS (production)
- [ ] Email SMTP configuré

---

## 💻 Déploiement Local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Naseydkd/Massa.git
cd Massa
```

### 2. Configuration Backend

```bash
# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
cd backend
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=resto_donuts
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SECRET_KEY=super_secret_key_change_in_production
PORT=5001
EOF
```

### 3. Initialiser la Base de Données

```bash
# Accéder à MySQL
mysql -u root -p

# Exécuter dans MySQL
CREATE DATABASE resto_donuts;
USE resto_donuts;
exit

# Importer les données de démonstration (optionnel)
mysql -u root -p resto_donuts < seed_data.sql
```

### 4. Lancer le serveur

```bash
# Depuis le répertoire backend/
python3 run.py
```

**Résultat** : Serveur accessible sur `http://localhost:5001`

### 5. Accéder au Frontend

```bash
# Option 1: Ouvrir directement
open frontend/index.html

# Option 2: Serveur local
cd frontend
python3 -m http.server 8000
# Accéder à http://localhost:8000
```

---

## 🌐 Déploiement Production

### 1. Utiliser Gunicorn (Production WSGI)

```bash
# Installer Gunicorn
pip install gunicorn

# Lancer avec Gunicorn (4 workers)
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Pour meilleure performance
gunicorn -w 8 -b 0.0.0.0:5001 --timeout 120 app:app
```

### 2. Utiliser Nginx comme Reverse Proxy

**Fichier de configuration** : `/etc/nginx/sites-available/hadjo`

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/hadjo/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Activer la configuration:
```bash
sudo ln -s /etc/nginx/sites-available/hadjo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL/HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot certonly --nginx -d your_domain.com

# Auto-renouvellement
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 4. Service Systemd pour Auto-Démarrage

**Fichier** : `/etc/systemd/system/hadjo.service`

```ini
[Unit]
Description=Chez Hadjo Backend Service
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/hadjo/backend
Environment="PATH=/var/www/hadjo/venv/bin"
ExecStart=/var/www/hadjo/venv/bin/gunicorn -w 4 -b 127.0.0.1:5001 app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activer le service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hadjo.service
sudo systemctl start hadjo.service
```

---

## 🐳 Configuration Docker

### Dockerfile Backend

**Fichier** : `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app/backend

# Installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier l'application
COPY . .

# Port
EXPOSE 5001

# Lancer l'application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]
```

### Docker Compose

**Fichier** : `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: resto_donuts
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root_password
      DB_NAME: resto_donuts
      SMTP_SERVER: smtp.gmail.com
      SMTP_PORT: 587
      SMTP_EMAIL: ${SMTP_EMAIL}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
    depends_on:
      - mysql

  frontend:
    image: node:18
    working_dir: /app/frontend
    volumes:
      - ./frontend:/app/frontend
    ports:
      - "8000:8000"
    command: npx http-server -p 8000

volumes:
  mysql_data:
```

### Lancer avec Docker

```bash
# Build les images
docker-compose build

# Démarrer les services
docker-compose up

# En arrière-plan
docker-compose up -d

# Arrêter
docker-compose down
```

---

## ☁️ Hébergement Cloud

### Heroku

**Fichier** : `Procfile`

```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

```bash
# Créer l'app
heroku create hadjo-app

# Ajouter MySQL
heroku addons:create cleardb:ignite

# Configurer les variables d'environnement
heroku config:set DB_HOST=your_db_host
heroku config:set SMTP_EMAIL=your_email

# Déployer
git push heroku main
```

### Railway.app

```bash
# Connexion
railway login

# Lier le projet
railway link

# Déployer
railway up
```

### PythonAnywhere

1. Créer un compte sur pythonanywhere.com
2. Uploader le code
3. Configurer WSGI
4. Mapper le domaine

### AWS EC2

```bash
# Lancer une instance
# SSH dans l'instance
ssh -i key.pem ubuntu@your_instance

# Installation
sudo apt-get update
sudo apt-get install python3-pip python3-venv mysql-server

# Clone et configuration (voir section "Déploiement Production")
```

---

## 📊 Monitoring & Logs

### Logs Systemd

```bash
# Voir les logs en direct
sudo journalctl -u hadjo.service -f

# Logs dernière heure
sudo journalctl -u hadjo.service --since "1 hour ago"
```

### Logs Gunicorn

```bash
# Créer un fichier de log
gunicorn -w 4 -b 0.0.0.0:5001 --access-logfile access.log --error-logfile error.log app:app
```

### Monitoring avec Supervisor

**Fichier** : `/etc/supervisor/conf.d/hadjo.conf`

```ini
[program:hadjo]
command=/var/www/hadjo/venv/bin/gunicorn -w 4 -b 127.0.0.1:5001 app:app
directory=/var/www/hadjo/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/hadjo/app.log
```

---

## 🔒 Sécurité Production

### 1. Variables d'Environnement

```bash
# Utiliser des variables d'environnement pour les secrets
export SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
export SMTP_PASSWORD="your_secure_password"
```

### 2. CORS Configuration

Modifier `backend/app/__init__.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your_domain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

### 3. Rate Limiting

```bash
pip install flask-limiter
```

### 4. Certificats SSL

```bash
# Générer auto-signé (test)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Utiliser Let's Encrypt (recommandé)
```

### 5. Firewall

```bash
# UFW sur Ubuntu
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 📈 Performance

### Optimisations

1. **Cache Frontend**
   - Mettre en cache les images SVG
   - Utiliser Service Workers

2. **Compression**
   - Gzip pour assets
   - Minification JS/CSS

3. **Database**
   - Indexer les colonnes fréquemment recherchées
   - Optimiser les queries

4. **CDN**
   - Utiliser CloudFlare pour cache et protection DDoS

---

## 🔄 CI/CD avec GitHub Actions

**Fichier** : `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: python test_features.py
      - name: Deploy
        run: |
          # Votre script de déploiement
          echo "Deploying..."
```

---

## ✅ Checklist Déploiement

- [ ] Code sur GitHub
- [ ] Tests passés
- [ ] Base de données initialisée
- [ ] SSL/HTTPS configuré
- [ ] Email SMTP testé
- [ ] Monitoring en place
- [ ] Backups configurés
- [ ] Logs configurés
- [ ] Domaine pointant vers le serveur
- [ ] Admin connecté et vérifié

---

## 📞 Support Déploiement

Pour toute question ou problème de déploiement, consultez:
- Documentation Flask: https://flask.palletsprojects.com/
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- Docker: https://docs.docker.com/

---

**Dernière mise à jour** : 20 décembre 2025
