# NGACOLOGY — Laporan Pengujian

Tanggal: 25 November 2026

## Lulus: pemeriksaan otomatis
- Sintaks JavaScript pada `index.html`.
- Bank sumber cocok dengan data yang tertanam pada game.
- Tepat 50 pertanyaan dan 250 jawaban.
- Bobot skor 10, 25, 50, 100, dan 200.
- Simulasi alur game 50 ronde.
- Timer 60 detik, jeda, lanjut, dan pergantian ronde.
- Jawaban duplikat tidak memberi poin dua kali.
- Skor satu ronde penuh berjumlah 385 poin.
- Hook komentar `window.handleTikTokComment`.
- Leaderboard, reset, dan mulai ulang game.

Workflow pemeriksaan otomatis terbaru: **berhasil**.
Run: https://github.com/chuankie10/NGACOLOGY/actions/runs/45547098637

## Belum dapat dinyatakan lulus
- Uji tampilan dan sentuhan langsung di HP Android.
- Uji suara melalui speaker/perangkat nyata.
- Uji komentar TikTok Live sungguhan.
- Uji beban banyak komentar masuk bersamaan.
- Uji penerbitan situs publik melalui GitHub Pages.

## Kendala penerbitan web
Workflow GitHub Pages sudah dibuat, tetapi GitHub menolak pembuatan Pages site otomatis dengan pesan `Resource not accessible by integration`. Pemilik repository perlu mengaktifkan satu kali melalui:

**Repository → Settings → Pages → Build and deployment → Source: GitHub Actions**

Setelah itu, push berikutnya akan mencoba deployment lagi. URL yang dituju:
https://chuankie10.github.io/NGACOLOGY/

## Batasan penting
Mode chat saat ini adalah simulasi browser. Hook integrasi disediakan, tetapi belum ada koneksi TikTok Live sungguhan. Lulusnya pemeriksaan otomatis tidak berarti aplikasi bebas dari semua bug atau sudah diuji pada perangkat fisik.
