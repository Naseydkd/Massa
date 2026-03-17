const router = require('express').Router();
const db = require('../db');

const reviewQuery = `
  SELECT r.*, COALESCE(u.email, 'Anonyme') as user_email, p.name as product_name
  FROM reviews r
  LEFT JOIN users u ON r.user_id = u.id
  JOIN products p ON r.product_id = p.id
`;

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(reviewQuery);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/product/:product_id', async (req, res) => {
  try {
    const { rows } = await db.query(reviewQuery + ' WHERE r.product_id=$1', [req.params.product_id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  const { product_id, user_id, rating, comment, user_name } = req.body;
  if (!product_id || !rating)
    return res.status(400).json({ error: 'Champs requis: product_id, rating' });
  if (rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Note doit être entre 1 et 5' });
  try {
    // Si pas de user_id, on insère avec NULL
    const { rows: [r] } = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1,$2,$3,$4) RETURNING id',
      [product_id, user_id || null, rating, comment]
    );
    const { rows: [review] } = await db.query(
      `SELECT r.*, 
        COALESCE(u.email, $2) as user_email,
        p.name as product_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       JOIN products p ON r.product_id = p.id
       WHERE r.id=$1`,
      [r.id, user_name || 'Anonyme']
    );
    res.status(201).json(review);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM reviews WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Avis non trouvé' });
    res.json({ message: 'Avis supprimé' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
