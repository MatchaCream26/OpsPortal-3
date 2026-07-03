// ============================================================
// AdminCMS.js — Manajemen CMS: Tambah/Edit Valas + Upload Gambar
//               + Update Kurs + Kelola Berita + Upload Data Cabang
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import { useApp } from '../App';
import { imgKey } from './CurrencyDetail';
import {
  EXTRA_STORAGE_KEYS, INITIAL_RATES, INITIAL_RATES_HISTORY, saveToStorage,
} from '../data/DataStore';

const CONTINENTS = ['Asia', 'Amerika', 'Eropa', 'Australia', 'Afrika'];

function EmptyDenomForm() {
  return {
    value: '', label: '', colorDesc: '', figure: '',
    yearIssued: '', latestEmission: '', isValid: true, invalidYears: '',
    securityFeatures: [{ method: 'Dilihat', desc: '' }],
    notes: '',
  };
}

// ══════════════════════════════════════════════════════════════
// TAB 1 — Tambah Mata Uang Baru
// ══════════════════════════════════════════════════════════════
function AddCurrencyForm() {
  const { addCurrency } = useApp();
  const [form, setForm] = useState({
    code: '', name: '', nameEn: '', country: '', continent: CONTINENTS[0], flag: '',
    centralBank: '', symbol: '', colorPrimary: '#3B82F6', colorAccent: '#1D4ED8', bgColor: '#EFF6FF',
  });
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    addCurrency({
      ...form,
      id: form.code.toUpperCase(),
      code: form.code.toUpperCase(),
      denominations: [],
      rejectionGuide: [
        'Fisik sobek/mutilasi lebih dari 50% area uang',
        'Tanda tangan/tulisan tinta di area potret',
        'Emisi yang sudah ditarik dari peredaran',
      ],
    });
    setSaved(true);
    setForm({ code: '', name: '', nameEn: '', country: '', continent: CONTINENTS[0], flag: '', centralBank: '', symbol: '', colorPrimary: '#3B82F6', colorAccent: '#1D4ED8', bgColor: '#EFF6FF' });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="font-semibold text-gray-700 mb-4">Tambah Mata Uang Baru</div>
      {saved && <div className="mb-4 p-3 bg-mint-50 text-mint-600 text-sm rounded-xl">✓ Mata uang baru berhasil ditambahkan ke katalog.</div>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Kode (contoh: THB)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
        <input value={form.flag} onChange={(e) => setForm({ ...form, flag: e.target.value })} placeholder="Emoji bendera (🇹🇭)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama (Bahasa Indonesia)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none sm:col-span-2" />
        <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Nama (English)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Negara" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
        <select value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white">
          {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="Simbol (Rp, $, ฿)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
        <input value={form.centralBank} onChange={(e) => setForm({ ...form, centralBank: e.target.value })} placeholder="Bank sentral" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none sm:col-span-2" />
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-20">Warna utama</label>
          <input type="color" value={form.colorPrimary} onChange={(e) => setForm({ ...form, colorPrimary: e.target.value })} className="w-10 h-9 rounded-lg border border-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-20">Warna aksen</label>
          <input type="color" value={form.colorAccent} onChange={(e) => setForm({ ...form, colorAccent: e.target.value })} className="w-10 h-9 rounded-lg border border-gray-200" />
        </div>
      </div>
      <button type="submit" className="mt-4 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium shadow-sm hover:bg-primary-600">
        Simpan Mata Uang
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 2 — Upload Gambar Denominasi (baru)
// ══════════════════════════════════════════════════════════════

// Satu slot upload (Depan atau Belakang)
function ImageUploadSlot({ currencyCode, denomValue, side, label, gradient }) {
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null); // 'saving' | 'saved' | 'error' | 'removed'
  const inputRef = useRef(null);

  // Baca gambar yang sudah tersimpan saat komponen mount
  useEffect(() => {
    const stored = localStorage.getItem(imgKey(currencyCode, denomValue, side));
    setPreview(stored || null);
  }, [currencyCode, denomValue, side]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setStatus('error'); return; }
    // Limit ukuran file: 4 MB
    if (file.size > 4 * 1024 * 1024) {
      setStatus('error');
      alert('Ukuran file terlalu besar. Maksimum 4 MB per gambar.');
      return;
    }
    setStatus('saving');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      try {
        localStorage.setItem(imgKey(currencyCode, denomValue, side), dataUrl);
        setPreview(dataUrl);
        setStatus('saved');
        // Beritahu CurrencyDetail untuk refresh
        window.dispatchEvent(new Event('ceod_img_updated'));
        setTimeout(() => setStatus(null), 2500);
      } catch (err) {
        // LocalStorage quota mungkin penuh
        setStatus('error');
        alert('Gagal menyimpan gambar. LocalStorage mungkin penuh. Coba kompres gambar terlebih dahulu.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    if (!window.confirm('Hapus gambar ini?')) return;
    localStorage.removeItem(imgKey(currencyCode, denomValue, side));
    setPreview(null);
    setStatus('removed');
    window.dispatchEvent(new Event('ceod_img_updated'));
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-gray-500">{label}</div>

      {/* Preview / Placeholder */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-gray-200"
        style={{ height: '160px' }}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow"
              title="Hapus gambar"
            >
              ✕
            </button>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/80 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-3xl opacity-50">🖼️</span>
            <span className="text-[11px] font-semibold">Klik untuk upload</span>
            <span className="text-[10px] opacity-70">JPG / PNG / WebP · maks 4 MB</span>
          </div>
        )}
      </div>

      {/* Tombol aksi */}
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 py-2 rounded-xl border border-primary-200 bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
        >
          {preview ? '🔄 Ganti Gambar' : '📤 Upload Gambar'}
        </button>
      </div>

      {/* Status feedback */}
      {status === 'saving' && <div className="text-xs text-gray-400 animate-pulse">Menyimpan...</div>}
      {status === 'saved' && <div className="text-xs text-mint-600">✓ Gambar berhasil disimpan</div>}
      {status === 'removed' && <div className="text-xs text-gray-400">Gambar dihapus</div>}
      {status === 'error' && <div className="text-xs text-red-500">Gagal menyimpan. Periksa format/ukuran file.</div>}

      {/* Input file tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

function ImageUploadPanel() {
  const { currencies } = useApp();
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(currencies[0]?.id || '');

  const currency = currencies.find((c) => c.id === selectedCurrencyId);
  const sortedDenoms = currency
    ? [...currency.denominations].sort((a, b) => b.value - a.value)
    : [];

  const gradient = currency
    ? `linear-gradient(135deg, ${currency.colorPrimary}, ${currency.colorAccent})`
    : '#e5e7eb';

  return (
    <div className="space-y-5">
      {/* Pilih mata uang */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-3">Pilih Mata Uang</div>
        <select
          value={selectedCurrencyId}
          onChange={(e) => setSelectedCurrencyId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
        >
          {currencies.map((c) => (
            <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.code})</option>
          ))}
        </select>

        {currency && (
          <div className="mt-3 p-3 rounded-xl flex items-center gap-3 text-white" style={{ background: gradient }}>
            <span className="text-2xl">{currency.flag}</span>
            <div>
              <div className="font-semibold text-sm">{currency.name}</div>
              <div className="text-xs opacity-80">{currency.denominations.length} denominasi terdaftar</div>
            </div>
          </div>
        )}
      </div>

      {/* Grid denominasi */}
      {!currency ? (
        <div className="text-center py-12 text-sm text-gray-400">Belum ada mata uang tersedia.</div>
      ) : sortedDenoms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-sm text-gray-400">
          Mata uang ini belum memiliki denominasi. Tambahkan denominasi terlebih dahulu di tab "Edit Materi".
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDenoms.map((d) => (
            <div key={d.value} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {/* Header denominasi */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: gradient }}
                >
                  {d.label}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{d.label}</div>
                  <div className="text-xs text-gray-400">{d.figure} · {d.colorDesc}</div>
                </div>
                <div className="ml-auto">
                  {d.isValid ? (
                    <span className="text-[10px] font-semibold text-mint-600 bg-mint-50 px-2 py-1 rounded-full">Berlaku</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Tdk Berlaku</span>
                  )}
                </div>
              </div>

              {/* Dua slot upload: Depan & Belakang */}
              <div className="grid grid-cols-2 gap-4">
                <ImageUploadSlot
                  currencyCode={currency.code}
                  denomValue={d.value}
                  side="front"
                  label="🖼️ Depan (Obverse)"
                  gradient={gradient}
                />
                <ImageUploadSlot
                  currencyCode={currency.code}
                  denomValue={d.value}
                  side="back"
                  label="🖼️ Belakang (Reverse)"
                  gradient={gradient}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info ukuran storage */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700">
        <div className="font-semibold mb-1">⚠️ Catatan Penyimpanan</div>
        Gambar disimpan sebagai base64 di <strong>LocalStorage</strong> browser ini.
        Kapasitas biasanya <strong>5–10 MB total</strong> per domain.
        Untuk gambar berkualitas tinggi, kompres terlebih dahulu (rekomendasi: JPG, maks 800×400 px, &lt;500 KB per gambar).
        Gambar <strong>tidak akan hilang</strong> selama tidak me-reset data atau membersihkan cache browser.
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 3 — Edit Materi Mata Uang & Denominasi
// ══════════════════════════════════════════════════════════════
function EditCurrencyPanel() {
  const { currencies, deleteCurrency, addDenomination, updateDenomination } = useApp();
  const [selectedId, setSelectedId] = useState(currencies[0]?.id || '');
  const [denomDraft, setDenomDraft] = useState(EmptyDenomForm());
  const [editingDenomValue, setEditingDenomValue] = useState(null);
  const [saved, setSaved] = useState(false);

  const currency = currencies.find((c) => c.id === selectedId);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const startEditDenom = (d) => {
    setEditingDenomValue(d.value);
    setDenomDraft({
      ...d,
      yearIssued: d.yearIssued.join(', '),
      invalidYears: (d.invalidYears || []).join(', '),
    });
  };

  const saveDenom = () => {
    const parsed = {
      ...denomDraft,
      value: Number(denomDraft.value),
      label: denomDraft.label || `${denomDraft.value}`,
      yearIssued: denomDraft.yearIssued.split(',').map((y) => y.trim()).filter(Boolean).map(Number),
      latestEmission: Number(denomDraft.latestEmission) || null,
      invalidYears: denomDraft.invalidYears.split(',').map((y) => y.trim()).filter(Boolean),
    };
    if (editingDenomValue !== null) {
      updateDenomination(currency.id, editingDenomValue, parsed);
    } else {
      addDenomination(currency.id, parsed);
    }
    setDenomDraft(EmptyDenomForm());
    setEditingDenomValue(null);
    flash();
  };

  const toggleValidity = (d) => {
    updateDenomination(currency.id, d.value, { ...d, isValid: !d.isValid });
    flash();
  };

  if (!currency) return <div className="text-sm text-gray-400">Belum ada mata uang untuk diedit.</div>;

  return (
    <div className="space-y-5">
      {saved && <div className="p-3 bg-mint-50 text-mint-600 text-sm rounded-xl">✓ Perubahan berhasil disimpan.</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setEditingDenomValue(null); setDenomDraft(EmptyDenomForm()); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
          >
            {currencies.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.code})</option>)}
          </select>
          <button
            onClick={() => { if (window.confirm(`Hapus mata uang ${currency.name}?`)) deleteCurrency(currency.id); }}
            className="text-xs text-red-500 hover:underline whitespace-nowrap"
          >
            Hapus mata uang ini
          </button>
        </div>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status Validitas Denominasi</div>
        <div className="space-y-2 mb-2">
          {currency.denominations.map((d) => (
            <div key={d.value} className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-700">{d.label}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleValidity(d)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.isValid ? 'bg-mint-100 text-mint-600' : 'bg-red-100 text-red-600'}`}
                >
                  {d.isValid ? 'Berlaku' : 'Tidak Berlaku'}
                </button>
                <button onClick={() => startEditDenom(d)} className="text-xs text-primary-500 hover:underline">Edit</button>
              </div>
            </div>
          ))}
          {currency.denominations.length === 0 && (
            <div className="text-xs text-gray-400 italic">Belum ada denominasi. Tambahkan di bawah.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-4">
          {editingDenomValue !== null ? `Edit Denominasi: ${denomDraft.label}` : 'Tambah Denominasi Baru'}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input value={denomDraft.value} onChange={(e) => setDenomDraft({ ...denomDraft, value: e.target.value })} placeholder="Nilai nominal (angka)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.label} onChange={(e) => setDenomDraft({ ...denomDraft, label: e.target.value })} placeholder="Label (contoh: $100)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.figure} onChange={(e) => setDenomDraft({ ...denomDraft, figure: e.target.value })} placeholder="Tokoh pada uang" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.colorDesc} onChange={(e) => setDenomDraft({ ...denomDraft, colorDesc: e.target.value })} placeholder="Deskripsi warna" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.yearIssued} onChange={(e) => setDenomDraft({ ...denomDraft, yearIssued: e.target.value })} placeholder="Tahun emisi (pisahkan koma)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.latestEmission} onChange={(e) => setDenomDraft({ ...denomDraft, latestEmission: e.target.value })} placeholder="Emisi terbaru" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={denomDraft.invalidYears} onChange={(e) => setDenomDraft({ ...denomDraft, invalidYears: e.target.value })} placeholder="Emisi ditarik (pisahkan koma)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 sm:col-span-2" />
          <textarea value={denomDraft.notes} onChange={(e) => setDenomDraft({ ...denomDraft, notes: e.target.value })} placeholder="Catatan instruksi kerja" rows={2} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 sm:col-span-2 resize-none" />
        </div>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fitur Keamanan</div>
        {denomDraft.securityFeatures.map((f, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <select
              value={f.method}
              onChange={(e) => {
                const next = [...denomDraft.securityFeatures];
                next[i] = { ...next[i], method: e.target.value };
                setDenomDraft({ ...denomDraft, securityFeatures: next });
              }}
              className="px-2 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none"
            >
              {['Dilihat', 'Diraba', 'Diterawang', 'UV Light', 'Microprinting'].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              value={f.desc}
              onChange={(e) => {
                const next = [...denomDraft.securityFeatures];
                next[i] = { ...next[i], desc: e.target.value };
                setDenomDraft({ ...denomDraft, securityFeatures: next });
              }}
              placeholder="Deskripsi ciri keamanan"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setDenomDraft({ ...denomDraft, securityFeatures: [...denomDraft.securityFeatures, { method: 'Dilihat', desc: '' }] })}
          className="text-xs text-primary-500 hover:underline mb-4"
        >
          + Tambah ciri keamanan
        </button>

        <div className="flex gap-2">
          <button onClick={saveDenom} className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium shadow-sm hover:bg-primary-600">
            {editingDenomValue !== null ? 'Simpan Perubahan' : 'Tambah Denominasi'}
          </button>
          {editingDenomValue !== null && (
            <button onClick={() => { setEditingDenomValue(null); setDenomDraft(EmptyDenomForm()); }} className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 4 — Manajemen FAQ
// ══════════════════════════════════════════════════════════════
function FaqAdminPanel() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ category: 'Operasional', question: '', answer: '', tags: '' });

  const startEdit = (f) => { setEditingId(f.id); setDraft({ ...f, tags: (f.tags || []).join(', ') }); };

  const save = () => {
    if (!draft.question.trim() || !draft.answer.trim()) return;
    const payload = { ...draft, tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    if (editingId) updateFaq({ ...payload, id: editingId });
    else addFaq(payload);
    setEditingId(null);
    setDraft({ category: 'Operasional', question: '', answer: '', tags: '' });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-4">{editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}</div>
        <div className="grid gap-3">
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Kategori" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} placeholder="Pertanyaan" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <textarea value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} placeholder="Jawaban" rows={4} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
          <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="Tags (pisahkan koma)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium shadow-sm hover:bg-primary-600">
            {editingId ? 'Simpan Perubahan' : 'Tambah FAQ'}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setDraft({ category: 'Operasional', question: '', answer: '', tags: '' }); }} className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-4">Daftar FAQ ({faqs.length})</div>
        <div className="space-y-2">
          {faqs.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-700 truncate">{f.question}</div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => startEdit(f)} className="text-xs text-primary-500 hover:underline">Edit</button>
                <button onClick={() => deleteFaq(f.id)} className="text-xs text-red-500 hover:underline">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Root Export — AdminCMS dengan 4 tab
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// TAB 5 — Update Kurs (Manual + CSV Upload)
// ══════════════════════════════════════════════════════════════
const RATE_CURRENCIES = ['USD','SGD','EUR','GBP','JPY','AUD','CNY','SAR','HKD','MYR'];
const SPREAD_TT  = 0.008;
const SPREAD_UKA = 0.018;

function buildRateFromMid(code, mid) {
  const m = Number(mid);
  return {
    code, mid: m,
    ttBuy:  Math.round(m * (1 - SPREAD_TT)),
    ttSell: Math.round(m * (1 + SPREAD_TT)),
    ukaBuy: Math.round(m * (1 - SPREAD_UKA)),
    ukaSell:Math.round(m * (1 + SPREAD_UKA)),
    updatedAt: new Date().toISOString(),
  };
}

function RateAdminPanel() {
  const { rates, setRates, ratesHistory, setRatesHistory } = useApp();
  const fileRef = useRef(null);
  const [manualMids, setManualMids] = useState(
    () => Object.fromEntries((rates || INITIAL_RATES).map((r) => [r.code, r.mid]))
  );
  const [saved, setSaved] = useState(false);
  const [parseMsg, setParseMsg] = useState(null);

  const flash = (msg) => { setSaved(true); setParseMsg(msg || null); setTimeout(() => { setSaved(false); setParseMsg(null); }, 3500); };

  // Simpan kurs manual
  const saveManual = () => {
    const newRates = RATE_CURRENCIES.map((code) => buildRateFromMid(code, manualMids[code] || 0));
    setRates(newRates);
    saveToStorage(EXTRA_STORAGE_KEYS.RATES, newRates);
    // Tambahkan ke historis hari ini
    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today };
    RATE_CURRENCIES.forEach((code) => { entry[code] = Number(manualMids[code] || 0); });
    const hist = [...(ratesHistory || INITIAL_RATES_HISTORY).filter((h) => h.date !== today), entry];
    setRatesHistory(hist);
    saveToStorage(EXTRA_STORAGE_KEYS.RATES_HISTORY, hist);
    flash('Kurs berhasil diperbarui.');
  };

  // Download template CSV
  const downloadTemplate = () => {
    const header = 'code,mid\n';
    const rows = RATE_CURRENCIES.map((c) => `${c},${manualMids[c] || 0}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template_kurs_ceod.csv';
    a.click();
  };

  // Upload CSV via FileReader + PapaParse
  const handleCSV = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = Papa.parse(ev.target.result, { header: true, skipEmptyLines: true });
      const updates = {};
      let count = 0;
      result.data.forEach((row) => {
        const code = (row.code || row.CODE || '').toUpperCase().trim();
        const mid  = parseFloat(row.mid || row.MID || 0);
        if (RATE_CURRENCIES.includes(code) && mid > 0) { updates[code] = mid; count++; }
      });
      if (count === 0) { setParseMsg('⚠️ Tidak ada data valid ditemukan. Pastikan kolom: code, mid'); return; }
      const merged = { ...manualMids, ...updates };
      setManualMids(merged);
      flash(`✓ ${count} mata uang berhasil di-parse dari CSV. Klik "Simpan" untuk menyimpan.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [manualMids]);

  return (
    <div className="space-y-5">
      {(saved || parseMsg) && (
        <div className={`p-3 rounded-xl text-sm ${parseMsg?.startsWith('⚠️') ? 'bg-amber-50 text-amber-700' : 'bg-mint-50 text-mint-600'}`}>
          {parseMsg || '✓ Perubahan berhasil disimpan.'}
        </div>
      )}

      {/* Upload CSV */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-3">Import Kurs dari CSV</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={downloadTemplate} className="flex-1 py-2.5 rounded-xl border border-primary-200 bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100">
            📥 Download Template CSV
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 py-2.5 rounded-xl border border-mint-200 bg-mint-50 text-mint-600 text-sm font-medium hover:bg-mint-100">
            📤 Upload CSV / Excel
          </button>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleCSV} className="hidden" />
        </div>
        <div className="mt-2 text-[11px] text-gray-400">Format kolom: <code className="bg-gray-100 px-1 rounded">code</code> (USD/SGD/...) dan <code className="bg-gray-100 px-1 rounded">mid</code> (kurs tengah IDR)</div>
      </div>

      {/* Form manual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-1">Input Manual Kurs Tengah (IDR)</div>
        <div className="text-xs text-gray-400 mb-4">Spread otomatis: TT ±0.8%, UKA ±1.8%</div>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {RATE_CURRENCIES.map((code) => (
            <div key={code} className="flex items-center gap-2">
              <span className="w-12 text-xs font-bold text-gray-600 flex-shrink-0">{code}</span>
              <input
                type="number"
                value={manualMids[code] || ''}
                onChange={(e) => setManualMids((prev) => ({ ...prev, [code]: e.target.value }))}
                placeholder="Kurs tengah IDR"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          ))}
        </div>
        <button onClick={saveManual} className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold shadow-sm hover:bg-primary-600">
          💾 Simpan & Perbarui Kurs
        </button>
      </div>

      {/* Preview hasil */}
      {rates?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 text-sm font-semibold text-gray-700">Preview Kurs Saat Ini</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['Kode','Mid','TT Beli','TT Jual','UKA Beli','UKA Jual'].map((h) => <th key={h} className="text-left p-3 text-[10px] font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.code} className="border-b border-gray-50 last:border-0">
                    <td className="p-3 font-bold text-gray-700">{r.code}</td>
                    <td className="p-3 text-gray-500">{r.mid?.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-mint-600">{r.ttBuy?.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-red-500">{r.ttSell?.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-mint-700">{r.ukaBuy?.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-red-400">{r.ukaSell?.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 6 — Kelola Berita / Pengumuman
// ══════════════════════════════════════════════════════════════
const EMPTY_NEWS = { title: '', category: 'Operasional', priority: 'medium', content: '', author: '', date: new Date().toISOString().slice(0, 10), tags: '' };
const NEWS_CATEGORIES = ['Regulasi', 'Keamanan', 'Operasional', 'Kepatuhan', 'Umum'];

function NewsAdminPanel() {
  const { news, addNews, updateNews, deleteNews } = useApp();
  const [editing, setEditing] = useState(null); // null = tambah baru, id = edit
  const [draft, setDraft] = useState(EMPTY_NEWS);

  const startEdit = (item) => {
    setEditing(item.id);
    setDraft({ ...item, tags: (item.tags || []).join(', ') });
  };
  const cancelEdit = () => { setEditing(null); setDraft(EMPTY_NEWS); };

  const save = () => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    const payload = { ...draft, tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    if (editing !== null) updateNews({ ...payload, id: editing });
    else addNews(payload);
    cancelEdit();
  };

  return (
    <div className="space-y-5">
      {/* Form tambah/edit */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-4">{editing !== null ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input value={draft.title} onChange={(e) => setDraft({...draft, title: e.target.value})} placeholder="Judul pengumuman" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 sm:col-span-2" />
          <select value={draft.category} onChange={(e) => setDraft({...draft, category: e.target.value})} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
            {NEWS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraft({...draft, priority: e.target.value})} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:ring-2 focus:ring-primary-300">
            <option value="high">⚠️ Penting / High</option>
            <option value="medium">ℹ️ Info / Medium</option>
            <option value="low">📄 Umum / Low</option>
          </select>
          <input value={draft.author} onChange={(e) => setDraft({...draft, author: e.target.value})} placeholder="Penulis / Unit" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <input type="date" value={draft.date} onChange={(e) => setDraft({...draft, date: e.target.value})} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
          <textarea value={draft.content} onChange={(e) => setDraft({...draft, content: e.target.value})} placeholder="Isi pengumuman lengkap..." rows={6} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 resize-none sm:col-span-2" />
          <input value={draft.tags} onChange={(e) => setDraft({...draft, tags: e.target.value})} placeholder="Tags (pisahkan koma)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300 sm:col-span-2" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium shadow-sm hover:bg-primary-600">
            {editing !== null ? 'Simpan Perubahan' : '+ Publikasikan'}
          </button>
          {editing !== null && <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Batal</button>}
        </div>
      </div>

      {/* Daftar berita */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-4">Daftar Pengumuman ({(news || []).length})</div>
        <div className="space-y-2">
          {(news || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">{item.title}</div>
                <div className="text-[10px] text-gray-400">{item.category} · {item.date} · {item.priority === 'high' ? '⚠️ Penting' : item.priority === 'medium' ? 'ℹ️ Info' : '📄 Umum'}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(item)} className="text-xs text-primary-500 hover:underline">Edit</button>
                <button onClick={() => { if (window.confirm('Hapus pengumuman ini?')) deleteNews(item.id); }} className="text-xs text-red-500 hover:underline">Hapus</button>
              </div>
            </div>
          ))}
          {!(news || []).length && <div className="text-sm text-gray-400 italic text-center py-4">Belum ada pengumuman.</div>}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 7 — Upload Data & Likuiditas Cabang
// ══════════════════════════════════════════════════════════════
const BRANCH_COLUMNS = 'code,name,region,type,idrLiq,usdLiq,eurLiq';
const LIQUIDITY_COLUMNS = 'code,idrLiq,usdLiq,eurLiq';

function BranchAdminPanel() {
  const { branches, setBranches } = useApp();
  const masterRef = useRef(null);
  const liqRef = useRef(null);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('success');

  const flash = (text, type = 'success') => { setMsg(text); setMsgType(type); setTimeout(() => setMsg(null), 4000); };

  const downloadSampleMaster = () => {
    const sample = `code,name,region,type,idrLiq,usdLiq,eurLiq
BTN-KC-XXX-001,KC Kota Baru,DKI Jakarta,KC,5000000000,150000,30000
BTN-KCP-XXX-001,KCP Kota Baru A,DKI Jakarta,KCP,800000000,20000,5000`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template_master_cabang.csv';
    a.click();
  };

  const downloadSampleLiquidity = () => {
    const rows = (branches || []).slice(0, 5).map((b) => `${b.code},${b.idrLiq},${b.usdLiq},${b.eurLiq}`).join('\n');
    const blob = new Blob([LIQUIDITY_COLUMNS + '\n' + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template_update_likuiditas.csv';
    a.click();
  };

  // Upload master data cabang baru
  const handleMasterUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = Papa.parse(ev.target.result, { header: true, skipEmptyLines: true, dynamicTyping: true });
      const newBranches = result.data
        .filter((row) => row.code && row.name)
        .map((row) => ({
          code: String(row.code).trim(),
          name: String(row.name).trim(),
          region: String(row.region || '').trim(),
          type: String(row.type || 'KC').trim(),
          idrLiq: Number(row.idrLiq || 0),
          usdLiq: Number(row.usdLiq || 0),
          eurLiq: Number(row.eurLiq || 0),
          updatedAt: new Date().toISOString().slice(0, 10),
        }));
      if (!newBranches.length) { flash('⚠️ Tidak ada data valid ditemukan. Periksa format kolom.', 'warn'); return; }
      // Merge: cabang baru ditambahkan, yang sudah ada di-overwrite
      const existingCodes = new Set(newBranches.map((b) => b.code));
      const merged = [
        ...(branches || []).filter((b) => !existingCodes.has(b.code)),
        ...newBranches,
      ];
      setBranches(merged);
      saveToStorage(EXTRA_STORAGE_KEYS.BRANCHES, merged);
      flash(`✓ ${newBranches.length} cabang berhasil diimpor/diperbarui.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Upload update likuiditas saja (hanya update field idrLiq, usdLiq, eurLiq)
  const handleLiquidityUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = Papa.parse(ev.target.result, { header: true, skipEmptyLines: true, dynamicTyping: true });
      let count = 0;
      const today = new Date().toISOString().slice(0, 10);
      const updated = (branches || []).map((b) => {
        const row = result.data.find((r) => String(r.code).trim() === b.code);
        if (!row) return b;
        count++;
        return {
          ...b,
          idrLiq: Number(row.idrLiq ?? b.idrLiq),
          usdLiq: Number(row.usdLiq ?? b.usdLiq),
          eurLiq: Number(row.eurLiq ?? b.eurLiq),
          updatedAt: today,
        };
      });
      if (!count) { flash('⚠️ Tidak ada kode cabang yang cocok ditemukan.', 'warn'); return; }
      setBranches(updated);
      saveToStorage(EXTRA_STORAGE_KEYS.BRANCHES, updated);
      flash(`✓ ${count} cabang berhasil diperbarui nominalnya.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      {msg && (
        <div className={`p-3 rounded-xl text-sm ${msgType === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-mint-50 text-mint-600'}`}>{msg}</div>
      )}

      {/* Upload master cabang */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-1">📂 Import Master Data Cabang</div>
        <div className="text-xs text-gray-400 mb-3">Upload CSV berisi daftar KC/KCP baru atau data yang diperbarui. Kode yang sudah ada akan di-overwrite.</div>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <button onClick={downloadSampleMaster} className="flex-1 py-2.5 rounded-xl border border-primary-200 bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100">
            📥 Download Template Master
          </button>
          <button onClick={() => masterRef.current?.click()} className="flex-1 py-2.5 rounded-xl border border-mint-200 bg-mint-50 text-mint-600 text-sm font-medium hover:bg-mint-100">
            📤 Upload CSV Master
          </button>
          <input ref={masterRef} type="file" accept=".csv" onChange={handleMasterUpload} className="hidden" />
        </div>
        <div className="text-[11px] text-gray-400">Kolom wajib: <code className="bg-gray-100 px-1 rounded">{BRANCH_COLUMNS}</code></div>
      </div>

      {/* Upload update likuiditas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-1">💰 Update Nominal Likuiditas Berkala</div>
        <div className="text-xs text-gray-400 mb-3">Upload CSV berisi kode cabang dan nominal saldo terbaru. Hanya kolom nominal yang diperbarui, data cabang lainnya tidak berubah.</div>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <button onClick={downloadSampleLiquidity} className="flex-1 py-2.5 rounded-xl border border-primary-200 bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100">
            📥 Download Template Likuiditas
          </button>
          <button onClick={() => liqRef.current?.click()} className="flex-1 py-2.5 rounded-xl border border-accent-200 bg-accent-50 text-accent-600 text-sm font-medium hover:bg-accent-100">
            📤 Upload CSV Likuiditas
          </button>
          <input ref={liqRef} type="file" accept=".csv" onChange={handleLiquidityUpload} className="hidden" />
        </div>
        <div className="text-[11px] text-gray-400">Kolom wajib: <code className="bg-gray-100 px-1 rounded">{LIQUIDITY_COLUMNS}</code></div>
      </div>

      {/* Ringkasan cabang terdaftar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="font-semibold text-gray-700 mb-3">Database Cabang Terdaftar ({(branches || []).length})</div>
        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                {['Kode', 'Nama', 'Wilayah', 'Tipe', 'IDR Likuiditas', 'Update'].map((h) => (
                  <th key={h} className="text-left p-2 text-[10px] font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(branches || []).map((b) => (
                <tr key={b.code} className="border-b border-gray-50 last:border-0">
                  <td className="p-2 font-mono text-gray-500 text-[10px]">{b.code}</td>
                  <td className="p-2 text-gray-700">{b.name}</td>
                  <td className="p-2 text-gray-500">{b.region}</td>
                  <td className="p-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${b.type === 'KC' ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'}`}>{b.type}</span></td>
                  <td className="p-2 text-gray-600">{b.idrLiq?.toLocaleString('id-ID')}</td>
                  <td className="p-2 text-gray-400">{b.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Root Export — AdminCMS dengan 7 tab total
// ══════════════════════════════════════════════════════════════
export default function AdminCMS() {
  const [tab, setTab] = useState('update-kurs');

  const TAB_GROUPS = [
    {
      label: 'Data & Konten',
      tabs: [
        { id: 'update-kurs',   label: '📊 Update Kurs' },
        { id: 'kelola-berita', label: '📢 Kelola Berita' },
        { id: 'cabang',        label: '🏦 Data Cabang' },
      ],
    },
    {
      label: 'Valas & Materi',
      tabs: [
        { id: 'upload-gambar', label: '🖼️ Upload Gambar' },
        { id: 'tambah-valas',  label: '➕ Tambah Valas' },
        { id: 'edit-valas',    label: '✏️ Edit Materi' },
        { id: 'faq',           label: '❓ Kelola FAQ' },
      ],
    },
  ];


  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Manajemen CMS</h1>
        <p className="text-sm text-gray-400">Khusus Supervisor/Admin — kelola materi, kurs, berita, dan data cabang</p>
      </div>

      {/* Tab groups */}
      <div className="space-y-2 mb-6">
        {TAB_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1">{group.label}</div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
              {group.tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 min-w-max px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    tab === t.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tab === 'update-kurs'   && <RateAdminPanel />}
      {tab === 'kelola-berita' && <NewsAdminPanel />}
      {tab === 'cabang'        && <BranchAdminPanel />}
      {tab === 'upload-gambar' && <ImageUploadPanel />}
      {tab === 'tambah-valas'  && <AddCurrencyForm />}
      {tab === 'edit-valas'    && <EditCurrencyPanel />}
      {tab === 'faq'           && <FaqAdminPanel />}
    </div>
  );
}
