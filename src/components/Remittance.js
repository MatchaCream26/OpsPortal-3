// ============================================================
// Remittance.js — Transfer Luar Negeri: TT/SWIFT, Compliance
// ============================================================
import React, { useState } from 'react';

// ─── Data statis ─────────────────────────────────────────────
const COST_TYPES = [
  {
    code: 'OUR',
    label: 'OUR',
    color: 'bg-primary-50 border-primary-200 text-primary-700',
    badge: 'bg-primary-100 text-primary-600',
    icon: '🏦',
    desc: 'Seluruh biaya (biaya bank pengirim + biaya bank koresponden + biaya bank penerima) ditanggung oleh PENGIRIM.',
    tip: 'Penerima mendapat jumlah penuh. Cocok saat pengirim ingin memastikan nominal penuh sampai ke tujuan.',
    example: 'Nasabah kirim USD 10.000 → Penerima terima penuh USD 10.000. Nasabah membayar USD 10.000 + biaya.',
  },
  {
    code: 'BEN',
    label: 'BEN (Beneficiary)',
    color: 'bg-mint-50 border-mint-200 text-mint-700',
    badge: 'bg-mint-100 text-mint-600',
    icon: '🎁',
    desc: 'Seluruh biaya ditanggung oleh PENERIMA (beneficiary). Biaya dipotong dari nominal yang diterima.',
    tip: 'Pengirim tidak dikenakan biaya ekstra. Namun penerima mendapat kurang dari nominal yang dikirim.',
    example: 'Nasabah kirim USD 10.000 → Penerima mendapat ±USD 9.950 setelah biaya dipotong.',
  },
  {
    code: 'SHA',
    label: 'SHA (Shared)',
    color: 'bg-accent-50 border-accent-200 text-accent-700',
    badge: 'bg-accent-100 text-accent-600',
    icon: '🤝',
    desc: 'Biaya dibagi: bank pengirim dibebankan ke pengirim, biaya bank koresponden & penerima ke penerima.',
    tip: 'Paling umum digunakan untuk transaksi B2B internasional. Biaya paling transparan.',
    example: 'Nasabah kirim USD 10.000 + bayar biaya BTN. Penerima dapat ±USD 9.960 setelah biaya koresponden.',
  },
];

const SWIFT_STEPS = [
  { no: 1, actor: 'Nasabah', icon: '👤', step: 'Mengisi Formulir TT', detail: 'Nasabah melengkapi form Transfer Luar Negeri: nama & rekening penerima, nama bank penerima, kode SWIFT/BIC bank penerima, negara tujuan, nominal & mata uang, tujuan pengiriman (underlying), dan tipe biaya (OUR/BEN/SHA).' },
  { no: 2, actor: 'Teller/CS', icon: '🧑‍💼', step: 'Verifikasi KYC & Dokumen', detail: 'Petugas verifikasi identitas pengirim (KTP/Paspor), tujuan transfer, dan underlying document (invoice, kontrak, SPPD, dll) sesuai ketentuan BI. Threshold: >USD 10.000 wajib underlying dokumen.' },
  { no: 3, actor: 'Sistem', icon: '🖥️', step: 'Sanction Screening', detail: 'Sistem memindai nama pengirim dan penerima terhadap daftar sanksi global: OFAC, UN Security Council, EU Consolidated List. Jika ada hit → transaksi ditahan dan dilaporkan ke Compliance.' },
  { no: 4, actor: 'Bank BTN', icon: '🏦', step: 'Pengiriman Pesan SWIFT', detail: 'BTN mengirimkan pesan SWIFT MT103 (transfer dana) ke bank koresponden (correspondent bank) melalui jaringan SWIFT. Pesan berisi semua detail transaksi terenkripsi.' },
  { no: 5, actor: 'Correspondent Bank', icon: '🌐', step: 'Proses via Bank Koresponden', detail: 'Bank koresponden (biasanya di negara tujuan atau negara mata uang tersebut) menerima instruksi dan meneruskan dana ke bank penerima akhir. Biaya koresponden dipotong sesuai tipe biaya (OUR/BEN/SHA).' },
  { no: 6, actor: 'Bank Penerima', icon: '🏛️', step: 'Kredit ke Rekening Penerima', detail: 'Bank penerima mengkredit rekening beneficiary sesuai instruksi MT103. Waktu penyelesaian: 1–3 hari kerja (T+1 untuk major currency, T+2–3 untuk minor/exotic).' },
  { no: 7, actor: 'Sistem & Teller', icon: '✅', step: 'Konfirmasi & Bukti TT', detail: 'Nasabah menerima bukti TT (struk) dengan nomor referensi SWIFT. Jika diperlukan, nasabah dapat meminta "SWIFT Confirmation Copy" sebagai bukti pengiriman.' },
];

