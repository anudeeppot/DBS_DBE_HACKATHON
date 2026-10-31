const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapAlert(row) {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity,
    title: row.title,
    message: row.message,
    timestamp: row.timestamp,
    read: !!row.is_read,
    actionUrl: row.action_url,
    vehicleReg: row.vehicle_reg,
  };
}

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(rows.map(mapAlert));
  } catch (err) {
    console.error('GET /api/alerts error:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// POST /api/alerts  — insert a new alert (e.g., after accepting an opportunity)
router.post('/', async (req, res) => {
  const a = req.body;
  try {
    await pool.query(
      `INSERT INTO alerts (id, type, severity, title, message, timestamp, is_read, action_url, vehicle_reg)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [a.id, a.type, a.severity, a.title, a.message, a.timestamp, 0, a.actionUrl, a.vehicleReg]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('POST /api/alerts error:', err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// PATCH /api/alerts/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/alerts/:id/read error:', err);
    res.status(500).json({ error: 'Failed to mark alert as read' });
  }
});

// PATCH /api/alerts/read-all
router.patch('/read-all', async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_read = 1');
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/alerts/read-all error:', err);
    res.status(500).json({ error: 'Failed to mark all alerts as read' });
  }
});

module.exports = router;
