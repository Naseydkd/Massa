// Fonction globale pour gérer les erreurs
window.addEventListener('error', (e) => {
    console.error('❌ Erreur JavaScript:', e.error);
});

// Configuration - fonctionne en local et en production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de l\'application...');
    
    // Charger l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    loadProducts();
    loadReviews(); // Charger les avis
    setupEventListeners();
    updateCartUI();
    updateAuthUI(); // Mettre à jour l'interface d'authentification
    
    console.log('✅ Application initialisée');
});

// ===========================
// RÉCUPÉRATION DES DONNÉES
// ===========================

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        allProducts = Array.isArray(data) && data.length > 0 ? data : [];
        displayProducts(allProducts);
    } catch (error) {
        console.warn('❌ API indisponible');
        displayProducts([]);
    }
}

// ===========================
// AFFICHAGE DES PRODUITS - VERSION SIMPLIFIÉE
// ===========================

function displayProducts(products) {
    console.log('🍩 Affichage des produits:', products.length);
    
    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.error('❌ Grille de produits non trouvée');
        return;
    }
    
    // Nettoyer la grille
    grid.innerHTML = '';

    if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Aucun produit trouvé</p>';
        return;
    }

    // Créer les cartes de produits de manière simple
    products.forEach((product, index) => {
        try {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Obtenir le nom de la catégorie
            const categoryName = getCategoryDisplayName(product.category);
            
            // Description simple
            const description = product.description || 'Donut artisanal fait maison';
            
            // Prix formaté
            const price = typeof product.price === 'number' ? product.price.toFixed(0) : product.price;
            
            // Image avec fallback
            const imageSrc = product.image_url || product.image || 'images/bouledn.png';
            
            // Créer le HTML de manière simple
            card.innerHTML = `
                <div class="product-image">
                    <img src="${imageSrc}" alt="${product.name}" />
                </div>
                <div class="product-info">
                    <div class="product-category">${categoryName}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${price} FCFA</div>
                    <div class="product-description">${description}</div>
                    <div class="product-actions">
                        <button class="btn-details" data-product-id="${product.id}">
                            Voir
                        </button>
                        <button class="btn-add-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                            Ajouter
                        </button>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
            
        } catch (error) {
            console.error('❌ Erreur lors de la création de la carte produit:', error);
        }
    });
    
    // Ajouter les event listeners de manière sécurisée
    setupProductEventListeners();
    
    // Initialiser les filtres après l'affichage des produits
    initializeFilters();
    
    console.log('✅ Produits affichés avec succès');
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'classique': 'Classique',
        'gourmand': 'Gourmand',
        'sain': 'Sain & Bio',
        'special': 'Spécialité'
    };
    return categoryNames[category] || category;
}

// ===========================
// EVENT LISTENERS POUR LES PRODUITS
// ===========================

function setupProductEventListeners() {
    // Event listeners pour les boutons "Voir"
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.btn-details').dataset.productId);
            showProductDetails(productId);
        });
    });

    // Event listeners pour les boutons "Commander"
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-add-cart');
            const productId = parseInt(button.dataset.productId);
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);
            addToCart(productId, productName, productPrice);
        });
    });
}

function initializeFilters() {
    // Configuration simple des filtres
    setTimeout(() => {
        document.querySelectorAll('.filtre-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons
                document.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');
                
                // Filtrer les produits
                filterProducts(btn.dataset.category);
            });
        });
    }, 100);
}



function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const detailsDiv = document.getElementById('product-details');
    detailsDiv.innerHTML = `
        <div class="product-details-image">
            <img src="${product.image_url || product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div class="product-details-info">
            <div class="product-details-category">${product.category}</div>
            <div class="product-details-name">${product.name}</div>
            <div class="product-details-price">${product.price.toFixed(0)} FCFA</div>
            <div class="product-details-description">
                ${product.description || 'Un délicieux donut artisanal'}
            </div>
            <div class="product-details-actions">
                <button class="btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}); closeModal('modal-product')">Ajouter au panier</button>
                <button class="btn-secondary" onclick="closeModal('modal-product')">Fermer</button>
            </div>
        </div>
    `;

    openModal('modal-product');
}

// ===========================
// GESTION DU PANIER
// ===========================

function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${name} ajouté au panier ! 🍩`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
        const totalElement = document.getElementById('cart-total');
        if (totalElement) totalElement.textContent = '0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">${itemTotal.toFixed(2)} FCFA</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;
    const totalElement = document.getElementById('cart-total');
    if (totalElement) totalElement.textContent = total.toFixed(2);
}

// ===========================
// FILTRAGE DES PRODUITS
// ===========================

function filterProducts(category) {
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// ===========================
// GESTION DES MODALES
// ===========================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// ===========================
// NOTIFICATIONS
// ===========================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===========================
// SETUP DES EVENT LISTENERS
// ===========================

function setupEventListeners() {
    console.log('🔧 Configuration des event listeners...');
    
    // Menu burger
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbar-menu');

    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('mobile-open');
        });
    }

    // Fermer le menu burger lors du clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navbarMenu) navbarMenu.classList.remove('mobile-open');
        });
    });

    // BOUTONS PRINCIPAUX
    setupMainButtons();
    
    // FORMULAIRES
    setupForms();
    
    // MODALES
    setupModals();
    
    // AVIS
    setupReviews();
    
    console.log('✅ Tous les event listeners configurés');
}

