// ============================================================
// FAQ.js — FAQ Interaktif dengan Accordion & Search
// ============================================================

import React, { useState, useMemo } from 'react';
import { useApp } from '../App';

const CATEGORY_COLORS = {
  Valas: 'bg-primary-100 text-primary-600',
  Transfer: 'bg-mint-100 text-mint-600',
  Warkat: 'bg-amber-100 text-amber-600',
  'BI-Fast': 'bg-mint-100 text-mint-600',
  Operasional: 'bg-purple-100 text-purple-600',
};

export default function FAQ() {
  const { faqs } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [openId, setOpenId] = useState(null);

  const categories = useMemo(() => ['Semua', ...new Set(faqs.map((f) => f.category))], [faqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchSearch = !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCategory = category === 'Semua' || f.category === category;
      return matchSearch && matchCategory;
    });
  }, [faqs, search, category]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">FAQ Operasional</h1>
        <p className="text-sm text-gray-400">Pertanyaan umum seputar operasional harian Front Office</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan, kata kunci..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Tidak ada FAQ yang cocok dengan pencarian.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => {
            const open = openId === f.id;
            return (
              <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg flex-shrink-0 ${CATEGORY_COLORS[f.category] || 'bg-gray-100 text-gray-500'}`}>
                      {f.category}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate">{f.question}</span>
                  </div>
                  <span className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open ? '1000px' : '0px' }}
                >
                  <div className="px-4 pb-4 pt-1 text-sm text-gray-600 whitespace-pre-line leading-relaxed border-t border-gray-50">
                    {f.answer}
                    {f.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {f.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
