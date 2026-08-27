import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  Package,
  Boxes,
  Truck,
  MapPin,
  Users,
  Wrench,
  Receipt,
  TrendingUp,
  LineChart,
  FileText,
  Info,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  pulse?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen: boolean; toggleOpen: () => void }> = ({ isOpen, toggleOpen }) => {
  const { kpis } = useLogistics();

  const navGroups: NavGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { name: 'Route Optimizer', path: '/route-optimizer', icon: Route, badge: 'AI' },
        { name: 'Shipments', path: '/shipments', icon: Package },
        { name: 'Capacity Optimizer', path: '/capacity-optimizer', icon: Boxes, badge: 'Smart Ingest' }
      ]
    },
    {
      label: 'FLEET',
      items: [
        { name: 'Vehicles', path: '/fleet', icon: Truck },
        { name: 'Live Fleet Tracking', path: '/live-tracking', icon: MapPin, pulse: true },
        { name: 'Driver Management', path: '/drivers', icon: Users },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench }
      ]
    },
    {
      label: 'FINANCE',
      items: [
        { name: 'Expense Manager', path: '/expenses', icon: Receipt },
        { name: 'Profitability Engine', path: '/profitability', icon: TrendingUp },
        { name: 'Investor Dashboard', path: '/investor', icon: LineChart }
      ]
    },
    {
      label: 'ANALYTICS',
      items: [
        { name: 'Reports & Export', path: '/reports', icon: FileText }
      ]
    },
    {
      label: 'COMPANY',
      items: [
        { name: 'About CargoRoute', path: '/about', icon: Info }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#FFFFFF] border-r border-cr-border flex flex-col transition-all duration-300 select-none ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-cr-border bg-white">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded bg-cr-red flex items-center justify-center text-white font-black text-lg tracking-tighter shrink-0 shadow-sm">
            CR
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-cr-text leading-none">CARGOROUTE</span>
              <span className="text-[9px] font-mono tracking-widest text-cr-muted uppercase mt-0.5">Enterprise TMS</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {isOpen && (
              <h5 className="px-3 text-[10px] font-mono font-bold tracking-wider text-cr-muted uppercase mb-1.5">
                {group.label}
              </h5>
            )}
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  onClick={() => {
                    // Close sidebar if open when navigating
                    if (isOpen) {
                      toggleOpen();
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cr-red text-white shadow-sm'
                        : 'text-cr-muted hover:text-cr-text hover:bg-cr-gray/50'
                    } ${!isOpen ? 'justify-center' : ''}`
                  }
                  title={!isOpen ? item.name : undefined}
                >
                  <div className="relative shrink-0">
                    <Icon className="w-4 h-4" />
                    {item.pulse && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    )}
                  </div>
                  {isOpen && <span className="truncate">{item.name}</span>}
                  {isOpen && item.badge && (
                    <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cr-yellow text-slate-900">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="p-3 border-t border-cr-border bg-[#FAFAF8] text-xs">
          <div className="bg-white border border-cr-border rounded p-3 shadow-2xs">
            <div className="flex items-center justify-between font-mono text-[11px] text-cr-muted mb-1">
              <span>ACTIVE FLEET</span>
              <span className="font-bold text-cr-text">{kpis.activeVehicles} / {kpis.totalVehicles}</span>
            </div>
            <div className="w-full bg-cr-gray h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-cr-red h-full rounded-full"
                style={{ width: `${(kpis.activeVehicles / kpis.totalVehicles) * 100}%` }}
              />
            </div>
            <Link
              to="/capacity-optimizer"
              className="flex items-center justify-between text-[11px] font-bold text-cr-red hover:underline"
            >
              <span>Ingest Opportunity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};
