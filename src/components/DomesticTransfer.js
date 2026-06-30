// ============================================================
// DomesticTransfer.js — RTGS, SKN, BI-Fast, Kliring Warkat
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../App';

function formatRupiah(n) {
  if (n === null || n === undefined) return 'Tidak terbatas';
  return 'Rp' + n.toLocaleString('id-ID');
}

function ComparisonTable({ transfers }) {
  const rows = [
    { label: 'Limit', get: (t) => `${t.minAmount ? `Min ${formatRupiah(t.minAmount)}` : ''}${t.maxAmount ? ` Maks ${formatRupiah(t.maxAmount)}` : t.minAmount ? '' : 'Tidak terbatas'}` },
    { label: 'Biaya', get: (t) => t.fee.desc },
    { label: 'Waktu Proses', get: (t) => t.processingTime },
    { label: 'Jam Operasional', get: (t) => t.operationalHours },
    { label: 'Channel', get: (t) => t.channel.join(', ') },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Kriteria</th>
            {transfers.map((t) => (
              <th key={t.id} className="text-left p-4">
                <div className="flex items-center gap-2">
                  <span style={{ color: t.colorPrimary }} className="text-lg">{t.icon}</span>
                  <span className="font-semibold text-gray-700">{t.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-50 last:border-0">
              <td className="p-4 text-xs font-semibold text-gray-500">{row.label}</td>
              {transfers.map((t) => (
                <td key={t.id} className="p-4 text-xs text-gray-600">{row.get(t)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransferDetailCard({ t }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-5 flex items-center gap-3" style={{ background: t.colorBg }}>
        <span className="text-3xl">{t.icon}</span>
        <div>
          <div className="font-display font-bold text-gray-800">{t.fullName}</div>
          <div className="text-xs text-gray-500">{t.tagline}</div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-0.5">Limit Transaksi</div>
            <div className="font-semibold text-gray-700">
              {t.minAmount ? `Min ${formatRupiah(t.minAmount)}` : ''}
              {t.maxAmount ? ` · Maks ${formatRupiah(t.maxAmount)}` : !t.minAmount ? 'Tidak terbatas' : ''}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-0.5">Biaya</div>
            <div className="font-semibold text-gray-700">{t.fee.desc}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-0.5">Waktu Proses</div>
            <div className="font-semibold text-gray-700">{t.processingTime}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-0.5">Jam Operasional</div>
            <div className="font-semibold text-gray-700">{t.operationalHours}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Karakteristik Utama</div>
          <ul className="space-y-1.5">
            {t.keyFeatures.map((f, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-mint-500 flex-shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contoh Penggunaan</div>
          <div className="flex flex-wrap gap-2">
            {t.useCases.map((u, i) => (
              <span key={i} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full">{u}</span>
            ))}
          </div>
        </div>

        {/* WARKAT KHUSUS (Kliring Warkat) */}
        {t.warkat && (
          <div className="mb-4 space-y-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jenis Warkat</div>
            {t.warkatTypes.map((w) => (
              <div key={w.type} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="font-semibold text-sm text-gray-800 mb-1">{w.type}</div>
                <div className="text-xs text-gray-600 mb-3">{w.description}</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-gray-500 mb-1">Syarat Formal</div>
                    <ul className="text-[11px] text-gray-600 space-y-0.5">
                      {w.formalRequirements.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-red-500 mb-1">Alasan Penolakan</div>
                    <ul className="text-[11px] text-gray-600 space-y-0.5">
                      {w.rejectionReasons.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {t.dhnInfo && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="font-semibold text-sm text-red-700 mb-1">{t.dhnInfo.title}</div>
                <div className="text-xs text-gray-600 mb-2">{t.dhnInfo.description}</div>
                <ul className="text-[11px] text-gray-600 space-y-0.5">
                  {t.dhnInfo.consequences.map((c, i) => <li key={i}>⚠️ {c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-400 mb-3">Regulasi: {t.biRegulation}</div>

        <div className="space-y-1.5">
          {t.alertNotes.map((a, i) => (
            <div key={i} className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DomesticTransfer() {
  const { transfers } = useApp();
  const [activeTab, setActiveTab] = useState('semua');

  const visible = activeTab === 'semua' ? transfers : transfers.filter((t) => t.id === activeTab);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Transfer Domestik</h1>
        <p className="text-sm text-gray-400">4 jalur transfer domestik berdasarkan aturan Bank Indonesia</p>
      </div>

      <ComparisonTable transfers={transfers} />

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('semua')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'semua' ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Semua
        </button>
        {transfers.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {visible.map((t) => <TransferDetailCard key={t.id} t={t} />)}
    </div>
  );
}
