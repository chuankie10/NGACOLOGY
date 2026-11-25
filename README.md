# NGACOLOGY

**Ilmu boleh ngawur, poin harus tinggi!**

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
- Hook `window.handleTikTokComment(username, avatarUrl, commentText)` sebagai titik integrasi untuk konektor komentar yang sah.

## Catatan integrasi TikTok
Mode yang tersedia saat ini adalah simulasi komentar di browser. Hook global disiapkan untuk integrasi, tetapi koneksi TikTok Live sungguhan memerlukan layanan/konektor eksternal yang kompatibel dan konfigurasi terpisah. Jangan menganggap chat simulasi sebagai chat live sungguhan.

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
