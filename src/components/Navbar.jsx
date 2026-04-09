import { Moon, Sun, Shield, Eye, LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { name: 'Dashboard',     icon: LayoutDashboard },
  { name: 'Transactions',  icon: ArrowLeftRight  },
  { name: 'Insights',      icon: Lightbulb       },
];

export default function Navbar({ activePage, setActivePage }) {
  const { role, setRole, darkMode, setDarkMode } = useApp();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-0"
      style={{
        background: darkMode
          ? 'rgba(2,6,23,0.85)'
          : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white text-xs font-black">F</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Fin<span className="text-indigo-500">Flow</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActivePage(name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activePage === name
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Role pill */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1">
            {[
              { value: 'admin',  label: 'Admin',  Icon: Shield },
              { value: 'viewer', label: 'Viewer', Icon: Eye    },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  role === value
                    ? value === 'admin'
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
