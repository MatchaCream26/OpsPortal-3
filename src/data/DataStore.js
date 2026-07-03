// ============================================================
// CEOD Portal – DataStore.js
// ============================================================

export const STORAGE_KEYS = {
  CURRENCIES: 'ceod_currencies',
  TRANSFERS: 'ceod_transfers',
  FAQ: 'ceod_faq',
  FORUM: 'ceod_forum',
};

export const INITIAL_CURRENCIES = [
  {
    id: 'USD', code: 'USD', name: 'Dolar Amerika Serikat', nameEn: 'US Dollar',
    country: 'Amerika Serikat', continent: 'Amerika', flag: '🇺🇸',
    centralBank: 'Federal Reserve (The Fed)', symbol: '$',
    colorPrimary: '#3B82F6', colorAccent: '#1D4ED8', bgColor: '#EFF6FF',
    denominations: [
      {
        value: 100, label: '$100',
        colorDesc: 'Hijau tosca dengan portrait Benjamin Franklin',
        figure: 'Benjamin Franklin',
        yearIssued: [1996, 2006, 2013], latestEmission: 2013, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Color-shifting ink pada angka 100 kanan bawah: berubah dari tembaga ke hijau saat dimiringkan.' },
          { method: 'Dilihat', desc: 'Pita keamanan biru 3D (3D Security Ribbon) dengan pola lonceng bergerak saat dimiringkan.' },
          { method: 'Diraba', desc: 'Tulisan "THE UNITED STATES OF AMERICA", angka nominal, dan portrait terasa kasar/timbul.' },
          { method: 'Diterawang', desc: 'Watermark portrait Franklin dan pita keamanan terlihat jelas saat diterawang ke cahaya.' },
          { method: 'UV Light', desc: 'Security thread berpendar merah muda, bertuliskan "USA 100".' },
          { method: 'Microprinting', desc: 'Tulisan "THE UNITED STATES OF AMERICA" sangat kecil di dalam angka 100 dan kerah jas Franklin.' },
        ],
        notes: 'Emisi 2013 adalah yang terbaru dan paling aman. Emisi 1996 dan 2006 masih dapat diterima.',
      },
      {
        value: 50, label: '$50',
        colorDesc: 'Merah muda pucat dengan portrait Ulysses S. Grant',
        figure: 'Ulysses S. Grant',
        yearIssued: [2004, 2013], latestEmission: 2013, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Tinta berubah warna pada angka 50 di sudut kanan bawah.' },
          { method: 'Diraba', desc: 'Portrait Grant dan tulisan "FIFTY DOLLARS" terasa timbul.' },
          { method: 'Diterawang', desc: 'Watermark portrait Grant terlihat di sisi kanan gambar utama.' },
          { method: 'UV Light', desc: 'Security thread berpendar kuning, bertuliskan "USA 50".' },
        ],
        notes: 'Semua emisi yang beredar masih berlaku.',
      },
      {
        value: 20, label: '$20',
        colorDesc: 'Hijau muda dengan portrait Andrew Jackson',
        figure: 'Andrew Jackson',
        yearIssued: [2003, 2009], latestEmission: 2009, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Tinta berubah warna pada angka 20.' },
          { method: 'Diraba', desc: 'Permukaan kasar pada portrait dan tulisan.' },
          { method: 'Diterawang', desc: 'Watermark portrait Jackson dan pita keamanan terlihat.' },
          { method: 'UV Light', desc: 'Security thread berpendar hijau, bertuliskan "USA 20".' },
        ],
        notes: 'Emisi lama (sebelum 2003) sudah jarang beredar, tolak jika ditemukan.',
      },
      {
        value: 1, label: '$1',
        colorDesc: 'Hijau polos dengan portrait George Washington',
        figure: 'George Washington',
        yearIssued: [1963], latestEmission: 1963, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Tidak memiliki tinta color-shifting. Perhatikan kualitas cetak yang tajam.' },
          { method: 'Diraba', desc: 'Tekstur kertas khas USD terasa berbeda (campuran linen dan kapas).' },
          { method: 'Diterawang', desc: 'Serat berwarna merah dan biru tertanam di kertas.' },
          { method: 'UV Light', desc: 'Tidak ada security thread pada $1. Periksa serat keamanan di kertas.' },
        ],
        notes: 'Tidak ada security thread pada $1. Fokus pada kualitas kertas dan cetak.',
      },
    ],
    rejectionGuide: [
      'Fisik sobek/mutilasi lebih dari 50% area uang',
      'Tanda tangan/tulisan tinta di area potret',
      'Lubang/luka bakar yang merusak fitur keamanan utama',
      'Emisi sangat lama yang sudah ditarik dari peredaran',
      'Gagal melewati alat pendeteksi UV dan magnet',
    ],
  },
  {
    id: 'SGD', code: 'SGD', name: 'Dolar Singapura', nameEn: 'Singapore Dollar',
    country: 'Singapura', continent: 'Asia', flag: '🇸🇬',
    centralBank: 'Monetary Authority of Singapore (MAS)', symbol: 'S$',
    colorPrimary: '#DC2626', colorAccent: '#991B1B', bgColor: '#FEF2F2',
    denominations: [
      {
        value: 1000, label: 'S$1000',
        colorDesc: 'Ungu dengan motif bunga anggrek',
        figure: 'Encik Yusof Bin Ishak',
        yearIssued: [1999, 2014], latestEmission: 2014, isValid: true, invalidYears: ['Seri Orchid lama'],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Hologram berubah dari "MAS" ke logo singa saat dimiringkan.' },
          { method: 'Diraba', desc: 'Tinta timbul pada teks dan angka nominal.' },
          { method: 'Diterawang', desc: 'Watermark potret Encik Yusof Bin Ishak (Presiden pertama).' },
          { method: 'UV Light', desc: 'Serat keamanan dan pola florescent terlihat di bawah UV.' },
        ],
        notes: 'Seri Orchid lama sudah tidak berlaku. Hanya terima seri Portrait (1999) dan seri 2014.',
      },
      {
        value: 100, label: 'S$100',
        colorDesc: 'Biru tua dengan desain minimalis modern',
        figure: 'Gedung Parlemen & motif kultural',
        yearIssued: [1999, 2014], latestEmission: 2014, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Window thread dengan teks SGD bergerak saat dimiringkan.' },
          { method: 'Diraba', desc: 'Intaglio printing pada portrait dan nilai nominal.' },
          { method: 'Diterawang', desc: 'Watermark Encik Yusof dan angka 100 dalam kertas.' },
          { method: 'UV Light', desc: 'Angka 100 berpendar di bawah sinar UV.' },
        ],
        notes: 'Berlaku. Waspadai pemalsuan pada pecahan ini.',
      },
    ],
    rejectionGuide: [
      'Uang lusuh, sobek, atau berjamur',
      'Tanda coretan/stempel yang merusak fitur keamanan',
      'Hologram hilang atau rusak',
      'Seri Orchid yang sudah ditarik MAS',
    ],
  },
  {
    id: 'AUD', code: 'AUD', name: 'Dolar Australia', nameEn: 'Australian Dollar',
    country: 'Australia', continent: 'Australia/Oseania', flag: '🇦🇺',
    centralBank: 'Reserve Bank of Australia (RBA)', symbol: 'A$',
    colorPrimary: '#059669', colorAccent: '#065F46', bgColor: '#ECFDF5',
    denominations: [
      {
        value: 100, label: 'A$100',
        colorDesc: 'Hijau terang – bahan POLYMER (plastik)',
        figure: 'Dame Nellie Melba & John Monash',
        yearIssued: [1996, 2020], latestEmission: 2020, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Bahan polymer transparan dengan jendela (window) yang jelas terlihat. Window berisi motif lyre bird yang berubah warna.' },
          { method: 'Dilihat', desc: 'Cetak warna-warni (rainbow print) yang berpendar di sekitar jendela transparan.' },
          { method: 'Diraba', desc: 'Permukaan licin khas polymer, namun tinta timbul terasa di area teks.' },
          { method: 'Diterawang', desc: 'Jendela transparan terlihat jelas, bukan kertas yang koyak.' },
          { method: 'UV Light', desc: 'Motif tersembunyi berpendar di bawah sinar UV.' },
        ],
        notes: 'AUD menggunakan bahan POLYMER (plastik), bukan kertas. Uang yang basah tetap valid namun periksa kondisi jendela transparan.',
      },
      {
        value: 50, label: 'A$50',
        colorDesc: 'Kuning keemasan – polymer',
        figure: 'David Unaipon & Edith Cowan',
        yearIssued: [1995, 2018], latestEmission: 2018, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Window dengan motif Eastern Spinebill yang berubah warna saat dimiringkan.' },
          { method: 'Diraba', desc: 'Teks dan angka terasa timbul meski bahan polymer.' },
          { method: 'Diterawang', desc: 'Window transparan jelas, periksa kejernihan dan desain di dalamnya.' },
          { method: 'UV Light', desc: 'Tinta UV di berbagai bagian uang.' },
        ],
        notes: 'Pecahan paling sering dipalsukan di Asia Tenggara. Periksa window dengan seksama.',
      },
    ],
    rejectionGuide: [
      'Window transparan berlubang, tersobek, atau terbakar',
      'Bahan terlipat permanen hingga merusak struktur polymer',
      'Warna pudar ekstrem (kemungkinan pemutihan kimia)',
      'Jendela transparan dimanipulasi (ditempel/diganti)',
    ],
  },
  {
    id: 'EUR', code: 'EUR', name: 'Euro', nameEn: 'Euro',
    country: 'Zona Euro (19 negara)', continent: 'Eropa', flag: '🇪🇺',
    centralBank: 'European Central Bank (ECB)', symbol: '€',
    colorPrimary: '#7C3AED', colorAccent: '#5B21B6', bgColor: '#F5F3FF',
    denominations: [
      {
        value: 500, label: '€500',
        colorDesc: 'Ungu – motif arsitektur modern Eropa',
        figure: 'Arsitektur Eropa Modern (abstrak)',
        yearIssued: [2002, 2013], latestEmission: 2013, isValid: false, invalidYears: [2002, 2013],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Hologram berisi angka €, simbol Euro, dan peta Eropa.' },
          { method: 'Diraba', desc: 'Tinta timbul khas intaglio pada seluruh permukaan.' },
          { method: 'Diterawang', desc: 'Watermark arsitektur dan nilai nominal terlihat tembus cahaya.' },
          { method: 'UV Light', desc: 'Serat berpendar biru, merah, dan hijau; peta Eropa berpendar.' },
        ],
        notes: '⚠️ TIDAK BERLAKU di Bank BTN – ECB menghentikan penerbitan sejak 2019. Tolak pecahan ini.',
      },
      {
        value: 100, label: '€100',
        colorDesc: 'Hijau – motif arsitektur Barok & Rokoko (seri Europa 2019)',
        figure: 'Arsitektur Baroque & Rococo',
        yearIssued: [2002, 2019], latestEmission: 2019, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Emerald number berpendar dan bergerak (angka bergulir ke bawah) saat dimiringkan.' },
          { method: 'Dilihat', desc: 'Portrait window – jendela transparan dengan potret Europa, Putri mitologi Yunani.' },
          { method: 'Diraba', desc: 'Garis timbul kasar di tepi kiri uang (tactile marks untuk tunanetra).' },
          { method: 'Diterawang', desc: 'Portrait Europa terlihat di kedua sisi saat diterawang.' },
          { method: 'UV Light', desc: 'Serat keamanan berpendar, peta Eropa berpendar oranye.' },
        ],
        notes: 'Terima seri Europa (2019). Seri 2002 masih valid tapi lebih jarang beredar.',
      },
      {
        value: 50, label: '€50',
        colorDesc: 'Oranye – motif arsitektur Renaisans',
        figure: 'Arsitektur Renaissance',
        yearIssued: [2002, 2017], latestEmission: 2017, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Emerald number dan portrait window.' },
          { method: 'Diraba', desc: 'Tinta timbul dan garis taktil tepi kiri.' },
          { method: 'Diterawang', desc: 'Watermark dan portrait watermark Europa.' },
          { method: 'UV Light', desc: 'Pola UV tersembunyi.' },
        ],
        notes: 'Berlaku. Pecahan paling umum beredar.',
      },
    ],
    rejectionGuide: [
      'Pecahan €500 – dilarang diterima sesuai kebijakan Bank BTN',
      'Emerald number tidak berpendar/tidak bergerak saat dimiringkan',
      'Portrait window tidak terlihat transparansi-nya',
      'Garis taktil tepi kiri tidak terasa',
    ],
  },
  {
    id: 'GBP', code: 'GBP', name: 'Poundsterling Inggris', nameEn: 'British Pound Sterling',
    country: 'Inggris Raya', continent: 'Eropa', flag: '🇬🇧',
    centralBank: 'Bank of England', symbol: '£',
    colorPrimary: '#BE123C', colorAccent: '#9F1239', bgColor: '#FFF1F2',
    denominations: [
      {
        value: 50, label: '£50',
        colorDesc: 'Merah – polymer, gambar Alan Turing',
        figure: 'Alan Turing (ilmuwan komputer)',
        yearIssued: [2021], latestEmission: 2021, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Window transparan (polymer) dengan angka 50 yang berubah warna hijau ke kuning saat dimiringkan.' },
          { method: 'Dilihat', desc: 'Hologram golden foil di sisi kanan atas.' },
          { method: 'Diraba', desc: 'Tinta timbul pada portrait dan teks "Bank of England".' },
          { method: 'Diterawang', desc: 'Window polymer transparan dan watermark terlihat.' },
          { method: 'UV Light', desc: 'Angka 50 berpendar terang di bawah UV; serat merah dan biru berpendar.' },
        ],
        notes: 'Seri polymer (2021) BERLAKU. Seri kertas lama sudah TIDAK BERLAKU sejak 30 Sep 2022.',
      },
      {
        value: 20, label: '£20',
        colorDesc: 'Ungu – polymer, gambar J.M.W. Turner',
        figure: 'J.M.W. Turner (pelukis)',
        yearIssued: [2020], latestEmission: 2020, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Window transparan dengan Queen Elizabeth II; golden foil pada sisi kanan.' },
          { method: 'Diraba', desc: 'Tinta timbul pada portrait dan denominasi.' },
          { method: 'Diterawang', desc: 'Window polimer transparan terlihat jelas.' },
          { method: 'UV Light', desc: 'Tinta fluorescent berpendar.' },
        ],
        notes: 'Seri kertas lama TIDAK BERLAKU sejak 20 Sep 2022. Hanya terima polymer.',
      },
    ],
    rejectionGuide: [
      'Semua seri kertas (paper note) – TIDAK BERLAKU, tolak',
      'Window polymer rusak, berlubang, atau dimanipulasi',
      'Golden foil hilang atau terkelupas',
    ],
  },
  {
    id: 'JPY', code: 'JPY', name: 'Yen Jepang', nameEn: 'Japanese Yen',
    country: 'Jepang', continent: 'Asia', flag: '🇯🇵',
    centralBank: 'Bank of Japan (日本銀行)', symbol: '¥',
    colorPrimary: '#B45309', colorAccent: '#92400E', bgColor: '#FFFBEB',
    denominations: [
      {
        value: 10000, label: '¥10.000',
        colorDesc: 'Cokelat/ungu – Shibusawa Eiichi (seri 2024) / Fukuzawa Yukichi (lama)',
        figure: 'Shibusawa Eiichi (seri 2024)',
        yearIssued: [2004, 2024], latestEmission: 2024, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: '3D hologram (seri 2024): teknologi terbaru pertama di dunia pada uang kertas.' },
          { method: 'Dilihat', desc: 'Tinta berubah warna (OVI) pada angka nominal.' },
          { method: 'Diraba', desc: 'Tinta intaglio sangat terasa timbul pada portrait dan teks.' },
          { method: 'Diterawang', desc: 'Watermark portrait dan pola geometris terlihat tembus cahaya.' },
          { method: 'UV Light', desc: 'Serat dan pola tersembunyi berpendar di bawah UV.' },
          { method: 'Microprinting', desc: 'Tulisan sangat kecil NIPPON GINKO di berbagai area.' },
        ],
        notes: 'Seri 2024 BARU mulai Juli 2024. Seri lama (Fukuzawa Yukichi) masih berlaku.',
      },
      {
        value: 1000, label: '¥1.000',
        colorDesc: 'Biru – Kitasato Shibasaburo (seri 2024) / Noguchi Hideyo (lama)',
        figure: 'Kitasato Shibasaburo (seri 2024)',
        yearIssued: [2004, 2024], latestEmission: 2024, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: '3D hologram teknologi terbaru pada seri 2024.' },
          { method: 'Diraba', desc: 'Intaglio timbul.' },
          { method: 'Diterawang', desc: 'Watermark terlihat.' },
          { method: 'UV Light', desc: 'Fitur UV.' },
        ],
        notes: 'Seri 2024 BARU mulai Juli 2024. Seri lama masih berlaku penuh.',
      },
    ],
    rejectionGuide: [
      'Fisik kotor/berjamur hingga fitur keamanan tidak terlihat',
      'Watermark tidak terlihat saat diterawang',
      'Intaglio tidak terasa timbul (kemungkinan palsu)',
    ],
  },
  {
    id: 'CNY', code: 'CNY', name: 'Renminbi / Yuan Tiongkok', nameEn: 'Chinese Yuan Renminbi',
    country: 'Tiongkok', continent: 'Asia', flag: '🇨🇳',
    centralBank: "People's Bank of China (PBoC / 中国人民银行)", symbol: '¥',
    colorPrimary: '#DC2626', colorAccent: '#991B1B', bgColor: '#FEF2F2',
    denominations: [
      {
        value: 100, label: '¥100',
        colorDesc: 'Merah – Gedung Balai Agung Rakyat (seri 2015)',
        figure: 'Mao Zedong & Balai Agung Rakyat',
        yearIssued: [1999, 2015], latestEmission: 2015, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'OVI: angka 100 di kanan bawah berubah dari emas ke hijau saat dimiringkan.' },
          { method: 'Dilihat', desc: 'Golden security thread dengan teks "RMB100" terlihat sebagai garis putus-putus.' },
          { method: 'Diraba', desc: 'Portrait Mao Zedong dan angka 100 (atas kiri) sangat terasa kasar/timbul.' },
          { method: 'Diterawang', desc: 'Watermark portrait Mao dan angka 100 terlihat jelas tembus cahaya.' },
          { method: 'UV Light', desc: 'Security thread berpendar biru; serat merah berpendar.' },
          { method: 'Microprinting', desc: 'Tulisan kecil "100" dan "RMB" di berbagai area uang.' },
        ],
        notes: 'Pecahan ini paling sering dipalsukan. Prioritas verifikasi lebih ketat.',
      },
    ],
    rejectionGuide: [
      'OVI tidak berubah warna saat dimiringkan (kemungkinan palsu)',
      'Portrait Mao tidak terasa timbul/kasar',
      'Watermark tidak terlihat saat diterawang',
    ],
  },
  {
    id: 'MYR', code: 'MYR', name: 'Ringgit Malaysia', nameEn: 'Malaysian Ringgit',
    country: 'Malaysia', continent: 'Asia', flag: '🇲🇾',
    centralBank: 'Bank Negara Malaysia (BNM)', symbol: 'RM',
    colorPrimary: '#2563EB', colorAccent: '#1E40AF', bgColor: '#EFF6FF',
    denominations: [
      {
        value: 100, label: 'RM100',
        colorDesc: 'Ungu – Tunku Abdul Rahman Putra Al-Haj',
        figure: 'Tunku Abdul Rahman (PM pertama Malaysia)',
        yearIssued: [2012, 2022], latestEmission: 2022, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'MOTION security thread: pita lebar dengan efek gerak saat dimiringkan.' },
          { method: 'Dilihat', desc: 'OVI pada angka nominal.' },
          { method: 'Diraba', desc: 'Portrait Tunku dan nilai nominal sangat terasa timbul.' },
          { method: 'Diterawang', desc: 'Watermark portrait Tunku dan Kijang Emas terlihat tembus cahaya.' },
          { method: 'UV Light', desc: 'BNM logo dan serat berpendar di bawah UV.' },
        ],
        notes: 'Seri 2022 terbaru. Seri lama masih berlaku.',
      },
    ],
    rejectionGuide: [
      'MOTION thread tidak bergerak saat dimiringkan',
      'Portrait tidak terasa timbul',
      'Uang sobek lebih dari 1/3 area',
    ],
  },
  {
    id: 'SAR', code: 'SAR', name: 'Riyal Arab Saudi', nameEn: 'Saudi Arabian Riyal',
    country: 'Arab Saudi', continent: 'Asia', flag: '🇸🇦',
    centralBank: 'Saudi Central Bank (SAMA)', symbol: 'ر.س',
    colorPrimary: '#16A34A', colorAccent: '#166534', bgColor: '#F0FDF4',
    denominations: [
      {
        value: 500, label: 'SAR 500',
        colorDesc: 'Hijau – King Abdul Aziz Al Saud',
        figure: 'King Abdul Aziz Al Saud',
        yearIssued: [2007, 2017], latestEmission: 2017, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'OVI tinta berubah warna pada angka 500.' },
          { method: 'Dilihat', desc: 'Hologram SAMA dengan lambang kerajaan.' },
          { method: 'Diraba', desc: 'Intaglio timbul pada portrait dan teks Arab.' },
          { method: 'Diterawang', desc: 'Watermark portrait dan angka 500 terlihat.' },
          { method: 'UV Light', desc: 'Pola tersembunyi berpendar di bawah UV.' },
        ],
        notes: 'Berlaku. Banyak beredar untuk TKI dan jemaah haji/umrah.',
      },
      {
        value: 100, label: 'SAR 100',
        colorDesc: 'Biru – King Abdul Aziz Al Saud',
        figure: 'King Abdul Aziz Al Saud',
        yearIssued: [2007, 2016], latestEmission: 2016, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'OVI dan hologram SAMA.' },
          { method: 'Diraba', desc: 'Intaglio timbul.' },
          { method: 'Diterawang', desc: 'Watermark.' },
          { method: 'UV Light', desc: 'Fitur UV.' },
        ],
        notes: 'Berlaku. Paling umum untuk transaksi TKI.',
      },
    ],
    rejectionGuide: [
      'OVI tidak berubah warna',
      'Hologram SAMA rusak atau hilang',
      'Uang lusuh/kotor ekstrem',
    ],
  },
  {
    id: 'HKD', code: 'HKD', name: 'Dolar Hong Kong', nameEn: 'Hong Kong Dollar',
    country: 'Hong Kong SAR', continent: 'Asia', flag: '🇭🇰',
    centralBank: 'Hong Kong Monetary Authority (HKMA)', symbol: 'HK$',
    colorPrimary: '#EA580C', colorAccent: '#C2410C', bgColor: '#FFF7ED',
    denominations: [
      {
        value: 1000, label: 'HK$1.000',
        colorDesc: 'Merah-oranye – penerbit: HSBC/Bank of China/SCB',
        figure: 'Berbeda per penerbit',
        yearIssued: [2010, 2018, 2023], latestEmission: 2023, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Hologram multi-dimensi berbeda per penerbit (HSBC/BOC/SCB).' },
          { method: 'Dilihat', desc: 'OVI pada angka nominal.' },
          { method: 'Diraba', desc: 'Intaglio timbul pada teks dan gambar.' },
          { method: 'Diterawang', desc: 'Watermark bunga bauhinia (bunga Hong Kong) dan angka 1000.' },
          { method: 'UV Light', desc: 'Serat dan pola UV tersembunyi.' },
        ],
        notes: 'HKD diterbitkan oleh 3 bank komersial (HSBC, Bank of China, Standard Chartered). Semua sah selama legal tender.',
      },
    ],
    rejectionGuide: [
      'Tidak bisa diidentifikasi penerbitnya (HSBC/BOC/SCB)',
      'Hologram rusak atau hilang',
      'Watermark bunga bauhinia tidak terlihat',
    ],
  },
  {
    id: 'IDR', code: 'IDR', name: 'Rupiah Indonesia', nameEn: 'Indonesian Rupiah',
    country: 'Indonesia', continent: 'Asia', flag: '🇮🇩',
    centralBank: 'Bank Indonesia (BI)', symbol: 'Rp',
    colorPrimary: '#DC2626', colorAccent: '#991B1B', bgColor: '#FEF2F2',
    denominations: [
      {
        value: 100000, label: 'Rp100.000',
        colorDesc: 'Merah – Ir. Soekarno & Moh. Hatta (Seri NKRI 2022)',
        figure: 'Ir. Soekarno & Moh. Hatta',
        yearIssued: [2014, 2016, 2022], latestEmission: 2022, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'Color Shifting Ink: angka 100000 di kanan bawah berubah dari merah ke emas saat dimiringkan.' },
          { method: 'Dilihat', desc: 'Benang pengaman terlihat sebagai garis putus-putus bertuliskan "BI" dan "100000".' },
          { method: 'Diraba', desc: 'Portrait Soekarno-Hatta dan tulisan "BANK INDONESIA" sangat terasa kasar/timbul.' },
          { method: 'Diraba', desc: 'Kode tuna netra (kode braille) berupa titik-titik timbul di pojok kiri atas.' },
          { method: 'Diterawang', desc: 'Watermark portrait Soekarno-Hatta dan angka "100000" terlihat tembus cahaya.' },
          { method: 'UV Light', desc: 'Gambar tersembunyi berpendar, benang pengaman berpendar terang.' },
          { method: 'Microprinting', desc: 'Tulisan sangat kecil "BANK INDONESIA" dan "100000" di berbagai sudut.' },
        ],
        notes: 'Emisi 2022 (Seri NKRI) terbaru. Emisi 2014 dan 2016 masih berlaku.',
      },
      {
        value: 50000, label: 'Rp50.000',
        colorDesc: 'Biru – I Gusti Ngurah Rai & Taman Bali',
        figure: 'I Gusti Ngurah Rai',
        yearIssued: [2014, 2016, 2022], latestEmission: 2022, isValid: true, invalidYears: [],
        securityFeatures: [
          { method: 'Dilihat', desc: 'OVI berubah dari hijau ke biru saat dimiringkan.' },
          { method: 'Diraba', desc: 'Portrait timbul, kode braille tuna netra.' },
          { method: 'Diterawang', desc: 'Watermark portrait dan angka 50000.' },
          { method: 'UV Light', desc: 'Benang pengaman dan pola UV berpendar.' },
        ],
        notes: 'Berlaku.',
      },
    ],
    rejectionGuide: [
      'Uang yang telah digunting/dipotong lebih dari 2/3 bagian',
      'Uang terbakar sehingga tidak dapat dikenali',
      'Uang berubah warna drastis (berjamur/terkena bahan kimia)',
      'Emisi yang sudah ditarik Bank Indonesia',
    ],
  },
];

