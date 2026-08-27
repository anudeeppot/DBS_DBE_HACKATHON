import { SystemAlert } from '../types';

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-01',
    type: 'opportunity',
    severity: 'opportunity',
    title: 'High-Margin Intermediate Ingest Detected',
    message: '2.4T Electronics load available in Nagpur for Bhopal delivery. Matches Truck TS09AB1234. Estimated net profit: +₹20,000.',
    timestamp: '5 mins ago',
    read: false,
    vehicleReg: 'TS09AB1234',
    actionUrl: '/capacity-optimizer'
  },
  {
    id: 'alt-02',
    type: 'delay',
    severity: 'warning',
    title: 'NH44 Nagpur Bypass Toll Congestion',
    message: 'Truck TS09AB1234 reported 25 min wait time at Hinganghat Toll Plaza. ETA adjusted by +30m.',
    timestamp: '22 mins ago',
    read: false,
    vehicleReg: 'TS09AB1234',
    actionUrl: '/fleet/veh-01'
  },
  {
    id: 'alt-03',
    type: 'maintenance',
    severity: 'info',
    title: 'Preventive Overhaul Due Soon',
    message: 'Vehicle DL01EF1190 is due for 135,000 km lube and brake diagnostic in 420 km.',
    timestamp: '1 hour ago',
    read: false,
    vehicleReg: 'DL01EF1190',
    actionUrl: '/maintenance'
  },
  {
    id: 'alt-04',
    type: 'financial',
    severity: 'info',
    title: 'EBITDA Target Exceeded',
    message: 'South corridor gross margins hit 34.2% today (+6.8% above operating baseline).',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/profitability'
  }
];
