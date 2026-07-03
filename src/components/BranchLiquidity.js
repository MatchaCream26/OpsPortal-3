// ============================================================
// BranchLiquidity.js — Likuiditas Kas KC/KCP
// ============================================================
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';

function formatIDR(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(2)} M`;
  if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(1)} jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

function formatFX(n, code) {
  if (!n && n !== 0) return '—';
  return `${code} ${n.toLocaleString('id-ID')}`;
}

function liquidityLevel(idr) {
  if (idr >= 5e9)  return { label: 'Aman', color: 'text-mint-600 bg-mint-50', dot: 'bg-mint-500' };
  if (idr >= 2e9)  return { label: 'Cukup', color: 'text-accent-600 bg-accent-50', dot: 'bg-accent-400' };
  return              { label: 'Rendah', color: 'text-red-600 bg-red-50', dot: 'bg-red-500' };
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return 'Hari ini';
  if (d === 1) return 'Kemarin';
  return `${d} hari lalu`;
}

export default function BranchLiquidity() {
  const { branches } = useApp();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('Semua');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('idrLiq');
  const [sortDir, setSortDir] = useState('desc');

  const regions = useMemo(() =>
    ['Semua', ...new Set((branches || []).map((b) => b.region))],
    [branches]
  );

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (branches || [])
      .filter((b) => {
        const ms = !q || b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
        const mr = regionFilter === 'Semua' || b.region === regionFilter;
        const mt = typeFilter === 'Semua' || b.type === typeFilter;
        return ms && mr && mt;
      })
      .sort((a, b) => {
        const av = a[sortBy] ?? 0;
        const bv = b[sortBy] ?? 0;
        return sortDir === 'asc' ? av - bv : bv - av;
      });
  }, [branches, search, regionFilter, typeFilter, sortBy, sortDir]);

  // Ringkasan regional
  const summary = useMemo(() => {
    const total = (branches || []).reduce((s, b) => s + (b.idrLiq || 0), 0);
    const aman  = (branches || []).filter((b) => b.idrLiq >= 5e9).length;
    const cukup = (branches || []).filter((b) => b.idrLiq >= 2e9 && b.idrLiq < 5e9).length;
    const rendah= (branches || []).filter((b) => b.idrLiq < 2e9).length;
    return { total, aman, cukup, rendah };
  }, [branches]);

  const SortBtn = ({ col, label }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600">
      {label}
      <span>{sortBy === col ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}</span>
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Posisi Likuiditas Cabang</h1>
        <p className="text-sm text-gray-400">Ketersediaan kas IDR & valas utama per kantor cabang & KCP</p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl mb-1">🏦</div>
          <div className="text-lg font-bold text-gray-800">{(branches || []).length}</div>
          <div className="text-xs text-gray-400">Total Cabang</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-lg font-bold text-gray-800">{formatIDR(summary.total)}</div>
          <div className="text-xs text-gray-400">Total Likuiditas IDR</div>
        </div>
        <div className="bg-mint-50 rounded-2xl border border-mint-100 p-4">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-lg font-bold text-mint-700">{summary.aman}</div>
          <div className="text-xs text-mint-500">Cabang Status Aman</div>
        </div>
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <div className="text-2xl mb-1">⚠️</div>
          <div className="text-lg font-bold text-red-600">{summary.rendah}</div>
          <div className="text-xs text-red-400">Cabang Likuiditas Rendah</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode cabang..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </div>
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
          {regions.map((r) => <option key={r} value={r}>{r === 'Semua' ? 'Semua Wilayah' : r}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
          <option value="Semua">KC & KCP</option>
          <option value="KC">Kantor Cabang (KC)</option>
          <option value="KCP">Kantor Cabang Pembantu (KCP)</option>
        </select>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 text-xs text-gray-400 flex justify-between">
          <span>Menampilkan {filtered.length} cabang</span>
          <span>Klik header kolom untuk mengurutkan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-3"><span className="text-xs font-semibold text-gray-400 uppercase">Cabang</span></th>
                <th className="text-left p-3"><span className="text-xs font-semibold text-gray-400 uppercase">Wilayah</span></th>
                <th className="text-left p-3"><SortBtn col="idrLiq" label="Likuiditas IDR" /></th>
                <th className="text-left p-3"><SortBtn col="usdLiq" label="USD" /></th>
                <th className="text-left p-3"><span className="text-xs font-semibold text-gray-400 uppercase">EUR</span></th>
                <th className="text-left p-3"><span className="text-xs font-semibold text-gray-400 uppercase">Status</span></th>
                <th className="text-left p-3"><span className="text-xs font-semibold text-gray-400 uppercase">Update</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-gray-400">Tidak ada cabang yang sesuai filter.</td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const lv = liquidityLevel(b.idrLiq);
                  return (
                    <tr key={b.code} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-800 text-sm">{b.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{b.code} · {b.type}</div>
                      </td>
                      <td className="p-3 text-xs text-gray-500">{b.region}</td>
                      <td className="p-3 font-semibold text-gray-700 text-sm">{formatIDR(b.idrLiq)}</td>
                      <td className="p-3 text-xs text-gray-500">{formatFX(b.usdLiq, 'USD')}</td>
                      <td className="p-3 text-xs text-gray-500">{formatFX(b.eurLiq, 'EUR')}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${lv.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lv.dot}`} />
                          {lv.label}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-gray-400">{timeAgo(b.updatedAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