export const INITIAL_TRANSFERS = [
  {
    id: 'rtgs', code: 'RTGS', name: 'RTGS', fullName: 'Real-Time Gross Settlement',
    tagline: 'Nilai besar, selesai seketika', icon: '🏦',
    colorPrimary: '#3B82F6', colorBg: '#EFF6FF',
    minAmount: 100000000, maxAmount: null,
    fee: { min: 25000, max: 50000, desc: 'Rp 25.000 – Rp 50.000 per transaksi' },
    processingTime: 'Real-time (seketika)',
    operationalHours: 'Senin–Jumat, 06.30–16.30 WIB',
    settlementType: 'Gross Settlement (per transaksi)',
    channel: ['Teller', 'Internet Banking Korporat', 'API Korporat'],
    keyFeatures: [
      'Penyelesaian bruto – setiap transaksi diselesaikan satu per satu',
      'Tidak ada penggabungan transaksi (netting)',
      'Irrevocable – tidak dapat dibatalkan setelah dikirim',
      'Wajib menyertakan keterangan/berita transfer',
    ],
    useCases: ['Pembayaran properti/tanah', 'Transfer modal perusahaan', 'Pembayaran kontrak nilai besar'],
    biRegulation: 'PBI No. 23/3/PBI/2021',
    alertNotes: [
      '⚠️ Tidak dapat diproses di luar jam operasional',
      '⚠️ Pastikan rekening tujuan aktif sebelum submit',
      '⚠️ Transaksi final dan tidak dapat dibatalkan',
    ],
  },
  {
    id: 'skn', code: 'SKN', name: 'SKN / LLG', fullName: 'Sistem Kliring Nasional / Lalu Lintas Giro',
    tagline: 'Transaksi ritel, biaya efisien', icon: '🔄',
    colorPrimary: '#10B981', colorBg: '#ECFDF5',
    minAmount: null, maxAmount: 500000000,
    fee: { min: 2900, max: 5000, desc: 'Rp 2.900 – Rp 5.000 per transaksi' },
    processingTime: '2–4 jam (batch processing)',
    operationalHours: 'Senin–Jumat, 08.00–14.00 WIB',
    settlementType: 'Net Settlement (batch/berkala)',
    channel: ['Teller', 'Internet Banking', 'Mobile Banking'],
    keyFeatures: [
      'Pemrosesan secara batch beberapa kali sehari',
      'Dana tidak sampai seketika – ada waktu tunggu kliring',
      'Biaya paling rendah di antara transfer antar bank',
      'Batas maksimum Rp 500 juta per transaksi',
    ],
    useCases: ['Pembayaran tagihan ritel', 'Transfer gaji karyawan (payroll)', 'Pembayaran supplier'],
    biRegulation: 'PBI No. 23/6/PBI/2021',
    alertNotes: [
      '⚠️ Konfirmasi kepada nasabah bahwa dana tidak sampai instan',
      '⚠️ Transaksi setelah cut-off diproses hari kerja berikutnya',
      '⚠️ Tidak berlaku Sabtu, Minggu, dan hari libur nasional',
    ],
  },
  {
    id: 'bi-fast', code: 'BI-FAST', name: 'BI-Fast', fullName: 'Bank Indonesia Fast Payment',
    tagline: 'Transfer modern 24/7, murah dan real-time', icon: '⚡',
    colorPrimary: '#FBBF24', colorBg: '#FFFBEB',
    minAmount: null, maxAmount: 250000000,
    fee: { min: 2500, max: 2500, desc: 'Flat Rp 2.500 per transaksi' },
    processingTime: 'Real-time (detik)',
    operationalHours: '24 jam / 7 hari (termasuk hari libur)',
    settlementType: 'Individual Real-time Settlement',
    channel: ['Teller', 'Internet Banking', 'Mobile Banking', 'QRIS'],
    keyFeatures: [
      'Beroperasi 24/7/365 termasuk hari libur nasional',
      'Mendukung Proxy Address: No. HP, email, atau NIK',
      'Notifikasi real-time kepada pengirim dan penerima',
      'Biaya flat Rp 2.500 tidak berubah berdasarkan nilai',
    ],
    useCases: ['Transfer antar individu segala waktu', 'Transfer menggunakan nomor HP penerima', 'Pembayaran mendesak di luar jam kerja'],
    biRegulation: 'PBI No. 23/6/PBI/2021 tentang BI-FAST',
    alertNotes: [
      '✅ Bisa diproses kapan saja, 24/7 termasuk hari libur',
      '⚠️ Proxy Address (No. HP) harus sudah didaftarkan penerima di banknya',
      '⚠️ Jika salah input Proxy Address, segera hubungi bank tujuan',
    ],
  },
  {
    id: 'kliring-warkat', code: 'WARKAT', name: 'Kliring Warkat', fullName: 'Kliring Warkat Debet (Cek & Bilyet Giro)',
    tagline: 'Pemrosesan cek dan bilyet giro lintas bank', icon: '📄',
    colorPrimary: '#7C3AED', colorBg: '#F5F3FF',
    minAmount: null, maxAmount: null,
    fee: { min: 5000, max: 10000, desc: 'Rp 5.000 – Rp 10.000 per warkat' },
    processingTime: '1–2 hari kerja',
    operationalHours: 'Senin–Jumat, sesuai jadwal kliring BI',
    settlementType: 'Net Settlement (deferred)',
    channel: ['Teller (setoran warkat)', 'Operasional Kliring'],
    keyFeatures: [
      'Warkat debet: Cek (cheque) dan Bilyet Giro (BG)',
      'Dana tidak cair seketika – ada masa kliring 1–2 hari kerja',
      'Penerimaan warkat harus diperiksa syarat formal secara seksama',
      'Penerbit cek/BG kosong masuk Daftar Hitam Nasional (DHN)',
    ],
    warkat: true,
    warkatTypes: [
      {
        type: 'Cek',
        description: 'Surat perintah tidak bersyarat kepada bank untuk membayar sejumlah uang kepada pembawa/pemegang.',
        formalRequirements: ['Kata "CEK" tercantum dalam teks', 'Perintah membayar tanpa syarat', 'Nama bank yang harus membayar', 'Tanggal dan tempat penarikan', 'Tanda tangan penarik'],
        rejectionReasons: ['Saldo tidak cukup (cek kosong)', 'Cek dibatalkan/diblokir penarik', 'Tanda tangan tidak sesuai spesimen', 'Cek kadaluarsa (lebih dari 70 hari)', 'Cacat formal', 'Rekening penarik sudah ditutup'],
      },
      {
        type: 'Bilyet Giro (BG)',
        description: 'Surat perintah dari nasabah kepada bank untuk memindahbukukan sejumlah dana ke rekening penerima.',
        formalRequirements: ['Kata "BILYET GIRO" dan nomor seri BG', 'Nama dan nomor rekening penerima', 'Jumlah dana (angka dan huruf)', 'Tanggal penarikan dan tanggal efektif', 'Tanda tangan dan nama penarik'],
        rejectionReasons: ['Saldo tidak cukup pada tanggal efektif', 'BG dibatalkan oleh penarik', 'Tanda tangan tidak sesuai spesimen', 'BG kadaluarsa (lebih dari 70 hari dari tanggal efektif)', 'Cacat formal', 'Rekening penarik sudah ditutup/diblokir', 'Tanggal efektif belum tiba'],
      },
    ],
    dhnInfo: {
      title: 'Daftar Hitam Nasional (DHN)',
      description: 'DHN adalah daftar yang dikelola BI berisi nama nasabah yang menerbitkan cek/BG kosong.',
      consequences: ['Nasabah dalam DHN tidak boleh membuka rekening giro baru di bank manapun', 'Nama masuk DHN selama 1 tahun sejak pelanggaran terakhir', 'Bank wajib melaporkan penerbitan cek/BG kosong ke BI dalam 1x24 jam'],
    },
    useCases: ['Pembayaran vendor/supplier nilai besar', 'Transaksi properti dengan pembayaran bertahap'],
    biRegulation: 'PBI No. 18/41/PBI/2016 tentang Bilyet Giro',
    alertNotes: [
      '⚠️ PERIKSA spesimen tanda tangan di sistem sebelum memproses warkat',
      '⚠️ Cek DHN untuk semua penerbit warkat baru',
      '⚠️ Warkat yang ditolak harus dikembalikan dengan Surat Keterangan Penolakan',
    ],
  },
];

