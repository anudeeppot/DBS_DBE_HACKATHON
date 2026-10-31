const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper: map flat DB row → nested Vehicle shape expected by frontend
function mapVehicle(row, stops = []) {
  return {
    id: row.id,
    regNumber: row.reg_number,
    type: row.type,
    makeModel: row.make_model,
    status: row.status,
    driverId: row.driver_id,
    driverName: row.driver_name,
    driverPhone: row.driver_phone,
    currentLocation: {
      city: row.loc_city,
      state: row.loc_state,
      lat: parseFloat(row.loc_lat),
      lng: parseFloat(row.loc_lng),
      heading: row.loc_heading,
      speedKmph: row.loc_speed_kmph,
    },
    origin: row.origin,
    destination: row.destination,
    routeStops: stops.map(s => ({
      city: s.city,
      state: s.state,
      status: s.status,
      eta: s.eta,
      actualArrival: s.actual_arrival,
      distanceFromStartKm: parseFloat(s.distance_from_start_km),
      latitude: parseFloat(s.latitude),
      longitude: parseFloat(s.longitude),
    })),
    currentStopIndex: row.current_stop_index,
    totalDistanceKm: parseFloat(row.total_distance_km),
    distanceCoveredKm: parseFloat(row.distance_covered_km),
    distanceRemainingKm: parseFloat(row.distance_remaining_km),
    eta: row.eta,
    maxWeightTons: parseFloat(row.max_weight_tons),
    currentWeightTons: parseFloat(row.current_weight_tons),
    maxVolumeM3: parseFloat(row.max_volume_m3),
    currentVolumeM3: parseFloat(row.current_volume_m3),
    mileageKmPerL: parseFloat(row.mileage_km_per_l),
    fuelPricePerL: parseFloat(row.fuel_price_per_l),
    maintenanceRatePerKm: parseFloat(row.maintenance_rate_per_km),
    driverCostPerKm: parseFloat(row.driver_cost_per_km),
    odometerKm: row.odometer_km,
    serviceDueInKm: row.service_due_in_km,
    healthScore: row.health_score,
    activeShipmentIds: [],   // populated via shipments join if needed
    totalTripRevenue: parseFloat(row.total_trip_revenue),
    totalTripCost: parseFloat(row.total_trip_cost),
    lastUpdated: row.last_updated,
  };
}

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const [vehicles] = await pool.query('SELECT * FROM vehicles ORDER BY reg_number');
    const [stops]    = await pool.query('SELECT * FROM vehicle_route_stops ORDER BY vehicle_id, stop_order');

    const stopsByVehicle = stops.reduce((acc, s) => {
      if (!acc[s.vehicle_id]) acc[s.vehicle_id] = [];
      acc[s.vehicle_id].push(s);
      return acc;
    }, {});

    const result = vehicles.map(v => mapVehicle(v, stopsByVehicle[v.id] || []));
    res.json(result);
  } catch (err) {
    console.error('GET /api/vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows]  = await pool.query('SELECT * FROM vehicles WHERE id = ? OR reg_number = ?', [req.params.id, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    const [stops] = await pool.query('SELECT * FROM vehicle_route_stops WHERE vehicle_id = ? ORDER BY stop_order', [rows[0].id]);
    res.json(mapVehicle(rows[0], stops));
  } catch (err) {
    console.error('GET /api/vehicles/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// PATCH /api/vehicles/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['In Transit','Loading','Idle','Delayed','Maintenance','At Stop','Offline'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status value' });
  try {
    await pool.query('UPDATE vehicles SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/vehicles/:id/status error:', err);
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

// PATCH /api/vehicles/:id/load  — used when accepting an intermediate shipment
router.patch('/:id/load', async (req, res) => {
  const { currentWeightTons, currentVolumeM3, totalTripRevenue, totalTripCost } = req.body;
  try {
    await pool.query(
      'UPDATE vehicles SET current_weight_tons=?, current_volume_m3=?, total_trip_revenue=?, total_trip_cost=? WHERE id=?',
      [currentWeightTons, currentVolumeM3, totalTripRevenue, totalTripCost, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/vehicles/:id/load error:', err);
    res.status(500).json({ error: 'Failed to update vehicle load' });
  }
});

module.exports = router;
