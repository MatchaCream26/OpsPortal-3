// ============================================================
// AdminCMS.js — Manajemen CMS: Tambah/Edit Valas + Upload Gambar
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { imgKey } from './CurrencyDetail';

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
export default function AdminCMS() {
  const [tab, setTab] = useState('upload-gambar');

  const tabs = [
    { id: 'upload-gambar', label: '🖼️ Upload Gambar' },
    { id: 'tambah-valas', label: '➕ Tambah Mata Uang' },
    { id: 'edit-valas', label: '✏️ Edit Materi' },
    { id: 'faq', label: '❓ Kelola FAQ' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Manajemen CMS</h1>
        <p className="text-sm text-gray-400">Khusus Supervisor/Admin — kelola materi portal secara dinamis</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-max px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              tab === t.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upload-gambar' && <ImageUploadPanel />}
      {tab === 'tambah-valas' && <AddCurrencyForm />}
      {tab === 'edit-valas' && <EditCurrencyPanel />}
      {tab === 'faq' && <FaqAdminPanel />}
    </div>
  );
}
