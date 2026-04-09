import { useState } from 'react';
import { X, DollarSign, Tag, Calendar, Type, AlignLeft } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

export default function TransactionModal({ onClose, existing }) {
  const { addTransaction, updateTransaction } = useApp();

  const [form, setForm] = useState({
    date:        existing?.date        ?? new Date().toISOString().split('T')[0],
    description: existing?.description ?? '',
    amount:      existing?.amount      ?? '',
    category:    existing?.category    ?? 'Food',
    type:        existing?.type        ?? 'expense',
  });

  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.description.trim()) return setError('Description is required');
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      return setError('Enter a valid amount');

    const tx = { ...form, amount: Number(form.amount) };

    if (existing) {
      updateTransaction(existing.id, tx);
    } else {
      addTransaction(tx);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              {existing ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {existing ? 'Update the details below' : 'Fill in the transaction details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                  form.type === t
                    ? t === 'expense'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {t === 'expense' ? '↓ Expense' : '↑ Income'}
              </button>
            ))}
          </div>

          {/* Amount — big and prominent */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <DollarSign size={16} />
            </div>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00"
              className={`${inputCls} pl-9 text-lg font-bold`}
            />
          </div>

          {/* Description */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <AlignLeft size={15} />
            </div>
            <input
              type="text"
              required
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Description (e.g. Coffee shop)"
              className={`${inputCls} pl-9`}
            />
          </div>

          {/* Date + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={14} />
              </div>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className={`${inputCls} pl-8`}
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Tag size={14} />
              </div>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={`${inputCls} pl-8 appearance-none`}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-xl">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                form.type === 'expense'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/30'
              }`}
            >
              {existing ? 'Save Changes' : `Add ${form.type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
