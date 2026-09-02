import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, ShieldCheck } from 'lucide-react';

export interface SidebarProps {
  role: 'Client' | 'Artisan';
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border h-full py-6 px-3 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col space-y-2 mt-16 md:mt-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/client' || link.to === '/artisan'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                  isActive
                    ? 'text-trust-blue bg-trust-blue/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-border/50'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
