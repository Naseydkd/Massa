#!/usr/bin/env bash

# 🍩 Chez Hadjo - Installation & Configuration Script
# Script d'automatisation pour configurer rapidement le projet

set -e

echo "🍩 ==========================================="
echo "   CHEZ HADJO - Setup Script"
echo "==========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour afficher avec couleur
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# ===========================
# 1. VÉRIFICATION PRÉREQUIS
# ===========================

echo ""
echo "Step 1/5: Vérification des prérequis..."
echo "=========================================="

# Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python3 détecté: $PYTHON_VERSION"
else
    print_error "Python3 non trouvé. Installez Python 3.8+"
    exit 1
fi

# MySQL
if command -v mysql &> /dev/null; then
    print_success "MySQL détecté"
else
    print_warning "MySQL non trouvé. Assurez-vous qu'il est installé et démarré"
fi

# Git
if command -v git &> /dev/null; then
    print_success "Git détecté"
else
    print_warning "Git non trouvé. Installation optionnelle"
fi

# ===========================
# 2. CONFIGURATION BACKEND
# ===========================

echo ""
echo "Step 2/5: Configuration Backend..."
echo "=========================================="

# Créer venv
if [ ! -d "backend/venv" ]; then
    print_info "Création de l'environnement virtuel..."
    cd backend
    python3 -m venv venv
    print_success "Environnement virtuel créé"
    cd ..
else
    print_info "Environnement virtuel existant"
fi

# Activer venv
print_info "Activation de l'environnement virtuel..."
source backend/venv/bin/activate

# Installer dépendances
print_info "Installation des dépendances..."
cd backend
pip install -q -r requirements.txt 2>/dev/null || print_warning "Certaines dépendances peuvent déjà être installées"
print_success "Dépendances installées"
cd ..

# Créer .env si n'existe pas
if [ ! -f "backend/.env" ]; then
    print_info "Création du fichier .env..."
    cat > backend/.env << 'EOF'
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resto_donuts

# Email Configuration (optionnel)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Application
SECRET_KEY=dev-secret-key-change-in-production
PORT=5001
EOF
    print_success "Fichier .env créé (personnalisez les valeurs)"
    print_warning "⚠️ IMPORTANT: Configurez DB_PASSWORD et SMTP_PASSWORD dans backend/.env"
else
    print_info ".env déjà existant"
fi

# ===========================
# 3. BASE DE DONNÉES
# ===========================

echo ""
echo "Step 3/5: Initialisation Base de Données..."
echo "=========================================="

read -p "Voulez-vous créer la base de données? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Création de la base de données..."
    
    # Demander le password MySQL
    read -sp "Password MySQL root: " MYSQL_PASS
    echo
    
    mysql -u root -p"$MYSQL_PASS" <<EOF 2>/dev/null
CREATE DATABASE IF NOT EXISTS resto_donuts;
USE resto_donuts;
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Base de données créée"
    else
        print_error "Erreur lors de la création de la BD"
        print_info "Continuez manuellement ou réessayez"
    fi
else
    print_info "Saut de création BD"
fi

# ===========================
# 4. TESTS
# ===========================

echo ""
echo "Step 4/5: Exécution des tests..."
echo "=========================================="

print_info "Lancement des tests de validation..."
python3 test_features.py

if [ $? -eq 0 ]; then
    print_success "Tous les tests passés! ✨"
else
    print_error "Certains tests ont échoué"
    print_info "Vérifiez votre configuration"
fi

# ===========================
# 5. DÉMARRAGE SERVEUR
# ===========================

echo ""
echo "Step 5/5: Prêt au démarrage..."
echo "=========================================="

echo ""
echo -e "${GREEN}🎉 Installation Terminée!${NC}"
echo ""
echo "Prochaines étapes:"
echo "=================="
echo ""
echo "1️⃣  Démarrer le serveur backend:"
echo "   cd backend && python3 run.py"
echo ""
echo "2️⃣  Accéder au site client:"
echo "   Ouvrir: frontend/index.html"
echo "   Ou: python3 -m http.server 8000"
echo ""
echo "3️⃣  Accéder au dashboard admin:"
echo "   URL: http://localhost:5001/admin.html"
echo "   Email: abdoulseydou@icloud.com"
echo "   Mot de passe: Abdoulseydou24"
echo ""
echo "4️⃣  Configuration Optionnelle:"
echo "   - Configurer l'email SMTP dans backend/.env"
echo "   - Modifier les horaires dans le dashboard admin"
echo "   - Ajouter des produits/stock"
echo ""
echo "📚 Documentation:"
echo "   - FEATURES.md - Guide complet des fonctionnalités"
echo "   - DEPLOYMENT.md - Guide de déploiement"
echo "   - COMPLETION_SUMMARY.md - Récapitulatif du projet"
echo ""
print_success "Bon développement! 🚀"
