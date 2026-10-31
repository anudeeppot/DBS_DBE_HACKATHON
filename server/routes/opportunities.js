const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapOpp(row) {
  return {
    id: row.id,
    shipmentTitle: row.shipment_title,
    origin: row.origin,
    destination: row.destination,
    weightTons: parseFloat(row.weight_tons),
    volumeM3: parseFloat(row.volume_m3),
    packageCount: row.package_count,
    goodsType: row.goods_type,
    offeredRevenue: parseFloat(row.offered_revenue),
    deadlineHours: row.deadline_hours,
    targetVehicleId: row.target_vehicle_id,
    targetVehicleReg: row.target_vehicle_reg,
    vehicleCurrentLoadTons: parseFloat(row.vehicle_current_load_tons),
    vehicleMaxLoadTons: parseFloat(row.vehicle_max_load_tons),
    vehicleCurrentVolumeM3: parseFloat(row.vehicle_current_volume_m3),
    vehicleMaxVolumeM3: parseFloat(row.vehicle_max_volume_m3),
    routeCompatibilityScore: row.route_compatibility_score,
    additionalDistanceKm: parseFloat(row.additional_distance_km),
    additionalFuelCost: parseFloat(row.additional_fuel_cost),
    additionalDriverCost: parseFloat(row.additional_driver_cost),
    additionalMaintenanceCost: parseFloat(row.additional_maintenance_cost),
    additionalTollCost: parseFloat(row.additional_toll_cost),
    totalAdditionalCost: parseFloat(row.total_additional_cost),
    netAdditionalProfit: parseFloat(row.net_additional_profit),
    incrementalMarginPct: parseFloat(row.incremental_margin_pct),
    recommendation: row.recommendation,
    recommendationReason: row.recommendation_reason,
    isAccepted: !!row.is_accepted,
  };
}

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY net_additional_profit DESC');
    res.json(rows.map(mapOpp));
  } catch (err) {
    console.error('GET /api/opportunities error:', err);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// PATCH /api/opportunities/:id/accept
router.patch('/:id/accept', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE opportunities SET is_accepted = 1 WHERE id = ? AND is_accepted = 0',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(400).json({ error: 'Already accepted or not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/opportunities/:id/accept error:', err);
    res.status(500).json({ error: 'Failed to accept opportunity' });
  }
});

module.exports = router;