export const INITIAL_FAQ = [
  { id: 1, category: 'BI-Fast', question: 'Bagaimana jika nasabah salah input Proxy Address (No. HP) di BI-Fast?', answer: 'Jika nasabah salah input Proxy Address dan dana sudah terkirim, lakukan langkah berikut:\n1. Minta nasabah untuk segera menghubungi call center Bank BTN.\n2. Bank BTN akan menghubungi bank tujuan melalui mekanisme dispute antar bank.\n3. Proses pengembalian dana dapat memakan waktu 5–14 hari kerja.\n4. Pastikan nasabah mendokumentasikan bukti transfer sebagai dasar klaim.\n5. Nasabah tidak dapat secara langsung membatalkan transaksi BI-Fast yang sudah selesai diproses.', tags: ['bi-fast', 'proxy', 'transfer', 'kesalahan'] },
  { id: 2, category: 'Valas', question: 'Apa tindakan yang harus dilakukan jika fisik uang asing terindikasi mutilasi?', answer: 'Uang mutilasi adalah uang yang sengaja dirusak/dipotong dengan tujuan penipuan. Tindakan teller:\n1. JANGAN terima uang tersebut – tolak dengan sopan dan jelaskan alasannya.\n2. Catat identitas nasabah yang menyerahkan uang tersebut.\n3. Laporkan kejadian kepada supervisor/kepala teller segera.\n4. Jika ada indikasi pemalsuan sistematis, laporkan ke Satuan Kerja Kepatuhan.\n5. Kerusakan wajar bisa diproses sesuai ketentuan BI, namun mutilasi adalah tindak kriminal.', tags: ['valas', 'mutilasi', 'uang palsu', 'prosedur'] },
  { id: 3, category: 'Transfer', question: 'Apakah RTGS bisa diproses di akhir pekan atau hari libur?', answer: 'Tidak. RTGS hanya beroperasi pada hari kerja (Senin–Jumat), pukul 06.30–16.30 WIB.\n\nTransaksi yang diajukan di luar jam operasional akan ditolak sistem atau dijadwalkan ke hari kerja berikutnya.\n\nAlternatif: Untuk transfer mendesak di luar jam RTGS, arahkan nasabah menggunakan BI-Fast (jika nilai ≤ Rp 250 juta) yang beroperasi 24/7.', tags: ['rtgs', 'jam operasional', 'transfer', 'libur'] },
  { id: 4, category: 'Warkat', question: 'Apa alasan-alasan sah penolakan Bilyet Giro (BG)?', answer: 'Bilyet Giro dapat ditolak karena:\n\n📋 ALASAN FORMAL:\n- Cacat formal: ada coretan tanpa paraf penarik yang sah\n- Informasi wajib tidak lengkap (nama penerima, nomor rekening, tanggal efektif)\n- Tanda tangan tidak sesuai spesimen di sistem bank\n\n💰 ALASAN SALDO:\n- Saldo tidak cukup pada tanggal efektif\n- Rekening penarik ditutup atau diblokir\n\n⏰ ALASAN WAKTU:\n- BG kadaluarsa (lewat 70 hari dari tanggal efektif)\n- BG mundur – tanggal efektif belum tiba\n\n⛔ ALASAN LAIN:\n- BG dibatalkan oleh penarik\n- Penarik masuk Daftar Hitam Nasional (DHN)', tags: ['warkat', 'bilyet giro', 'penolakan', 'DHN'] },
  { id: 5, category: 'Valas', question: 'Berapa batas minimum dan maksimum transaksi valas di teller?', answer: 'Ketentuan transaksi valas di teller Bank BTN:\n\n📥 Pembelian Valas (nasabah beli valas dari bank):\n- Di bawah USD 25.000 ekuivalen: Tidak wajib underlying dokumen\n- USD 25.000 ke atas: Wajib menyertakan dokumen underlying (tiket, invoice, dll)\n\n📤 Penjualan Valas (nasabah jual valas ke bank):\n- Di bawah USD 25.000 ekuivalen: Cukup identitas diri (KTP)\n- USD 25.000 ke atas: Wajib underlying dokumen dan pelaporan ke BI\n\nSesuai PBI No. 21/14/PBI/2019.', tags: ['valas', 'limit', 'ketentuan', 'BI'] },
  { id: 6, category: 'Transfer', question: 'Apa perbedaan utama SKN dan BI-Fast untuk nasabah ritel?', answer: 'Perbandingan SKN vs BI-Fast:\n\nBiaya: SKN Rp 2.900–5.000 | BI-Fast Rp 2.500 (flat)\nKecepatan: SKN 2–4 jam | BI-Fast real-time (detik)\nJam Operasional: SKN Senin–Jumat 08.00–14.00 | BI-Fast 24/7/365\nLimit: SKN maks Rp 500 juta | BI-Fast maks Rp 250 juta\nProxy Address: SKN tidak ada | BI-Fast ada (No. HP/email)\n\nRekomendasi: Untuk mayoritas kasus, BI-Fast lebih menguntungkan. SKN relevan untuk nilai Rp 250–500 juta.', tags: ['skn', 'bi-fast', 'perbandingan', 'transfer'] },
  { id: 7, category: 'Valas', question: 'Bagaimana cara membedakan USD asli vs palsu tanpa alat UV?', answer: 'Metode 3D tanpa alat UV untuk USD:\n\n👁️ DILIHAT:\n- Miringkan uang – angka kanan bawah (Color Shifting Ink) berubah dari tembaga ke hijau\n- Pita biru 3D Security Ribbon dengan lonceng kecil bergerak saat dimiringkan\n- Kualitas cetak sangat tajam dan detail\n\n✋ DIRABA:\n- Permukaan terasa kasar/tidak rata di area portrait dan teks\n- Kertas terasa berbeda dari kertas biasa (campuran linen+kapas)\n\n💡 DITERAWANG:\n- Watermark portrait Franklin terlihat samar di sisi kanan\n- Angka 100 terlihat dalam kertas\n\n⚠️ Jika salah satu tidak terpenuhi, jangan terima – laporkan ke supervisor.', tags: ['usd', 'palsu', 'deteksi', '3D'] },
  { id: 8, category: 'Operasional', question: 'Apa yang harus dilakukan jika nasabah memaksa menyerahkan uang yang diduga palsu?', answer: 'Prosedur jika nasabah memaksa menyerahkan uang yang diduga palsu:\n\n1. TETAP TENANG – jangan konfrontasi langsung\n2. Tolak secara sopan: "Mohon maaf, kami tidak dapat memproses uang ini sesuai prosedur"\n3. Jangan kembalikan uang jika ada keraguan kuat – dokumentasikan\n4. Segera hubungi supervisor/kepala teller\n5. Catat identitas nasabah (nama, nomor KTP, nomor antrian)\n6. Jika nasabah meninggalkan uang – amankan sebagai barang bukti\n7. Buat laporan tertulis ke Satuan Kerja Kepatuhan\n8. Jangan pernah menuduh nasabah di depan umum', tags: ['uang palsu', 'prosedur', 'nasabah', 'keamanan'] },
  { id: 9, category: 'Valas', question: 'Mengapa pecahan EUR €500 tidak bisa diterima di Bank BTN?', answer: 'Pecahan EUR €500 tidak diterima di Bank BTN karena:\n\n🏛️ Alasan Regulasi ECB:\n- ECB menghentikan penerbitan baru €500 sejak 2019\n- Sebagian besar bank komersial global menolak menerima atau mengkonversi pecahan ini\n\n⚠️ Alasan Keamanan:\n- Sering digunakan dalam transaksi ilegal dan pencucian uang\n- Likuiditas sangat rendah\n- Risiko pemalsuan tinggi\n\n📋 Kebijakan Internal:\n- Sesuai kebijakan Bank BTN dan rekomendasi BI, pecahan €500 masuk daftar valas yang tidak dapat ditransaksikan\n- Arahkan nasabah ke bank sentral atau money changer resmi', tags: ['EUR', 'euro', '500', 'kebijakan', 'ECB'] },
  { id: 10, category: 'Transfer', question: 'Apakah nasabah perlu mengisi form khusus untuk setiap jenis transfer?', answer: 'Ya, setiap jalur transfer memiliki form berbeda:\n\n📋 Form Transfer:\n- RTGS: Form Transfer Dana RTGS (wajib menyertakan keterangan/berita transfer)\n- SKN/LLG: Form Setoran Kliring atau Form Transfer SKN\n- BI-Fast: Di teller menggunakan form transfer umum; bisa via mobile/internet banking\n- Kliring Warkat: Formulir Setoran Warkat + fisik warkat (cek/BG)\n\n📎 Dokumen Pendukung:\n- Semua transfer: KTP nasabah\n- Valas > USD 25.000 ekuivalen: Underlying dokumen wajib', tags: ['form', 'transfer', 'dokumen', 'prosedur'] },
];

