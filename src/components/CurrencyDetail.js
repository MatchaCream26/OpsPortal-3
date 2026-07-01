// ============================================================
// CurrencyDetail.js — Detail Mata Uang + Galeri Gambar + Lightbox
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../App';

const METHOD_ICON = {
  Dilihat: '👁️',
  Diraba: '✋',
  Diterawang: '💡',
  'UV Light': '🔆',
  Microprinting: '🔬',
};

// ─── Kunci LocalStorage untuk gambar denominasi ─────────────
// Format: ceod_img_{currencyCode}_{denomValue}_{side}
// side: 'front' | 'back'
export function imgKey(currencyCode, denomValue, side) {
  return `ceod_img_${currencyCode}_${denomValue}_${side}`;
}

// ─── Lightbox / Modal Zoom ───────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, onClose]);

  // Lock scroll body saat lightbox terbuka
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const current = images[idx];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Kontainer gambar — klik di sini tidak nutup modal */}
      <div
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl leading-none"
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* Label sisi */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {current.label}
        </div>

        {/* Gambar utama */}
        <div className="w-full flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden min-h-[200px]">
          {current.src ? (
            <img
              src={current.src}
              alt={current.label}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl select-none"
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-56 flex flex-col items-center justify-center rounded-2xl text-white gap-2"
              style={{ background: current.gradient }}
            >
              <span className="text-4xl font-display font-bold">{current.denomLabel}</span>
              <span className="text-sm opacity-70">{current.subtitle}</span>
              <span className="text-xs opacity-50 mt-1">Belum ada gambar — upload di Manajemen CMS</span>
            </div>
          )}
        </div>

        {/* Navigasi gambar */}
        {images.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg"
              aria-label="Gambar sebelumnya"
            >
              ‹
            </button>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg"
              aria-label="Gambar berikutnya"
            >
              ›
            </button>
          </div>
        )}

        <div className="text-white/40 text-xs">
          {idx + 1} / {images.length} · Tekan ← → untuk navigasi, Esc untuk tutup
        </div>
      </div>
    </div>
  );
}

// ─── Satu card denominasi ────────────────────────────────────
function DenominationCard({ denom, currency, onOpenLightbox, allImages }) {
  const [activeMethod, setActiveMethod] = useState(null);
  const methods = [...new Set(denom.securityFeatures.map((f) => f.method))];

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);

  // Baca gambar dari LocalStorage setiap render (reactive via prop perubahan bisa ditambah)
  useEffect(() => {
    const f = localStorage.getItem(imgKey(currency.code, denom.value, 'front'));
    const b = localStorage.getItem(imgKey(currency.code, denom.value, 'back'));
    setFrontImg(f || null);
    setBackImg(b || null);
  }, [currency.code, denom.value]);

  // Kalau gambar baru di-upload (dari AdminCMS), reload secara global
  useEffect(() => {
    const handler = () => {
      const f = localStorage.getItem(imgKey(currency.code, denom.value, 'front'));
      const b = localStorage.getItem(imgKey(currency.code, denom.value, 'back'));
      setFrontImg(f || null);
      setBackImg(b || null);
    };
    window.addEventListener('ceod_img_updated', handler);
    return () => window.removeEventListener('ceod_img_updated', handler);
  }, [currency.code, denom.value]);

  const gradient = `linear-gradient(135deg, ${currency.colorPrimary}, ${currency.colorAccent})`;

  const buildImageSlot = (side, src, label, subtitle) => (
    <button
      onClick={() => {
        // Temukan index gambar ini di allImages untuk lightbox posisi
        const clickedIdx = allImages.findIndex(
          (img) => img.denomValue === denom.value && img.side === side
        );
        onOpenLightbox(clickedIdx >= 0 ? clickedIdx : 0);
      }}
      className="relative group flex flex-col items-center justify-center text-white overflow-hidden focus:outline-none"
      style={{ height: '140px', background: src ? 'black' : gradient }}
      aria-label={`Perbesar gambar ${label}`}
    >
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-display font-bold">{denom.label}</span>
          <span className="text-[10px] opacity-80">{subtitle}</span>
        </div>
      )}
      {/* Label sisi */}
      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {label}
      </span>
      {/* Overlay zoom on hover */}
      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          🔍 Perbesar
        </span>
      </span>
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* GALERI DEPAN / BELAKANG */}
      <div className="grid grid-cols-2 gap-px bg-gray-200">
        {buildImageSlot('front', frontImg, 'Depan (Obverse)', denom.figure)}
        {buildImageSlot('back', backImg, 'Belakang (Reverse)', denom.colorDesc)}
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

// ─── Halaman utama Detail Mata Uang ─────────────────────────
export default function CurrencyDetail({ currencyId }) {
  const { currencies, navigate } = useApp();
  const currency = currencies.find((c) => c.id === currencyId);
  const [tab, setTab] = useState('denominasi');
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [imgRevision, setImgRevision] = useState(0); // force re-render saat gambar baru di-upload

  // Dengerin event upload gambar dari AdminCMS
  useEffect(() => {
    const handler = () => setImgRevision((r) => r + 1);
    window.addEventListener('ceod_img_updated', handler);
    return () => window.removeEventListener('ceod_img_updated', handler);
  }, []);

  // Bangun array gambar flat untuk lightbox (semua denominasi × 2 sisi)
  // Harus di atas early-return agar tidak melanggar rules of hooks
  const sortedDenoms = currency
    ? [...currency.denominations].sort((a, b) => b.value - a.value)
    : [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allImages = React.useMemo(() => {
    if (!currency) return [];
    const gradient = `linear-gradient(135deg, ${currency.colorPrimary}, ${currency.colorAccent})`;
    const list = [];
    for (const d of sortedDenoms) {
      for (const side of ['front', 'back']) {
        const src = localStorage.getItem(imgKey(currency.code, d.value, side)) || null;
        list.push({
          denomValue: d.value,
          side,
          src,
          label: `${d.label} — ${side === 'front' ? 'Depan (Obverse)' : 'Belakang (Reverse)'}`,
          denomLabel: d.label,
          subtitle: side === 'front' ? d.figure : d.colorDesc,
          gradient,
        });
      }
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, imgRevision]);

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
      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

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
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'denominasi', label: `Denominasi (${currency.denominations.length})` },
          { id: 'penolakan', label: 'Panduan Penolakan' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'denominasi' && (
        <div>
          {sortedDenoms.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Belum ada denominasi terdaftar.</div>
          )}
          {sortedDenoms.map((d) => (
            <DenominationCard
              key={d.value}
              denom={d}
              currency={currency}
              allImages={allImages}
              onOpenLightbox={setLightboxIdx}
            />
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
