// ============================================================
// CurrencyCatalog.js — Grid Katalog 11 Mata Uang + Filter
// ============================================================

import React, { useState, useMemo } from 'react';
import { useApp } from '../App';

export default function CurrencyCatalog() {
  const { currencies, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [continentFilter, setContinentFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const continents = useMemo(
    () => ['Semua', ...new Set(currencies.map((c) => c.continent))],
    [currencies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currencies.filter((c) => {
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q);
      const matchContinent = continentFilter === 'Semua' || c.continent === continentFilter;
      const hasInvalid = c.denominations.some((d) => !d.isValid);
      const matchStatus =
        statusFilter === 'Semua' ||
        (statusFilter === 'Berlaku' && !hasInvalid) ||
        (statusFilter === 'Ada Emisi Ditarik' && hasInvalid);
      return matchSearch && matchContinent && matchStatus;
    });
  }, [currencies, search, continentFilter, statusFilter]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Katalog Valas</h1>
        <p className="text-sm text-gray-400">11 mata uang asing dengan panduan keaslian dan status emisi</p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, kode, atau negara..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
          />
        </div>
        <select
          value={continentFilter}
          onChange={(e) => setContinentFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
        >
          {continents.map((c) => <option key={c} value={c}>{c === 'Semua' ? 'Semua Benua' : c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
        >
          <option value="Semua">Semua Status</option>
          <option value="Berlaku">Semua Emisi Berlaku</option>
          <option value="Ada Emisi Ditarik">Ada Emisi Ditarik</option>
        </select>
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Tidak ada mata uang yang cocok dengan filter.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const hasInvalid = c.denominations.some((d) => !d.isValid);
            return (
              <button
                key={c.id}
                onClick={() => navigate('currency-detail', { currencyId: c.id })}
                className="text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="h-20 flex items-center justify-between px-5"
                  style={{ background: `linear-gradient(135deg, ${c.colorPrimary}, ${c.colorAccent})` }}
                >
                  <span className="text-3xl">{c.flag}</span>
                  <span className="text-white font-display font-bold text-xl">{c.symbol}</span>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-800 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{c.country} · {c.code}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{c.denominations.length} denominasi</span>
                    {hasInvalid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Ada Ditarik
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint-600 bg-mint-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-mint-500 rounded-full" /> Semua Berlaku
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
