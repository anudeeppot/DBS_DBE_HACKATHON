import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, Search, Menu, ChevronRight, User, ShieldCheck, 
  ExternalLink, Sparkles 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { SimulationBadge } from './SimulationBadge';

export const Navbar: React.FC<{
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleNotificationDrawer: () => void;
}> = ({ sidebarOpen, toggleSidebar, toggleNotificationDrawer }) => {
  const { unreadAlertsCount, kpis } = useLogistics();
  const location = useLocation();

  const getBreadcrumbTitle = (path: string) => {
    const segment = path.split('/')[1] || '';
    if (!segment) return 'Overview';
    return segment
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <header className="h-16 bg-white border-b border-cr-border px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-cr-gray text-cr-muted hover:text-cr-text transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cr-muted">
          <Link to="/" className="hover:text-cr-text font-bold">CARGOROUTE</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cr-text font-semibold">{getBreadcrumbTitle(location.pathname)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SimulationBadge />

        <div className="h-4 w-px bg-cr-border hidden sm:block"></div>

        <Link
          to="/route-optimizer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cr-red text-white text-xs font-bold hover:bg-cr-red-dark transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-cr-yellow" />
          <span>Plan Multimodal Route</span>
        </Link>

        <button
          onClick={toggleNotificationDrawer}
          className="relative p-2 rounded-full hover:bg-cr-gray text-cr-muted hover:text-cr-text transition-colors"
          title="System Alerts & Intermediate Opportunities"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cr-red text-white text-[9px] font-bold flex items-center justify-center">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-cr-border">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-cr-text leading-none">Operations Head</span>
            <span className="text-[10px] font-mono text-cr-muted mt-0.5">HQ South Corridor</span>
          </div>
        </div>
      </div>
    </header>
  );
};
