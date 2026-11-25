#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== NGACOLOGY Android setup ==="
pkg update -y
pkg install -y git nodejs-lts

if [ -d "$HOME/NGACOLOGY/.git" ]; then
  git -C "$HOME/NGACOLOGY" pull --ff-only
else
  git clone https://github.com/chuankie10/NGACOLOGY.git "$HOME/NGACOLOGY"
fi

cd "$HOME/NGACOLOGY/server"
npm install

echo
echo "Setup selesai."
echo "Jalankan: bash $HOME/NGACOLOGY/scripts/termux-start.sh"
