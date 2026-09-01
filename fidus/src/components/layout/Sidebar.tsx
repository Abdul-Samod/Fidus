import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, ShieldCheck } from 'lucide-react';

export interface SidebarProps {
  role: 'Client' | 'Artisan';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const clientLinks = [
    { to: '/client', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/client/create-job', label: 'Create Job', icon: <PlusCircle className="w-5 h-5" /> },
  ];

  const artisanLinks = [
    { to: '/artisan', label: 'Job Feed', icon: <Search className="w-5 h-5" /> },
    { to: '/artisan/kyc', label: 'KYC Verification', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const links = role === 'Client' ? clientLinks : artisanLinks;

  return (
    <aside className="w-64 bg-surface border-r border-border h-full py-6 px-3 flex flex-col shrink-0">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/client' || link.to === '/artisan'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                isActive
                  ? 'text-trust-blue bg-trust-blue/10'
                  : 'text-secondary hover:text-primary hover:bg-surface-lighter/50'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
