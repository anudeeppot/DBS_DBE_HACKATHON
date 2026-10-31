const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapExpense(row) {
  return {
    id: row.id,
    date: row.date,
    vehicleReg: row.vehicle_reg,
    category: row.category,
    description: row.description,
    amount: parseFloat(row.amount),
    litersOrKm: row.liters_or_km ? parseFloat(row.liters_or_km) : undefined,
    invoiceNumber: row.invoice_number,
    paymentMethod: row.payment_method,
    approvedBy: row.approved_by,
  };
}

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(rows.map(mapExpense));
  } catch (err) {
    console.error('GET /api/expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  const e = req.body;
  try {
    await pool.query(
      `INSERT INTO expenses (id, date, vehicle_reg, category, description, amount,
        liters_or_km, invoice_number, payment_method, approved_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [e.id, e.date, e.vehicleReg, e.category, e.description, e.amount,
       e.litersOrKm ?? null, e.invoiceNumber, e.paymentMethod, e.approvedBy]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('POST /api/expenses error:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

module.exports = router;
