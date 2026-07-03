// ============================================================
// NewsSection.js — Papan Pengumuman & Berita untuk Front Office
// ============================================================
import React, { useState } from 'react';
import { useApp } from '../App';

const PRIORITY_STYLE = {
  high:   { badge: 'bg-red-100 text-red-600 border-red-200',   dot: 'bg-red-500',   label: 'Penting' },
  medium: { badge: 'bg-accent-100 text-accent-600 border-accent-200', dot: 'bg-accent-400', label: 'Info' },
  low:    { badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400',  label: 'Umum' },
};

const CATEGORY_COLORS = {
  Regulasi:    'bg-primary-100 text-primary-600',
  Keamanan:    'bg-red-100 text-red-600',
  Operasional: 'bg-accent-100 text-accent-600',
  Kepatuhan:   'bg-purple-100 text-purple-600',
  Umum:        'bg-gray-100 text-gray-500',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  return `${days} hari lalu`;
}

// Versi compact untuk Dashboard
export function NewsWidget({ news, onNavigate }) {
  const top = (news || [])
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2) || new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);

  if (!top.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          📢 Pengumuman & Berita Terbaru
        </div>
        <button
          onClick={() => onNavigate?.('news')}
          className="text-xs text-primary-500 hover:underline font-medium"
        >
          Lihat semua →
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {top.map((item) => {
          const ps = PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.low;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.('news')}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${ps.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ps.badge}`}>{ps.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-500'}`}>{item.category}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 line-clamp-2 leading-snug">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{timeAgo(item.date)} · {item.author}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Halaman penuh berita
export default function NewsSection() {
  const { news } = useApp();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [prioFilter, setPrioFilter] = useState('Semua');

  const allCategories = ['Semua', ...new Set((news || []).map((n) => n.category))];

  const filtered = (news || [])
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2) || new Date(b.date) - new Date(a.date);
    })
    .filter((n) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCat = catFilter === 'Semua' || n.category === catFilter;
      const matchPrio = prioFilter === 'Semua' || n.priority === prioFilter;
      return matchSearch && matchCat && matchPrio;
    });

  if (selected) {
    const ps = PRIORITY_STYLE[selected.priority] || PRIORITY_STYLE.low;
    return (
      <div className="animate-fade-in">
        <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
          ← Kembali ke Pengumuman
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ps.badge}`}>{ps.label}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[selected.category] || 'bg-gray-100 text-gray-500'}`}>{selected.category}</span>
          </div>
          <h2 className="text-xl font-display font-bold text-gray-800 mb-3 leading-snug">{selected.title}</h2>
          <div className="text-xs text-gray-400 mb-6 flex items-center gap-3">
            <span>📅 {new Date(selected.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
            <span>✍️ {selected.author}</span>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selected.content}</div>
          {selected.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
              {selected.tags.map((t) => (
                <span key={t} className="text-[11px] bg-primary-50 text-primary-500 px-2.5 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Pengumuman & Berita</h1>
        <p className="text-sm text-gray-400">Informasi terkini dari manajemen dan unit terkait</p>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau konten..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
          {allCategories.map((c) => <option key={c} value={c}>{c === 'Semua' ? 'Semua Kategori' : c}</option>)}
        </select>
        <select value={prioFilter} onChange={(e) => setPrioFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
          <option value="Semua">Semua Prioritas</option>
          <option value="high">⚠️ Penting</option>
          <option value="medium">ℹ️ Info</option>
          <option value="low">📄 Umum</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Tidak ada berita yang sesuai.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const ps = PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.low;
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${ps.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ps.badge}`}>{ps.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-500'}`}>{item.category}</span>
                    </div>
                    <div className="font-semibold text-gray-800 mb-2 leading-snug">{item.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.content.split('\n')[0]}</div>
                    <div className="text-xs text-gray-400 mt-2">{timeAgo(item.date)} · {item.author}</div>
                  </div>
                  <span className="text-gray-300 flex-shrink-0">›</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
