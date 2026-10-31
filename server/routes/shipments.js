const express = require('express');
const router = express.Router();
const pool = require('../db');

function mapShipment(row) {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    customerName: row.customer_name,
    customerCompany: row.customer_company,
    origin: row.origin,
    destination: row.destination,
    pickupDate: row.pickup_date,
    deliveryDeadline: row.delivery_deadline,
    estimatedDelivery: row.estimated_delivery,
    actualDelivery: row.actual_delivery,
    weightTons: parseFloat(row.weight_tons),
    volumeM3: parseFloat(row.volume_m3),
    packageCount: row.package_count,
    goodsType: row.goods_type,
    priority: row.priority,
    transportMode: row.transport_mode,
    assignedVehicleId: row.assigned_vehicle_id,
    assignedVehicleReg: row.assigned_vehicle_reg,
    status: row.status,
    isIntermediateLoad: !!row.is_intermediate_load,
    intermediatePickupStop: row.intermediate_pickup_stop,
    intermediateDropStop: row.intermediate_drop_stop,
    revenue: parseFloat(row.revenue),
    allocatedFuelCost: parseFloat(row.allocated_fuel_cost),
    allocatedDriverCost: parseFloat(row.allocated_driver_cost),
    allocatedMaintenanceCost: parseFloat(row.allocated_maintenance_cost),
    allocatedTollCost: parseFloat(row.allocated_toll_cost),
    allocatedHandlingCost: parseFloat(row.allocated_handling_cost),
    totalCost: parseFloat(row.total_cost),
    profit: parseFloat(row.profit),
    profitMargin: parseFloat(row.profit_margin),
    currentProgressPct: row.current_progress_pct,
  };
}

// GET /api/shipments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shipments ORDER BY created_at DESC');
    res.json(rows.map(mapShipment));
  } catch (err) {
    console.error('GET /api/shipments error:', err);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// POST /api/shipments  — create new shipment
router.post('/', async (req, res) => {
  const s = req.body;
  try {
    await pool.query(
      `INSERT INTO shipments (
        id, tracking_number, customer_name, customer_company, origin, destination,
        pickup_date, delivery_deadline, estimated_delivery, weight_tons, volume_m3,
        package_count, goods_type, priority, transport_mode, assigned_vehicle_id,
        assigned_vehicle_reg, status, is_intermediate_load, intermediate_pickup_stop,
        intermediate_drop_stop, revenue, allocated_fuel_cost, allocated_driver_cost,
        allocated_maintenance_cost, allocated_toll_cost, allocated_handling_cost,
        total_cost, profit, profit_margin, current_progress_pct
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        s.id, s.trackingNumber, s.customerName, s.customerCompany, s.origin, s.destination,
        s.pickupDate, s.deliveryDeadline, s.estimatedDelivery, s.weightTons, s.volumeM3,
        s.packageCount, s.goodsType, s.priority, s.transportMode, s.assignedVehicleId,
        s.assignedVehicleReg, s.status, s.isIntermediateLoad ? 1 : 0, s.intermediatePickupStop,
        s.intermediateDropStop, s.revenue, s.allocatedFuelCost, s.allocatedDriverCost,
        s.allocatedMaintenanceCost, s.allocatedTollCost, s.allocatedHandlingCost,
        s.totalCost, s.profit, s.profitMargin, s.currentProgressPct
      ]
    );
    res.status(201).json({ success: true, id: s.id });
  } catch (err) {
    console.error('POST /api/shipments error:', err);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

module.exports = router;
