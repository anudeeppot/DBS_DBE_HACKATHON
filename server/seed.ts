import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { INITIAL_VEHICLES } from '../src/data/vehicles';
import { INITIAL_DRIVERS } from '../src/data/drivers';
import { INITIAL_SHIPMENTS } from '../src/data/shipments';
import { INITIAL_OPPORTUNITIES } from '../src/data/opportunities';
import { INITIAL_MAINTENANCE } from '../src/data/maintenance';
import { INITIAL_EXPENSES } from '../src/data/expenses';
import { INITIAL_ALERTS } from '../src/data/alerts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'transitx',
  });

  console.log('Connected to MySQL. Clearing old data...');

  // Disable FK checks while clearing and reseeding
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await connection.query('TRUNCATE TABLE vehicle_route_stops');
  await connection.query('TRUNCATE TABLE vehicles');
  await connection.query('TRUNCATE TABLE drivers');
  await connection.query('TRUNCATE TABLE shipments');
  await connection.query('TRUNCATE TABLE opportunities');
  await connection.query('TRUNCATE TABLE maintenance');
  await connection.query('TRUNCATE TABLE expenses');
  await connection.query('TRUNCATE TABLE alerts');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('Seeding vehicles and route stops...');
  for (const v of INITIAL_VEHICLES) {
    await connection.query(
      `INSERT INTO vehicles (
        id, reg_number, type, make_model, status, driver_id, driver_name, driver_phone,
        loc_city, loc_state, loc_lat, loc_lng, loc_heading, loc_speed_kmph, origin, destination,
        current_stop_index, total_distance_km, distance_covered_km, distance_remaining_km, eta,
        max_weight_tons, current_weight_tons, max_volume_m3, current_volume_m3, mileage_km_per_l,
        fuel_price_per_l, maintenance_rate_per_km, driver_cost_per_km, odometer_km,
        service_due_in_km, health_score, total_trip_revenue, total_trip_cost, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.regNumber, v.type, v.makeModel, v.status, v.driverId || null, v.driverName || null, v.driverPhone || null,
        v.currentLocation.city, v.currentLocation.state, v.currentLocation.lat, v.currentLocation.lng, v.currentLocation.heading, v.currentLocation.speedKmph,
        v.origin, v.destination, v.currentStopIndex, v.totalDistanceKm, v.distanceCoveredKm, v.distanceRemainingKm, v.eta,
        v.maxWeightTons, v.currentWeightTons, v.maxVolumeM3, v.currentVolumeM3, v.mileageKmPerL,
        v.fuelPricePerL, v.maintenanceRatePerKm, v.driverCostPerKm, v.odometerKm,
        v.serviceDueInKm, v.healthScore, v.totalTripRevenue, v.totalTripCost, v.lastUpdated
      ]
    );

    if (v.routeStops && v.routeStops.length) {
      for (let i = 0; i < v.routeStops.length; i++) {
        const s = v.routeStops[i];
        await connection.query(
          `INSERT INTO vehicle_route_stops (
            vehicle_id, stop_order, city, state, status, eta, actual_arrival, distance_from_start_km, latitude, longitude
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.id, i, s.city, s.state, s.status, s.eta || null, s.actualArrival || null,
            s.distanceFromStartKm, s.latitude, s.longitude
          ]
        );
      }
    }
  }

  console.log('Seeding drivers...');
  for (const d of INITIAL_DRIVERS) {
    await connection.query(
      `INSERT INTO drivers (
        id, name, code, assigned_vehicle_reg, phone, license_number, license_expiry,
        experience_years, base_salary_monthly, allowance_per_day, overtime_hours,
        working_hours_this_month, current_route, rating, trips_completed,
        on_time_delivery_rate, fuel_efficiency_score, safety_score,
        revenue_generated_total, status, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.id, d.name, d.code, d.assignedVehicleReg || null, d.phone, d.licenseNumber, d.licenseExpiry,
        d.experienceYears, d.baseSalaryMonthly, d.allowancePerDay, d.overtimeHours,
        d.workingHoursThisMonth, d.currentRoute, d.rating, d.tripsCompleted,
        d.onTimeDeliveryRate, d.fuelEfficiencyScore, d.safetyScore,
        d.revenueGeneratedTotal, d.status, d.photoUrl || null
      ]
    );
  }

  console.log('Seeding shipments...');
  for (const s of INITIAL_SHIPMENTS) {
    await connection.query(
      `INSERT INTO shipments (
        id, tracking_number, customer_name, customer_company, origin, destination,
        pickup_date, delivery_deadline, estimated_delivery, actual_delivery, weight_tons, volume_m3,
        package_count, goods_type, priority, transport_mode, assigned_vehicle_id, assigned_vehicle_reg,
        status, is_intermediate_load, intermediate_pickup_stop, intermediate_drop_stop,
        revenue, allocated_fuel_cost, allocated_driver_cost, allocated_maintenance_cost,
        allocated_toll_cost, allocated_handling_cost, total_cost, profit, profit_margin, current_progress_pct
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id, s.trackingNumber, s.customerName, s.customerCompany, s.origin, s.destination,
        s.pickupDate, s.deliveryDeadline, s.estimatedDelivery, s.actualDelivery || null, s.weightTons, s.volumeM3,
        s.packageCount, s.goodsType, s.priority, s.transportMode, s.assignedVehicleId || null, s.assignedVehicleReg || null,
        s.status, s.isIntermediateLoad ? 1 : 0, s.intermediatePickupStop || null, s.intermediateDropStop || null,
        s.revenue, s.allocatedFuelCost, s.allocatedDriverCost, s.allocatedMaintenanceCost,
        s.allocatedTollCost, s.allocatedHandlingCost, s.totalCost, s.profit, s.profitMargin, s.currentProgressPct
      ]
    );
  }

  console.log('Seeding opportunities...');
  for (const o of INITIAL_OPPORTUNITIES) {
    await connection.query(
      `INSERT INTO opportunities (
        id, shipment_title, origin, destination, weight_tons, volume_m3, package_count, goods_type,
        offered_revenue, deadline_hours, target_vehicle_id, target_vehicle_reg, vehicle_current_load_tons,
        vehicle_max_load_tons, vehicle_current_volume_m3, vehicle_max_volume_m3, route_compatibility_score,
        additional_distance_km, additional_fuel_cost, additional_driver_cost, additional_maintenance_cost,
        additional_toll_cost, total_additional_cost, net_additional_profit, incremental_margin_pct,
        recommendation, recommendation_reason, is_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id, o.shipmentTitle, o.origin, o.destination, o.weightTons, o.volumeM3, o.packageCount, o.goodsType,
        o.offeredRevenue, o.deadlineHours, o.targetVehicleId, o.targetVehicleReg, o.vehicleCurrentLoadTons,
        o.vehicleMaxLoadTons, o.vehicleCurrentVolumeM3, o.vehicleMaxVolumeM3, o.routeCompatibilityScore,
        o.additionalDistanceKm, o.additionalFuelCost, o.additionalDriverCost, o.additionalMaintenanceCost,
        o.additionalTollCost, o.totalAdditionalCost, o.netAdditionalProfit, o.incrementalMarginPct,
        o.recommendation, o.recommendationReason, o.isAccepted ? 1 : 0
      ]
    );
  }

  console.log('Seeding maintenance...');
  for (const m of INITIAL_MAINTENANCE) {
    await connection.query(
      `INSERT INTO maintenance (
        id, vehicle_id, vehicle_reg, service_type, scheduled_date, completed_date, odometer_km,
        cost, status, workshop, mechanic_notes, next_service_km
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id, m.vehicleId, m.vehicleReg, m.serviceType, m.scheduledDate, m.completedDate || null, m.odometerKm,
        m.cost, m.status, m.workshop, m.mechanicNotes, m.nextServiceKm
      ]
    );
  }

  console.log('Seeding expenses...');
  for (const e of INITIAL_EXPENSES) {
    await connection.query(
      `INSERT INTO expenses (
        id, date, vehicle_reg, category, description, amount, liters_or_km,
        invoice_number, payment_method, approved_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id, e.date, e.vehicleReg, e.category, e.description, e.amount, e.litersOrKm || null,
        e.invoiceNumber, e.paymentMethod, e.approvedBy
      ]
    );
  }

  console.log('Seeding alerts...');
  for (const a of INITIAL_ALERTS) {
    await connection.query(
      `INSERT INTO alerts (
        id, type, severity, title, message, timestamp, is_read, action_url, vehicle_reg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.id, a.type, a.severity, a.title, a.message, a.timestamp, a.read ? 1 : 0, a.actionUrl || null, a.vehicleReg || null
      ]
    );
  }

  await connection.end();
  console.log('✅ Database seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
