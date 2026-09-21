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

  // Play candle blowout sound (gentle breath whoosh + celebratory twinkle)
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Pink noise buffer for soft breath
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      // Followed by sweet twinkling chime
      setTimeout(() => {
        this.playSparkle();
      }, 250);
    } catch {
      // ignore
    }
  }

  // Play gift box unwrap sound
  public playGiftUnwrap() {
    if (this.isMuted) return;
    this.playSparkle();
  }

  // Music Box Melody: "Happy Birthday to You" (Key of C)
  public startMusicBox() {
    if (this.isMusicPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;

    // Melody: [frequency, duration in beats]
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const notes: [number, number][] = [
      [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2], // Happy birthday to you
      [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2], // Happy birthday to you
      [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 2], // Happy birthday dear Eraj
      [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2.5] // Happy birthday to you!
    ];

    let currentStep = 0;
    const tempo = 450; // ms per beat

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