const COMPLIANCE_RULES = [
  {
    title: 'KYC — Know Your Customer',
    icon: '🪪',
    color: 'border-primary-200 bg-primary-50',
    items: [
      'Verifikasi identitas pengirim dengan KTP/Paspor yang masih berlaku',
      'Konfirmasi sumber dana (gaji, tabungan, hasil usaha, dll)',
      'Tujuan pengiriman harus jelas dan sesuai profil nasabah',
      'Nasabah baru wajib mengisi formulir profil dan CDD sebelum TT pertama',
    ],
  },
  {
    title: 'CDD/EDD — Customer & Enhanced Due Diligence',
    icon: '🔍',
    color: 'border-mint-200 bg-mint-50',
    items: [
      'CDD wajib untuk SEMUA nasabah transfer luar negeri',
      'EDD wajib untuk: Politically Exposed Persons (PEP), negara high-risk (FATF grey/black list), transaksi >USD 25.000',
      'EDD memerlukan persetujuan Supervisor/Manager Cabang',
      'Dokumentasi EDD disimpan minimal 5 tahun',
    ],
  },
  {
    title: 'Sanction List Checking',
    icon: '🚫',
    color: 'border-red-200 bg-red-50',
    items: [
      'Cek wajib terhadap: OFAC SDN List, UN Consolidated List, EU Sanctions List',
      'Cek nama PENGIRIM dan PENERIMA sebelum memproses',
      'Jika ada partial match: tahan transaksi, lapor Compliance dalam 1x24 jam',
      'Jika confirmed hit: tolak transaksi, buat STR (Suspicious Transaction Report)',
    ],
  },
  {
    title: 'Underlying Document & Threshold',
    icon: '📋',
    color: 'border-accent-200 bg-accent-50',
    items: [
      'Transfer ≤ USD 10.000: Cukup pernyataan tujuan transfer',
      'Transfer > USD 10.000 s.d. USD 25.000: Wajib deklarasi underlying dokumen',
      'Transfer > USD 25.000: Wajib menyerahkan FISIK underlying dokumen (invoice, kontrak, SPK, dll)',
      'Transfer untuk biaya pendidikan/kesehatan: Lampirkan surat penerimaan/tagihan resmi',
    ],
  },
];

const SWIFT_CORRIDORS = [
  { region: 'Amerika (USD)', time: 'T+1', risk: 'low', bank: 'JP Morgan Chase, Citibank NY' },
  { region: 'Eropa (EUR)', time: 'T+1–2', risk: 'low', bank: 'Deutsche Bank, BNP Paribas' },
  { region: 'Inggris (GBP)', time: 'T+1–2', risk: 'low', bank: 'HSBC London, Barclays' },
  { region: 'Singapura (SGD)', time: 'T+1', risk: 'low', bank: 'DBS Bank, OCBC' },
  { region: 'Australia (AUD)', time: 'T+1–2', risk: 'low', bank: 'ANZ, Westpac' },
  { region: 'Jepang (JPY)', time: 'T+1–2', risk: 'low', bank: 'MUFG, Sumitomo Mitsui' },
  { region: 'China (CNY)', time: 'T+2–3', risk: 'medium', bank: 'Bank of China, ICBC' },
  { region: 'Arab Saudi (SAR)', time: 'T+2–3', risk: 'medium', bank: 'Al Rajhi Bank, NCB' },
  { region: 'Hong Kong (HKD)', time: 'T+1–2', risk: 'low', bank: 'HSBC HK, Hang Seng' },
  { region: 'Malaysia (MYR)', time: 'T+1–2', risk: 'low', bank: 'Maybank, CIMB' },
];

