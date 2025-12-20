// Configuration
const API_BASE_URL = 'http://localhost:5001/api';
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// Produits de démonstration
const DEMO_PRODUCTS = [
    // Classiques
    { id: 1, name: 'Donut Sucre', category: 'classique', description: 'Donut simple saupoudré de sucre blanc', price: 1500, color: '#F4A460', topping: 'white', image: 'images/bouledn.png', available: true },
    { id: 2, name: 'Donut Chocolat', category: 'classique', description: 'Donut nature avec glaçage chocolat noir', price: 1000, color: '#8B4513', topping: 'brown', image: 'images/donut-chocolat.png', available: true },
    { id: 3, name: 'Donut Rose', category: 'classique', description: 'Donut avec glaçage rose sucré', price: 1000, color: '#FFB6C1', topping: 'pink', image: 'images/donut-rose.png', available: true },
    { id: 4, name: 'Donut Vanille', category: 'classique', description: 'Donut fourré à la vanille', price: 2500, color: '#F5DEB3', topping: 'cream', image: 'images/donut-vanille.png', available: true },
    // Gourmands
    { id: 5, name: 'Donut Nutella', category: 'gourmand', description: 'Donut fourré aux noisettes Nutella', price: 1000, color: '#8B4513', topping: 'nutella', image: 'images/donut-nutella.png', available: true },
    { id: 6, name: 'Donut Caramel Beurre Salé', category: 'gourmand', description: 'Donut avec caramel et fleur de sel', price: 1000, color: '#CD853F', topping: 'caramel', image: 'images/donut-caramel.png', available: true },
    { id: 7, name: 'Donut Fraise Chantilly', category: 'gourmand', description: 'Donut garni de fraise fraîche et chantilly', price: 1000, color: '#FF69B4', topping: 'strawberry', image: 'images/donut-fraise.png', available: true },
    { id: 8, name: 'Donut Cookies & Cream', category: 'gourmand', description: 'Donut avec morceaux de cookies et crème', price: 1000, color: '#D2B48C', topping: 'cookies', image: 'images/donut-cookies.png', available: true },
    // Sains
    { id: 9, name: 'Donut Complet', category: 'sain', description: 'Donut aux céréales complètes', price: 1000, color: '#8B6F47', topping: 'wholegrains', image: 'images/donut-complet.png', available: true },
    { id: 10, name: 'Donut sans Sucre', category: 'sain', description: 'Donut sucré avec édulcorant naturel', price: 1000, color: '#D4AF37', topping: 'honey', image: 'images/donut-sansucre.png', available: true },
    { id: 11, name: 'Donut Fruits Rouges', category: 'sain', description: 'Donut fourré aux fruits rouges', price: 1000, color: '#DC143C', topping: 'berries', image: 'images/donut-fruits.png', available: true },
    { id: 12, name: 'Donut Amande Miel', category: 'sain', description: 'Donut à base de farine d\'amande', price: 3000, color: '#D4A574', topping: 'almond', image: 'images/donut-amande.png', available: true },
    // Spéciaux
    { id: 13, name: 'Donut Café', category: 'special', description: 'Donut au parfum café intense', price: 1000, color: '#6F4E37', topping: 'coffee', image: 'images/donut-cafe.png', available: true },
    { id: 14, name: 'Donut Pistache', category: 'special', description: 'Donut fourré à la pistache', price: 1000, color: '#93C572', topping: 'pistachio', image: 'images/donut-pistache.png', available: true },
    { id: 15, name: 'Donut Matcha', category: 'special', description: 'Donut au thé matcha japonais', price: 1000, color: '#7CB342', topping: 'matcha', image: 'images/donut-matcha.png', available: true },
    { id: 16, name: 'Donut Lavande Miel', category: 'special', description: 'Donut parfumé à la lavande avec miel', price: 1000, color: '#E6E6FA', topping: 'lavender', image: 'images/donut-lavande.png', available: true }
];

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateCartUI();
});

// ===========================
// GÉNÉRATION DES IMAGES SVG
// ===========================

