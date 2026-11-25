#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$HOME/NGACOLOGY/server"
termux-wake-lock 2>/dev/null || true
echo "NGACOLOGY LIVE Bridge berjalan."
echo "Buka Chrome di HP yang sama: http://127.0.0.1:3000"
echo "Untuk menghentikan server, kembali ke Termux lalu tekan CTRL+C."
npm start
