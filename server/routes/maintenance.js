const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapMaint(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    vehicleReg: row.vehicle_reg,
    serviceType: row.service_type,
    scheduledDate: row.scheduled_date,
    completedDate: row.completed_date,
    odometerKm: row.odometer_km,
    cost: parseFloat(row.cost),
    status: row.status,
    workshop: row.workshop,
    mechanicNotes: row.mechanic_notes,
    nextServiceKm: row.next_service_km,
  };
}

// GET /api/maintenance
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM maintenance ORDER BY scheduled_date DESC');
    res.json(rows.map(mapMaint));
  } catch (err) {
    console.error('GET /api/maintenance error:', err);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// POST /api/maintenance
router.post('/', async (req, res) => {
  const r = req.body;
  try {
    await pool.query(
      `INSERT INTO maintenance (id, vehicle_id, vehicle_reg, service_type, scheduled_date,
        completed_date, odometer_km, cost, status, workshop, mechanic_notes, next_service_km)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [r.id, r.vehicleId, r.vehicleReg, r.serviceType, r.scheduledDate,
       r.completedDate, r.odometerKm, r.cost, r.status, r.workshop, r.mechanicNotes, r.nextServiceKm]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('POST /api/maintenance error:', err);
    res.status(500).json({ error: 'Failed to add maintenance record' });
  }
});

module.exports = router;
