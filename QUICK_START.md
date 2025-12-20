# 🎯 GUIDE RAPIDE DÉVELOPPEUR - Chez Hadjo

**Version**: 1.0.0  
**Date**: 20 décembre 2025  
**Status**: ✅ COMPLET & TESTÉ

---

## 📌 Vue d'ensemble 30 secondes

**Chez Hadjo** est une plateforme e-commerce **complète** pour vendre des BDN (boulettes de neige).

**3 fichiers essentiels à connaître:**
- `backend/run.py` → Lance le serveur API
- `frontend/index.html` → Page client
- `frontend/admin.html` → Dashboard admin

**2 endpoints importants:**
- `http://localhost:5001/api` → Backend API
- `http://localhost:5001/admin.html` → Admin

---

## ⚡ Démarrage 2 minutes

```bash
# Terminal 1: Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 run.py
# → Serveur lancé sur port 5001

# Terminal 2: Frontend
cd frontend
python3 -m http.server 8000
# → Site client sur port 8000
```

**Accès:**
- 👤 Admin: `http://localhost:5001/admin.html` (abdoulseydou@icloud.com / Abdoulseydou24)
- 🛍️ Client: `http://localhost:8000`

---

## 🗂️ Structure Code Essentiels

### Backend (Flask)

```
backend/app/
├── models/
│   ├── user.py          → Utilisateurs
│   ├── product.py       → Produits + STOCK
│   ├── order.py         → Commandes
│   ├── review.py        → Avis (⭐ 1-5)
│   └── settings.py      → Horaires + Email
├── routes/
│   ├── users.py         → /api/users/* (auth)
│   ├── products.py      → /api/products/*
│   ├── orders.py        → /api/orders/* + EMAIL
│   ├── reviews.py       → /api/reviews/*
│   └── settings.py      → /api/settings/*
└── utils/
    └── email_service.py → Notifications email
```

### Frontend (Client)

```
frontend/
├── index.html           → Page client (+ section avis)
├── js/app.js            → Client logic + loadReviews()
├── css/styles.css       → Styles (+ avis-section)
```

### Frontend (Admin)

```
frontend/
├── admin.html           → Dashboard (+ charts + reviews)
├── js/admin.js          → Admin logic + createSalesChart()
├── css/admin.css        → Admin styles
```

---

## 🔑 Fonctionnalités Clés à Retenir

### 1. Stock 📊
**Fichier**: `backend/app/models/product.py`
```python
stock = db.Column(db.Integer, default=0)  # Champ dans Product
```
**Admin**: Edit dans `/api/products/<id>` avec champ stock
**Frontend**: `displayStockTable()` dans admin.js

### 2. Graphiques 📈
**Fichier**: `frontend/js/admin.js`
```javascript
createSalesChart()      // Bar chart: ventes par jour
createProductsChart()   // Donut chart: top 5 produits
```
**Lib**: Chart.js v3.9.1 (CDN dans admin.html)

### 3. Avis ⭐
**Fichier**: `backend/app/models/review.py`
```python
rating = db.Column(db.Integer)  # 1-5 étoiles
comment = db.Column(db.Text)    # Commentaire
```
**Frontend**: `loadReviews()` + `displayReviews()` dans app.js
**Admin**: `displayReviews()` + `deleteReview()` dans admin.js

### 4. Email 📧
**Fichier**: `backend/app/utils/email_service.py`
```python
send_order_notification(order_id, total_amount, notify_email)
```
**Intégration**: `POST /api/orders/` appelle cette fonction
**Config**: Fichier `.env` avec SMTP_*

### 5. Horaires ⏰
**Fichier**: `backend/app/models/settings.py`
```python
opening_time = db.Column(db.Time)    # 09:00
closing_time = db.Column(db.Time)    # 20:00
notify_on_order = db.Column(...)     # Bool
```
**Routes**: `GET /api/settings/` + `PUT /api/settings/`

---

## 🔌 API les Plus Utilisées

### Produits
```bash
# Lister (avec stock)
GET http://localhost:5001/api/products/

# Créer
POST http://localhost:5001/api/products/
Body: { name, price, stock, category, ... }

# Modifier stock
PUT http://localhost:5001/api/products/1
Body: { stock: 50 }
```

### Commandes
```bash
# Créer (déclenche email)
POST http://localhost:5001/api/orders/
Body: { user_id, items, total_amount, ... }
```

### Avis
```bash
# Lister
GET http://localhost:5001/api/reviews/

# Créer
POST http://localhost:5001/api/reviews/
Body: { product_id, user_id, rating, comment }

# Supprimer (admin)
DELETE http://localhost:5001/api/reviews/1
```

---

## 📝 Tâches Courantes

### Ajouter un Produit
1. Admin → Produits → Ajouter
2. Form: Nom, Prix, Stock, Catégorie
3. Save → `POST /api/products/`
4. Stock visible dans tableau

### Éditer le Stock
1. Admin → Stock Réel
2. Click sur un produit → Edit
3. Entrer nouvelle quantité
4. Submit → `PUT /api/products/<id>`