export const INITIAL_FORUM = [
  { id: 1, title: 'Tips cepat membedakan USD 2013 vs USD 2006 di loket ramai', category: 'Valas', author: 'Teller_Surabaya_01', branch: 'KC Surabaya Mayjen Sungkono', content: 'Teman-teman, setelah setahun bertugas saya menemukan cara paling cepat membedakan keduanya tanpa alat: pegang di bawah lampu ruangan dan lihat pita 3D (warna biru). Emisi 2013 pitanya lebih lebar dan efek loncengnya lebih jelas. Emisi 2006 tidak punya pita biru ini sama sekali. Semoga membantu!', replies: [{ id: 101, author: 'CS_Jakarta_Pusat', content: 'Terima kasih tipsnya! Tambahan: kalau emisi 2006, jendela watermark-nya lebih kecil dari emisi 2013.', timestamp: new Date('2024-11-15T10:30:00').toISOString() }], timestamp: new Date('2024-11-14T08:00:00').toISOString(), views: 234, likes: 18 },
  { id: 2, title: 'Pengalaman menolak BG kosong – cara menjelaskan ke nasabah', category: 'Warkat', author: 'Teller_Malang_03', branch: 'KC Malang', content: 'Pernah ada nasabah yang marah besar saat BG-nya ditolak karena saldo kosong. Yang berhasil menenangkan adalah menunjukkan langsung print-out konfirmasi dari sistem bahwa saldo memang tidak cukup, bukan keputusan teller pribadi. Sambil tawarkan solusi: "Pak, kalau saldo sudah tercukupi, BG ini bisa dikliringkan kembali."', replies: [], timestamp: new Date('2024-11-20T14:00:00').toISOString(), views: 187, likes: 24 },
  { id: 3, title: 'BI-Fast jam 23.00 – pengalaman transfer berhasil saat darurat', category: 'Transfer', author: 'Teller_Bekasi_07', branch: 'KCP Bekasi Selatan', content: 'Kemarin nasabah datang minta transfer jam 22.30 untuk bayar DP rumah yang deadline tengah malam. Berhasil pakai BI-Fast, dana masuk dalam 10 detik! Nasabah hampir menangis kegirangan. Ini yang bikin kerja di bank itu berasa bermakna!', replies: [{ id: 301, author: 'Supervisor_Surabaya', content: 'Good job! BI-Fast memang game changer. Pastikan nasabah tahu fitur ini di internet banking mereka juga.', timestamp: new Date('2024-11-21T09:00:00').toISOString() }], timestamp: new Date('2024-11-21T07:00:00').toISOString(), views: 312, likes: 45 },
];

