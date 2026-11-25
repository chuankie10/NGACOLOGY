# NGACOLOGY

**JAWABAN BOLEH NGAWUR, POIN HARUS TINGGI!**

NGACOLOGY adalah game kuis tebak-jawaban bergaya arcade, dibuat mobile-first untuk layar vertikal dan sesi hiburan/live.

## Jalankan
Buka `index.html` melalui browser atau host sebagai situs statis. Tidak memerlukan instalasi aplikasi maupun server untuk mode simulasi.

## Fitur versi awal
- 50 pertanyaan berbahasa Indonesia, masing-masing dengan 5 jawaban.
- Timer 60 detik per ronde.
- Nilai jawaban acak: 10, 25, 50, 100, atau 200 poin.
- Leaderboard Top 5 dan gelar pemain.
- Input nama dan jawaban secara manual.
- Auto-Bot untuk simulasi permainan.
- Efek suara sederhana dan animasi.
- Panel koneksi TikTok LIVE melalui server lokal Node.js di HP Android.

## Catatan integrasi TikTok
Mode yang tersedia saat ini adalah simulasi komentar di browser. Hook global disiapkan untuk integrasi, tetapi koneksi TikTok Live sungguhan memerlukan layanan/konektor eksternal yang kompatibel dan konfigurasi terpisah. Jangan menganggap chat simulasi sebagai chat live sungguhan.

## Integrasi TikTok LIVE (uji coba gratis dari HP Android)

Server penghubung dapat dijalankan langsung di HP Android menggunakan Termux. Dengan cara ini tidak diperlukan Render, kartu pembayaran, VPS, atau hosting berbayar.

- Target LIVE: `chuanki10` (dapat diubah melalui variabel `TIKTOK_USERNAME`).
- Server lokal menyajikan game dan membaca komentar LIVE pada proses Node.js yang sama.
- Browser game terhubung ke `http://127.0.0.1:3000`; alamat ini hanya berlaku pada HP yang menjalankan Termux.
- Tidak diperlukan password, OTP, cookie, atau login TikTok untuk membaca LIVE publik.
- `tiktok-live-connector` adalah konektor tidak resmi/reverse-engineered. TikTok dapat mengubah protokol dan koneksi dapat gagal sewaktu-waktu.
- Konektor menggunakan layanan signing pihak ketiga (Euler Stream) dengan batas komunitas gratis; ketersediaan dan batas gratisnya tidak dijamin.
- Library konektor berlisensi AGPL-3.0.

### Persiapan satu kali di HP Android

1. Instal Termux dari sumber resmi F-Droid atau GitHub Termux. Hindari versi Play Store yang sudah usang.
2. Buka Termux dan jalankan perintah berikut:

```bash
pkg update -y && pkg install -y git nodejs-lts
git clone https://github.com/chuankie10/NGACOLOGY.git
cd NGACOLOGY/server && npm install
```

### Setiap kali akan bermain LIVE

1. Buka Termux dan jalankan:

```bash
cd ~/NGACOLOGY && git pull --ff-only
cd server && npm start
```

2. Biarkan Termux tetap berjalan. Kembali ke Chrome pada HP yang sama dan buka `http://127.0.0.1:3000`.
3. Pada panel TIKTOK LIVE, pastikan alamat lokal `http://127.0.0.1:3000` terisi lalu tekan **HUBUNGKAN LIVE**.
4. Mulai TikTok LIVE pada akun `@chuanki10`. Komentar penonton akan diteruskan ke game setelah konektor mendeteksi LIVE.
5. Untuk menghentikan server, kembali ke Termux dan tekan `CTRL+C`.

**Catatan Android:** Jangan paksa berhenti Termux. Izinkan penggunaan baterai tanpa pembatasan bila Android menghentikan proses. Mode ini paling cocok untuk satu HP dan uji coba; jika Android menutup Termux atau koneksi internet terputus, pembacaan komentar ikut berhenti. Termux dan Chrome harus berjalan pada HP yang sama. Tidak ada jaminan uptime seperti server cloud.

## Pemeriksaan otomatis
Jalankan dengan Node.js 22 atau lebih baru:

```bash
node scripts/validate.mjs
```

GitHub Actions menjalankan pemeriksaan yang sama pada setiap push ke `main` dan pull request.

## Status pengujian

Pemeriksaan otomatis GitHub Actions saat ini mencakup:
- Sintaks JavaScript di halaman utama.
- Kesesuaian bank soal sumber dan data yang tertanam di game.
- 50 pertanyaan dan 250 jawaban.
- Simulasi 50 ronde, timer, jeda/lanjut, skor, penolakan jawaban duplikat, hook komentar, leaderboard, reset, dan main ulang.

Pemeriksaan otomatis belum menggantikan uji visual pada perangkat Android atau koneksi TikTok Live sungguhan.

## Mengaktifkan tautan web (satu kali)

Workflow deploy sudah disiapkan. Agar GitHub dapat menerbitkan game sebagai situs:
1. Buka repository **Settings**.
2. Pilih **Pages**.
3. Pada **Build and deployment**, pilih **GitHub Actions** sebagai Source.

Setelah Pages diaktifkan, workflow deployment dapat menerbitkan game di:
`https://chuankie10.github.io/NGACOLOGY/`

Jika situs belum tersedia, periksa tab **Actions** dan pastikan workflow **Deploy NGACOLOGY to GitHub Pages** berhasil.
