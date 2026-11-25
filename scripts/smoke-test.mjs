import fs from "node:fs";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const scriptMatch = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scriptMatch.length, 1);

class FakeElement {
  constructor(id = "") {
    this.id = id; this.children = []; this.listeners = {}; this.style = {};
    this.value = id === "username" ? "Penonton" : "";
    this.checked = false;
    this.disabled = false; this.textContent = ""; this.className = "";
    this.classList = {
      add: (...names) => { this._classes = new Set([...(this._classes || []), ...names]); },
      remove: (...names) => { for (const n of names) (this._classes || new Set()).delete(n); },
      toggle: (name, force) => {
        this._classes ||= new Set();
        const on = force === undefined ? !this._classes.has(name) : force;
        if (on) this._classes.add(name); else this._classes.delete(name);
        return on;
      }
    };
  }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = [...items]; }
  setAttribute() {}
  focus() {}
  get scrollHeight() { return this.children.length; }
  set innerHTML(value) { this._html = value; this.children = []; }
  get innerHTML() { return this._html || ""; }
}
const elements = new Map();
const document = {
  getElementById(id) { if (!elements.has(id)) elements.set(id, new FakeElement(id)); return elements.get(id); },
  createElement() { return new FakeElement(); },
  createTextNode(text) { return {textContent:String(text)}; }
};
let timerId = 0;
const timers = new Map();
const setIntervalFake = fn => { const id=++timerId; timers.set(id,fn); return id; };
const clearIntervalFake = id => timers.delete(id);
const setTimeoutFake = fn => { const id=++timerId; timers.set(id,fn); return id; };
const clearTimeoutFake = id => timers.delete(id);
const window = {};
const boot = new Function("document","window","setInterval","clearInterval","setTimeout","clearTimeout",
  scriptMatch[0][1] + "\nreturn {state, QUESTION_BANK};");
const {state, QUESTION_BANK} = boot(document,window,setIntervalFake,clearIntervalFake,setTimeoutFake,clearTimeoutFake);
document.getElementById("botToggle").checked = false;
const durationSelect=document.getElementById("roundDuration");
for(const seconds of ["60","90","120"]){durationSelect.value=seconds;durationSelect.listeners.change();assert.equal(state.roundDuration,Number(seconds));}
durationSelect.value="90";durationSelect.listeners.change();
document.getElementById("startBtn").listeners.click();
assert.equal(state.phase,"playing");
assert.equal(state.seconds,90,"Ronde harus mengikuti pilihan durasi 90 detik");
assert.equal(document.getElementById("answers").children.length,5);
assert.equal(QUESTION_BANK.length,50);
timers.get(state.timer)();
assert.equal(state.seconds,89,"Timer 90 detik harus berkurang menjadi 89");
document.getElementById("startBtn").listeners.click();
assert.equal(state.phase,"paused");
document.getElementById("startBtn").listeners.click();
assert.equal(state.phase,"playing");

const q = QUESTION_BANK[state.order[state.round]];
const firstAnswer = q.answers[0];
window.handleTikTokComment("Pemain Satu","",firstAnswer);
const scoreAfterFirst = state.players.get("pemain satu").score;
assert.ok(scoreAfterFirst > 0);
assert.equal(state.found.size,1);
window.handleTikTokComment("Pemain Satu","",firstAnswer);
assert.equal(state.players.get("pemain satu").score,scoreAfterFirst,"Jawaban duplikat tidak boleh menambah poin");

document.getElementById("advanceMode").value="manual";
document.getElementById("advanceMode").listeners.change();
for (let i=1;i<5;i++) window.handleTikTokComment("Pemain "+(i+1),"",q.answers[i]);
assert.equal(state.found.size,5);
assert.equal(state.phase,"round-ended");
assert.equal(state.advance,null,"Mode manual tidak boleh menjadwalkan ronde otomatis");
assert.equal(document.getElementById("nextBtn").disabled,false);
assert.equal(document.getElementById("startBtn").disabled,true);
assert.equal([...state.players.values()].reduce((n,p)=>n+p.score,0),385,"Total bobot satu ronde harus 385");
assert.ok(document.getElementById("leaderboard").children.length>=1);

durationSelect.value="60";durationSelect.listeners.change();
document.getElementById("nextBtn").listeners.click();
assert.equal(state.round,1);
assert.equal(state.seconds,60,"Ronde berikutnya harus memakai pilihan durasi 60 detik");
assert.equal(state.phase,"playing");
assert.equal(document.getElementById("startBtn").disabled,false);
document.getElementById("advanceMode").value="auto";
document.getElementById("advanceMode").listeners.change();
document.getElementById("startBtn").listeners.click();
assert.equal(state.phase,"paused");
document.getElementById("startBtn").listeners.click();
assert.equal(state.phase,"playing");
const q2=QUESTION_BANK[state.order[state.round]];
for(let i=0;i<5;i++) window.handleTikTokComment("Auto "+(i+1),"",q2.answers[i]);
assert.equal(state.phase,"round-ended");
assert.notEqual(state.advance,null,"Mode otomatis harus menjadwalkan perpindahan ronde");
document.getElementById("nextBtn").listeners.click();
assert.equal(state.round,2,"Tombol lanjut harus bisa mempercepat mode otomatis");

document.getElementById("resetBtn").listeners.click();
assert.equal(state.phase,"idle");
assert.equal(state.players.size,0);
console.log("NGACOLOGY smoke test PASS: selectable 60/90/120-second durations, timer countdown, scoring, duplicate protection, TikTok hook, auto/manual round advance, pause/resume, reset.");
