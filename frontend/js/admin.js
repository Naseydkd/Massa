// Admin Dashboard Configuration
const API_BASE_URL = 'http://localhost:5001/api';
let currentAdmin = null;
let allOrders = [];
let allProducts = [];
let allUsers = [];

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadDashboardData();
    setupEventListeners();
    setupNavigation();
});

// ===========================
// AUTHENTIFICATION
// ===========================

function checkAdminAuth() {
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (!savedAdmin) {
        window.location.href = 'index.html';
        return;
    }
    currentAdmin = JSON.parse(savedAdmin);
    document.getElementById('admin-user').textContent = currentAdmin.email || 'Admin';
}

// ===========================
// CHARGEMENT DES DONNÉES
// ===========================

async function loadDashboardData() {
    try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
            fetch(`${API_BASE_URL}/orders/`),
            fetch(`${API_BASE_URL}/products/`),
            fetch(`${API_BASE_URL}/users/`)
        ]);

        allOrders = await ordersRes.json();
        allProducts = await productsRes.json();
        allUsers = await usersRes.json();

        updateDashboard();
        displayOrders();
        displayProducts();
        displayUsers();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('Erreur lors du chargement des données', 'error');
    }
}

// ===========================
// MISE À JOUR DU TABLEAU DE BORD
// ===========================

function updateDashboard() {
    // Statistiques
    document.getElementById('stat-orders').textContent = allOrders.length;
    document.getElementById('stat-users').textContent = allUsers.length;
    document.getElementById('stat-products').textContent = allProducts.length;

    // Revenu total
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    document.getElementById('stat-revenue').textContent = totalRevenue.toFixed(0) + ' FCFA';

    // Dernières commandes
    const recentOrders = allOrders.slice(-5).reverse();
    const recentOrdersHtml = recentOrders.map(order => `
        <div class="list-item">
            <div class="list-item-title">Commande #${order.id}</div>
            <div class="list-item-info">
                Client: ${order.user_id} | Total: ${order.total_amount || 0} FCFA | Statut: ${order.status}
            </div>
        </div>
    `).join('');
    document.getElementById('recent-orders').innerHTML = recentOrdersHtml;

    // Produits populaires (plus vendus)
    const productSales = {};
    allOrders.forEach(order => {
        // Exemple simplifié - en vrai il faudrait les order_items
        if (order.items) {
            order.items.forEach(item => {
                productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
            });
        }
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topProductsHtml = topProducts.map(([productId, quantity]) => {
        const product = allProducts.find(p => p.id == productId);
        return `
            <div class="list-item">
                <div class="list-item-title">${product?.name || 'Produit inconnu'}</div>
                <div class="list-item-info">Ventes: ${quantity} unités</div>
            </div>
        `;
    }).join('');
    document.getElementById('popular-products').innerHTML = topProductsHtml;
}

// ===========================
// AFFICHAGE DES COMMANDES
// ===========================

function displayOrders(filteredOrders = null) {
    const orders = filteredOrders || allOrders;
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.user_id}</td>
                        <td>${order.total_amount || 0} FCFA</td>
                        <td><span class="status-badge status-${order.status || 'pending'}">${order.status || 'En attente'}</span></td>
                        <td>${new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                        <td>
                            <button class="btn-sm btn-view" onclick="editOrder(${order.id})">Éditer</button>
                            <button class="btn-sm btn-delete" onclick="deleteOrder(${order.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('orders-table').innerHTML = tableHtml;
}

// ===========================
// AFFICHAGE DES PRODUITS
// ===========================

function displayProducts() {
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Disponible</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allProducts.map(product => `
                    <tr>
                        <td>#${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.price} FCFA</td>
                        <td>${product.available ? '✅' : '❌'}</td>
                        <td>
                            <button class="btn-sm btn-edit" onclick="editProduct(${product.id})">Éditer</button>
                            <button class="btn-sm btn-delete" onclick="deleteProduct(${product.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('products-table').innerHTML = tableHtml;
}

// ===========================
// AFFICHAGE DES UTILISATEURS
// ===========================

function displayUsers() {
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Nom d'utilisateur</th>
                    <th>Téléphone</th>
                    <th>Date d'inscription</th>
                </tr>
            </thead>
            <tbody>
                ${allUsers.map(user => `
                    <tr>
                        <td>#${user.id}</td>
                        <td>${user.email}</td>
                        <td>${user.username}</td>
                        <td>${user.phone || '-'}</td>
                        <td>${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('users-table').innerHTML = tableHtml;
}

// ===========================
// GESTION DES PRODUITS
// ===========================

function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.image_url || '';
    document.getElementById('product-available').checked = product.available;
    document.getElementById('modal-title').textContent = 'Éditer le produit';

    openModal('modal-product');
}

async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Produit supprimé', 'success');
            loadDashboardData();
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// ===========================
// GESTION DES COMMANDES
// ===========================

function editOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('order-id').value = order.id;
    document.getElementById('order-status').value = order.status || 'pending';

    const detailsHtml = `
        <div class="order-detail-row">
            <strong>ID Commande:</strong> <span>#${order.id}</span>
        </div>
        <div class="order-detail-row">
            <strong>Client:</strong> <span>ID ${order.user_id}</span>
        </div>
        <div class="order-detail-row">
            <strong>Montant:</strong> <span>${order.total_amount || 0} FCFA</span>
        </div>
        <div class="order-detail-row">
            <strong>Type de livraison:</strong> <span>${order.delivery_type || 'Non spécifié'}</span>
        </div>
        <div class="order-detail-row">
            <strong>Méthode de paiement:</strong> <span>${order.payment_method || 'Non spécifiée'}</span>
        </div>
    `;
    document.getElementById('order-details').innerHTML = detailsHtml;

    openModal('modal-order');
}

async function deleteOrder(orderId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Commande supprimée', 'success');
            loadDashboardData();
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
    // Bouton ajouter produit
    document.getElementById('btn-add-product').addEventListener('click', () => {
        document.getElementById('product-id').value = '';
        document.getElementById('form-product').reset();
        document.getElementById('modal-title').textContent = 'Ajouter un produit';
        openModal('modal-product');
    });

    // Formulaire produit
    document.getElementById('form-product').addEventListener('submit', submitProduct);

    // Formulaire commande
    document.getElementById('form-order').addEventListener('submit', submitOrder);

    // Filtre statut
    document.getElementById('filter-status').addEventListener('change', (e) => {
        if (e.target.value) {
            const filtered = allOrders.filter(o => o.status === e.target.value);
            displayOrders(filtered);
        } else {
            displayOrders();
        }
    });

    // Déconnexion
    document.getElementById('btn-logout').addEventListener('click', logout);

    // Fermer modales
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });
}

