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
- Panel koneksi TikTok LIVE melalui server penghubung (memerlukan deploy Render; belum aktif sampai server diterbitkan).

## Catatan integrasi TikTok
Mode yang tersedia saat ini adalah simulasi komentar di browser. Hook global disiapkan untuk integrasi, tetapi koneksi TikTok Live sungguhan memerlukan layanan/konektor eksternal yang kompatibel dan konfigurasi terpisah. Jangan menganggap chat simulasi sebagai chat live sungguhan.

## Integrasi TikTok LIVE (uji coba)

Repository ini sekarang menyertakan server Node.js pada folder `server/` dan konfigurasi Render Blueprint pada `render.yaml`.

- Server membaca komentar LIVE publik untuk akun yang ditetapkan melalui `TIKTOK_USERNAME` (default: `chuanki10`).
- Halaman game menerima komentar server melalui Socket.IO dan meneruskannya ke `window.handleTikTokComment()`.
- Tidak diperlukan password, OTP, cookie, atau login TikTok untuk membaca LIVE publik.
- Konektor `tiktok-live-connector` adalah proyek tidak resmi/reverse-engineered; TikTok dapat mengubah protokol dan koneksi bisa gagal sewaktu-waktu.
- Konektor ini menggunakan layanan signing pihak ketiga. Jangan menambahkan cookie atau kredensial akun ke konfigurasi.
- Library konektor berlisensi AGPL-3.0; kode integrasi server di repository ini tersedia secara publik.

### Deploy server penghubung
1. Masuk ke Render dan hubungkan akun GitHub.
2. Pilih **New → Blueprint** lalu pilih repository `chuankie10/NGACOLOGY`.
3. Render akan membaca `render.yaml`; pilih paket **Free** dan deploy.
4. Setelah layanan aktif, salin alamat `https://...onrender.com`.
5. Buka game NGACOLOGY, masukkan alamat tersebut di panel **TIKTOK LIVE**, lalu tekan **HUBUNGKAN LIVE**.

Render Free dapat tidur setelah 15 menit tanpa lalu lintas masuk; pesan WebSocket masuk menjaga layanan tetap aktif selama halaman game tersambung. Layanan gratis juga dapat restart sewaktu-waktu. Karena itu, integrasi ini untuk uji coba, bukan siaran penting/produksi.

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