export const initLocalStorage = () => {
  if (!localStorage.getItem('ceod_currencies')) localStorage.setItem('ceod_currencies', JSON.stringify(INITIAL_CURRENCIES));
  if (!localStorage.getItem('ceod_transfers')) localStorage.setItem('ceod_transfers', JSON.stringify(INITIAL_TRANSFERS));
  if (!localStorage.getItem('ceod_faq')) localStorage.setItem('ceod_faq', JSON.stringify(INITIAL_FAQ));
  if (!localStorage.getItem('ceod_forum')) localStorage.setItem('ceod_forum', JSON.stringify(INITIAL_FORUM));
};

export const getFromStorage = (key) => {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; }
};

export const saveToStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; }
};

export const resetStorage = () => {
  ['ceod_currencies','ceod_transfers','ceod_faq','ceod_forum'].forEach(k => localStorage.removeItem(k));
  initLocalStorage();
};

// ============================================================
// DATA TAMBAHAN — Kurs, Berita, Cabang, Remittance
// ============================================================

// ── Tambahan kunci LocalStorage ──────────────────────────────
export const EXTRA_STORAGE_KEYS = {
  RATES:    'ceod_rates',
  RATES_HISTORY: 'ceod_rates_history',
  NEWS:     'ceod_news',
  BRANCHES: 'ceod_branches',
};