function generateDonutSVG(product, size = 'medium') {
    const baseSize = size === 'large' ? 150 : 100;
    const svg = `
        <svg viewBox="0 0 200 200" style="width: ${baseSize}px; height: ${baseSize}px;">
            <!-- Ombre -->
            <ellipse cx="100" cy="160" rx="70" ry="15" fill="rgba(0,0,0,0.1)"/>
            
            <!-- Donut principal -->
            <circle cx="100" cy="100" r="80" fill="${product.color}" stroke="#8B7355" stroke-width="3"/>
            <circle cx="100" cy="100" r="50" fill="#ffffff" stroke="none"/>
            
            <!-- Glaçage brillant -->
            <ellipse cx="85" cy="70" rx="30" ry="20" fill="${product.color}" opacity="0.3"/>
            
            <!-- Garniture/décoration selon le type -->
            ${generateToppingHTML(product.topping)}
        </svg>
    `;
    return svg;
}

function generateToppingHTML(topping) {
    const toppings = {
        'white': `<circle cx="70" cy="80" r="3" fill="white"/><circle cx="100" cy="70" r="2.5" fill="white"/><circle cx="130" cy="85" r="3" fill="white"/><circle cx="110" cy="110" r="2.5" fill="white"/>`,
        'brown': `<circle cx="70" cy="80" r="4" fill="#6F4E37"/><circle cx="100" cy="70" r="3.5" fill="#6F4E37"/><circle cx="130" cy="85" r="4" fill="#6F4E37"/>`,
        'pink': `<path d="M70 120 Q75 110 80 120" stroke="#FF1493" stroke-width="2" fill="none"/><path d="M100 125 Q105 115 110 125" stroke="#FF1493" stroke-width="2" fill="none"/>`,
        'cream': `<path d="M80 115 Q85 105 90 115" stroke="#FFFACD" stroke-width="2.5" fill="none"/><path d="M110 115 Q115 105 120 115" stroke="#FFFACD" stroke-width="2.5" fill="none"/>`,
        'nutella': `<circle cx="75" cy="85" r="5" fill="#6F4E37"/><circle cx="105" cy="90" r="5" fill="#6F4E37"/><circle cx="95" cy="110" r="4" fill="#6F4E37"/>`,
        'caramel': `<path d="M70 100 Q80 90 90 100 Q100 110 110 100" stroke="#CD853F" stroke-width="3" fill="none"/><circle cx="85" cy="95" r="2" fill="#FFD700"/>`,
        'strawberry': `<circle cx="80" cy="85" r="6" fill="#FF1493"/><circle cx="110" cy="90" r="6" fill="#FF1493"/><circle cx="95" cy="110" r="5" fill="#FF1493"/><circle cx="85" cy="105" r="4" fill="#FFB6C1"/>`,
        'cookies': `<circle cx="75" cy="80" r="5" fill="#8B4513"/><circle cx="105" cy="85" r="5" fill="#8B4513"/><circle cx="90" cy="105" r="4" fill="#8B4513"/><circle cx="110" cy="100" r="3" fill="#654321"/>`,
        'wholegrains': `<rect x="70" y="75" width="4" height="4" fill="#8B6F47" transform="rotate(20 72 77)"/><rect x="100" y="80" width="4" height="4" fill="#8B6F47" transform="rotate(45 102 82)"/><rect x="110" y="100" width="4" height="4" fill="#8B6F47" transform="rotate(30 112 102)"/>`,
        'honey': `<path d="M75 90 L80 95 L75 100 L70 95 Z" fill="#FFD700"/><path d="M105 95 L110 100 L105 105 L100 100 Z" fill="#FFD700"/><path d="M90 110 L95 115 L90 120 L85 115 Z" fill="#FFA500"/>`,
        'berries': `<circle cx="75" cy="85" r="4" fill="#8B0000"/><circle cx="105" cy="90" r="4" fill="#8B0000"/><circle cx="95" cy="110" r="3.5" fill="#DC143C"/><circle cx="115" cy="100" r="3" fill="#8B0000"/>`,
        'almond': `<ellipse cx="80" cy="85" rx="5" ry="3" fill="#D4A574" stroke="#8B6F47" stroke-width="1" transform="rotate(25 80 85)"/><ellipse cx="110" cy="95" rx="4" ry="2.5" fill="#D4A574" stroke="#8B6F47" stroke-width="1" transform="rotate(45 110 95)"/>`,
        'coffee': `<circle cx="75" cy="85" r="3" fill="#3E2723"/><circle cx="105" cy="90" r="3" fill="#3E2723"/><circle cx="95" cy="110" r="2.5" fill="#3E2723"/><circle cx="115" cy="95" r="2" fill="#3E2723"/>`,
        'pistachio': `<ellipse cx="80" cy="85" rx="6" ry="4" fill="#93C572" stroke="#6B8E23" stroke-width="1.5" transform="rotate(30 80 85)"/><ellipse cx="110" cy="95" rx="5" ry="3.5" fill="#93C572" stroke="#6B8E23" stroke-width="1.5" transform="rotate(50 110 95)"/>`,
        'matcha': `<path d="M70 100 Q75 85 80 100" stroke="#7CB342" stroke-width="2.5" fill="none"/><path d="M100 105 Q105 90 110 105" stroke="#7CB342" stroke-width="2.5" fill="none"/><path d="M85 115 Q90 100 95 115" stroke="#7CB342" stroke-width="2.5" fill="none"/>`,
        'lavender': `<path d="M75 95 L75 110 M70 100 L80 100 M70 105 L80 105" stroke="#E6E6FA" stroke-width="2" fill="none"/><path d="M105 100 L105 115 M100 105 L110 105" stroke="#E6E6FA" stroke-width="2" fill="none"/>`
    };
    return toppings[topping] || toppings['white'];
}

