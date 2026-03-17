const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// POST register
router.post('/register', async (req, res) => {
  const { email, username, password, first_name, last_name, phone, address, city, postal_code } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ error: 'Champs requis: email, username, password' });
  if (!first_name || !phone)
    return res.status(400).json({ error: 'Le prénom et le numéro de téléphone sont obligatoires' });
  try {
    const exists = await db.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username]);
    if (exists.rows.find(u => u.email === email))
      return res.status(400).json({ error: 'Email déjà utilisé' });
    if (exists.rows.find(u => u.username === username))
      return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" });

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (email, username, password_hash, first_name, last_name, phone, address, city, postal_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [email, username, password_hash, first_name, last_name, phone, address, city, postal_code]
    );
    const user = rows[0];
    delete user.password_hash;
    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    delete user.password_hash;
    res.json({ message: 'Connexion réussie', user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id,email,username,first_name,last_name,phone,address,city,postal_code,is_admin,created_at FROM users');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET one user
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id,email,username,first_name,last_name,phone,address,city,postal_code,is_admin,created_at FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { rows: existing } = await db.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const u = existing[0];
    const { first_name=u.first_name, last_name=u.last_name, phone=u.phone,
            address=u.address, city=u.city, postal_code=u.postal_code } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, address=$4, city=$5, postal_code=$6
       WHERE id=$7 RETURNING id,email,username,first_name,last_name,phone,address,city,postal_code,is_admin,created_at`,
      [first_name, last_name, phone, address, city, postal_code, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
