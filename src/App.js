// ============================================================
// CEOD Portal - App.js
// Komponen utama: routing, Context global, dan state management
// ============================================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  STORAGE_KEYS,
  INITIAL_CURRENCIES,
  INITIAL_TRANSFERS,
  INITIAL_FAQ,
  INITIAL_FORUM,
  getFromStorage,
  saveToStorage,
} from './data/DataStore';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CurrencyCatalog from './components/CurrencyCatalog';
import CurrencyDetail from './components/CurrencyDetail';
import DomesticTransfer from './components/DomesticTransfer';
import Forum from './components/Forum';
import FAQ from './components/FAQ';
import AdminCMS from './components/AdminCMS';

// ─── Context Global ─────────────────────────────────────────
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export default function App() {
  // ── Navigasi ──────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Data state, di-seed dari LocalStorage (fallback ke data awal) ──
  const [currencies, setCurrencies] = useState(() =>
    getFromStorage(STORAGE_KEYS.CURRENCIES) || INITIAL_CURRENCIES
  );
  const [transfers] = useState(() =>
    getFromStorage(STORAGE_KEYS.TRANSFERS) || INITIAL_TRANSFERS
  );
  const [faqs, setFaqs] = useState(() =>
    getFromStorage(STORAGE_KEYS.FAQ) || INITIAL_FAQ
  );
  const [forumPosts, setForumPosts] = useState(() =>
    getFromStorage(STORAGE_KEYS.FORUM) || INITIAL_FORUM
  );

  // ── Search & filter global ────────────────────────────────
  const [globalSearch, setGlobalSearch] = useState('');

  // ── Persist ke LocalStorage setiap kali data berubah ──────
  useEffect(() => { saveToStorage(STORAGE_KEYS.CURRENCIES, currencies); }, [currencies]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSFERS, transfers); }, [transfers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FAQ, faqs); }, [faqs]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FORUM, forumPosts); }, [forumPosts]);

  // ── Navigasi helper ────────────────────────────────────────
  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params.currencyId !== undefined) setSelectedCurrencyId(params.currencyId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── CRUD: Mata Uang ───────────────────────────────────────
  const addCurrency = (newCurrency) => {
    const id = (newCurrency.code || newCurrency.id || '').toUpperCase();
    setCurrencies((prev) => [...prev, { ...newCurrency, id, code: id }]);
  };

  const updateCurrency = (updatedCurrency) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.id === updatedCurrency.id ? updatedCurrency : c))
    );
  };

  const deleteCurrency = (currencyId) => {
    setCurrencies((prev) => prev.filter((c) => c.id !== currencyId));
  };

  const addDenomination = (currencyId, denom) => {
    setCurrencies((prev) =>
      prev.map((c) =>
        c.id === currencyId
          ? { ...c, denominations: [...c.denominations, denom] }
          : c
      )
    );
  };

  const updateDenomination = (currencyId, denomValue, updatedDenom) => {
    setCurrencies((prev) =>
      prev.map((c) =>
        c.id === currencyId
          ? {
              ...c,
              denominations: c.denominations.map((d) =>
                d.value === denomValue ? updatedDenom : d
              ),
            }
          : c
      )
    );
  };

  // ── CRUD: FAQ ──────────────────────────────────────────────
  const addFaq = (newFaq) => {
    setFaqs((prev) => [...prev, { ...newFaq, id: Date.now() }]);
  };

  const updateFaq = (updatedFaq) => {
    setFaqs((prev) => prev.map((f) => (f.id === updatedFaq.id ? updatedFaq : f)));
  };

  const deleteFaq = (faqId) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  // ── CRUD: Forum ────────────────────────────────────────────
  const addForumTopic = (topic) => {
    const newTopic = {
      ...topic,
      id: Date.now(),
      replies: [],
      timestamp: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    setForumPosts((prev) => [newTopic, ...prev]);
    return newTopic.id;
  };

  const addForumReply = (topicId, replyContent, author) => {
    const reply = {
      id: Date.now(),
      author: author || 'Anonim',
      content: replyContent,
      timestamp: new Date().toISOString(),
    };
    setForumPosts((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, replies: [...t.replies, reply] } : t
      )
    );
  };

  const likeForumTopic = (topicId) => {
    setForumPosts((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, likes: (t.likes || 0) + 1 } : t))
    );
  };

  const viewForumTopic = (topicId) => {
    setForumPosts((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, views: (t.views || 0) + 1 } : t))
    );
  };

  // ── Reset semua data ke default ───────────────────────────
  const resetAllData = () => {
    setCurrencies(INITIAL_CURRENCIES);
    setFaqs(INITIAL_FAQ);
    setForumPosts(INITIAL_FORUM);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  };

  // ── Context value ──────────────────────────────────────────
  const ctx = {
    currencies, transfers, faqs, forumPosts,
    currentPage, navigate, selectedCurrencyId,
    sidebarOpen, setSidebarOpen,
    addCurrency, updateCurrency, deleteCurrency,
    addDenomination, updateDenomination,
    addFaq, updateFaq, deleteFaq,
    addForumTopic, addForumReply, likeForumTopic, viewForumTopic,
    globalSearch, setGlobalSearch,
    resetAllData,
  };

  // ── Render halaman aktif ───────────────────────────────────
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'katalog':
        return <CurrencyCatalog />;
      case 'currency-detail':
        return <CurrencyDetail currencyId={selectedCurrencyId} />;
      case 'transfer':
        return <DomesticTransfer />;
      case 'forum':
        return <Forum />;
      case 'faq':
        return <FAQ />;
      case 'admin':
        return <AdminCMS />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar currentPage={currentPage} setCurrentPage={navigate} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="md:pl-[260px] pt-14 min-h-screen transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}
