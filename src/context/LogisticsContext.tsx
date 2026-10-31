import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle, Driver, Shipment, IntermediateOpportunity,
  MaintenanceRecord, ExpenseRecord, SystemAlert, ScenarioParameters
} from '../types';
import { api } from '../services/api';

interface LogisticsContextType {
  vehicles: Vehicle[];
  drivers: Driver[];
  shipments: Shipment[];
  opportunities: IntermediateOpportunity[];
  maintenance: MaintenanceRecord[];
  expenses: ExpenseRecord[];
  alerts: SystemAlert[];
  unreadAlertsCount: number;
  scenarioParams: ScenarioParameters;
  isLoading: boolean;
  loadError: string | null;

  // Computed Financials & KPIs
  kpis: {
    totalVehicles: number;
    activeVehicles: number;
    availableVehicles: number;
    maintenanceVehicles: number;
    delayedVehicles: number;
    activeShipments: number;
    deliveredShipments: number;
    fleetUtilizationPct: number;
    totalRevenue: number;
    totalOperatingCost: number;
    totalProfit: number;
    profitMarginPct: number;
    availableWeightCapacityTons: number;
    availableVolumeCapacityM3: number;
    avgFuelCostPerKm: number;
    totalDistanceTraveledKm: number;
  };

  // Actions
  acceptIntermediateShipment: (oppId: string) => boolean;
  createShipment: (newShipment: Partial<Shipment>) => void;
  updateVehicleStatus: (vehicleId: string, status: Vehicle['status']) => void;
  setScenarioParams: React.Dispatch<React.SetStateAction<ScenarioParameters>>;
  updateScenarioParam: <K extends keyof ScenarioParameters>(key: K, value: ScenarioParameters[K]) => void;
  resetScenarioParams: () => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getDriverById: (id: string) => Driver | undefined;
}

