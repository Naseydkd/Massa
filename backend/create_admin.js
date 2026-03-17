require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

// ⬇️ MODIFIE CES VALEURS
const EMAIL    = 'abdoulnasserseydou24@gmail.com';
const USERNAME = 'admin';
const PASSWORD = 'Abdoulseydou@bouledeneige';
// ⬆️ MODIFIE CES VALEURS

async function go() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  await db.query(
    `INSERT INTO users (email, username, password_hash, is_admin)
     VALUES ($1, $2, $3, true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $3, is_admin = true`,
    [EMAIL, USERNAME, hash]
  );
  console.log(`✅ Admin créé : ${EMAIL}`);
  await db.end();
}

go().catch(e => { console.error(e.message); process.exit(1); });
