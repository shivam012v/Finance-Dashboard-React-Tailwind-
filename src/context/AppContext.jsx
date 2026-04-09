import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockTransactions } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const initialized = useRef(false);

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fd_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return mockTransactions;
  });

  const [role, setRole] = useState(
    () => localStorage.getItem('fd_role') || 'admin'
  );

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('fd_dark') === 'true'
  );

  const [filters, setFilters] = useState({
    search: '', type: 'all', category: 'all', sort: 'date-desc',
  });

  // Skip saving on first render (avoid overwriting with stale state)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    localStorage.setItem('fd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fd_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('fd_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = (tx) => {
    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...tx,
      amount: Number(tx.amount),
    };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      // Save immediately — don't wait for useEffect
      localStorage.setItem('fd_transactions', JSON.stringify(updated));
      return updated;
    });
  };

  const updateTransaction = (id, updated) => {
    setTransactions(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, ...updated, amount: Number(updated.amount) } : t
      );
      localStorage.setItem('fd_transactions', JSON.stringify(next));
      return next;
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('fd_transactions', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction,
      role, setRole,
      darkMode, setDarkMode,
      filters, setFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