function setupMainButtons() {
    // Panier
    const btnPanier = document.getElementById('btn-panier');
    if (btnPanier) {
        btnPanier.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('modal-panier');
        });
    }

    // Connexion
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('modal-login');
        });
        console.log('✅ Bouton connexion configuré');
    }

    // Commander
    const btnCommander = document.getElementById('btn-commander');
    if (btnCommander) {
        btnCommander.addEventListener('click', (e) => {
            e.preventDefault();
            const catalogue = document.getElementById('catalogue');
            if (catalogue) {
                catalogue.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Continue shopping
    const btnContinueShopping = document.getElementById('btn-continue-shopping');
    if (btnContinueShopping) {
        btnContinueShopping.addEventListener('click', () => {
            closeModal('modal-panier');
        });
    }

    // Checkout
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            closeModal('modal-panier');
            openModal('modal-checkout');
        });
    }
}

function setupModals() {
    // Fermer les modales avec le bouton X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Fermer les modales en cliquant à l'extérieur
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// ===========================
// AVIS CLIENTS / REVIEWS
// ===========================

async function loadReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`);
        if (!response.ok) throw new Error('API non disponible');
        const reviews = await response.json();
        displayReviewsSlider(reviews);
        updateReviewsStats(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
    }
}

// Variables pour le slider continu
let reviewsData = [];

function displayReviewsSlider(reviews) {
    console.log('Affichage du slider continu avec', reviews.length, 'avis');
    reviewsData = reviews || [];
    const sliderContainer = document.getElementById('reviews-slider');
    const noReviewsDiv = document.getElementById('no-reviews');
    
    if (!sliderContainer) {
        console.error('Container du slider non trouvé');
        return;
    }
    
    if (reviewsData.length === 0) {
        sliderContainer.style.display = 'none';
        if (noReviewsDiv) noReviewsDiv.style.display = 'block';
        return;
    }
    
    sliderContainer.style.display = 'flex';
    if (noReviewsDiv) noReviewsDiv.style.display = 'none';
    
    // Créer les avis en double pour un défilement infini
    const doubledReviews = [...reviewsData, ...reviewsData];
    
    const reviewsHTML = doubledReviews.map(review => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    <span class="avis-rating-num">${review.rating}/5</span>
                </div>
                <div class="avis-product">${review.product_name || 'Produit'}</div>
            </div>
            <div class="avis-comment">
                ${review.comment || 'Excellent produit !'}
            </div>
            <div class="avis-user">
                par ${review.user_name || (review.user_email ? review.user_email.split('@')[0] : 'Client')}
            </div>
            <div class="avis-date">
                ${review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : 'Récemment'}
            </div>
        </div>
    `).join('');
    
    sliderContainer.innerHTML = reviewsHTML;
    
    // Masquer les contrôles manuels car on a un défilement continu
    const sliderControls = document.querySelector('.slider-controls');
    if (sliderControls) {
        sliderControls.style.display = 'none';
    }
    
    // Masquer les dots
    const sliderDots = document.getElementById('slider-dots');
    if (sliderDots) {
        sliderDots.style.display = 'none';
    }
    
    console.log('✅ Slider continu initialisé avec', doubledReviews.length, 'avis (doublés pour boucle infinie)');
}

function updateReviewsStats(reviews) {
    const totalCount = document.getElementById('total-reviews-count');
    const averageStars = document.getElementById('average-stars');
    const averageRating = document.getElementById('average-rating-display');
    
    if (!reviews || reviews.length === 0) {
        if (totalCount) totalCount.textContent = '0';
        if (averageStars) averageStars.textContent = '☆☆☆☆☆';
        if (averageRating) averageRating.textContent = '0.0';
        return;
    }
    
    const total = reviews.length;
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total;
    
    if (totalCount) totalCount.textContent = total;
    if (averageRating) averageRating.textContent = average.toFixed(1);
    if (averageStars) {
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        let starsHTML = '★'.repeat(fullStars);
        if (hasHalfStar) starsHTML += '☆';
        starsHTML += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
        averageStars.textContent = starsHTML;
    }
}


// Fonction pour soumettre un avis
async function submitReview(productId, name, rating, comment) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                user_id: currentUser ? currentUser.id : null,
                user_name: currentUser ? currentUser.username : (name || 'Anonyme'),
                rating: rating,
                comment: comment
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erreur lors de l\'ajout de l\'avis', 'error');
            return false;
        }

        showNotification('Avis ajouté avec succès !', 'success');
        loadReviews(); // Recharger les avis
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'avis:', error);
        showNotification('Erreur lors de l\'ajout de l\'avis', 'error');
        return false;
    }
}

