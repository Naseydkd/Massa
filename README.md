# Resto Donuts - Vente en Ligne

Site e-commerce complet pour la vente de donuts en ligne avec livraison locale.

## Structure du Projet

```
resto-donuts/
├── backend/                 # API Python/Flask
│   ├── app/
│   │   ├── models/         # Modèles de données (Product, User, Order)
│   │   ├── routes/         # Routes API (products, users, orders)
│   │   └── __init__.py     # Config Flask & DB
│   ├── requirements.txt     # Dépendances Python
│   ├── .env.example         # Variables d'environnement
│   └── run.py              # Point d'entrée
└── frontend/               # Interface web
    ├── index.html          # Page principale
    ├── css/styles.css      # Styles
    ├── js/app.js           # Logique côté client
    └── images/             # Images
```

## Fonctionnalités

### Catalogue & Produits
- ✅ 4 catégories de donuts (Classiques, Gourmands, Sains, Spéciaux)
- ✅ Filtrage par catégorie
- ✅ Détails produit avec description et prix
- ✅ Design blanc et verre épuré

### Utilisateurs & Authentification
- ✅ Inscription / Connexion
- ✅ Gestion du profil utilisateur
- ✅ Sauvegarde des adresses de livraison

### Panier & Commandes
- ✅ Panier persistant (localStorage)
- ✅ Ajout/Suppression/Modification de quantités
- ✅ Calcul automatique du total
- ✅ Historique des commandes

### Livraison & Paiement
- ✅ Deux options: Livraison à domicile / Retrait en magasin
- ✅ Deux méthodes de paiement: Carte bancaire / Espèces
- ✅ Notes de commande (allergies, préférences)

### Langues & Devises
- ✅ Interface en français
- ✅ Devises en FCFA

## Installation & Démarrage

### Backend

1. **Installer les dépendances**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configurer la base de données**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos paramètres MySQL
   ```

3. **Créer la base de données MySQL**
   ```bash
   mysql -u root -p
   CREATE DATABASE resto_donuts;
   EXIT;
   ```

4. **Lancer le serveur**
   ```bash
   python run.py
   ```
   Le serveur démarre sur `http://localhost:5001`

### Frontend

1. **Ouvrir le site**
   - Ouvrir `frontend/index.html` dans un navigateur
   - Ou utiliser un serveur local (ex: Live Server dans VS Code)

## Configuration de la Base de Données

Les tables sont créées automatiquement au démarrage du serveur Flask.

**Tables:**
- `users` - Comptes utilisateurs
- `products` - Catalogue de donuts
- `orders` - Historique des commandes
- `order_items` - Articles dans les commandes

## API Endpoints

### Produits
- `GET /api/products/` - Tous les produits
- `GET /api/products/?category=classique` - Filtrer par catégorie
- `GET /api/products/<id>` - Détails d'un produit
- `POST /api/products/` - Créer un produit (admin)
- `PUT /api/products/<id>` - Mettre à jour (admin)
- `DELETE /api/products/<id>` - Supprimer (admin)

### Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/<id>` - Profil utilisateur
- `PUT /api/users/<id>` - Mettre à jour profil

### Commandes
- `POST /api/orders/` - Créer une commande
- `GET /api/orders/user/<user_id>` - Commandes de l'utilisateur
- `GET /api/orders/<id>` - Détails de la commande
- `PUT /api/orders/<id>` - Mettre à jour le statut
- `GET /api/orders/` - Toutes les commandes (admin)

## Exemple de requête

```javascript
// Créer une commande
fetch('http://localhost:5001/api/orders/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        user_id: 1,
        items: [
            { product_id: 1, quantity: 2 },
            { product_id: 3, quantity: 1 }
        ],
        delivery_type: 'delivery',
        payment_method: 'card',
        notes: 'Sans sucre pour le premier'
    })
})
```

## Prochaines étapes

1. **Ajouter des produits** via l'API ou un dashboard admin
2. **Intégrer Stripe** pour les paiements par carte
3. **Créer un dashboard admin** pour gérer les commandes et inventaire
4. **Ajouter des images** des produits
5. **Déployer** sur un serveur (Heroku, DigitalOcean, etc.)
6. **Tests** et optimisations

## Dépendances

**Backend (Python):**
- Flask 2.3.3
- Flask-SQLAlchemy 3.0.5
- Flask-CORS 4.0.0
- mysql-connector-python 8.0.33
- python-dotenv 1.0.0

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## Support

Pour des questions ou des modifications, éditez les fichiers correspondants:
- Logique backend: `backend/app/routes/`
- Modèles de données: `backend/app/models/`
- Styles: `frontend/css/styles.css`
- JavaScript: `frontend/js/app.js`

---

**Crée le 17 décembre 2025** ✨
