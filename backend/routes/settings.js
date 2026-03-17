const router = require('express').Router();
const db = require('../db');

async function getOrCreateSettings() {
  let { rows } = await db.query('SELECT * FROM settings LIMIT 1');
  if (!rows[0]) {
    const res = await db.query(
      `INSERT INTO settings (opening_time, closing_time, is_open, notify_on_order)
       VALUES ('09:00','20:00',true,true) RETURNING *`
    );
    rows = res.rows;
  }
  return rows[0];
}

router.get('/', async (req, res) => {
  try { res.json(await getOrCreateSettings()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/', async (req, res) => {
  try {
    const s = await getOrCreateSettings();
    const { opening_time=s.opening_time, closing_time=s.closing_time, is_open=s.is_open,
            notify_email=s.notify_email, notify_on_order=s.notify_on_order } = req.body;
    const { rows } = await db.query(
      `UPDATE settings SET opening_time=$1, closing_time=$2, is_open=$3,
       notify_email=$4, notify_on_order=$5 WHERE id=$6 RETURNING *`,
      [opening_time, closing_time, is_open, notify_email, notify_on_order, s.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
