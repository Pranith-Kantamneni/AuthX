import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, LogIn, LineChart, Activity, ShieldCheck, Cpu, TerminalSquare, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const location = useLocation();

  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Metrics', path: '/metrics', icon: LineChart },
    { name: 'Analytics', path: '/analytics', icon: Activity },
    { name: 'Live Simulation', path: '/simulation', icon: Cpu },
    { name: 'Attack Simulator', path: '/attack', icon: TerminalSquare },
    { name: 'Admin Panel', path: '/admin', icon: Settings },
  ];
  
  const authRoutes = [
    { name: 'Register Area', path: '/register', icon: UserPlus },
    { name: 'Login Gateway', path: '/login', icon: LogIn },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white hidden md:flex shrink-0">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 bg-slate-50">
        <ShieldCheck className="w-8 h-8 text-indigo-600 mr-2" />
        <span className="text-xl font-bold tracking-tight text-slate-900">Auth<span className="text-indigo-600">X</span></span>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Systems</div>
        <nav className="flex flex-col gap-1.5 px-3 mb-8">
          {routes.map(r => (
            <Link
              key={r.path}
              to={r.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                location.pathname === r.path 
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <r.icon className={cn("w-5 h-5", location.pathname === r.path ? "text-indigo-600" : "text-slate-400")} />
              {r.name}
            </Link>
          ))}
        </nav>

        <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Authentication</div>
        <nav className="flex flex-col gap-1.5 px-3">
          {authRoutes.map(r => (
            <Link
              key={r.path}
              to={r.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                location.pathname === r.path ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <r.icon className="w-5 h-5" />
              {r.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
