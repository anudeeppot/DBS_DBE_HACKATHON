import { ExpenseRecord } from '../types';

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-101',
    date: '2026-08-24 07:30',
    vehicleReg: 'TS09AB1234',
    category: 'Fuel',
    description: 'Diesel top-up at Indian Oil COCO, Adilabad Highway',
    amount: 19000,
    litersOrKm: 200,
    invoiceNumber: 'IOCL-ADI-88319',
    paymentMethod: 'Fuel Card',
    approvedBy: 'Fleet Op Center'
  },
  {
    id: 'exp-102',
    date: '2026-08-24 06:15',
    vehicleReg: 'TS09AB1234',
    category: 'Toll',
    description: 'NHAI FASTag toll plazas (Hyderabad - Nagpur stretch)',
    amount: 2450,
    invoiceNumber: 'FASTAG-771092',
    paymentMethod: 'Corporate Fastag',
    approvedBy: 'Auto Fastag Gateway'
  },
  {
    id: 'exp-103',
    date: '2026-08-24 08:00',
    vehicleReg: 'AP28CD4567',
    category: 'Fuel',
    description: 'Diesel top-up at BPCL Ghar, Pune Bypass',
    amount: 14250,
    litersOrKm: 150,
    invoiceNumber: 'BPCL-PUN-33104',
    paymentMethod: 'Fuel Card',
    approvedBy: 'Fleet Op Center'
  },
  {
    id: 'exp-104',
    date: '2026-08-24 05:00',
    vehicleReg: 'AP28CD4567',
    category: 'Toll',
    description: 'Mumbai-Pune Expressway Toll + FASTag',
    amount: 1850,
    invoiceNumber: 'FASTAG-994120',
    paymentMethod: 'Corporate Fastag',
    approvedBy: 'Auto Fastag Gateway'
  },
  {
    id: 'exp-105',
    date: '2026-08-24 09:00',
    vehicleReg: 'TN02MN7788',
    category: 'Maintenance',
    description: 'Commercial brake system overhaul & disc replacement',
    amount: 14500,
    invoiceNumber: 'AL-SERV-55410',
    paymentMethod: 'Direct Transfer',
    approvedBy: 'Chief Fleet Engineer'
  },
  {
    id: 'exp-106',
    date: '2026-08-23 20:00',
    vehicleReg: 'TS10EF7890',
    category: 'Driver',
    description: 'Driver long-haul rest stop allowance & food stipend',
    amount: 900,
    invoiceNumber: 'DRV-ALLOW-1104',
    paymentMethod: 'Petty Cash',
    approvedBy: 'Trip Manager'
  },
  {
    id: 'exp-107',
    date: '2026-08-23 16:00',
    vehicleReg: 'DL01PQ9012',
    category: 'Handling',
    description: 'Cold-chain pallet strapping & temperature logging seal',
    amount: 1200,
    invoiceNumber: 'DLI-HAND-902',
    paymentMethod: 'Direct Transfer',
    approvedBy: 'Warehouse Hub Lead'
  },
  {
    id: 'exp-108',
    date: '2026-08-22 11:00',
    vehicleReg: 'KA01GH2345',
    category: 'Permits & Taxes',
    description: 'Tamil Nadu Interstate Commercial Road Permit Q3',
    amount: 3200,
    invoiceNumber: 'TN-RTO-PERM-882',
    paymentMethod: 'Direct Transfer',
    approvedBy: 'Compliance Lead'
  }
];
