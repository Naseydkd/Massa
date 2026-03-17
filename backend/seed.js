require('dotenv').config();
const db = require('./db');

const products = [
  { name: 'Donut Sucre',           category: 'classique', description: 'Donut simple saupoudré de sucre blanc',          price: 1500, image_url: 'images/bouledn.png',        available: true, stock: 50 },
  { name: 'Donut Chocolat',        category: 'classique', description: 'Donut nature avec glaçage chocolat noir',         price: 1000, image_url: 'images/donut-chocolat.png', available: true, stock: 50 },
  { name: 'Donut Rose',            category: 'classique', description: 'Donut avec glaçage rose sucré',                   price: 1000, image_url: 'images/donut-rose.png',      available: true, stock: 50 },
  { name: 'Donut Vanille',         category: 'classique', description: 'Donut fourré à la vanille',                       price: 2500, image_url: 'images/donut-vanille.png',   available: true, stock: 50 },
  { name: 'Donut Nutella',         category: 'gourmand',  description: 'Donut fourré aux noisettes Nutella',              price: 1000, image_url: 'images/donut-nutella.png',   available: true, stock: 50 },
  { name: 'Donut Caramel Beurre Salé', category: 'gourmand', description: 'Donut avec caramel et fleur de sel',          price: 1000, image_url: 'images/donut-caramel.png',   available: true, stock: 50 },
  { name: 'Donut Fraise Chantilly',category: 'gourmand',  description: 'Donut garni de fraise fraîche et chantilly',     price: 1000, image_url: 'images/donut-fraise.png',    available: true, stock: 50 },
  { name: 'Donut Cookies & Cream', category: 'gourmand',  description: 'Donut avec morceaux de cookies et crème',        price: 1000, image_url: 'images/donut-cookies.png',   available: true, stock: 50 },
  { name: 'Donut Complet',         category: 'sain',      description: 'Donut aux céréales complètes',                   price: 1000, image_url: 'images/donut-complet.png',   available: true, stock: 50 },
  { name: 'Donut sans Sucre',      category: 'sain',      description: 'Donut sucré avec édulcorant naturel',            price: 1000, image_url: 'images/donut-sansucre.png',  available: true, stock: 50 },
  { name: 'Donut Fruits Rouges',   category: 'sain',      description: 'Donut fourré aux fruits rouges',                 price: 1000, image_url: 'images/donut-fruits.png',    available: true, stock: 50 },
  { name: 'Donut Amande Miel',     category: 'sain',      description: "Donut à base de farine d'amande",               price: 3000, image_url: 'images/donut-amande.png',    available: true, stock: 50 },
  { name: 'Donut Café',            category: 'special',   description: 'Donut au parfum café intense',                   price: 1000, image_url: 'images/donut-cafe.png',      available: true, stock: 50 },
  { name: 'Donut Pistache',        category: 'special',   description: 'Donut fourré à la pistache',                     price: 1000, image_url: 'images/donut-pistache.png',  available: true, stock: 50 },
  { name: 'Donut Matcha',          category: 'special',   description: 'Donut au thé matcha japonais',                   price: 1000, image_url: 'images/donut-matcha.png',    available: true, stock: 50 },
  { name: 'Donut Lavande Miel',    category: 'special',   description: 'Donut parfumé à la lavande avec miel',           price: 1000, image_url: 'images/donut-lavande.png',   available: true, stock: 50 },
];

const categories = [
  { name: 'classique', display_order: 1 },
  { name: 'gourmand',  display_order: 2 },
  { name: 'sain',      display_order: 3 },
  { name: 'special',   display_order: 4 },
];

async function seed() {
  console.log('🌱 Seeding...');

  // Categories
  for (const cat of categories) {
    await db.query(
      `INSERT INTO categories (name, display_order, is_visible)
       VALUES ($1, $2, true) ON CONFLICT (name) DO NOTHING`,
      [cat.name, cat.display_order]
    );
  }
  console.log('✅ Catégories insérées');

  // Products
  for (const p of products) {
    await db.query(
      `INSERT INTO products (name, category, description, price, image_url, available, stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [p.name, p.category, p.description, p.price, p.image_url, p.available, p.stock]
    );
  }
  console.log('✅ Produits insérés');

  await db.end();
  console.log('🎉 Done');
}

seed().catch(e => { console.error(e); process.exit(1); });
