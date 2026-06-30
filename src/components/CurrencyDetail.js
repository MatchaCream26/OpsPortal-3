// ============================================================
// CurrencyDetail.js — Detail Mata Uang: Galeri, Status, Anti-Palsu
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../App';

const METHOD_ICON = {
  Dilihat: '👁️',
  Diraba: '✋',
  Diterawang: '💡',
  'UV Light': '🔆',
  Microprinting: '🔬',
};

function DenominationCard({ denom, colorPrimary, colorAccent }) {
  const [activeMethod, setActiveMethod] = useState(null);
  const methods = [...new Set(denom.securityFeatures.map((f) => f.method))];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* GALERI OBVERSE/REVERSE */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {['Depan (Obverse)', 'Belakang (Reverse)'].map((side, i) => (
          <div
            key={side}
            className="h-32 flex flex-col items-center justify-center gap-1 text-white relative"
            style={{ background: `linear-gradient(135deg, ${colorPrimary}, ${colorAccent})` }}
          >
            <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">{side}</span>
            <span className="text-2xl font-display font-bold">{denom.label}</span>
            <span className="text-[10px] opacity-80">{i === 0 ? denom.figure : denom.colorDesc}</span>
          </div>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-display font-bold text-gray-800 text-lg">{denom.label}</div>
            <div className="text-xs text-gray-400">{denom.colorDesc}</div>
          </div>
          {denom.isValid ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint-600 bg-mint-50 px-2.5 py-1 rounded-full whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-mint-500 rounded-full" /> Berlaku
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Tidak Berlaku
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <span className="font-medium text-gray-600">Tokoh:</span> {denom.figure} ·{' '}
          <span className="font-medium text-gray-600">Emisi:</span> {denom.yearIssued.join(', ')}
          {denom.latestEmission && <> (terbaru: {denom.latestEmission})</>}
        </div>

        {denom.invalidYears?.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl text-xs text-red-600">
            ⚠️ Emisi/seri ditarik: {denom.invalidYears.join(', ')}
          </div>
        )}

        {/* HOTSPOT METODE KEAMANAN */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Panduan Anti-Uang Palsu</div>
          <div className="flex flex-wrap gap-2">
            {methods.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMethod(activeMethod === m ? null : m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeMethod === m
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
              >
                <span>{METHOD_ICON[m] || '🔍'}</span> {m}
              </button>
            ))}
          </div>
        </div>

        {activeMethod && (
          <div className="space-y-2 animate-slide-up">
            {denom.securityFeatures.filter((f) => f.method === activeMethod).map((f, i) => (
              <div key={i} className="flex gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 leading-relaxed">
                <span>{METHOD_ICON[f.method] || '🔍'}</span>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        )}

        {denom.notes && (
          <div className="mt-3 text-xs text-gray-500 italic border-t border-gray-100 pt-3">📌 {denom.notes}</div>
        )}
      </div>
    </div>
  );
}

export default function CurrencyDetail({ currencyId }) {
  const { currencies, navigate } = useApp();
  const currency = currencies.find((c) => c.id === currencyId);
  const [tab, setTab] = useState('denominasi');

  if (!currency) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500 mb-4">Mata uang tidak ditemukan.</p>
        <button onClick={() => navigate('katalog')} className="text-primary-600 font-medium text-sm hover:underline">
          ← Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('katalog')} className="text-sm text-gray-400 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
        ← Kembali ke Katalog
      </button>

      {/* HEADER */}
      <div
        className="rounded-3xl p-6 md:p-8 mb-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${currency.colorPrimary}, ${currency.colorAccent})` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-5xl">{currency.flag}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">{currency.name}</h1>
            <p className="text-sm opacity-90">{currency.nameEn} · {currency.country}</p>
            <p className="text-xs opacity-75 mt-1">Bank Sentral: {currency.centralBank}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'denominasi', label: `Denominasi (${currency.denominations.length})` },
          { id: 'penolakan', label: 'Panduan Penolakan' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'denominasi' && (
        <div>
          {currency.denominations
            .slice()
            .sort((a, b) => b.value - a.value)
            .map((d) => (
              <DenominationCard key={d.value} denom={d} colorPrimary={currency.colorPrimary} colorAccent={currency.colorAccent} />
            ))}
        </div>
      )}

      {tab === 'penolakan' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm font-semibold text-gray-700 mb-4">Kondisi yang Mengharuskan Penolakan</div>
          <div className="space-y-3">
            {currency.rejectionGuide.map((g, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✕</span>
                <span className="text-sm text-gray-600">{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
