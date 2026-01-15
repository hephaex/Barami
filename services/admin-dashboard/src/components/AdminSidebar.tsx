import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  FileText,
  Wind,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  {
    to: '/admin',
    icon: LayoutDashboard,
    label: 'Overview',
    end: true,
  },
  {
    to: '/admin/grafana',
    icon: BarChart3,
    label: 'Grafana',
  },
  {
    to: '/admin/metrics',
    icon: Activity,
    label: 'Metrics',
  },
  {
    to: '/admin/services',
    icon: Settings,
    label: 'Services',
  },
  {
    to: '/admin/logs',
    icon: FileText,
    label: 'Logs',
  },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <Wind className="w-8 h-8 text-primary-500" />
          <div>
            <h1 className="text-xl font-bold text-white">Barami</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-dark-hover hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="text-xs text-gray-500">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 Barami Project</p>
        </div>
      </div>
    </aside>
  );
};