// ─── Sub-komponen ─────────────────────────────────────────────
function StepFlow() {
  const [activeStep, setActiveStep] = useState(null);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 className="font-display font-bold text-gray-800 mb-1">Alur Proses TT (Telegrafic Transfer)</h3>
      <p className="text-xs text-gray-400 mb-5">Klik setiap langkah untuk melihat detail prosedur</p>
      <div className="relative">
        {/* Garis vertikal penghubung */}
        <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-gray-100 md:hidden" />
        {SWIFT_STEPS.map((s, i) => {
          const isActive = activeStep === s.no;
          return (
            <div key={s.no} className="mb-2 last:mb-0">
              <button
                onClick={() => setActiveStep(isActive ? null : s.no)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  isActive ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-50 hover:bg-primary-50 text-gray-700'
                }`}
              >
                <span className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold shadow-sm ${
                  isActive ? 'bg-white/20' : 'bg-white border border-gray-200'
                }`}>
                  {isActive ? '▸' : s.no}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{s.actor}</div>
                  <div className="font-semibold text-sm truncate">{s.step}</div>
                </div>
                <span className="text-xl flex-shrink-0">{s.icon}</span>
              </button>
              {isActive && (
                <div className="mx-2 mb-2 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-gray-600 leading-relaxed animate-slide-up">
                  {s.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CostTypeCards() {
  return (
    <div className="mb-6">
      <h3 className="font-display font-bold text-gray-800 mb-1">Tipe Biaya Transfer: OUR / BEN / SHA</h3>
      <p className="text-xs text-gray-400 mb-4">Tentukan siapa yang menanggung biaya antar-bank</p>
      <div className="grid md:grid-cols-3 gap-4">
        {COST_TYPES.map((ct) => (
          <div key={ct.code} className={`rounded-2xl border p-4 ${ct.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{ct.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${ct.badge}`}>{ct.label}</span>
            </div>
            <p className="text-sm font-medium mb-2">{ct.desc}</p>
            <div className="bg-white/60 rounded-xl p-3 text-xs text-gray-500">
              <div className="font-semibold text-gray-600 mb-1">💡 Contoh:</div>
              {ct.example}
            </div>
            <div className="mt-2 text-[11px] text-gray-500 italic">📌 {ct.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="mb-6">
      <h3 className="font-display font-bold text-gray-800 mb-1">Panduan Kepatuhan (APU-PPT)</h3>
      <p className="text-xs text-gray-400 mb-4">Wajib dipahami sebelum memproses transfer luar negeri</p>
      <div className="space-y-2">
        {COMPLIANCE_RULES.map((rule, i) => (
          <div key={i} className={`border rounded-2xl overflow-hidden ${rule.color}`}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl">{rule.icon}</span>
              <span className="font-semibold text-gray-800 flex-1">{rule.title}</span>
              <span className={`text-gray-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="px-5 pb-4 space-y-2">
                {rule.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-mint-500 flex-shrink-0 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CorridorTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50">
        <h3 className="font-display font-bold text-gray-800">Koridor & Bank Koresponden Utama BTN</h3>
        <p className="text-xs text-gray-400 mt-1">Waktu penyelesaian estimasi (hari kerja)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Wilayah / Mata Uang</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Estimasi Waktu</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Bank Koresponden</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-400 uppercase">Risiko</th>
            </tr>
          </thead>
          <tbody>
            {SWIFT_CORRIDORS.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-700">{row.region}</td>
                <td className="p-3 text-gray-500">{row.time}</td>
                <td className="p-3 text-gray-500 text-xs">{row.bank}</td>
                <td className="p-3 text-center">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    row.risk === 'low'    ? 'bg-mint-50 text-mint-600' :
                    row.risk === 'medium' ? 'bg-accent-50 text-accent-600' :
                                           'bg-red-50 text-red-600'
                  }`}>
                    {row.risk === 'low' ? 'Rendah' : row.risk === 'medium' ? 'Sedang' : 'Tinggi'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Export utama ─────────────────────────────────────────────
export default function Remittance() {
  const [tab, setTab] = useState('alur');
  const tabs = [
    { id: 'alur', label: '🔀 Alur Proses TT' },
    { id: 'biaya', label: '💲 Tipe Biaya' },
    { id: 'compliance', label: '🛡️ Kepatuhan APU-PPT' },
    { id: 'koridor', label: '🌐 Koridor & Koresponden' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Transfer Luar Negeri (Remittance)</h1>
        <p className="text-sm text-gray-400">Panduan operasional TT melalui jaringan SWIFT, kepatuhan APU-PPT, dan koridor internasional</p>
      </div>

      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-5 md:p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="relative z-10 grid md:grid-cols-4 gap-4">
          {[
            { icon: '🌐', label: 'Jaringan SWIFT', val: '11.000+ institusi di 200+ negara' },
            { icon: '⚡', label: 'Pesan SWIFT', val: 'MT103 — Transfer Dana Individual' },
            { icon: '⏱️', label: 'Waktu Penyelesaian', val: 'T+1 s.d. T+3 hari kerja' },
            { icon: '🛡️', label: 'Threshold Underlying', val: 'Wajib > USD 10.000' },
          ].map((info) => (
            <div key={info.label} className="bg-white/10 rounded-2xl p-3">
              <div className="text-xl mb-1">{info.icon}</div>
              <div className="text-xs font-semibold opacity-80">{info.label}</div>
              <div className="text-sm font-bold mt-0.5">{info.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
        {tabs.map((t) => (
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

      {tab === 'alur' && <StepFlow />}
      {tab === 'biaya' && <CostTypeCards />}
      {tab === 'compliance' && <ComplianceSection />}
      {tab === 'koridor' && <CorridorTable />}
    </div>
  );
}
