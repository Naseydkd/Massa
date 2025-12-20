# 🍩 Chez Hadjo - Plateforme E-commerce Complète

## 📋 Vue d'ensemble

**Chez Hadjo** est une plateforme e-commerce moderne conçue pour vendre des **boulettes de neige (BDN)** - des délices culinaires senégalais. Le système comprend:

- **Frontend** : Interface client responsive et tableau de bord admin
- **Backend** : API REST complète avec Flask
- **Base de données** : MySQL avec gestion complète des stocks
- **Fonctionnalités avancées** : Graphiques de ventes, avis clients, notifications email

---

## 🎯 Fonctionnalités Principales

### 1. **Catalogue Produits** 🍩
- 16 produits pré-configurés (Classiques, Gourmands, Sains, Spéciaux)
- Images SVG générées dynamiquement
- Système de catégories avec filtres
- Affichage du stock disponible
- Description détaillée par produit

### 2. **Gestion du Panier** 🛒
- Ajout/suppression de produits
- Modification des quantités
- Persistance du panier (localStorage)
- Calcul du total en FCFA

### 3. **Système d'Authentification** 🔐
- Inscription client
- Connexion sécurisée (JWT)
- Authentification admin séparée
- Gestion des sessions (localStorage)

### 4. **Gestion des Commandes** 📦
- Formulaire de checkout complet
  - Adresse, ville, numéro de téléphone
  - Choix du type de livraison (domicile/magasin)
  - Méthode de paiement (MyNita/Cash)
- Historique des commandes
- Statut de commande (en attente, confirmée, livrée, annulée)

### 5. **Dashboard Admin** 👨‍💼
- Vue d'ensemble des statistiques
  - Nombre de commandes
  - Nombre d'utilisateurs
  - Nombre de produits
  - Revenus totaux
- Gestion complète des produits
  - Créer, modifier, supprimer
  - Gestion du stock en temps réel
- Suivi des commandes
  - Tableau des commandes avec filtrage par statut
- Gestion des avis clients

### 6. **Gestion du Stock** 📊
- Affichage du stock en temps réel
- Édition rapide du stock
- Tableau complet avec colonnes: Produit, Prix, Stock
- Synchronisation automatique

### 7. **Horaires d'Ouverture** ⏰
- Configuration des heures d'ouverture/fermeture
- Affichage du statut (ouvert/fermé)
- Paramètres modifiables par l'admin

### 8. **Graphiques de Ventes** 📈
- **Ventes par jour** : Graphique en barres (7 derniers jours)
  - Revenus en FCFA
  - Tendances de vente
- **Top 5 Produits** : Graphique en donut
  - Produits les plus vendus
  - Répartition en pourcentage

### 9. **Système d'Avis Clients** ⭐
- Notation 1-5 étoiles
- Commentaires texte
- Affichage public des avis (page accueil)
- Gestion des avis (suppression admin)
- Section "Ce que nos clients disent" sur la page principale

### 10. **Notifications Email** 📧
- Envoi automatique lors d'une nouvelle commande
- Email contenant:
  - Détails de la commande
  - Montant total
  - Lien d'accès pour l'admin
- Configuration SMTP flexible

---

## 🚀 Installation et Configuration

### Prérequis
- Python 3.8+
- MySQL 5.7+
- Node.js (optionnel, pour les dépendances frontend)

### Installation Backend

1. **Cloner le dépôt**
```bash
git clone https://github.com/Naseydkd/Massa.git
cd Massa
```

2. **Créer un environnement virtuel**
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

3. **Installer les dépendances**
```bash
cd backend
pip install -r requirements.txt
```

4. **Configurer la base de données**

Créer un fichier `.env` dans le dossier `backend/`:

```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=resto_donuts

# Email Configuration (optionnel pour les notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=votre_email@gmail.com
SMTP_PASSWORD=votre_password_app

# Autres
SECRET_KEY=votre_clé_secrète
PORT=5001
```

5. **Initialiser la base de données**

```bash
# Accéder à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE resto_donuts;
USE resto_donuts;

# Quitter MySQL
exit
```

6. **Lancer le serveur**
```bash
python3 run.py
```

Le serveur démarre sur `http://localhost:5001`

### Installation Frontend

Le frontend s'ouvre simplement en ouvrant `frontend/index.html` dans un navigateur.

Pour un meilleur fonctionnement, utilisez un serveur local:

```bash
# Option 1: Python
cd frontend
python3 -m http.server 8000

# Option 2: Node.js
npx http-server frontend -p 8000
```

Puis accédez à `http://localhost:8000`

---

## 📁 Structure du Projet

```
Boule-de-neige/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Factory Flask
│   │   ├── models/
│   │   │   ├── user.py              # Modèle utilisateur
│   │   │   ├── product.py           # Modèle produit (avec stock)
│   │   │   ├── order.py             # Modèle commande
│   │   │   ├── review.py            # Modèle avis clients
│   │   │   └── settings.py          # Modèle paramètres
│   │   ├── routes/
│   │   │   ├── users.py             # Endpoints authentification
│   │   │   ├── products.py          # Endpoints produits
│   │   │   ├── orders.py            # Endpoints commandes
│   │   │   ├── reviews.py           # Endpoints avis
│   │   │   └── settings.py          # Endpoints paramètres
│   │   └── utils/
│   │       └── email_service.py     # Service d'envoi d'emails
│   ├── run.py                       # Point d'entrée
│   ├── requirements.txt             # Dépendances Python
│   └── seed_data.sql                # Données de démonstration
├── frontend/
│   ├── index.html                   # Page principale
│   ├── admin.html                   # Tableau de bord admin
│   ├── login.html                   # Page de connexion admin
│   ├── signup.html                  # Page d'inscription admin
│   ├── css/
│   │   ├── styles.css               # Styles du site client
│   │   └── admin.css                # Styles du tableau de bord
│   └── js/
│       ├── app.js                   # JavaScript client
│       └── admin.js                 # JavaScript admin
├── README.md                        # Ce fichier
└── install.sh                       # Script d'installation

```

