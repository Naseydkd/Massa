const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY display_order');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      for (const item of data) {
        const { rows } = await db.query('SELECT id FROM categories WHERE name=$1', [item.name]);
        if (rows[0]) {
          await db.query('UPDATE categories SET display_order=$1, is_visible=$2 WHERE name=$3',
            [item.display_order ?? 999, item.is_visible ?? true, item.name]);
        } else {
          await db.query('INSERT INTO categories (name, display_order, is_visible) VALUES ($1,$2,$3)',
            [item.name, item.display_order ?? 999, item.is_visible ?? true]);
        }
      }
      return res.json({ message: 'Catégories mises à jour' });
    }
    if (!data.name) return res.status(400).json({ error: 'Le nom est requis' });
    const name = data.name.toLowerCase();
    const { rows } = await db.query('SELECT id FROM categories WHERE name=$1', [name]);
    if (rows[0]) return res.status(400).json({ error: `Catégorie "${name}" existe déjà` });
    const { rows: [cat] } = await db.query(
      'INSERT INTO categories (name, display_order, is_visible) VALUES ($1,$2,$3) RETURNING *',
      [name, data.display_order ?? 999, data.is_visible ?? true]
    );
    res.status(201).json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { rows: existing } = await db.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Catégorie non trouvée' });
    const c = existing[0];
    const { display_order=c.display_order, is_visible=c.is_visible } = req.body;
    const { rows } = await db.query(
      'UPDATE categories SET display_order=$1, is_visible=$2 WHERE id=$3 RETURNING *',
      [display_order, is_visible, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/init', async (req, res) => {
  const defaults = [
    { name: 'classique', display_order: 1 },
    { name: 'gourmand',  display_order: 2 },
    { name: 'sain',      display_order: 3 },
    { name: 'special',   display_order: 4 }
  ];
  try {
    for (const cat of defaults) {
      const { rows } = await db.query('SELECT id FROM categories WHERE name=$1', [cat.name]);
      if (!rows[0]) {
        await db.query('INSERT INTO categories (name, display_order, is_visible) VALUES ($1,$2,true)',
          [cat.name, cat.display_order]);
      }
    }
    res.json({ message: 'Catégories initialisées' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