// Fonction pour charger les produits dans le select du modal avis
function loadProductsForReview() {
    const select = document.getElementById('review-product');
    if (!select || !allProducts) return;
    
    select.innerHTML = '<option value="">Sélectionnez un produit</option>';
    
    allProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

function displayReviews(reviews) {
    // Cette fonction est gardée pour compatibilité mais on utilise maintenant displayReviewsSlider
    displayReviewsSlider(reviews);
}

function setupReviews() {
    console.log('⭐ Configuration des avis...');
    
    // Event listeners pour les avis
    const btnAddReview = document.getElementById('btn-add-review');
    if (btnAddReview) {
        btnAddReview.addEventListener('click', () => {
            loadProductsForReview();
            openModal('modal-review');
        });
        console.log('✅ Bouton d\'ajout d\'avis configuré');
    }
    
    // Formulaire d'ajout d'avis
    const formReview = document.getElementById('form-review');
    if (formReview) {
        formReview.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const productId = document.getElementById('review-product')?.value;
            const name = document.getElementById('review-name')?.value;
            const rating = document.querySelector('input[name="rating"]:checked')?.value;
            const comment = document.getElementById('review-comment')?.value;
            
            if (!productId || !name || !rating || !comment) {
                showNotification('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            const success = await submitReview(parseInt(productId), name, parseInt(rating), comment);
            if (success) {
                closeModal('modal-review');
                formReview.reset();
                // Réinitialiser les étoiles
                document.querySelectorAll('input[name="rating"]').forEach(input => {
                    input.checked = false;
                });
            }
        });
        console.log('✅ Formulaire d\'avis configuré');
    }
}
// ===========================
// AUTHENTIFICATION
// ===========================

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erreur de connexion', 'error');
            return;
        }

        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('modal-login');
        showNotification('Connecté avec succès!', 'success');
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

async function signup(email, username, password, firstName, lastName, phone) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                phone
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erreur lors de l\'inscription', 'error');
            return;
        }

        showNotification('Compte créé! Veuillez vous connecter.', 'success');
        closeModal('modal-signup');
        openModal('modal-login');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        showNotification('Erreur lors de l\'inscription', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Déconnecté', 'success');
}

function updateAuthUI() {
    const btnLogin = document.getElementById('btn-login');
    const loginText = document.querySelector('.login-text');

    if (btnLogin) {
        if (currentUser) {
            if (loginText) {
                loginText.textContent = `Déconnexion`;
            } else {
                btnLogin.textContent = `Déconnexion (${currentUser.username})`;
            }
            btnLogin.onclick = logout;
        } else {
            if (loginText) {
                loginText.textContent = 'Connexion';
            } else {
                btnLogin.textContent = 'Connexion';
            }
            btnLogin.onclick = () => openModal('modal-login');penModal('modal-login');
        }
    }
}

// ===========================
// COMMANDE
// ===========================

async function submitOrder(address, city, phone, deliveryType, paymentMethod, notes) {
    if (!currentUser) {
        showNotification('Veuillez vous connecter d\'abord', 'error');
        openModal('modal-login');
        return;
    }

    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    try {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                items,
                address,
                city,
                phone,
                delivery_type: deliveryType,
                payment_method: paymentMethod,
                notes
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erreur lors de la création de la commande', 'error');
            return;
        }

        showNotification('Commande créée avec succès! Numéro: ' + data.id, 'success');
        cart = [];
        saveCart();
        updateCartUI();
        closeModal('modal-checkout');
        closeModal('modal-panier');
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        showNotification('Erreur lors de la création de la commande', 'error');
    }
}
function setupForms() {
    console.log('📝 Configuration des formulaires...');
    
    // Authentification
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            login(email, password);
        });
        console.log('✅ Formulaire de connexion configuré');
    }

    const formSignup = document.getElementById('form-signup');
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = e.target.querySelectorAll('input');
            const firstName = document.getElementById('signup-firstname')?.value || inputs[3]?.value;
            const lastName = document.getElementById('signup-lastname')?.value || inputs[4]?.value;
            const phone = document.getElementById('signup-phone')?.value || inputs[5]?.value;
            signup(inputs[0].value, inputs[1].value, inputs[2].value, firstName, lastName, phone);
        });
        console.log('✅ Formulaire d\'inscription configuré');
    }

    const btnSignup = document.getElementById('btn-signup');
    if (btnSignup) {
        btnSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('modal-login');
            openModal('modal-signup');
        });
        console.log('✅ Lien d\'inscription configuré');
    }

    // Checkout
    const formCheckout = document.getElementById('form-checkout');
    if (formCheckout) {
        formCheckout.addEventListener('submit', (e) => {
            e.preventDefault();
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const phone = document.getElementById('phone').value;
            const deliveryType = document.querySelector('input[name="delivery_type"]:checked')?.value;
            const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value;
            const notes = document.getElementById('notes').value;

            submitOrder(address, city, phone, deliveryType, paymentMethod, notes);
        });
        console.log('✅ Formulaire de commande configuré');
    }
}