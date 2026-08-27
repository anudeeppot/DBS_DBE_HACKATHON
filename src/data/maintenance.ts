import { MaintenanceRecord } from '../types';

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint-01',
    vehicleId: 'veh-08',
    vehicleReg: 'TN02MN7788',
    serviceType: 'Brake System',
    scheduledDate: '2026-08-24',
    odometerKm: 189300,
    cost: 14500,
    status: 'In Maintenance',
    workshop: 'Ashok Leyland Authorized Hub, Chennai Guindy',
    mechanicNotes: 'Replacing front and rear brake pads, disc re-facing, and hydraulic fluid bleed.',
    nextServiceKm: 204300
  },
  {
    id: 'maint-02',
    vehicleId: 'veh-02',
    vehicleReg: 'AP28CD4567',
    serviceType: 'Oil & Filter',
    scheduledDate: '2026-08-26',
    odometerKm: 98400,
    cost: 8200,
    status: 'Service Due',
    workshop: 'Castrol Truck Care Center, Bengaluru Peenya',
    mechanicNotes: 'Scheduled 100,000 km general engine lube service, fuel filter and air filter renewal.',
    nextServiceKm: 115000
  },
  {
    id: 'maint-03',
    vehicleId: 'veh-04',
    vehicleReg: 'TS10EF7890',
    serviceType: 'Tyre Replacement',
    scheduledDate: '2026-08-28',
    odometerKm: 215400,
    cost: 48000,
    status: 'Service Due',
    workshop: 'Apollo Commercial Tyres, Delhi Transport Nagar',
    mechanicNotes: 'Rear tandem axle 4 tyre tread wear below 3mm. Replacing with Apollo EnduTrax.',
    nextServiceKm: 260000
  },
  {
    id: 'maint-04',
    vehicleId: 'veh-01',
    vehicleReg: 'TS09AB1234',
    serviceType: 'Preventive',
    scheduledDate: '2026-08-10',
    completedDate: '2026-08-11',
    odometerKm: 135000,
    cost: 12400,
    status: 'Good',
    workshop: 'Tata Motors Authorized Hub, Hyderabad Shamshabad',
    mechanicNotes: 'Comprehensive 50-point diagnostic check passed. Differential oil topped up.',
    nextServiceKm: 150000
  },
  {
    id: 'maint-05',
    vehicleId: 'veh-03',
    vehicleReg: 'KA01GH2345',
    serviceType: 'Preventive',
    scheduledDate: '2026-08-14',
    completedDate: '2026-08-15',
    odometerKm: 76400,
    cost: 9500,
    status: 'Good',
    workshop: 'BharatBenz Service Park, Bengaluru Electronic City',
    mechanicNotes: 'Coolant flush and suspension greasing. Alignment calibrated.',
    nextServiceKm: 86000
  },
  {
    id: 'maint-06',
    vehicleId: 'veh-06',
    vehicleReg: 'DL01PQ9012',
    serviceType: 'Electrical',
    scheduledDate: '2026-08-18',
    completedDate: '2026-08-18',
    odometerKm: 61000,
    cost: 6500,
    status: 'Good',
    workshop: 'Carrier Transicold Reefer Service, Delhi Okhla',
    mechanicNotes: 'Thermo King reefer unit compressor test. Temperature logging sensor recalibrated.',
    nextServiceKm: 74000
  }
];
