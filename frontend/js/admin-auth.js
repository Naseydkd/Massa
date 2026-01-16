// Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkIfAlreadyLoggedIn();
});

// ===========================
// VÉRIFICATION CONNEXION
// ===========================

function checkIfAlreadyLoggedIn() {
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
        window.location.href = 'admin.html';
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
    // Toggle entre login et signup
    document.getElementById('btn-toggle-signup').addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms();
    });

    document.getElementById('btn-toggle-login').addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms();
    });

    // Formulaires
    document.getElementById('form-login').addEventListener('submit', handleLogin);
    document.getElementById('form-signup').addEventListener('submit', handleSignup);
}

function toggleForms() {
    document.getElementById('form-login').classList.toggle('active');
    document.getElementById('form-signup').classList.toggle('active');
    clearMessages();
}

// ===========================
// CONNEXION
// ===========================

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    showMessage('Connexion en cours...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Erreur de connexion', 'error');
            return;
        }

        // Vérifier si c'est un admin
        if (data.user.is_admin) {
            // Sauvegarder l'admin
            localStorage.setItem('currentAdmin', JSON.stringify(data.user));
            showMessage('Connexion réussie! Redirection...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            showMessage('Accès refusé. Seuls les administrateurs peuvent accéder à cette page.', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
    }
}

// ===========================
// INSCRIPTION
// ===========================

async function handleSignup(e) {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        showMessage('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    // Vérifier que l'email contient "admin" (simple vérification)
    if (!email.toLowerCase().includes('admin')) {
        showMessage('Seuls les administrateurs peuvent créer un compte ici', 'error');
        return;
    }

    showMessage('Inscription en cours...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Erreur lors de l\'inscription', 'error');
            return;
        }

        showMessage('Inscription réussie! Connectez-vous maintenant.', 'success');
        
        // Remplir le formulaire de login avec l'email
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = '';
        
        // Basculer vers le formulaire de login
        setTimeout(() => {
            toggleForms();
        }, 1500);
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
    }
}

// ===========================
// MESSAGES
// ===========================

function showMessage(message, type = 'info') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message show ${type}`;
}

function clearMessages() {
    const statusDiv = document.getElementById('status-message');
    statusDiv.className = 'status-message';
    statusDiv.textContent = '';
}
// ===========================
// EFFETS VISUELS MODERNES
// ===========================

// Améliorer les effets de focus sur les inputs
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Effet de focus amélioré
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Effet de saisie
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.parentElement.classList.add('has-content');
            } else {
                this.parentElement.classList.remove('has-content');
            }
        });
    });
    
    // Effet de parallaxe léger sur les info-boxes
    const infoBoxes = document.querySelectorAll('.info-box');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        infoBoxes.forEach((box, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            box.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});

// ===========================
// FONCTION DE TEST POUR LA DÉMO
// ===========================

// Ajouter un bouton de test pour simuler une connexion rapide
document.addEventListener('DOMContentLoaded', () => {
    // Créer un bouton de test en mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Test Login (Demo)';
        testButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        `;
        
        testButton.addEventListener('click', () => {
            // Simuler une connexion admin réussie
            const testAdmin = {
                id: 1,
                email: 'admin@test.com',
                username: 'admin_test'
            };
            
            localStorage.setItem('currentAdmin', JSON.stringify(testAdmin));
            showMessage('🎉 Connexion test réussie ! Redirection...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        });
        
        document.body.appendChild(testButton);
    }
});