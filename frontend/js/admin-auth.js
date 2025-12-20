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