### Configurer Horaires
1. Admin → Paramètres
2. Time inputs: opening_time, closing_time
3. Toggle: Ouvert/Fermé
4. Save → `PUT /api/settings/`

### Envoyer Email sur Commande
1. Configurer `.env`:
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_EMAIL=your@gmail.com
   SMTP_PASSWORD=app_password
   ```
2. `settings.notify_on_order = true`
3. Créer commande → Email auto

### Voir Avis Clients
1. **Client**: Accueil → Section "Avis Récents"
2. **Admin**: Avis Clients → Tableau complet
3. Admin peut supprimer mauvais avis

---

## 🧪 Vérifier que Ça Marche

```bash
# Test rapide
python3 test_features.py

# Résultat attendu:
# ✅ Modèles OK
# ✅ BD OK  
# ✅ API OK
# ✅ Email OK
# ✅ TOUS LES TESTS PASSÉS
```

---

## 🐛 Problèmes Courants

### "Port 5001 already in use"
```bash
lsof -i :5001
kill -9 <PID>
```

### "ModuleNotFoundError: No module named 'app'"
```bash
cd backend
pip install -r requirements.txt
```

### "MySQL connection refused"
```bash
# Vérifier MySQL tourne
mysql -u root -p
# Créer BD si besoin
CREATE DATABASE resto_donuts;
```

### Avis ne s'affichent pas
- Vérifier `GET http://localhost:5001/api/reviews/` retourne []
- Créer un avis via admin
- Refresh page client

### Graphs pas visibles
- Vérifier Chart.js chargé (voir Network tab)
- Console check pour erreurs JavaScript
- Vérifier `createSalesChart()` exécutée

---

## 📚 Fichiers de Référence

| Fichier | Contenu |
|---------|---------|
| `FEATURES.md` | Doc complète des features |
| `DEPLOYMENT.md` | Doc déploiement |
| `COMPLETION_SUMMARY.md` | Récap technique |
| `test_features.py` | Suite de tests |
| `setup.sh` | Script install auto |

---

## 🔄 Workflow Développement

### Ajouter une Feature

1. **Backend**: Ajouter modèle/route dans `/backend/app/`
2. **Frontend**: Ajouter fonction dans `/frontend/js/app.js` ou `/frontend/js/admin.js`
3. **HTML**: Ajouter éléments dans `/frontend/index.html` ou `/frontend/admin.html`
4. **CSS**: Ajouter styles dans `/frontend/css/`
5. **Test**: Vérifier avec `test_features.py`
6. **Git**: Commit descriptif

### Example: Ajouter Rating Produit

```python
# 1. Model (backend/app/models/product.py)
rating = db.Column(db.Float, default=0)

# 2. Route (backend/app/routes/products.py)
# UPDATE endpoint pour inclure rating

# 3. HTML (frontend/index.html)
<span class="product-rating">⭐ ${product.rating}</span>

# 4. JS (frontend/js/app.js)
// displayProducts() affiche rating

# 5. CSS (frontend/css/styles.css)
.product-rating { /* styles */ }

# 6. Test
python3 test_features.py

# 7. Git
git commit -m "feat: Add product rating display"
```

---

## 💾 Database Quick Ref

### Voir toutes les tables
```sql
USE resto_donuts;
SHOW TABLES;
DESCRIBE product;
```

### Insérer Données Test
```sql
INSERT INTO product (name, price, stock) 
VALUES ('BDN Chocolat', 1000, 50);
```

### Backup/Restore
```bash
# Backup
mysqldump -u root -p resto_donuts > backup.sql

# Restore
mysql -u root -p resto_donuts < backup.sql
```

---

## 🚀 Checklist Pre-Deploy

- [ ] Tests passent (`python3 test_features.py`)
- [ ] .env configuré (DB, SMTP)
- [ ] Stock initial créé
- [ ] Horaires configurés
- [ ] Admin account créé
- [ ] Email testé
- [ ] Graphiques affichés
- [ ] Avis visibles
- [ ] Responsive sur mobile
- [ ] Pas d'erreurs console
- [ ] Git commit final

---

## 📞 Contacts Utiles

**Problème?**
1. Vérifier `test_features.py`
2. Lire `FEATURES.md` section Troubleshooting
3. Vérifier logs console (F12 → Console)
4. Email: abdoulseydou@icloud.com

---

## ✨ Tips Productivité

### Live Reload
Installer extension VSCode: "Live Server"

### Debug Admin
Ouvrir DevTools (F12) → Console pour erreurs JavaScript

### API Testing
Utiliser Postman ou curl pour tester endpoints

### Database
DBeaver gratuit pour visualiser MySQL

---

## 📊 Métriques Importantes

- **API Response Time**: <200ms
- **Page Load**: <1s
- **Chart Render**: ~500ms
- **DB Query**: <100ms

---

## 🎯 Prochaine Itération?

Voir `COMPLETION_SUMMARY.md` section "Prochaines Étapes"

- Phase 2: Paiement en ligne
- Phase 3: Recommandations IA
- Phase 4: App mobile

---

**Bon codage! 🍩✨**

**Dernière mise à jour**: 20 décembre 2025
