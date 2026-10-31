const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapDriver(row) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    assignedVehicleReg: row.assigned_vehicle_reg,
    phone: row.phone,
    licenseNumber: row.license_number,
    licenseExpiry: row.license_expiry,
    experienceYears: row.experience_years,
    baseSalaryMonthly: parseFloat(row.base_salary_monthly),
    allowancePerDay: parseFloat(row.allowance_per_day),
    overtimeHours: parseFloat(row.overtime_hours),
    workingHoursThisMonth: parseFloat(row.working_hours_this_month),
    currentRoute: row.current_route,
    rating: parseFloat(row.rating),
    tripsCompleted: row.trips_completed,
    onTimeDeliveryRate: parseFloat(row.on_time_delivery_rate),
    fuelEfficiencyScore: parseFloat(row.fuel_efficiency_score),
    safetyScore: parseFloat(row.safety_score),
    revenueGeneratedTotal: parseFloat(row.revenue_generated_total),
    status: row.status,
    photoUrl: row.photo_url,
  };
}

// GET /api/drivers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM drivers ORDER BY name');
    res.json(rows.map(mapDriver));
  } catch (err) {
    console.error('GET /api/drivers error:', err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// GET /api/drivers/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ? OR code = ?', [req.params.id, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Driver not found' });
    res.json(mapDriver(rows[0]));
  } catch (err) {
    console.error('GET /api/drivers/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

module.exports = router;