// ── Data kurs hari ini (dummy) ────────────────────────────────
const TODAY = new Date();
function dStr(daysAgo) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// Kurs dasar mid per currency (USD = 1)
const MID_BASE = {
  USD: 16250, SGD: 12100, EUR: 17800, GBP: 20500,
  JPY: 108,   AUD: 10600, CNY: 2240,  SAR: 4330,
  HKD: 2080,  MYR: 3620,
};

const SPREAD_TT  = 0.008; // 0.8% spread TT
const SPREAD_UKA = 0.018; // 1.8% spread UKA (banknote)

function buildRate(code, mid) {
  return {
    code,
    ttBuy:  Math.round(mid * (1 - SPREAD_TT)),
    ttSell: Math.round(mid * (1 + SPREAD_TT)),
    ukaBuy: Math.round(mid * (1 - SPREAD_UKA)),
    ukaSell:Math.round(mid * (1 + SPREAD_UKA)),
    mid,
    updatedAt: new Date().toISOString(),
  };
}

export const INITIAL_RATES = Object.entries(MID_BASE).map(([code, mid]) =>
  buildRate(code, mid)
);

// ── Historis kurs 30 hari (untuk Recharts) ───────────────────
// Setiap item: { date: "YYYY-MM-DD", USD: mid, SGD: mid, ... }
function generateHistory(days = 30) {
  const history = [];
  for (let i = days; i >= 0; i--) {
    const entry = { date: dStr(i) };
    Object.entries(MID_BASE).forEach(([code, baseMid]) => {
      // Simulasi fluktuasi ±1.5% acak tapi relatif stabil
      const drift = (Math.sin(i * 0.4 + code.charCodeAt(0)) * 0.012 +
                     Math.cos(i * 0.7 + code.charCodeAt(1)) * 0.008);
      entry[code] = Math.round(baseMid * (1 + drift));
    });
    history.push(entry);
  }
  return history;
}
export const INITIAL_RATES_HISTORY = generateHistory(30);

