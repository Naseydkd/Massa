#!/bin/bash

# Script d'installation et démarrage du projet Resto Donuts

echo "🍩 Installation Resto Donuts"
echo "=========================="

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Backend
echo ""
echo "📦 Installation des dépendances Python..."
cd backend
pip install -r requirements.txt
cp .env.example .env

echo ""
echo "📝 Configuration MySQL..."
read -p "Entrez le mot de passe MySQL (vide si aucun): " db_password
read -p "Entrez le nom de la base de données [resto_donuts]: " db_name
db_name=${db_name:-resto_donuts}

# Créer la base de données
echo "DROP DATABASE IF EXISTS $db_name;" | mysql -u root -p"$db_password"
echo "CREATE DATABASE $db_name;" | mysql -u root -p"$db_password"

echo "✅ Base de données créée: $db_name"

# Mettre à jour .env
sed -i '' "s/DB_PASSWORD=/DB_PASSWORD=$db_password/" .env
sed -i '' "s/DB_NAME=.*/DB_NAME=$db_name/" .env

echo ""
echo "🚀 Démarrage du serveur Flask..."
echo "Le serveur démarre sur http://localhost:5000"
echo ""

python run.py
