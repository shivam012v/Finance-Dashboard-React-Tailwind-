import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

function AppContent() {
  const [activePage, setActivePage] = useState('Dashboard');
  const pages = { Dashboard, Transactions, Insights };
  const Page  = pages[activePage];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-6 pb-24 sm:pb-8">
        <Page setActivePage={setActivePage} />
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
