require('dotenv').config();
const db = require('./db');

const demoReviews = [
  { product_name: 'Donut Chocolat', rating: 5, comment: 'Absolument délicieux ! Les donuts sont frais et le goût est incroyable.', user_name: 'Marie L.' },
  { product_name: 'Donut Vanille',  rating: 4, comment: 'Très bon service et produits de qualité. Je recommande !',               user_name: 'Pierre D.' },
  { product_name: 'Donut Nutella',  rating: 5, comment: 'Les meilleurs donuts de la ville ! Livraison rapide en plus.',            user_name: 'Sophie M.' },
  { product_name: 'Donut Caramel Beurre Salé', rating: 4, comment: 'Parfait pour le petit-déjeuner. Texture moelleuse et goût authentique.', user_name: 'Ahmed K.' },
  { product_name: 'Donut Fraise Chantilly', rating: 5, comment: 'Une découverte fantastique ! Je vais commander régulièrement.',   user_name: 'Lucie R.' },
  { product_name: 'Donut Pistache', rating: 4, comment: 'Très satisfait de ma commande. Donuts savoureux et bien présentés.',     user_name: 'Thomas B.' },
];

async function seed() {
  console.log('🌱 Insertion des avis de démo...');

  for (const r of demoReviews) {
    // Trouver l'ID du produit par son nom
    const { rows } = await db.query('SELECT id FROM products WHERE name = $1 LIMIT 1', [r.product_name]);
    if (!rows[0]) {
      console.warn(`⚠️  Produit "${r.product_name}" non trouvé, avis ignoré`);
      continue;
    }
    await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, NULL, $2, $3)`,
      [rows[0].id, r.rating, `${r.comment} — ${r.user_name}`]
    );
    console.log(`✅ Avis de ${r.user_name} inséré`);
  }

  await db.end();
  console.log('🎉 Done');
}

seed().catch(e => { console.error(e.message); process.exit(1); });