// ── Data berita / pengumuman awal ─────────────────────────────
export const INITIAL_NEWS = [
  {
    id: 1,
    title: 'Pemberitahuan: Pembaruan Limit Transaksi BI-Fast Efektif 1 Juli 2026',
    category: 'Regulasi',
    priority: 'high',
    content: `Bank Indonesia melalui Surat Edaran No.24/XX/DKSP menetapkan kenaikan batas maksimum transaksi BI-Fast dari Rp 250 juta menjadi Rp 500 juta per transaksi, efektif 1 Juli 2026.\n\nPoin penting yang perlu diperhatikan:\n- Limit baru Rp 500 juta berlaku untuk semua channel (teller, mobile, internet banking)\n- Biaya transaksi tetap Rp 2.500 (tidak berubah)\n- Nasabah tidak perlu melakukan pendaftaran ulang\n\nSosialisasikan kepada nasabah yang selama ini menggunakan RTGS untuk transaksi Rp 250–500 juta, karena kini bisa beralih ke BI-Fast dengan biaya lebih murah.`,
    author: 'Tim Kepatuhan Bank BTN',
    date: dStr(2),
    tags: ['BI-Fast', 'limit', 'regulasi'],
  },
  {
    id: 2,
    title: 'WASPADA: Modus Penipuan QR Code Palsu di Loket Teller',
    category: 'Keamanan',
    priority: 'high',
    content: `Ditemukan modus penipuan baru di beberapa kota: pelaku memasang QR Code palsu di atas QR Code resmi Bank BTN di area loket teller.\n\nCiri-ciri QR Code palsu:\n- Stiker QR Code ditempel di atas QR asli (terasa sedikit lebih tebal)\n- Tidak mencantumkan logo Bank BTN yang jelas\n- Tujuan pembayaran menuju rekening pribadi, bukan rekening BTN\n\nTindakan preventif:\n1. Periksa QR Code di area loket setiap pagi sebelum operasional\n2. Laporkan segera ke supervisor jika menemukan kejanggalan\n3. Edukasi nasabah untuk selalu memverifikasi nama penerima sebelum konfirmasi pembayaran`,
    author: 'Satuan Kerja Keamanan',
    date: dStr(5),
    tags: ['keamanan', 'penipuan', 'QR code'],
  },
  {
    id: 3,
    title: 'Gangguan Layanan SWIFT: Beberapa Koridor Terdampak (14–15 Juli 2026)',
    category: 'Operasional',
    priority: 'medium',
    content: `SWIFT melaporkan gangguan teknis pada messaging platform yang berdampak pada beberapa koridor remittance, khususnya ke Timur Tengah dan Asia Selatan.\n\nStatus terkini (per 14 Juli 2026, 09:00 WIB):\n- Koridor ke Arab Saudi (SAR): Delay 2–4 jam dari SLA normal\n- Koridor ke Pakistan & Bangladesh: Sementara ditangguhkan\n- Koridor lain: Beroperasi normal\n\nPanduan untuk teller:\n- Informasikan kepada nasabah yang hendak kirim ke negara terdampak\n- Minta nasabah mengkonfirmasi ulang keesokan harinya\n- Catat semua transaksi yang tertunda di log harian`,
    author: 'Divisi Treasury & Correspondent Banking',
    date: dStr(1),
    tags: ['SWIFT', 'remittance', 'gangguan'],
  },
  {
    id: 4,
    title: 'Update Daftar Sanksi OFAC & PBB – Wajib Diperbarui di Sistem Screening',
    category: 'Kepatuhan',
    priority: 'high',
    content: `Daftar sanksi terbaru dari OFAC (Office of Foreign Assets Control) dan Dewan Keamanan PBB telah diperbarui per 10 Juli 2026. Terdapat 47 entitas baru (individu dan perusahaan) yang dimasukkan ke dalam daftar sanksi global.\n\nKewajiban:\n1. Tim IT/Core Banking telah memperbarui database screening otomatis\n2. Untuk transaksi manual/override: Teller dan CS WAJIB melakukan pengecekan ulang di portal BI-SAK sebelum memproses\n3. Khusus transfer valas dan remittance: Lakukan double-check terhadap nama pengirim DAN penerima\n\nLink pengecekan: Portal BI-SAK (akses melalui intranet cabang)`,
    author: 'Unit APU-PPT Bank BTN',
    date: dStr(4),
    tags: ['sanksi', 'OFAC', 'kepatuhan', 'APU-PPT'],
  },
];