// ===========================
// RÉCUPÉRATION DES DONNÉES
// ===========================

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/`);
        const data = await response.json();
        allProducts = data.length > 0 ? data : DEMO_PRODUCTS;
        displayProducts(allProducts);
    } catch (error) {
        console.warn('API indisponible, utilisation des produits démo');
        allProducts = DEMO_PRODUCTS;
        displayProducts(allProducts);
    }
}

// ===========================
// AFFICHAGE DES PRODUITS
// ===========================

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Aucun produit trouvé</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image_url || product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.innerHTML='${generateDonutSVG(product, 'medium').replace(/"/g, '&quot;')}'" />
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(0)} FCFA</div>
                <div class="product-actions">
                    <button class="btn-details" onclick="showProductDetails(${product.id})">Détails</button>
                    <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Ajouter</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const detailsDiv = document.getElementById('product-details');
    detailsDiv.innerHTML = `
        <div class="product-details-image">
            <img src="${product.image_url || product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.innerHTML='${generateDonutSVG(product, 'large').replace(/"/g, '&quot;')}'" />
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
    showNotification(`${name} ajouté au panier!`, 'success');
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
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
        document.getElementById('cart-total').textContent = '0.00';
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
    document.getElementById('cart-total').textContent = total.toFixed(2);
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

    if (currentUser) {
        btnLogin.textContent = `Déconnexion (${currentUser.username})`;
        btnLogin.onclick = logout;
    } else {
        btnLogin.textContent = 'Connexion';
        btnLogin.onclick = () => openModal('modal-login');
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

// ===========================
// GESTION DES MODALES
// ===========================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
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
    // Menu burger
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbar-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('mobile-open');
    });

    // Fermer le menu burger lors du clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('mobile-open');
        });
    });

    // Slide de filtres
    const filtresContainer = document.querySelector('.filtres-container');
    const filtresBtnContainer = document.querySelector('.filtres');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');

    let scrollPosition = 0;
    const scrollAmount = 120;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateSlideButtons() {
        const maxScroll = filtresBtnContainer.scrollWidth - filtresContainer.clientWidth;
        prevBtn.disabled = scrollPosition <= 0;
        nextBtn.disabled = scrollPosition >= maxScroll;
    }

    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - scrollAmount);
        filtresBtnContainer.style.transform = `translateX(-${scrollPosition}px)`;
        updateSlideButtons();
    });

    nextBtn.addEventListener('click', () => {
        const maxScroll = filtresBtnContainer.scrollWidth - filtresContainer.clientWidth;
        scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
        filtresBtnContainer.style.transform = `translateX(-${scrollPosition}px)`;
        updateSlideButtons();
    });

    // Support tactile (swipe)
    filtresBtnContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        filtresBtnContainer.classList.add('dragging');
    });

    filtresBtnContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        filtresBtnContainer.classList.remove('dragging');
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const maxScroll = filtresBtnContainer.scrollWidth - filtresContainer.clientWidth;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold) {
            // Swipe gauche = aller à droite
            scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
        } else if (diff < -swipeThreshold) {
            // Swipe droite = aller à gauche
            scrollPosition = Math.max(0, scrollPosition - scrollAmount);
        }

        filtresBtnContainer.style.transform = `translateX(-${scrollPosition}px)`;
        updateSlideButtons();
    }

    // Support souris (drag)
    let isMouseDown = false;
    let mouseStartX = 0;
    let lastTranslateX = 0;

    filtresBtnContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
        filtresBtnContainer.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;

        const diff = e.clientX - mouseStartX;
        const newTranslate = lastTranslateX + diff;
        filtresBtnContainer.style.transform = `translateX(${newTranslate}px)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        filtresBtnContainer.classList.remove('dragging');

        const diff = e.clientX - mouseStartX;
        const maxScroll = filtresBtnContainer.scrollWidth - filtresContainer.clientWidth;

        if (diff < -30) {
            scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
        } else if (diff > 30) {
            scrollPosition = Math.max(0, scrollPosition - scrollAmount);
        }

        lastTranslateX = -scrollPosition;
        filtresBtnContainer.style.transform = `translateX(-${scrollPosition}px)`;
        updateSlideButtons();
    });

    updateSlideButtons();

    // Filtres
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });

    // Panier
    document.getElementById('btn-panier').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('modal-panier');
    });

    document.getElementById('btn-commander').addEventListener('click', () => {
        document.querySelector('.filtre-btn').click();
    });

    document.getElementById('btn-continue-shopping').addEventListener('click', () => {
        closeModal('modal-panier');
    });

    document.getElementById('btn-checkout').addEventListener('click', () => {
        // Vérifier si l'utilisateur est connecté
        if (!currentUser) {
            showNotification('Veuillez vous connecter pour finaliser votre commande', 'error');
            closeModal('modal-panier');
            openModal('modal-login');
            return;
        }
        
        // Pré-remplir les champs du formulaire
        const form = document.getElementById('form-checkout');
        // Garder les champs vides par défaut, l'utilisateur peut les remplir
        // Mais si nous avons des données utilisateur, nous pouvons les pré-remplir
        
        closeModal('modal-panier');
        openModal('modal-checkout');
    });

    // Authentification
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        login(email, password);
    });

    document.getElementById('form-signup').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input');
        signup(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value, inputs[5].value);
    });

    document.getElementById('btn-signup').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('modal-login');
        openModal('modal-signup');
    });

    // Checkout
    document.getElementById('form-checkout').addEventListener('submit', (e) => {
        e.preventDefault();
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const phone = document.getElementById('phone').value;
        const deliveryType = document.querySelector('input[name="delivery_type"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
        const notes = document.getElementById('notes').value;

        submitOrder(address, city, phone, deliveryType, paymentMethod, notes);
    });

    // Fermer les modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal').id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Charger l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    } else {
        updateAuthUI();
    }

    // Charger les avis clients
    loadReviews();
}

// ===========================
// AVIS CLIENTS / REVIEWS
// ===========================

async function loadReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`);
        if (!response.ok) {
            console.error('Erreur lors du chargement des avis');
            return;
        }
        
        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
    }
}

function displayReviews(reviews) {
    const avisContainer = document.getElementById('avis-container');
    
    if (!avisContainer) return;
    
    if (!Array.isArray(reviews) || reviews.length === 0) {
        avisContainer.innerHTML = '<p class="no-reviews">Soyez le premier à laisser un avis!</p>';
        return;
    }

    // Afficher les 6 derniers avis
    const recentReviews = reviews.slice(-6).reverse();
    
    const avisHtml = recentReviews.map(review => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-rating">
                    ${'⭐'.repeat(review.rating)}<span class="avis-rating-num">/${review.rating}</span>
                </div>
                <div class="avis-product">${review.product_name || 'Produit'}</div>
            </div>
            <div class="avis-comment">
                "${review.comment || 'Pas de commentaire'}"
            </div>
            <div class="avis-user">
                par ${review.user_email ? review.user_email.split('@')[0] : 'Anonyme'}
            </div>
        </div>
    `).join('');
    
    avisContainer.innerHTML = avisHtml;
}