---

## 🔌 API REST Endpoints

### Authentification
- `POST /api/users/register` - Créer un compte
- `POST /api/users/login` - Connexion utilisateur
- `POST /api/users/admin/login` - Connexion admin

### Produits
- `GET /api/products/` - Lister tous les produits
- `GET /api/products/<id>` - Détails d'un produit
- `POST /api/products/` - Créer un produit (admin)
- `PUT /api/products/<id>` - Modifier un produit (admin)
- `DELETE /api/products/<id>` - Supprimer un produit (admin)

### Utilisateurs
- `GET /api/users/` - Lister tous les utilisateurs (admin)
- `GET /api/users/<id>` - Détails d'un utilisateur

### Commandes
- `GET /api/orders/` - Lister les commandes
- `POST /api/orders/` - Créer une commande
- `PUT /api/orders/<id>` - Modifier le statut d'une commande

### Avis
- `GET /api/reviews/` - Tous les avis
- `GET /api/reviews/product/<id>` - Avis d'un produit
- `POST /api/reviews/` - Créer un avis
- `DELETE /api/reviews/<id>` - Supprimer un avis (admin)

### Paramètres
- `GET /api/settings/` - Récupérer les paramètres
- `PUT /api/settings/` - Modifier les paramètres (admin)

---

## 🎨 Palette de Couleurs

- **Accent primaire** : `#800000` (Marron foncé)
- **Texte** : `#333333`
- **Fond** : `#ffffff` / `#f5f5f5`
- **Succès** : `#28a745`
- **Danger** : `#dc3545`
- **Étoiles** : `#ffc107`

---

## 👤 Comptes de Test

### Admin
- **Email** : `abdoulseydou@icloud.com`
- **Mot de passe** : `Abdoulseydou24`

### Client
Vous pouvez créer un compte client lors de l'inscription sur le site.

---

## 📧 Configuration Email

Pour activer les notifications email:

1. **Gmail** (recommandé)
   - Générer un mot de passe d'application
   - `SMTP_SERVER=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_EMAIL=votre_email@gmail.com`
   - `SMTP_PASSWORD=votre_mot_de_passe_app`

2. **Mailtrap** (pour les tests)
   - Créer un compte sur mailtrap.io
   - Utiliser les identifiants Mailtrap

3. **SMTP Custom**
   - Utiliser vos propres paramètres SMTP

---

## 🧪 Tests

Exécuter les tests de validation:

```bash
python3 test_features.py
```

Cela valide:
- ✅ Tous les modèles
- ✅ La structure de base de données
- ✅ Les endpoints API
- ✅ Le service email

---

## 🐛 Dépannage

### "Address already in use" (Port 5001)
```bash
# Tuer le processus Python
pkill -f "python3 run.py"

# Ou utiliser un port différent
python3 run.py PORT=5002
```

### Erreur de base de données
```bash
# Vérifier la connexion MySQL
mysql -u root -p -h localhost

# Créer la base de données si elle n'existe pas
CREATE DATABASE resto_donuts;
```

### CORS errors
Les CORS sont configurés automatiquement dans `app/__init__.py`.
Si besoin, modifier le fichier ou utiliser un proxy CORS.

---

## 📱 Responsive Design

Le site est entièrement responsive:
- **Desktop** : Layout multi-colonnes
- **Tablet** : Adaptation fluide
- **Mobile** : Layout single-column (breakpoint 600px)

---

## 🔐 Sécurité

- JWT pour l'authentification
- Mots de passe hashés (werkzeug.security)
- CORS activé
- Validation des entrées
- Protection CSRF (à ajouter pour production)

---

## 📊 Statistiques

- **16 produits** disponibles
- **5 catégories** (Classiques, Gourmands, Sains, Spéciaux, et All)
- **20+ endpoints** API
- **5 modèles** de base de données
- **Charts.js** pour les graphiques

---

## 🚀 Futures Améliorations

- [ ] Paiement en ligne intégré
- [ ] Système de coupons/codes promo
- [ ] Recommandations IA
- [ ] Chat en direct
- [ ] App mobile native
- [ ] Analytics avancées
- [ ] Gestion des catégories dynamiques
- [ ] Images personnalisées (upload)

---

## 📄 Licence

Projet personnel - Droits réservés © 2025

---

## 👨‍💻 Auteur

**Abdoul Nasser Seydou**
- Email: abdoulseydou@icloud.com
- GitHub: [@Naseydkd](https://github.com/Naseydkd)

---

## 💬 Support

Pour toute question ou bug, veuillez créer une issue sur GitHub.

---

**Dernière mise à jour** : 20 décembre 2025
