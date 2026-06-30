# CEOD Portal — Bank BTN

Currencies Education & Operation Digital Portal. Portal pembelajaran interaktif untuk Front Office (Teller & Customer Service), dibangun dengan React + Tailwind CSS, serverless (LocalStorage sebagai basis data).

## Fitur

- **Dashboard** — smart search lintas modul (valas, transfer, FAQ).
- **Katalog Valas** — 11 mata uang (USD, SGD, AUD, EUR, GBP, JPY, CNY, MYR, SAR, HKD, IDR) dengan galeri denominasi, status emisi, dan panduan anti-uang palsu (Dilihat/Diraba/Diterawang + UV + microprinting).
- **Transfer Domestik** — RTGS, SKN/LLG, BI-Fast, Kliring Warkat lengkap dengan tabel komparasi dan detail warkat/DHN.
- **FAQ Interaktif** — accordion + search.
- **Forum Diskusi** — topik baru, balasan, like, view count (tersimpan di LocalStorage).
- **Manajemen CMS** — tambah/edit mata uang, denominasi, dan FAQ secara dinamis.

## Menjalankan secara lokal

```bash
npm install
npm start
```

Aplikasi berjalan di `http://localhost:3000`.

## Build untuk produksi

```bash
npm run build
```

Hasil build ada di folder `build/`.

## Deploy ke GitHub Pages

1. Push project ini ke repository GitHub Anda.
2. Sesuaikan field `"homepage"` di `package.json` menjadi `https://<username>.github.io/<nama-repo>`.
3. Jalankan:

```bash
npm run deploy
```

Script ini akan menjalankan build lalu mempublikasikan folder `build/` ke branch `gh-pages` (memerlukan paket `gh-pages`, sudah termasuk di `devDependencies`).

## Struktur Proyek

```
src/
  App.js                  — root component, Context, routing, state
  index.js / index.css    — entry point + Tailwind directives
  data/
    DataStore.js           — data awal (mata uang, transfer, FAQ, forum) + helper LocalStorage
  components/
    Navbar.js              — sidebar + top bar responsif
    Dashboard.js            — smart search & statistik
    CurrencyCatalog.js      — grid katalog 11 mata uang
    CurrencyDetail.js       — detail denominasi & anti-uang palsu
    DomesticTransfer.js     — 4 jalur transfer + tabel komparasi
    FAQ.js                  — accordion FAQ
    Forum.js                — forum diskusi internal
    AdminCMS.js              — manajemen materi (CRUD)
```

## Catatan

- Semua gambar denominasi uang menggunakan **placeholder visual** (blok warna + label), bukan foto asli. Anda dapat menggantinya dengan aset gambar nyata di `CurrencyDetail.js` (komponen `DenominationCard`) bila diperlukan.
- Data tersimpan di `localStorage` browser pengguna. Tombol "Reset data ke default" di sidebar akan mengembalikan semua data ke kondisi awal.
