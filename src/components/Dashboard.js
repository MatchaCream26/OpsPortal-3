// ============================================================
// Dashboard.js — Halaman Utama v2: Smart Search + Kurs + Berita
// ============================================================
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { RateTable } from './ExchangeRateChart';
import { NewsWidget } from './NewsSection';

export default function Dashboard() {
  const { currencies, transfers, faqs, rates, news, navigate } = useApp();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const currencyHits = currencies.filter((c) => {
      const inName  = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
      const inDenom = c.denominations.some((d) => d.label.toLowerCase().includes(q) || d.figure?.toLowerCase().includes(q));
      const inSec   = c.denominations.some((d) => d.securityFeatures?.some((f) => f.desc.toLowerCase().includes(q)));
      return inName || inDenom || inSec;
    }).map((c) => ({ type: 'currency', id: c.id, title: `${c.flag} ${c.name} (${c.code})`, subtitle: c.country }));

    const transferHits = transfers.filter((t) =>
      t.name.toLowerCase().includes(q) || t.fullName.toLowerCase().includes(q) || t.keyFeatures.some((f) => f.toLowerCase().includes(q))
    ).map((t) => ({ type: 'transfer', id: t.id, title: `${t.icon} ${t.fullName}`, subtitle: t.tagline }));

    const faqHits = faqs.filter((f) =>
      f.question.toLowerCase().includes(q) || f.tags?.some((t) => t.toLowerCase().includes(q))
    ).map((f) => ({ type: 'faq', id: f.id, title: f.question, subtitle: f.category }));

    const rateHits = (rates || []).filter((r) => r.code.toLowerCase().includes(q))
      .map((r) => ({ type: 'kurs', id: r.code, title: `💱 Kurs ${r.code}/IDR`, subtitle: `TT Beli: ${r.ttBuy?.toLocaleString('id-ID')} | TT Jual: ${r.ttSell?.toLocaleString('id-ID')}` }));

    return [...currencyHits, ...transferHits, ...rateHits, ...faqHits];
  }, [query, currencies, transfers, faqs, rates]);

  const totalDenoms   = currencies.reduce((s, c) => s + c.denominations.length, 0);
  const invalidDenoms = currencies.reduce((s, c) => s + c.denominations.filter((d) => !d.isValid).length, 0);

  const stats = [
    { label: 'Mata Uang Terdaftar', value: currencies.length,  icon: '💱', grad: 'from-primary-500 to-primary-600' },
    { label: 'Total Denominasi',    value: totalDenoms,         icon: '🏷️', grad: 'from-mint-500 to-mint-600' },
    { label: 'Emisi Tidak Berlaku', value: invalidDenoms,       icon: '⚠️', grad: 'from-red-400 to-red-500' },
    { label: 'FAQ Tersedia',        value: faqs.length,         icon: '❓', grad: 'from-accent-400 to-accent-500' },
  ];

  const handleResultClick = (r) => {
    if (r.type === 'currency') navigate('currency-detail', { currencyId: r.id });
    else if (r.type === 'transfer') navigate('transfer');
    else if (r.type === 'kurs') navigate('kurs');
    else navigate('faq');
  };

  return (
    <div className="animate-fade-in">
      {/* HERO SEARCH */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-3xl p-6 md:p-10 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-accent-400 opacity-10 rounded-full" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-mint-400 rounded-full" /> Portal Pembelajaran Front Office
          </div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">
            Selamat datang di CEOD Portal 👋
          </h1>
          <p className="text-primary-50 text-sm md:text-base max-w-xl mb-6">
            Cari materi valas, panduan transfer, kurs hari ini, atau FAQ — semua dalam satu pencarian.
          </p>
          <div className="relative max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Coba "USD 100", "Limit SKN", "SWIFT", "kurs EUR"...'
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 shadow-lg focus:ring-4 focus:ring-white/30 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* HASIL SEARCH */}
      {results !== null && (
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-slide-up">
          <div className="text-sm font-semibold text-gray-700 mb-3">{results.length} hasil untuk "{query}"</div>
          {results.length === 0 ? (
            <div className="text-sm text-gray-400 py-6 text-center">Tidak ada materi yang cocok. Coba kata kunci lain.</div>
          ) : (
            <div className="space-y-1">
              {results.map((r, i) => (
                <button key={`${r.type}-${r.id}-${i}`} onClick={() => handleResultClick(r)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${
                    r.type === 'currency' ? 'bg-primary-100 text-primary-600' :
                    r.type === 'kurs'     ? 'bg-mint-100 text-mint-600' :
                    r.type === 'transfer' ? 'bg-accent-100 text-accent-600' : 'bg-gray-100 text-gray-500'
                  }`}>{r.type === 'currency' ? 'Valas' : r.type === 'kurs' ? 'Kurs' : r.type === 'transfer' ? 'Transfer' : 'FAQ'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-600">{r.title}</div>
                    <div className="text-xs text-gray-400 truncate">{r.subtitle}</div>
                  </div>
                  <span className="text-gray-300 group-hover:text-primary-500">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white text-lg mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* KURS WIDGET */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="font-semibold text-gray-700 text-sm flex items-center gap-2">📈 Kurs Valas Hari Ini</div>
          <button onClick={() => navigate('kurs')} className="text-xs text-primary-500 hover:underline font-medium">
            Historis & Grafik →
          </button>
        </div>
        <RateTable rates={rates} compact />
      </div>

      {/* NEWS WIDGET + SHORTCUTS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <NewsWidget news={news} onNavigate={navigate} />
        <div className="space-y-3">
          {[
            { page: 'katalog',    icon: '💱', label: 'Katalog Valas',         desc: '11 mata uang asing & ciri keaslian' },
            { page: 'remittance', icon: '🌐', label: 'Transfer Luar Negeri',  desc: 'SWIFT, biaya OUR/BEN/SHA, Compliance' },
            { page: 'likuiditas', icon: '🏦', label: 'Likuiditas Cabang',     desc: 'Posisi kas IDR & valas per KC/KCP' },
            { page: 'forum',      icon: '💬', label: 'Forum Diskusi',         desc: 'Berbagi temuan antar teller & CS' },
          ].map((s) => (
            <button key={s.page} onClick={() => navigate(s.page)}
              className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
                <div className="text-xs text-gray-400">{s.desc}</div>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
