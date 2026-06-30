// ============================================================
// Navbar.js — Sidebar (desktop) + Top Bar (mobile), responsif
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../App';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'katalog', label: 'Katalog Valas', icon: '💱' },
  { id: 'transfer', label: 'Transfer Domestik', icon: '🔀' },
  { id: 'forum', label: 'Forum Diskusi', icon: '💬' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'admin', label: 'Manajemen CMS', icon: '⚙️' },
];

export default function Navbar({ currentPage, setCurrentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const app = useApp();

  const handleNav = (id) => {
    setCurrentPage(id);
    setMobileOpen(false);
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === currentPage);

  return (
    <>
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 shadow-sm h-14 flex items-center px-4">
        <button
          className="md:hidden mr-3 p-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Buka menu navigasi"
        >
          <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-xl">💰</span>
          <span className="font-display font-bold text-primary-700 text-sm">CEOD Portal</span>
        </div>
        <div className="flex-1 md:ml-[260px]">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-400">Bank BTN —</span>
              <span className="text-sm font-semibold text-gray-700">
                {activeItem?.icon} {activeItem?.label}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-mint-50 text-mint-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse inline-block" />
                Sistem Aktif
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY MOBILE */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 w-[260px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* LOGO */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
              <span className="text-white text-lg">💰</span>
            </div>
            <div>
              <div className="font-display font-bold text-gray-800 text-sm leading-tight">CEOD Portal</div>
              <div className="text-xs text-gray-400 leading-tight">Front Office Learning</div>
            </div>
          </div>
        </div>

        {/* USER BADGE */}
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-primary-50 border border-primary-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">T</div>
            <div>
              <div className="text-xs font-semibold text-gray-800">Teller / CS</div>
              <div className="text-xs text-gray-400">Bank BTN Cabang</div>
            </div>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu Utama</div>
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-3 text-white">
            <div className="text-xs font-semibold mb-1">💡 Tip Hari Ini</div>
            <div className="text-xs opacity-90 leading-relaxed">
              Selalu verifikasi keaslian uang asing dengan metode 3D: Dilihat, Diraba, Diterawang.
            </div>
          </div>
          <button
            onClick={() => app?.resetAllData?.()}
            className="mt-3 w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset data ke default
          </button>
          <div className="mt-1 text-center text-xs text-gray-300">CEOD v1.0 © 2026 Bank BTN</div>
        </div>
      </aside>
    </>
  );
}
