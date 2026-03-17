require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir le frontend statique
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/products',    require('./routes/products'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/orders',      require('./routes/orders'));
app.use('/api/reviews',     require('./routes/reviews'));
app.use('/api/settings',    require('./routes/settings'));
app.use('/api/categories',  require('./routes/categories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
