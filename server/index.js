const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));  // Vite dev server
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/vehicles',     require('./routes/vehicles'));
app.use('/api/drivers',      require('./routes/drivers'));
app.use('/api/shipments',    require('./routes/shipments'));
app.use('/api/opportunities',require('./routes/opportunities'));
app.use('/api/maintenance',  require('./routes/maintenance'));
app.use('/api/expenses',     require('./routes/expenses'));
app.use('/api/alerts',       require('./routes/alerts'));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ TransitX API server running on http://localhost:${PORT}`);
});
