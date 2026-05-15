// Memoria 抽卡音效 · 频率共鸣 + 二次元 chime 融合(跟 battle 同空间感、同 select 频)
const SFX = {
  ctx: null,
  masterGain: null,
  dryGain: null,
  wetGain: null,
  reverb: null,
  enabled: (function(){
    try { const v = localStorage.getItem('sfx_enabled'); return v === null ? true : v === '1'; }
    catch(e){ return true; }
  })(),
  vibrateEnabled: (function(){
    try { const v = localStorage.getItem('vibrate_enabled'); return v === null ? true : v === '1'; }
    catch(e){ return true; }
  })(),

  setEnabled(on) {
    this.enabled = !!on;
    try { localStorage.setItem('sfx_enabled', on ? '1' : '0'); } catch(e){}
    if (this.masterGain) this.masterGain.gain.value = on ? 0.5 : 0;
  },

  setVibrateEnabled(on) {
    this.vibrateEnabled = !!on;
    try { localStorage.setItem('vibrate_enabled', on ? '1' : '0'); } catch(e){}
  },

  _makeIR(duration, decay){
    const c = this.ctx;
    const len = Math.floor(c.sampleRate * duration);
    const ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++){
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++){
        const fade = Math.pow(1 - i / len, decay);
        data[i] = (Math.random() * 2 - 1) * fade * 0.6;
      }
    }
    return ir;
  },

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? 0.5 : 0;
      this.masterGain.connect(this.ctx.destination);

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.85;
      this.dryGain.connect(this.masterGain);

      // 拉长 IR 尾巴跟 battle 同空间感（battle 用 2.5s/decay 2.2），保留稍紧的 1.6s/2.2
      this.reverb = this.ctx.createConvolver();
      this.reverb.buffer = this._makeIR(1.6, 2.2);
      this.wetGain = this.ctx.createGain();
      this.wetGain.gain.value = 0.28;
      this.reverb.connect(this.wetGain);
      this.wetGain.connect(this.masterGain);
      this.dryGain.gain.value = 0.78;
    } catch (e) {
      this.enabled = false;
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  _bus(reverbAmt = 0.2){
    const g = this.ctx.createGain();
    g.connect(this.dryGain);
    if (reverbAmt > 0){
      const sendG = this.ctx.createGain();
      sendG.gain.value = reverbAmt;
      g.connect(sendG);
      sendG.connect(this.reverb);
    }
    return g;
  },

  tone({ freq, type = 'sine', start = 0, dur = 0.2, gain = 0.22, attack = 0.005, release = 0.18, reverbAmt = 0.2, freqEnd = null }) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const out = this._bus(reverbAmt);
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(0.01, freqEnd), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur + release);
    osc.connect(g); g.connect(out);
    osc.start(t0); osc.stop(t0 + dur + release + 0.05);
  },

  chime({ freq, start = 0, dur = 0.3, gain = 0.2, attack = 0.003, release = 0.5, reverbAmt = 0.25 }){
    this.tone({ freq, type: 'sine', start, dur, gain, attack, release, reverbAmt });
    this.tone({ freq: freq * 2, type: 'sine', start, dur: dur * 0.8, gain: gain * 0.45, attack, release: release * 0.7, reverbAmt });
    this.tone({ freq: freq * 3, type: 'sine', start, dur: dur * 0.5, gain: gain * 0.18, attack, release: release * 0.5, reverbAmt: reverbAmt + 0.1 });
  },

  // ===== 业务音效 =====

  // click 对齐 battle select 1760Hz 基频 → 跨场景统一"频率确认"听感
  click() {
    this.init(); this.resume();
    this.tone({ freq: 1760, type: 'sine', dur: 0.05, gain: 0.11, attack: 0.001, release: 0.15, reverbAmt: 0.45 });
    this.tone({ freq: 2640, type: 'sine', start: 0.01, dur: 0.04, gain: 0.05, attack: 0.001, release: 0.2, reverbAmt: 0.55 });
  },

  cardFlip() {
    this.init(); this.resume();
    this.chime({ freq: 1320, dur: 0.1, gain: 0.13, release: 0.35, reverbAmt: 0.4 });
  },

  // 频率注入（共鸣同源 underlay）— 用在 SSR/SR 揭晓底层
  freqInject({ start = 0, gain = 0.1, dur = 0.8 } = {}) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const out = this._bus(0.7);
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(82, t0);
    osc.frequency.exponentialRampToValueAtTime(165, t0 + dur * 0.6);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur + 0.3);
    osc.connect(g); g.connect(out);
    osc.start(t0); osc.stop(t0 + dur + 0.4);
    // 5 度泛音
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine'; osc2.frequency.setValueAtTime(123, t0);
    osc2.frequency.exponentialRampToValueAtTime(247, t0 + dur * 0.6);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0, t0);
    g2.gain.linearRampToValueAtTime(gain * 0.5, t0 + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, t0 + dur + 0.3);
    osc2.connect(g2); g2.connect(out);
    osc2.start(t0); osc2.stop(t0 + dur + 0.4);
  },

  // R: do-mi-sol
  rReveal() {
    this.init(); this.resume();
    this.chime({ freq: 523.25, dur: 0.3, gain: 0.18, release: 0.5, reverbAmt: 0.25 });
    this.chime({ freq: 659.25, start: 0.08, dur: 0.3, gain: 0.16, release: 0.45, reverbAmt: 0.25 });
    this.chime({ freq: 783.99, start: 0.16, dur: 0.32, gain: 0.16, release: 0.5, reverbAmt: 0.3 });
  },

  // SR: 心动 arpeggio + 频率低 drone underlay
  srReveal() {
    this.init(); this.resume();
    this.freqInject({ gain: 0.07, dur: 0.6 });
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((f, i) => {
      this.chime({ freq: f, start: i * 0.07, dur: 0.2, gain: 0.16, release: 0.5, reverbAmt: 0.4 });
    });
    [2093, 2637, 3136].forEach((f, i) => {
      this.tone({ freq: f, type: 'sine', start: 0.35 + i * 0.05, dur: 0.1, gain: 0.07, release: 0.4, reverbAmt: 0.55 });
    });
  },

  // SSR: 频率注入 → 上扬礼花 → 高频闪烁（甜美 + 共鸣，无打击噪声）
  ssrReveal() {
    this.init(); this.resume();
    this.freqInject({ gain: 0.13, dur: 1.0 });
    const fundamentals = [523.25, 659.25, 783.99, 987.77];
    fundamentals.forEach((f, i) => {
      this.chime({ freq: f, start: 0.15 + i * 0.05, dur: 0.5, gain: 0.2, release: 0.8, reverbAmt: 0.45 });
    });
    [1046.5, 1318.51, 1568, 1975.53].forEach((f, i) => {
      this.chime({ freq: f, start: 0.4 + i * 0.04, dur: 0.4, gain: 0.12, release: 0.6, reverbAmt: 0.5 });
    });
    for (let i = 0; i < 15; i++){
      const f = 2349 + Math.random() * 2000;
      this.tone({ freq: f, type: 'sine', start: 0.3 + i * 0.05 + Math.random() * 0.03, dur: 0.06, gain: 0.05 + Math.random() * 0.04, release: 0.4, reverbAmt: 0.55 });
    }
    this.chime({ freq: 2637, start: 0.85, dur: 0.4, gain: 0.18, release: 0.7, reverbAmt: 0.5 });
  },

  // Cut-in: 频率注入开场（共鸣 charge 上扬）
  cutIn() {
    this.init(); this.resume();
    // 跟 battle 'charge' 同形：220→660 上扬 + 440→1320 泛音
    this.tone({ freq: 220, freqEnd: 660, type: 'sine', dur: 0.4, gain: 0.1, attack: 0.04, release: 0.5, reverbAmt: 0.45 });
    this.tone({ freq: 440, freqEnd: 1320, type: 'sine', start: 0.02, dur: 0.4, gain: 0.06, attack: 0.05, release: 0.5, reverbAmt: 0.55 });
    for (let i = 0; i < 6; i++){
      this.tone({ freq: 2349 + Math.random() * 1500, type: 'sine', start: 0.1 + i * 0.045, dur: 0.05, gain: 0.06, release: 0.3, reverbAmt: 0.55 });
    }
  },

  shake(intensity = 1) {
    const el = document.body;
    if (!el) return;
    el.style.willChange = 'transform';
    const dur = 400;
    const start = performance.now();
    const step = (t) => {
      const p = (t - start) / dur;
      if (p >= 1) { el.style.transform = ''; el.style.willChange = ''; return; }
      const dx = (Math.random() - 0.5) * 14 * intensity * (1 - p);
      const dy = (Math.random() - 0.5) * 14 * intensity * (1 - p);
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  vibrate(pattern) {
    if (!this.vibrateEnabled) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  }
};

document.addEventListener('click', () => SFX.resume(), { once: true });
document.addEventListener('touchstart', () => SFX.resume(), { once: true });
