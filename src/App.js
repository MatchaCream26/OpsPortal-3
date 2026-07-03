// ============================================================
// CEOD Portal - App.js (v2 — 8 modul)
// ============================================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  STORAGE_KEYS, EXTRA_STORAGE_KEYS,
  INITIAL_CURRENCIES, INITIAL_TRANSFERS, INITIAL_FAQ, INITIAL_FORUM,
  INITIAL_RATES, INITIAL_RATES_HISTORY, INITIAL_NEWS, INITIAL_BRANCHES,
  getFromStorage, saveToStorage,
} from './data/DataStore';

import Navbar        from './components/Navbar';
import Dashboard     from './components/Dashboard';
import CurrencyCatalog  from './components/CurrencyCatalog';
import CurrencyDetail   from './components/CurrencyDetail';
import DomesticTransfer from './components/DomesticTransfer';
import Remittance       from './components/Remittance';
import ExchangeRateChart from './components/ExchangeRateChart';
import Forum         from './components/Forum';
import FAQ           from './components/FAQ';
import NewsSection   from './components/NewsSection';
import BranchLiquidity  from './components/BranchLiquidity';
import AdminCMS      from './components/AdminCMS';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export default function App() {
  const [currentPage, setCurrentPage]       = useState('dashboard');
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // ── Data states ────────────────────────────────────────────
  const [currencies, setCurrencies] = useState(() =>
    getFromStorage(STORAGE_KEYS.CURRENCIES) || INITIAL_CURRENCIES);
  const [transfers]   = useState(() =>
    getFromStorage(STORAGE_KEYS.TRANSFERS)  || INITIAL_TRANSFERS);
  const [faqs, setFaqs] = useState(() =>
    getFromStorage(STORAGE_KEYS.FAQ)        || INITIAL_FAQ);
  const [forumPosts, setForumPosts] = useState(() =>
    getFromStorage(STORAGE_KEYS.FORUM)      || INITIAL_FORUM);

  // Modul baru
  const [rates, setRates] = useState(() =>
    getFromStorage(EXTRA_STORAGE_KEYS.RATES) || INITIAL_RATES);
  const [ratesHistory, setRatesHistory] = useState(() =>
    getFromStorage(EXTRA_STORAGE_KEYS.RATES_HISTORY) || INITIAL_RATES_HISTORY);
  const [news, setNews] = useState(() =>
    getFromStorage(EXTRA_STORAGE_KEYS.NEWS) || INITIAL_NEWS);
  const [branches, setBranches] = useState(() =>
    getFromStorage(EXTRA_STORAGE_KEYS.BRANCHES) || INITIAL_BRANCHES);

  const [globalSearch, setGlobalSearch] = useState('');

  // ── Persist ────────────────────────────────────────────────
  useEffect(() => { saveToStorage(STORAGE_KEYS.CURRENCIES, currencies); },   [currencies]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSFERS, transfers); },     [transfers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FAQ, faqs); },               [faqs]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FORUM, forumPosts); },       [forumPosts]);
  useEffect(() => { saveToStorage(EXTRA_STORAGE_KEYS.RATES, rates); },      [rates]);
  useEffect(() => { saveToStorage(EXTRA_STORAGE_KEYS.RATES_HISTORY, ratesHistory); }, [ratesHistory]);
  useEffect(() => { saveToStorage(EXTRA_STORAGE_KEYS.NEWS, news); },        [news]);
  useEffect(() => { saveToStorage(EXTRA_STORAGE_KEYS.BRANCHES, branches); }, [branches]);

  // ── Navigasi ───────────────────────────────────────────────
  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params.currencyId !== undefined) setSelectedCurrencyId(params.currencyId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── CRUD Currencies ────────────────────────────────────────
  const addCurrency = (c) => {
    const id = (c.code || c.id || '').toUpperCase();
    setCurrencies((p) => [...p, { ...c, id, code: id }]);
  };
  const updateCurrency   = (c) => setCurrencies((p) => p.map((x) => x.id === c.id ? c : x));
  const deleteCurrency   = (id) => setCurrencies((p) => p.filter((x) => x.id !== id));
  const addDenomination  = (cid, d) => setCurrencies((p) => p.map((x) =>
    x.id === cid ? { ...x, denominations: [...x.denominations, d] } : x));
  const updateDenomination = (cid, val, d) => setCurrencies((p) => p.map((x) =>
    x.id === cid ? { ...x, denominations: x.denominations.map((dd) => dd.value === val ? d : dd) } : x));

  // ── CRUD FAQ ───────────────────────────────────────────────
  const addFaq    = (f)  => setFaqs((p) => [...p, { ...f, id: Date.now() }]);
  const updateFaq = (f)  => setFaqs((p) => p.map((x) => x.id === f.id ? f : x));
  const deleteFaq = (id) => setFaqs((p) => p.filter((x) => x.id !== id));

  // ── CRUD Forum ─────────────────────────────────────────────
  const addForumTopic = (t) => {
    const n = { ...t, id: Date.now(), replies: [], timestamp: new Date().toISOString(), views: 0, likes: 0 };
    setForumPosts((p) => [n, ...p]);
    return n.id;
  };
  const addForumReply = (tid, content, author) => {
    const r = { id: Date.now(), author: author || 'Anonim', content, timestamp: new Date().toISOString() };
    setForumPosts((p) => p.map((t) => t.id === tid ? { ...t, replies: [...t.replies, r] } : t));
  };
  const likeForumTopic = (tid) => setForumPosts((p) =>
    p.map((t) => t.id === tid ? { ...t, likes: (t.likes || 0) + 1 } : t));
  const viewForumTopic = (tid) => setForumPosts((p) =>
    p.map((t) => t.id === tid ? { ...t, views: (t.views || 0) + 1 } : t));

  // ── CRUD News ──────────────────────────────────────────────
  const addNews    = (n)  => setNews((p) => [{ ...n, id: Date.now(), date: new Date().toISOString().slice(0,10) }, ...p]);
  const updateNews = (n)  => setNews((p) => p.map((x) => x.id === n.id ? n : x));
  const deleteNews = (id) => setNews((p) => p.filter((x) => x.id !== id));

  // ── Update Rates ───────────────────────────────────────────
  const updateRates = (newRates) => setRates(newRates);
  const updateRatesHistory = (newHistory) => setRatesHistory(newHistory);

  // ── CRUD Branches ──────────────────────────────────────────
  const setBranchesData    = (data)   => setBranches(data);
  const updateBranchLiquidity = (updates) => {
    setBranches((prev) => prev.map((b) => {
      const upd = updates.find((u) => u.code === b.code);
      return upd ? { ...b, ...upd } : b;
    }));
  };

  // ── Reset ──────────────────────────────────────────────────
  const resetAllData = () => {
    setCurrencies(INITIAL_CURRENCIES);
    setFaqs(INITIAL_FAQ);
    setForumPosts(INITIAL_FORUM);
    setRates(INITIAL_RATES);
    setRatesHistory(INITIAL_RATES_HISTORY);
    setNews(INITIAL_NEWS);
    setBranches(INITIAL_BRANCHES);
    [...Object.values(STORAGE_KEYS), ...Object.values(EXTRA_STORAGE_KEYS)]
      .forEach((k) => localStorage.removeItem(k));
  };

  // ── Context ────────────────────────────────────────────────
  const ctx = {
    // Data
    currencies, transfers, faqs, forumPosts,
    rates, ratesHistory, news, branches,
    // Nav
    currentPage, navigate, selectedCurrencyId,
    sidebarOpen, setSidebarOpen,
    // CRUD
    addCurrency, updateCurrency, deleteCurrency,
    addDenomination, updateDenomination,
    addFaq, updateFaq, deleteFaq,
    addForumTopic, addForumReply, likeForumTopic, viewForumTopic,
    addNews, updateNews, deleteNews,
    updateRates, updateRatesHistory,
    setBranchesData, updateBranchLiquidity,
    // Search
    globalSearch, setGlobalSearch,
    resetAllData,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':      return <Dashboard />;
      case 'katalog':        return <CurrencyCatalog />;
      case 'currency-detail': return <CurrencyDetail currencyId={selectedCurrencyId} />;
      case 'transfer':       return <DomesticTransfer />;
      case 'remittance':     return <Remittance />;
      case 'kurs':           return <ExchangeRateChart />;
      case 'forum':          return <Forum />;
      case 'faq':            return <FAQ />;
      case 'berita':         return <NewsSection />;
      case 'likuiditas':     return <BranchLiquidity />;
      case 'admin':          return <AdminCMS />;
      default:               return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar currentPage={currentPage} setCurrentPage={navigate} />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="md:pl-[260px] pt-14 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}
