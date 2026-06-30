// ============================================================
// AdminCMS.js — Manajemen CMS untuk Supervisor/Admin
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../App';

const CONTINENTS = ['Asia', 'Amerika', 'Eropa', 'Australia', 'Afrika'];

function EmptyDenomForm() {
  return {
    value: '', label: '', colorDesc: '', figure: '',
    yearIssued: '', latestEmission: '', isValid: true, invalidYears: '',
    securityFeatures: [{ method: 'Dilihat', desc: '' }],
    notes: '',
  };
}

// ── TAB: Tambah Mata Uang Baru ──────────────────────────────
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
      {saved && (
        <div className="mb-4 p-3 bg-mint-50 text-mint-600 text-sm rounded-xl flex items-center gap-2">
          ✓ Mata uang baru berhasil ditambahkan ke katalog.
        </div>
      )}
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

// ── TAB: Edit Materi Mata Uang & Denominasi ─────────────────
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
      {saved && (
        <div className="p-3 bg-mint-50 text-mint-600 text-sm rounded-xl">✓ Perubahan berhasil disimpan.</div>
      )}

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

// ── TAB: Manajemen FAQ ──────────────────────────────────────
function FaqAdminPanel() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ category: 'Operasional', question: '', answer: '', tags: '' });

  const startEdit = (f) => {
    setEditingId(f.id);
    setDraft({ ...f, tags: (f.tags || []).join(', ') });
  };

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
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Kategori (contoh: Valas, Transfer, Warkat)" className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary-300" />
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

export default function AdminCMS() {
  const [tab, setTab] = useState('tambah-valas');

  const tabs = [
    { id: 'tambah-valas', label: 'Tambah Mata Uang' },
    { id: 'edit-valas', label: 'Edit Materi & Denominasi' },
    { id: 'faq', label: 'Manajemen FAQ' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Manajemen CMS</h1>
        <p className="text-sm text-gray-400">Khusus Supervisor/Admin — kelola materi portal secara dinamis</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 flex-wrap">
        {tabs.map((t) => (
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

      {tab === 'tambah-valas' && <AddCurrencyForm />}
      {tab === 'edit-valas' && <EditCurrencyPanel />}
      {tab === 'faq' && <FaqAdminPanel />}
    </div>
  );
}