const DEFAULT_SCENARIO: ScenarioParameters = {
  dieselPricePerL: 95,
  freightRatePerKm: 42,
  driverCostMultiplier: 1.0,
  maintenanceRateMultiplier: 1.0,
  fleetUtilizationPct: 78.4,
  fleetSize: 48,
  monthlyShipmentVolumeTons: 3200,
  avgTripDistanceKm: 1250
};

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles]           = useState<Vehicle[]>([]);
  const [drivers, setDrivers]             = useState<Driver[]>([]);
  const [shipments, setShipments]         = useState<Shipment[]>([]);
  const [opportunities, setOpportunities] = useState<IntermediateOpportunity[]>([]);
  const [maintenance, setMaintenance]     = useState<MaintenanceRecord[]>([]);
  const [expenses, setExpenses]           = useState<ExpenseRecord[]>([]);
  const [alerts, setAlerts]               = useState<SystemAlert[]>([]);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParameters>(DEFAULT_SCENARIO);
  const [isLoading, setIsLoading]         = useState(true);
  const [loadError, setLoadError]         = useState<string | null>(null);

  // ── Initial data fetch from MySQL via Express API ──────────────
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [v, d, s, o, m, e, a] = await Promise.all([
          api.vehicles.getAll(),
          api.drivers.getAll(),
          api.shipments.getAll(),
          api.opportunities.getAll(),
          api.maintenance.getAll(),
          api.expenses.getAll(),
          api.alerts.getAll(),
        ]);
        if (cancelled) return;
        setVehicles(v);
        setDrivers(d);
        setShipments(s);
        setOpportunities(o);
        setMaintenance(m);
        setExpenses(e);
        setAlerts(a);
      } catch (err: any) {
        if (!cancelled) {
          console.error('Failed to load data from API:', err);
          setLoadError(err.message ?? 'Could not connect to backend. Is the server running?');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  // ── Simulated vehicle movement ticker ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(veh => {
          if (veh.status !== 'In Transit') return veh;
          const latDelta = (Math.random() - 0.48) * 0.002;
          const lngDelta = (Math.random() - 0.48) * 0.002;
          const speedVariation = Math.floor(Math.random() * 7) - 3;
          const newSpeed = Math.max(45, Math.min(75, veh.currentLocation.speedKmph + speedVariation));
          return {
            ...veh,
            currentLocation: {
              ...veh.currentLocation,
              lat: veh.currentLocation.lat + latDelta,
              lng: veh.currentLocation.lng + lngDelta,
              speedKmph: newSpeed
            },
            distanceCoveredKm: Math.min(veh.totalDistanceKm, veh.distanceCoveredKm + 0.2),
            distanceRemainingKm: Math.max(0, veh.distanceRemainingKm - 0.2),
            lastUpdated: 'Just now (Live)'
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // ── KPI calculations ───────────────────────────────────────────
  const fuelMultiplier = scenarioParams.dieselPricePerL / 95.0;
  const rateMultiplier = scenarioParams.freightRatePerKm / 42.0;

  const baseRevenue = shipments.reduce((sum, s) => sum + s.revenue, 0) + (scenarioParams.fleetSize - 8) * 32000;
  const totalRevenue = Math.round(baseRevenue * rateMultiplier * (scenarioParams.fleetUtilizationPct / 78.4));

  const baseFuelCost     = shipments.reduce((sum, s) => sum + s.allocatedFuelCost, 0) + (scenarioParams.fleetSize - 8) * 11500;
  const adjustedFuelCost = baseFuelCost * fuelMultiplier;

  const baseDriverCost     = shipments.reduce((sum, s) => sum + s.allocatedDriverCost, 0) + (scenarioParams.fleetSize - 8) * 3800;
  const adjustedDriverCost = baseDriverCost * scenarioParams.driverCostMultiplier;

  const baseMaintCost     = shipments.reduce((sum, s) => sum + s.allocatedMaintenanceCost, 0) + (scenarioParams.fleetSize - 8) * 3200;
  const adjustedMaintCost = baseMaintCost * scenarioParams.maintenanceRateMultiplier;

  const otherCosts         = shipments.reduce((sum, s) => sum + s.allocatedTollCost + s.allocatedHandlingCost, 0) + (scenarioParams.fleetSize - 8) * 4100;
  const totalOperatingCost = Math.round(adjustedFuelCost + adjustedDriverCost + adjustedMaintCost + otherCosts);
  const totalProfit        = totalRevenue - totalOperatingCost;
  const profitMarginPct    = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

  const activeVehCount      = vehicles.filter(v => v.status === 'In Transit' || v.status === 'Loading').length + Math.round((scenarioParams.fleetSize - 8) * 0.75);
  const availableVehCount   = vehicles.filter(v => v.status === 'Idle').length + Math.round((scenarioParams.fleetSize - 8) * 0.15);
  const maintenanceVehCount = vehicles.filter(v => v.status === 'Maintenance').length + Math.round((scenarioParams.fleetSize - 8) * 0.10);
  const delayedVehCount     = vehicles.filter(v => v.status === 'Delayed').length;

  const totalAvailableWeightTons = vehicles.reduce((sum, v) => sum + Math.max(0, v.maxWeightTons - v.currentWeightTons), 0);
  const totalAvailableVolM3      = vehicles.reduce((sum, v) => sum + Math.max(0, v.maxVolumeM3 - v.currentVolumeM3), 0);

  const kpis = {
    totalVehicles: scenarioParams.fleetSize,
    activeVehicles: activeVehCount,
    availableVehicles: availableVehCount,
    maintenanceVehicles: maintenanceVehCount,
    delayedVehicles: delayedVehCount,
    activeShipments: shipments.filter(s => s.status === 'In Transit' || s.status === 'Delayed').length,
    deliveredShipments: shipments.filter(s => s.status === 'Delivered').length,
    fleetUtilizationPct: scenarioParams.fleetUtilizationPct,
    totalRevenue,
    totalOperatingCost,
    totalProfit,
    profitMarginPct,
    availableWeightCapacityTons: Number(totalAvailableWeightTons.toFixed(1)),
    availableVolumeCapacityM3: Number(totalAvailableVolM3.toFixed(1)),
    avgFuelCostPerKm: Number((scenarioParams.dieselPricePerL / 4.2).toFixed(2)),
    totalDistanceTraveledKm: 84250
  };

  // ── Actions ────────────────────────────────────────────────────
  const acceptIntermediateShipment = (oppId: string): boolean => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp || opp.isAccepted) return false;

    // Optimistic UI update
    setVehicles(prev =>
      prev.map(v => {
        if (v.id !== opp.targetVehicleId) return v;
        const newWeight = Math.min(v.maxWeightTons, Number((v.currentWeightTons + opp.weightTons).toFixed(1)));
        const newVolume = Math.min(v.maxVolumeM3, Number((v.currentVolumeM3 + opp.volumeM3).toFixed(1)));
        return {
          ...v,
          currentWeightTons: newWeight,
          currentVolumeM3: newVolume,
          totalTripRevenue: v.totalTripRevenue + opp.offeredRevenue,
          totalTripCost: v.totalTripCost + opp.totalAdditionalCost,
          activeShipmentIds: [...v.activeShipmentIds, `shp-int-${Date.now()}`]
        };
      })
    );

    const newShp: Shipment = {
      id: `shp-int-${Date.now()}`,
      trackingNumber: `CR-${opp.origin.substring(0, 3).toUpperCase()}-${opp.destination.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: `${opp.shipmentTitle} Client`,
      customerCompany: 'Consolidated Freight Network',
      origin: opp.origin,
      destination: opp.destination,
      pickupDate: 'Today (Immediate)',
      deliveryDeadline: `In ${opp.deadlineHours} hours`,
      estimatedDelivery: `In ${opp.deadlineHours - 1} hours`,
      weightTons: opp.weightTons,
      volumeM3: opp.volumeM3,
      packageCount: opp.packageCount,
      goodsType: opp.goodsType,
      priority: 'Express',
      transportMode: 'Truck',
      assignedVehicleId: opp.targetVehicleId,
      assignedVehicleReg: opp.targetVehicleReg,
      status: 'In Transit',
      isIntermediateLoad: true,
      intermediatePickupStop: opp.origin,
      intermediateDropStop: opp.destination,
      revenue: opp.offeredRevenue,
      allocatedFuelCost: opp.additionalFuelCost,
      allocatedDriverCost: opp.additionalDriverCost,
      allocatedMaintenanceCost: opp.additionalMaintenanceCost,
      allocatedTollCost: opp.additionalTollCost,
      allocatedHandlingCost: 0,
      totalCost: opp.totalAdditionalCost,
      profit: opp.netAdditionalProfit,
      profitMargin: opp.incrementalMarginPct,
      currentProgressPct: 15
    };
    setShipments(prev => [newShp, ...prev]);
    setOpportunities(prev => prev.map(o => (o.id === oppId ? { ...o, isAccepted: true } : o)));

    const newAlert: SystemAlert = {
      id: `alt-opp-${Date.now()}`,
      type: 'opportunity',
      severity: 'opportunity',
      title: 'Intermediate Cargo Ingested Successfully',
      message: `${opp.weightTons}T (${opp.origin} → ${opp.destination}) assigned to ${opp.targetVehicleReg}. +₹${opp.netAdditionalProfit.toLocaleString('en-IN')} net profit generated!`,
      timestamp: 'Just now',
      read: false,
      vehicleReg: opp.targetVehicleReg,
      actionUrl: `/fleet/${opp.targetVehicleId}`
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Persist to DB (fire-and-forget; optimistic UI already updated)
    api.opportunities.accept(oppId).catch(console.error);
    api.shipments.create(newShp).catch(console.error);
    api.vehicles.updateLoad(opp.targetVehicleId, {
      currentWeightTons: Math.min(
        (vehicles.find(v => v.id === opp.targetVehicleId)?.maxWeightTons ?? 99),
        Number(((vehicles.find(v => v.id === opp.targetVehicleId)?.currentWeightTons ?? 0) + opp.weightTons).toFixed(1))
      ),
      currentVolumeM3: Math.min(
        (vehicles.find(v => v.id === opp.targetVehicleId)?.maxVolumeM3 ?? 999),
        Number(((vehicles.find(v => v.id === opp.targetVehicleId)?.currentVolumeM3 ?? 0) + opp.volumeM3).toFixed(1))
      ),
      totalTripRevenue: (vehicles.find(v => v.id === opp.targetVehicleId)?.totalTripRevenue ?? 0) + opp.offeredRevenue,
      totalTripCost: (vehicles.find(v => v.id === opp.targetVehicleId)?.totalTripCost ?? 0) + opp.totalAdditionalCost,
    }).catch(console.error);
    api.alerts.create({ ...newAlert }).catch(console.error);

    return true;
  };

  const createShipment = (newShipment: Partial<Shipment>) => {
    const revenue    = newShipment.revenue || 35000;
    const totalCost  = Math.round(revenue * 0.72);
    const profit     = revenue - totalCost;
    const profitMargin = Number(((profit / revenue) * 100).toFixed(1));

    const shp: Shipment = {
      id: `shp-${Date.now()}`,
      trackingNumber: `CR-${(newShipment.origin || 'HYD').substring(0, 3).toUpperCase()}-${(newShipment.destination || 'DEL').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newShipment.customerName || 'Enterprise Shipper',
      customerCompany: newShipment.customerCompany || 'Commercial Logistics',
      origin: newShipment.origin || 'Hyderabad',
      destination: newShipment.destination || 'Delhi',
      pickupDate: newShipment.pickupDate || new Date().toISOString().split('T')[0],
      deliveryDeadline: newShipment.deliveryDeadline || 'In 48 hours',
      estimatedDelivery: 'On Schedule',
      weightTons: newShipment.weightTons || 5.0,
      volumeM3: newShipment.volumeM3 || 20.0,
      packageCount: newShipment.packageCount || 50,
      goodsType: newShipment.goodsType || 'General Cargo',
      priority: newShipment.priority || 'Standard',
      transportMode: newShipment.transportMode || 'Multimodal',
      assignedVehicleId: newShipment.assignedVehicleId || 'veh-01',
      assignedVehicleReg: newShipment.assignedVehicleReg || 'TS09AB1234',
      status: 'Pending Pickup',
      revenue,
      allocatedFuelCost: Math.round(totalCost * 0.55),
      allocatedDriverCost: Math.round(totalCost * 0.15),
      allocatedMaintenanceCost: Math.round(totalCost * 0.12),
      allocatedTollCost: Math.round(totalCost * 0.10),
      allocatedHandlingCost: Math.round(totalCost * 0.08),
      totalCost,
      profit,
      profitMargin,
      currentProgressPct: 0
    };

    setShipments(prev => [shp, ...prev]);
    api.shipments.create(shp).catch(console.error);
  };

  const updateVehicleStatus = (vehicleId: string, status: Vehicle['status']) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status } : v));
    api.vehicles.updateStatus(vehicleId, status).catch(console.error);
  };

  const updateScenarioParam = <K extends keyof ScenarioParameters>(key: K, value: ScenarioParameters[K]) => {
    setScenarioParams(prev => ({ ...prev, [key]: value }));
  };

  const resetScenarioParams = () => setScenarioParams(DEFAULT_SCENARIO);

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
    api.alerts.markRead(alertId).catch(console.error);
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    api.alerts.markAllRead().catch(console.error);
  };

  const addExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const record: ExpenseRecord = { ...expense, id: `exp-${Date.now()}` };
    setExpenses(prev => [record, ...prev]);
    api.expenses.create(record).catch(console.error);
  };

  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = { ...record, id: `maint-${Date.now()}` };
    setMaintenance(prev => [newRecord, ...prev]);
    api.maintenance.create(newRecord).catch(console.error);
  };

  const getVehicleById = (id: string) => vehicles.find(v => v.id === id || v.regNumber === id);
  const getDriverById  = (id: string) => drivers.find(d => d.id === id || d.code === id);

  return (
    <LogisticsContext.Provider
      value={{
        vehicles,
        drivers,
        shipments,
        opportunities,
        maintenance,
        expenses,
        alerts,
        unreadAlertsCount,
        scenarioParams,
        isLoading,
        loadError,
        kpis,
        acceptIntermediateShipment,
        createShipment,
        updateVehicleStatus,
        setScenarioParams,
        updateScenarioParam,
        resetScenarioParams,
        markAlertRead,
        markAllAlertsRead,
        addExpense,
        addMaintenanceRecord,
        getVehicleById,
        getDriverById
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
