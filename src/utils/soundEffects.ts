// Web Audio API Synthesizer for Cute Sound Effects & Music Box Melody
// No external assets required - 100% reliable, zero latency, and works offline!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private musicTimeout: NodeJS.Timeout | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isMusicPlaying) {
      this.stopMusicBox();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play a soft cute bubble pop (for button taps, card flips)
  public playPop(freq = 600) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  // Play a magical chime/sparkle sweep
  public playSparkle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch {
          // ignore
        }
      }, idx * 60);
    });
  }

  // Tiny helper: one soft enveloped tone
  private tone(freq: number, opts: { type?: OscillatorType; start?: number; dur?: number; vol?: number; slideTo?: number } = {}) {
    const ctx = this.getContext();
    if (!ctx) return;
    const { type = "sine", start = 0, dur = 0.18, vol = 0.14, slideTo } = opts;
    try {
      const t = ctx.currentTime + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {
      // ignore
    }
  }

  // Bunny giggle: three quick, rising squeaks
  public playSqueak() {
    if (this.isMuted) return;
    const base = 900 + Math.random() * 200;
    [0, 0.09, 0.18].forEach((start, i) => {
      this.tone(base + i * 180, { type: "triangle", start, dur: 0.08, vol: 0.12, slideTo: base + i * 180 + 380 });
    });
  }

  // Soft cartoon "boop" (pitch drops like a squishy nose press)
  public playBoop() {
    if (this.isMuted) return;
    this.tone(720, { dur: 0.16, vol: 0.2, slideTo: 330 });
  }

  // Gentle harp-like pluck; step walks up a pentatonic scale so repeats sound like a tune
  public playPluck(step = 0) {
    if (this.isMuted) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
    const freq = scale[((step % scale.length) + scale.length) % scale.length];
    this.tone(freq, { type: "triangle", dur: 0.45, vol: 0.13 });
    this.tone(freq * 2, { dur: 0.3, vol: 0.04 });
  }

  // Paper-star unfold: a little two-note music-box chime
  public playChime() {
    if (this.isMuted) return;
    this.tone(1318.51, { dur: 0.5, vol: 0.09 });
    this.tone(1760, { start: 0.1, dur: 0.6, vol: 0.08 });
  }

  // Glass jar jiggle
  public playJiggle() {
    if (this.isMuted) return;
    [0, 0.06, 0.12].forEach((start, i) => this.tone(2100 - i * 250, { start, dur: 0.07, vol: 0.05 }));
  }

  // Camera shutter: short filtered noise click
  public playShutter() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const len = Math.floor(ctx.sampleRate * 0.06);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1800;
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      this.tone(1500, { start: 0.07, dur: 0.05, vol: 0.05 });
    } catch {
      // ignore
    }
  }

  // Rising heartbeat-ish tick while a hug is charging (progress 0..1)
  public playHugTick(progress: number) {
    if (this.isMuted) return;
    this.tone(300 + progress * 500, { dur: 0.09, vol: 0.08 });
  }

  // "Mwah!" — a quick kiss-like swoop down followed by sparkles
  public playKiss() {
    if (this.isMuted) return;
    this.tone(1400, { type: "triangle", dur: 0.12, vol: 0.14, slideTo: 600 });
    setTimeout(() => this.playSparkle(), 120);
  }

  // Music Box Melody: "Twinkle Twinkle Little Star" (public domain lullaby, key of C)
  public startMusicBox() {
    if (this.isMusicPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;

    // Melody: [frequency, duration in beats]
    const C = 261.63, D = 293.66, E = 329.63, F = 349.23, G = 392.0, A = 440.0;
    const notes: [number, number][] = [
      [C, 1], [C, 1], [G, 1], [G, 1], [A, 1], [A, 1], [G, 2],
      [F, 1], [F, 1], [E, 1], [E, 1], [D, 1], [D, 1], [C, 2],
      [G, 1], [G, 1], [F, 1], [F, 1], [E, 1], [E, 1], [D, 2],
      [G, 1], [G, 1], [F, 1], [F, 1], [E, 1], [E, 1], [D, 2],
      [C, 1], [C, 1], [G, 1], [G, 1], [A, 1], [A, 1], [G, 2],
      [F, 1], [F, 1], [E, 1], [E, 1], [D, 1], [D, 1], [C, 3]
    ];

    let currentStep = 0;
    const tempo = 420; // ms per beat

    const playNext = () => {
      if (!this.isMusicPlaying || this.isMuted) return;

      const [freq, durationBeats] = notes[currentStep];
      const durationMs = durationBeats * tempo;

      try {
        const c = this.getContext();
        if (c) {
          const osc = c.createOscillator();
          const gain = c.createGain();

          // Celesta/music box timbre (sine with gentle bell ring)
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq * 2, c.currentTime); // 1 octave higher for music-box sparkle

          gain.gain.setValueAtTime(0.08, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0005, c.currentTime + Math.min(1.2, durationBeats * 0.9));

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start();
          osc.stop(c.currentTime + 1.2);
        }
      } catch {
        // ignore
      }

      currentStep = (currentStep + 1) % notes.length;
      const nextDelay = currentStep === 0 ? durationMs + 2000 : durationMs; // pause at end of song before looping
      this.musicTimeout = setTimeout(playNext, nextDelay);
    };

    playNext();
  }

  public stopMusicBox() {
    this.isMusicPlaying = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusicBox();
      return false;
    } else {
      this.startMusicBox();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const sounds = new SoundEngine();