async function submitProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('product-id').value;
    const data = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        image_url: document.getElementById('product-image').value,
        available: document.getElementById('product-available').checked
    };

    try {
        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products/`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification(productId ? 'Produit mis à jour' : 'Produit créé', 'success');
            closeModal('modal-product');
            loadDashboardData();
        } else {
            showNotification('Erreur lors de la sauvegarde', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

async function submitOrder(e) {
    e.preventDefault();

    const orderId = document.getElementById('order-id').value;
    const status = document.getElementById('order-status').value;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showNotification('Commande mise à jour', 'success');
            closeModal('modal-order');
            loadDashboardData();
        } else {
            showNotification('Erreur lors de la mise à jour', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la mise à jour', 'error');
    }
}

// ===========================
// NAVIGATION
// ===========================

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Retirer la classe active
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

            // Ajouter la classe active
            item.classList.add('active');
            const sectionId = item.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');

            // Mettre à jour le titre
            const titles = {
                dashboard: 'Tableau de bord',
                orders: 'Gestion des Commandes',
                products: 'Gestion des Produits',
                users: 'Gestion des Utilisateurs'
            };
            document.getElementById('page-title').textContent = titles[sectionId];
        });
    });
}

// ===========================
// MODALES
// ===========================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ===========================
// DÉCONNEXION
// ===========================

function logout() {
    localStorage.removeItem('currentAdmin');
    window.location.href = 'index.html';
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
        border-radius: 5px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}
