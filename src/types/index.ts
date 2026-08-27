export type VehicleStatus = 'In Transit' | 'Loading' | 'Idle' | 'Delayed' | 'Maintenance' | 'At Stop' | 'Offline';
export type VehicleType = '32 FT Multi-Axle' | '24 FT Container' | '40 FT Heavy Haul' | '14 FT City Feeder' | 'Refrigerated 32 FT';

export interface RouteProgressStop {
  city: string;
  state: string;
  status: 'completed' | 'current' | 'next' | 'destination' | 'scheduled';
  eta?: string;
  actualArrival?: string;
  distanceFromStartKm: number;
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  type: VehicleType;
  makeModel: string;
  status: VehicleStatus;
  driverId: string;
  driverName: string;
  driverPhone: string;
  currentLocation: {
    city: string;
    state: string;
    lat: number;
    lng: number;
    heading: number;
    speedKmph: number;
  };
  origin: string;
  destination: string;
  routeStops: RouteProgressStop[];
  currentStopIndex: number;
  totalDistanceKm: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  eta: string;
  maxWeightTons: number;
  currentWeightTons: number;
  maxVolumeM3: number;
  currentVolumeM3: number;
  mileageKmPerL: number;
  fuelPricePerL: number;
  maintenanceRatePerKm: number;
  driverCostPerKm: number;
  odometerKm: number;
  serviceDueInKm: number;
  healthScore: number;
  activeShipmentIds: string[];
  totalTripRevenue: number;
  totalTripCost: number;
  lastUpdated: string;
}

export interface Driver {
  id: string;
  name: string;
  code: string;
  assignedVehicleReg: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  baseSalaryMonthly: number;
  allowancePerDay: number;
  overtimeHours: number;
  workingHoursThisMonth: number;
  currentRoute: string;
  rating: number;
  tripsCompleted: number;
  onTimeDeliveryRate: number;
  fuelEfficiencyScore: number;
  safetyScore: number;
  revenueGeneratedTotal: number;
  status: 'On Duty' | 'Resting' | 'On Leave' | 'Standby';
  photoUrl: string;
}

export type TransportMode = 'Truck' | 'Train' | 'Flight' | 'Multimodal';
export type GoodsType = 'General Cargo' | 'Electronics' | 'Pharmaceuticals' | 'Automotive Parts' | 'Textiles' | 'FMCG' | 'Industrial Machinery';
export type ShipmentPriority = 'Standard' | 'Express' | 'Critical';
export type ShipmentStatus = 'Pending Pickup' | 'In Transit' | 'At Intermediate Hub' | 'Out for Delivery' | 'Delivered' | 'Delayed';

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerCompany: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDeadline: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  weightTons: number;
  volumeM3: number;
  packageCount: number;
  goodsType: GoodsType;
  priority: ShipmentPriority;
  transportMode: TransportMode;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  status: ShipmentStatus;
  isIntermediateLoad?: boolean;
  intermediatePickupStop?: string;
  intermediateDropStop?: string;
  revenue: number;
  allocatedFuelCost: number;
  allocatedDriverCost: number;
  allocatedMaintenanceCost: number;
  allocatedTollCost: number;
  allocatedHandlingCost: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  currentProgressPct: number;
}

export interface ServiceDetail {
  mode: 'Truck' | 'Train' | 'Flight';
  serviceName: string;
  serviceNumber?: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: number;
  cargoCapacityTons: number;
  usedCapacityTons: number;
  availableCapacityTons: number;
  co2EmissionsKg: number;
  cost: number;
}

export interface RouteOption {
  id: string;
  title: string;
  badge: string;
  mode: TransportMode;
  corridor: string;
  totalDistanceKm: number;
  totalDurationHours: number;
  estimatedCost: number;
  suggestedCustomerPrice: number;
  expectedProfit: number;
  profitMargin: number;
  co2Kg: number;
  numberOfTransfers: number;
  availableWeightCapacityTons: number;
  availableVolumeCapacityM3: number;
  legs: {
    from: string;
    to: string;
    mode: 'Truck' | 'Train' | 'Flight';
    service: ServiceDetail;
    distanceKm: number;
    durationHours: number;
  }[];
  costBreakdown: {
    fuel: number;
    driver: number;
    maintenance: number;
    toll: number;
    transshipmentHandling: number;
    insurance: number;
    other: number;
  };
  matchScore: number;
}

export interface IntermediateOpportunity {
  id: string;
  shipmentTitle: string;
  origin: string;
  destination: string;
  weightTons: number;
  volumeM3: number;
  packageCount: number;
  goodsType: GoodsType;
  offeredRevenue: number;
  deadlineHours: number;
  targetVehicleId: string;
  targetVehicleReg: string;
  vehicleCurrentLoadTons: number;
  vehicleMaxLoadTons: number;
  vehicleCurrentVolumeM3: number;
  vehicleMaxVolumeM3: number;
  routeCompatibilityScore: number;
  additionalDistanceKm: number;
  additionalFuelCost: number;
  additionalDriverCost: number;
  additionalMaintenanceCost: number;
  additionalTollCost: number;
  totalAdditionalCost: number;
  netAdditionalProfit: number;
  incrementalMarginPct: number;
  recommendation: 'ACCEPT' | 'REVIEW' | 'REJECT';
  recommendationReason: string;
  isAccepted: boolean;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  serviceType: 'Preventive' | 'Tyre Replacement' | 'Engine Overhaul' | 'Oil & Filter' | 'Brake System' | 'Electrical';
  scheduledDate: string;
  completedDate?: string;
  odometerKm: number;
  cost: number;
  status: 'Good' | 'Service Due' | 'In Maintenance' | 'Critical';
  workshop: string;
  mechanicNotes: string;
  nextServiceKm: number;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  vehicleReg: string;
  category: 'Fuel' | 'Driver' | 'Maintenance' | 'Toll' | 'Permits & Taxes' | 'Depreciation' | 'Insurance' | 'Handling';
  description: string;
  amount: number;
  litersOrKm?: number;
  invoiceNumber: string;
  paymentMethod: 'Corporate Fastag' | 'Fuel Card' | 'Direct Transfer' | 'Petty Cash';
  approvedBy: string;
}

export interface SystemAlert {
  id: string;
  type: 'delay' | 'maintenance' | 'capacity' | 'shipment' | 'opportunity' | 'financial';
  severity: 'critical' | 'warning' | 'info' | 'opportunity';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  vehicleReg?: string;
}

export interface ScenarioParameters {
  dieselPricePerL: number;
  freightRatePerKm: number;
  driverCostMultiplier: number;
  maintenanceRateMultiplier: number;
  fleetUtilizationPct: number;
  fleetSize: number;
  monthlyShipmentVolumeTons: number;
  avgTripDistanceKm: number;
}