// ── Data cabang awal ──────────────────────────────────────────
export const INITIAL_BRANCHES = [
  { code:'BTN-KCI-001', name:'KC Utama Jakarta Selatan', region:'DKI Jakarta', type:'KC', idrLiq: 8500000000, usdLiq: 250000, eurLiq: 50000, updatedAt: dStr(0) },
  { code:'BTN-KCI-002', name:'KC Jakarta Barat', region:'DKI Jakarta', type:'KC', idrLiq: 6200000000, usdLiq: 180000, eurLiq: 30000, updatedAt: dStr(0) },
  { code:'BTN-KCI-003', name:'KC Jakarta Timur', region:'DKI Jakarta', type:'KC', idrLiq: 5100000000, usdLiq: 120000, eurLiq: 20000, updatedAt: dStr(1) },
  { code:'BTN-KCI-004', name:'KC Jakarta Utara', region:'DKI Jakarta', type:'KC', idrLiq: 4300000000, usdLiq: 95000,  eurLiq: 15000, updatedAt: dStr(1) },
  { code:'BTN-KCP-001', name:'KCP Menteng', region:'DKI Jakarta', type:'KCP', idrLiq: 1200000000, usdLiq: 30000, eurLiq: 5000, updatedAt: dStr(0) },
  { code:'BTN-KCP-002', name:'KCP Kebayoran Baru', region:'DKI Jakarta', type:'KCP', idrLiq: 980000000, usdLiq: 25000, eurLiq: 4000, updatedAt: dStr(0) },
  { code:'BTN-KC-SBY-001', name:'KC Surabaya Mayjen Sungkono', region:'Jawa Timur', type:'KC', idrLiq: 7800000000, usdLiq: 210000, eurLiq: 45000, updatedAt: dStr(0) },
  { code:'BTN-KC-SBY-002', name:'KC Surabaya Rungkut', region:'Jawa Timur', type:'KC', idrLiq: 3900000000, usdLiq: 90000, eurLiq: 18000, updatedAt: dStr(1) },
  { code:'BTN-KCP-SBY-001', name:'KCP Sidoarjo Gedangan', region:'Jawa Timur', type:'KCP', idrLiq: 850000000, usdLiq: 20000, eurLiq: 3000, updatedAt: dStr(0) },
  { code:'BTN-KCP-SBY-002', name:'KCP Sidoarjo Waru', region:'Jawa Timur', type:'KCP', idrLiq: 720000000, usdLiq: 15000, eurLiq: 2500, updatedAt: dStr(1) },
  { code:'BTN-KC-MLG-001', name:'KC Malang', region:'Jawa Timur', type:'KC', idrLiq: 4100000000, usdLiq: 100000, eurLiq: 20000, updatedAt: dStr(0) },
  { code:'BTN-KC-BDG-001', name:'KC Bandung Asia Afrika', region:'Jawa Barat', type:'KC', idrLiq: 5500000000, usdLiq: 140000, eurLiq: 28000, updatedAt: dStr(0) },
  { code:'BTN-KCP-BDG-001', name:'KCP Bandung Dago', region:'Jawa Barat', type:'KCP', idrLiq: 1100000000, usdLiq: 22000, eurLiq: 4000, updatedAt: dStr(2) },
  { code:'BTN-KC-SMG-001', name:'KC Semarang Pemuda', region:'Jawa Tengah', type:'KC', idrLiq: 4800000000, usdLiq: 115000, eurLiq: 22000, updatedAt: dStr(0) },
  { code:'BTN-KC-MKS-001', name:'KC Makassar Ahmad Yani', region:'Sulawesi Selatan', type:'KC', idrLiq: 3600000000, usdLiq: 80000, eurLiq: 15000, updatedAt: dStr(1) },
  { code:'BTN-KC-MDN-001', name:'KC Medan Imam Bonjol', region:'Sumatera Utara', type:'KC', idrLiq: 5200000000, usdLiq: 125000, eurLiq: 25000, updatedAt: dStr(0) },
  { code:'BTN-KCP-MDN-001', name:'KCP Medan Polonia', region:'Sumatera Utara', type:'KCP', idrLiq: 890000000, usdLiq: 18000, eurLiq: 3000, updatedAt: dStr(1) },
  { code:'BTN-KC-DPS-001', name:'KC Denpasar Teuku Umar', region:'Bali', type:'KC', idrLiq: 6800000000, usdLiq: 320000, eurLiq: 80000, updatedAt: dStr(0) },
  { code:'BTN-KCP-DPS-001', name:'KCP Kuta', region:'Bali', type:'KCP', idrLiq: 2100000000, usdLiq: 150000, eurLiq: 40000, updatedAt: dStr(0) },
  { code:'BTN-KC-YGY-001', name:'KC Yogyakarta Sudirman', region:'DI Yogyakarta', type:'KC', idrLiq: 3200000000, usdLiq: 75000, eurLiq: 14000, updatedAt: dStr(1) },
];

