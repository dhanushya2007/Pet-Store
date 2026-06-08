require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

const authRoutes        = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const enquiryRoutes     = require('./routes/enquiries');
const productRoutes     = require('./routes/products');
const sellerRoutes      = require('./routes/sellers');
const adminRoutes       = require('./routes/admin');
const cartRoutes        = require('./routes/cart');
const petRoutes         = require('./routes/pets');
const messageRoutes     = require('./routes/messages');
const orderRoutes       = require('./routes/orders');
const seedRoutes        = require('./routes/seed');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/enquiries',    enquiryRoutes);
app.use('/api/products',     productRoutes);   // legacy
app.use('/api/sellers',      sellerRoutes);    // legacy
app.use('/api/admin',        adminRoutes);
app.use('/api/cart',         cartRoutes);
app.use('/api/pets',         petRoutes);
app.use('/api/messages',     messageRoutes);
app.use('/api/orders',       orderRoutes);
app.use('/api/seed',         seedRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PetStore API running.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
