// ============================================================
// ExchangeRateChart.js — Kurs Valas: Tabel Hari Ini + Historis Recharts
// ============================================================
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import {
  EXTRA_STORAGE_KEYS, INITIAL_RATES, INITIAL_RATES_HISTORY, getFromStorage,
} from '../data/DataStore';

// Warna per mata uang di grafik
const CURRENCY_COLORS = {
  USD: '#3B82F6', SGD: '#10B981', EUR: '#8B5CF6', GBP: '#F59E0B',
  JPY: '#EF4444', AUD: '#06B6D4', CNY: '#F97316', SAR: '#84CC16',
  HKD: '#EC4899', MYR: '#14B8A6',
};

const CURRENCIES = Object.keys(CURRENCY_COLORS);

function formatIDR(n) {
  if (!n) return '—';
  return n.toLocaleString('id-ID');
}

// ─── Tooltip kustom Recharts ──────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs min-w-[160px]">
      <div className="font-semibold text-gray-600 mb-2">📅 {label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
          <span style={{ color: p.color }} className="font-medium">{p.dataKey}</span>
          <span className="text-gray-700 font-semibold">Rp {p.value?.toLocaleString('id-ID')}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget tabel kurs (dipakai di Dashboard juga via export) ─
export function RateTable({ rates, compact = false }) {
  if (!rates?.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['Mata Uang', 'TT Beli', 'TT Jual', 'UKA Beli', 'UKA Jual'].map((h) => (
              <th key={h} className="text-left p-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rates.map((r) => (
            <tr key={r.code} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: CURRENCY_COLORS[r.code] || '#6B7280' }}
                  >
                    {r.code}
                  </span>
                  {!compact && <span className="text-gray-500 text-xs hidden sm:inline">{r.code}/IDR</span>}
                </div>
              </td>
              <td className="p-3 text-mint-600 font-semibold">{formatIDR(r.ttBuy)}</td>
              <td className="p-3 text-red-500 font-semibold">{formatIDR(r.ttSell)}</td>
              <td className="p-3 text-mint-700 font-medium">{formatIDR(r.ukaBuy)}</td>
              <td className="p-3 text-red-400 font-medium">{formatIDR(r.ukaSell)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Halaman penuh Exchange Rate ─────────────────────────────
export default function ExchangeRateChart() {
  const [rates] = useState(
    () => getFromStorage(EXTRA_STORAGE_KEYS.RATES) || INITIAL_RATES
  );
  const [history] = useState(
    () => getFromStorage(EXTRA_STORAGE_KEYS.RATES_HISTORY) || INITIAL_RATES_HISTORY
  );
  const [tab, setTab] = useState('tabel');
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'SGD', 'EUR']);
  const [range, setRange] = useState(7);

  const chartData = history.slice(-range).map((h) => ({
    ...h,
    date: h.date.slice(5), // tampilkan MM-DD saja
  }));

  const toggleCurrency = (code) => {
    setSelectedCurrencies((prev) =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter((c) => c !== code) : prev
        : [...prev, code]
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Kurs & Nilai Tukar Valas</h1>
        <p className="text-sm text-gray-400">
          Kurs hari ini · Diperbarui: {rates[0]?.updatedAt
            ? new Date(rates[0].updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            : '—'}
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl">
        {[
          { id: 'tabel', label: '📊 Kurs Hari Ini' },
          { id: 'historis', label: '📈 Historis & Grafik' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === t.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: TABEL KURS HARI INI */}
      {tab === 'tabel' && (
        <div className="space-y-4">
          {/* Highlight cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {rates.filter((r) => ['USD', 'SGD', 'EUR', 'GBP'].includes(r.code)).map((r) => (
              <div key={r.code} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-8 h-8 rounded-xl text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: CURRENCY_COLORS[r.code] }}
                  >
                    {r.code}
                  </span>
                  <span className="text-xs text-gray-400">vs IDR</span>
                </div>
                <div className="text-lg font-bold text-gray-800">{formatIDR(r.mid)}</div>
                <div className="text-[10px] text-gray-400 mt-1">TT Beli: {formatIDR(r.ttBuy)} · Jual: {formatIDR(r.ttSell)}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="font-semibold text-gray-700 text-sm">Tabel Lengkap 10 Mata Uang</div>
              <div className="text-[10px] text-gray-400 bg-mint-50 text-mint-600 px-2 py-1 rounded-full font-medium">
                TT = Telegrafic Transfer · UKA = Uang Kertas Asing
              </div>
            </div>
            <RateTable rates={rates} />
          </div>
        </div>
      )}

      {/* TAB: HISTORIS & GRAFIK */}
      {tab === 'historis' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
              <div className="font-semibold text-gray-700 text-sm">Pergerakan Kurs (IDR per 1 unit)</div>
              <div className="flex gap-2">
                {[7, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setRange(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      range === d ? 'bg-primary-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {d === 7 ? '7 Hari' : '30 Hari'}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency toggle */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  onClick={() => toggleCurrency(code)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    selectedCurrencies.includes(code)
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}
                  style={selectedCurrencies.includes(code) ? { background: CURRENCY_COLORS[code] } : {}}
                >
                  {code}
                </button>
              ))}
              <span className="text-[10px] text-gray-400 self-center ml-1">Klik untuk tampilkan/sembunyikan</span>
            </div>

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toLocaleString('id-ID')}
                  width={75}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                {selectedCurrencies.map((code) => (
                  <Line
                    key={code}
                    type="monotone"
                    dataKey={code}
                    stroke={CURRENCY_COLORS[code]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel ringkasan perubahan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 text-sm font-semibold text-gray-700">Perubahan dalam {range} Hari</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Mata Uang</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">{range}h lalu</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Hari ini</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Perubahan</th>
                  </tr>
                </thead>
                <tbody>
                  {CURRENCIES.filter((c) => selectedCurrencies.includes(c)).map((code) => {
                    const oldest = history[history.length - range]?.[code] || history[0]?.[code];
                    const latest = history[history.length - 1]?.[code];
                    const delta = latest - oldest;
                    const pct = ((delta / oldest) * 100).toFixed(2);
                    return (
                      <tr key={code} className="border-b border-gray-50 last:border-0">
                        <td className="p-3">
                          <span className="font-semibold text-gray-700 text-sm">{code}</span>
                        </td>
                        <td className="p-3 text-gray-500 text-xs">{oldest?.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-gray-700 font-medium text-xs">{latest?.toLocaleString('id-ID')}</td>
                        <td className="p-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            delta >= 0 ? 'text-red-600 bg-red-50' : 'text-mint-600 bg-mint-50'
                          }`}>
                            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toLocaleString('id-ID')} ({pct}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
