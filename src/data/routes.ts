import { RouteOption, TransportMode, GoodsType } from '../types';

export const MAJOR_HUBS = [
  'Hyderabad', 'Nagpur', 'Bhopal', 'Delhi', 'Mumbai', 
  'Pune', 'Bengaluru', 'Chennai', 'Kolkata', 'Ahmedabad', 
  'Jaipur', 'Varanasi', 'Surat', 'Belagavi'
];

export function generateRouteOptions(
  origin: string,
  destination: string,
  weightTons: number,
  volumeM3: number,
  goodsType: GoodsType,
  preferredMode?: TransportMode
): RouteOption[] {
  const isHydDel = (origin === 'Hyderabad' && destination === 'Delhi') || (origin === 'Delhi' && destination === 'Hyderabad');
  const baseDistance = isHydDel ? 1560 : 1100;
  
  const opt1: RouteOption = {
    id: 'rt-best-overall',
    title: 'Best Overall Multimodal (Rail + Road)',
    badge: 'RECOMMENDED',
    mode: 'Multimodal',
    corridor: `${origin} → Nagpur (Truck) ↚ Delhi (Train)`,
    totalDistanceKm: baseDistance,
    totalDurationHours: 32,
    estimatedCost: Math.round(weightTons * 2800 + baseDistance * 14),
    suggestedCustomerPrice: Math.round(weightTons * 3900 + baseDistance * 22),
    expectedProfit: Math.round((weightTons * 3900 + baseDistance * 22) - (weightTons * 2800 + baseDistance * 14)),
    profitMargin: 29.5,
    co2Kg: Math.round(baseDistance * 0.42 * weightTons),
    numberOfTransfers: 1,
    availableWeightCapacityTons: 12.0,
    availableVolumeCapacityM3: 45.0,
    matchScore: 97,
    legs: [
      {
        from: origin,
        to: 'Nagpur Hub',
        mode: 'Truck',
        distanceKm: 502,
        durationHours: 10,
        service: {
          mode: 'Truck',
          serviceName: 'TS09AB1234 — 32 FT Multi-Axle Truck',
          serviceNumber: 'TS09AB1234',
          departureCity: origin,
          arrivalCity: 'Nagpur Hub',
          departureTime: '19:30',
          arrivalTime: '05:30 (+1d)',
          durationHours: 10,
          cargoCapacityTons: 15.0,
          usedCapacityTons: 12.3,
          availableCapacityTons: 2.7,
          co2EmissionsKg: 340,
          cost: 16800
        }
      },
      {
        from: 'Nagpur Goods Yard',
        to: destination,
        mode: 'Train',
        distanceKm: 1058,
        durationHours: 18,
        service: {
          mode: 'Train',
          serviceName: 'Telangana Express (Freight Parcel Van)',
          serviceNumber: 'Train No: 12723',
          departureCity: 'Nagpur Yard',
          arrivalCity: 'Hazrat Nizamuddin Cargo Shed',
          departureTime: '18:30',
          arrivalTime: '06:30 (+1d)',
          durationHours: 18,
          cargoCapacityTons: 20.0,
          usedCapacityTons: 8.0,
          availableCapacityTons: 12.0,
          co2EmissionsKg: 185,
          cost: 21500
        }
      }
    ],
    costBreakdown: {
      fuel: 14500,
      driver: 3800,
      maintenance: 3200,
      toll: 2400,
      transshipmentHandling: 3500,
      insurance: 1800,
      other: 1200
    }
  };

  const opt2: RouteOption = {
    id: 'rt-direct-truck',
    title: 'Direct Dedicated Truck (Lowest Transfers)',
    badge: 'ZERO TRANSSHIPMENT',
    mode: 'Truck',
    corridor: `${origin} → NH44 Corridor → ${destination}`,
    totalDistanceKm: baseDistance,
    totalDurationHours: 38,
    estimatedCost: Math.round(weightTons * 3100 + baseDistance * 16),
    suggestedCustomerPrice: Math.round(weightTons * 4200 + baseDistance * 24),
    expectedProfit: Math.round((weightTons * 4200 + baseDistance * 24) - (weightTons * 3100 + baseDistance * 16)),
    profitMargin: 23.8,
    co2Kg: Math.round(baseDistance * 0.78 * weightTons),
    numberOfTransfers: 0,
    availableWeightCapacityTons: 15.0 - weightTons,
    availableVolumeCapacityM3: 60.0 - volumeM3,
    matchScore: 91,
    legs: [
      {
        from: origin,
        to: destination,
        mode: 'Truck',
        distanceKm: baseDistance,
        durationHours: 38,
        service: {
          mode: 'Truck',
          serviceName: 'AP28CD4567 — 32 FT Container Truck',
          serviceNumber: 'AP28CD4567',
          departureCity: origin,
          arrivalCity: destination,
          departureTime: '20:00',
          arrivalTime: '10:00 (+2d)',
          durationHours: 38,
          cargoCapacityTons: 15.0,
          usedCapacityTons: 8.0,
          availableCapacityTons: 7.0,
          co2EmissionsKg: 890,
          cost: 41200
        }
      }
    ],
    costBreakdown: {
      fuel: 24500,
      driver: 5800,
      maintenance: 6240,
      toll: 5800,
      transshipmentHandling: 800,
      insurance: 1900,
      other: 1400
    }
  };

  const opt3: RouteOption = {
    id: 'rt-express-air',
    title: 'Fastest Air Cargo Express',
    badge: 'SAME DAY EXPRESS',
    mode: 'Flight',
    corridor: `${origin} Airport (HYD) → ${destination} Cargo (DEL)`,
    totalDistanceKm: 1250,
    totalDurationHours: 6.5,
    estimatedCost: Math.round(weightTons * 7500 + 12000),
    suggestedCustomerPrice: Math.round(weightTons * 11500 + 18000),
    expectedProfit: Math.round((weightTons * 11500 + 18000) - (weightTons * 7500 + 12000)),
    profitMargin: 33.2,
    co2Kg: Math.round(baseDistance * 1.85 * weightTons),
    numberOfTransfers: 2,
    availableWeightCapacityTons: 1.8,
    availableVolumeCapacityM3: 8.5,
    matchScore: 84,
    legs: [
      {
        from: origin,
        to: `${origin} RGIA Airport Cargo Terminal`,
        mode: 'Truck',
        distanceKm: 35,
        durationHours: 1.5,
        service: {
          mode: 'Truck',
          serviceName: '14 FT Airport Feeder Truck',
          serviceNumber: 'TS37XY8812',
          departureCity: origin,
          arrivalCity: 'RGIA Cargo Gate 4',
          departureTime: '10:00',
          arrivalTime: '11:30',
          durationHours: 1.5,
          cargoCapacityTons: 4.5,
          usedCapacityTons: 2.0,
          availableCapacityTons: 2.5,
          co2EmissionsKg: 28,
          cost: 3200
        }
      },
      {
        from: 'HYD Airport',
        to: 'DEL Cargo Terminal',
        mode: 'Flight',
        distanceKm: 1180,
        durationHours: 2.25,
        service: {
          mode: 'Flight',
          serviceName: 'IndiGo Cargo Airbus A321-P2F',
          serviceNumber: 'Flight 6E-9042',
          departureCity: 'Hyderabad RGIA',
          arrivalCity: 'Delhi IGI Terminal 2 Cargo',
          departureTime: '14:15',
          arrivalTime: '16:30',
          durationHours: 2.25,
          cargoCapacityTons: 24.0,
          usedCapacityTons: 18.2,
          availableCapacityTons: 5.8,
          co2EmissionsKg: 1420,
          cost: 34500
        }
      },
      {
        from: 'DEL Airport',
        to: destination,
        mode: 'Truck',
        distanceKm: 35,
        durationHours: 1.5,
        service: {
          mode: 'Truck',
          serviceName: 'Delhi Hub Delivery Van',
          serviceNumber: 'DL01EF11190',
          departureCity: 'IGI Cargo Gate',
          arrivalCity: destination,
          departureTime: '18:00',
          arrivalTime: '19:30',
          durationHours: 1.5,
          cargoCapacityTons: 3.5,
          usedCapacityTons: 1.2,
          availableCapacityTons: 2.3,
          co2EmissionsKg: 25,
          cost: 2800
        }
      }
    ],
    costBreakdown: {
      fuel: 18500,
      driver: 2100,
      maintenance: 1800,
      toll: 800,
      transshipmentHandling: 7200,
      insurance: 4500,
      other: 2600
    }
  };

  const opt4: RouteOption = {
    id: 'rt-pure-rail',
    title: 'Cheapest Rail Freight Corridor',
    badge: 'MAX ECO & LOWEST COST',
    mode: 'Train',
    corridor: `${origin} Sanathnagar Yard ⁢ Tughlakabad Concor Depot`,
    totalDistanceKm: 1490,
    totalDurationHours: 44,
    estimatedCost: Math.round(weightTons * 2100 + baseDistance * 10),
    suggestedCustomerPrice: Math.round(weightTons * 3100 + baseDistance * 17),
    expectedProfit: Math.round((weightTons * 3100 + baseDistance * 17) - (weightTons * 2100 + baseDistance * 10)),
    profitMargin: 36.5,
    co2Kg: Math.round(baseDistance * 0.22 * weightTons),
    numberOfTransfers: 2,
    availableWeightCapacityTons: 28.0,
    availableVolumeCapacityM3: 95.0,
    matchScore: 89,
    legs: [
      {
        from: `${origin} Sanathnagar Goods Yard`,
        to: 'Tughlakabad Container Depot (Delhi)',
        mode: 'Train',
        distanceKm: 1490,
        durationHours: 44,
        service: {
          mode: 'Train',
          serviceName: 'CONCOR Dedicated Freight Express',
          serviceNumber: 'Rake No: CR-9812-DFCC',
          departureCity: 'Hyderabad Yard',
          arrivalCity: 'Delhi TKD Depot',
          departureTime: '21:00',
          arrivalTime: '17:00 (+2d)',
          durationHours: 44,
          cargoCapacityTons: 1200,
          usedCapacityTons: 890,
          availableCapacityTons: 310,
          co2EmissionsKg: 420,
          cost: 29800
        }
      }
    ],
    costBreakdown: {
      fuel: 11200,
      driver: 1800,
      maintenance: 2100,
      toll: 0,
      transshipmentHandling: 4800,
      insurance: 2200,
      other: 1400
    }
  };

  return [opt1, opt2, opt4, opt3];
}
