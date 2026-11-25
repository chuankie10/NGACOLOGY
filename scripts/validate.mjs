import fs from "node:fs";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bankFile = JSON.parse(fs.readFileSync(new URL("../bank-soal.json", import.meta.url), "utf8"));

assert.equal(bankFile.questions.length, 50, "Bank soal harus berisi 50 pertanyaan");
assert.ok(bankFile.questions.every(q => Array.isArray(q.answers) && q.answers.length === 5), "Setiap pertanyaan harus memiliki 5 jawaban");

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, "Harus ada tepat satu inline script utama");
new Function(scripts[0][1]);

const embeddedMatch = html.match(/const QUESTION_BANK = (\[[\s\S]*?\]);\nconst WEIGHTS/);
assert.ok(embeddedMatch, "Bank soal harus tertanam di halaman game");
const embeddedBank = JSON.parse(embeddedMatch[1]);
assert.equal(embeddedBank.length, 50, "Game harus memuat 50 pertanyaan");
assert.ok(embeddedBank.every(q => q.answers.length === 5), "Game harus memuat 5 jawaban per pertanyaan");
assert.deepEqual(embeddedBank, bankFile.questions.map(q => ({question:q.question, answers:q.answers.map(a => a.text)})), "Soal yang tertanam di game harus sama dengan bank-soal.json");

for (const required of [
  'const WEIGHTS = [10,25,50,100,200]',
  'function startRound()',
  'function endRound(message)',
  'function finishGame()',
  'function drawBoard()',
  'function startBot()',
  'window.handleTikTokComment',
  'state.phase==="finished"'
]) assert.ok(html.includes(required), 'Fitur penting tidak ditemukan: ' + required);

console.log("NGACOLOGY validation PASS: HTML script syntax, 50 questions, 250 answers, scoring, timer, leaderboard, Auto-Bot and TikTok hook.");
