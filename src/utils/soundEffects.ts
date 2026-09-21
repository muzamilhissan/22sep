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

  // Short burst of filtered noise (used for pops, crunches, stamps)
  private noise(dur: number, opts: { type?: BiquadFilterType; freq?: number; vol?: number; start?: number } = {}) {
    const ctx = this.getContext();
    if (!ctx) return;
    const { type = "bandpass", freq = 1200, vol = 0.3, start = 0 } = opts;
    try {
      const len = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = vol;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(ctx.currentTime + start);
    } catch {
      // ignore
    }
  }

  // Kitten "mew": a little rise-and-fall glide
  public playMew() {
    if (this.isMuted) return;
    const base = 700 + Math.random() * 150;
    this.tone(base, { type: "triangle", dur: 0.14, vol: 0.12, slideTo: base * 1.45 });
    this.tone(base * 1.45, { type: "triangle", start: 0.13, dur: 0.22, vol: 0.1, slideTo: base * 0.9 });
  }

  // Soft purr: low rumble pulsed by an LFO
  public playPurr() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.value = 55;
      filter.type = "lowpass";
      filter.frequency.value = 260;
      lfo.frequency.value = 24;
      lfoGain.gain.value = 0.05;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      lfo.start(t);
      osc.stop(t + 1.35);
      lfo.stop(t + 1.35);
    } catch {
      // ignore
    }
  }

  // Balloon pop: sharp noise crack + a tiny squeak
  public playBalloonPop() {
    if (this.isMuted) return;
    this.noise(0.08, { type: "highpass", freq: 900, vol: 0.45 });
    this.tone(1200 + Math.random() * 400, { start: 0.02, dur: 0.1, vol: 0.06, slideTo: 500 });
  }

  // Cookie crunch: a couple of crumbly noise bursts
  public playCrunch() {
    if (this.isMuted) return;
    this.noise(0.09, { freq: 2200, vol: 0.4 });
    this.noise(0.07, { freq: 1500, vol: 0.3, start: 0.07 });
    this.noise(0.05, { freq: 2800, vol: 0.2, start: 0.13 });
  }

  // Rubber stamp thud
  public playStamp() {
    if (this.isMuted) return;
    this.noise(0.1, { type: "lowpass", freq: 400, vol: 0.6 });
    this.tone(140, { dur: 0.14, vol: 0.2, slideTo: 70 });
  }

  // Sprinkles: a quick shower of tiny high blips
  public playSprinkle() {
    if (this.isMuted) return;
    for (let i = 0; i < 6; i++) {
      this.tone(1800 + Math.random() * 1600, { start: i * 0.035, dur: 0.05, vol: 0.05 });
    }
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
