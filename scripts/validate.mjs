import fs from "node:fs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const serverPath = fileURLToPath(new URL("../server/index.js", import.meta.url));
const serverCheck = spawnSync(process.execPath, ["--check", serverPath], { encoding: "utf8" });
assert.equal(serverCheck.status, 0, "Sintaks server Node.js harus valid: " + (serverCheck.stderr || ""));
for (const scriptName of ["termux-setup.sh", "termux-start.sh", "termux-stop.sh"]) {
  const scriptPath = fileURLToPath(new URL("../scripts/" + scriptName, import.meta.url));
  const shellCheck = spawnSync("bash", ["-n", scriptPath], { encoding: "utf8" });
  assert.equal(shellCheck.status, 0, "Sintaks " + scriptName + " harus valid: " + (shellCheck.stderr || ""));
}

const bankFiles = ["questions-1.js", "questions-2.js", "questions3.js", "questions3b.js", "questions4.js", "questions5.js"];
let bank = [];
for (let i = 0; i < bankFiles.length; i++) {
  const source = fs.readFileSync(new URL("../" + bankFiles[i], import.meta.url), "utf8").trim();
  const json = i === 0
    ? source.replace(/^window\.NGACOLOGY_QUESTIONS\s*=\s*/, "").replace(/;\s*$/, "")
    : source.replace(/^window\.NGACOLOGY_QUESTIONS\.push\(\.\.\./, "").replace(/\);\s*$/, "");
  bank.push(...JSON.parse(json));
}
assert.equal(bank.length, 50, "Bank soal harus berisi tepat 50 pertanyaan");
assert.ok(bank.every(q => typeof q.question === "string" && Array.isArray(q.answers) && q.answers.length === 5), "Setiap pertanyaan harus memiliki 5 jawaban");
assert.ok(bank.every(q => q.answers.every(a => typeof a === "string" && a.trim().length > 0 && !/\s/.test(a))), "Semua jawaban harus tepat satu kata tanpa spasi");

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, "Harus ada tepat satu inline script utama");
new Function(scripts[0][1]);
for (const file of bankFiles) assert.ok(html.includes('src="./' + file + '"'), "File bank soal tidak dimuat: " + file);

for (const required of [
  'const QUESTION_BANK = window.NGACOLOGY_QUESTIONS',
  'function showLevelUp(name,title)',
  'levelPopupTimer=setTimeout',
  '},5000)',
  'level-viewer-name',
  'level-rank-title',
  'const WEIGHTS = [10,25,50,100,200]',
  '{min:10000,title:"👑 Dewa Kekacauan"}',
  '{min:6000,title:"🏆 Legenda Ngaco"}',
  '{min:5000,title:"🧠 Titipan Einstein"}',
  '{min:4000,title:"🌟 Master Idola"}',
  '{min:3000,title:"🎓 Doktor Titipan"}',
  '{min:2000,title:"📚 Calon Sarjana"}',
  '{min:1000,title:"🐣 Anak Magang Ngaco"}',
  '{min:0,title:""}',
  '.rank-dewa{color:#ffd700!important',
  'Math.floor(old.score/1000)>Math.floor((old.score-points)/1000)',
  'function startRound()',
  'function endRound(message)',
  'function finishGame()',
  'function drawBoard()',
  'function startBot()',
  'window.handleTikTokComment',
  'id="tiktokPanel"',
  'tiktok:chat',
  'bridgeConnectBtn',
  'http://127.0.0.1:3000',
  '127\\.0\\.0\\.1',
  'state.phase==="finished"'
]) assert.ok(html.includes(required), "Fitur penting tidak ditemukan: " + required);

console.log("NGACOLOGY validation PASS: 50 pertanyaan, 250 jawaban satu kata, game, scoring, timer, leaderboard, Auto-Bot, TikTok hook, Node bridge dan skrip Android Termux.");
