class AudioService {
  private context: AudioContext | null = null;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  setMuted(m: boolean) { this.muted = m; }
  isMuted() { return this.muted; }

  playSFX(type: "correct" | "wrong" | "click") {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      if (type === "correct") {
        [[523,0],[659,0.08],[784,0.16],[1047,0.24]].forEach(([f,t]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "square"; o.frequency.value = f;
          g.gain.setValueAtTime(0, ctx.currentTime + t);
          g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.02);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.12);
          o.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.15);
        });
      } else if (type === "wrong") {
        [[220,0],[185,0.1],[155,0.2]].forEach(([f,t]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sawtooth"; o.frequency.value = f;
          g.gain.setValueAtTime(0.2, ctx.currentTime + t);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.12);
          o.connect(g); g.connect(ctx.destination);
          o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.15);
        });
      } else {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 440;
        g.gain.setValueAtTime(0.05, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.06);
      }
    } catch {}
  }

  // No-op stubs to keep compatibility with existing hooks
  async initialize() {}
  startAmbientMusic() {}
  stopMusic() {}
  async playTrack(_: string) {}
  async playFile(_: string) {}
  setMusicVolume(_: number) {}
  setVoiceVolume(_: number) {}
}

export const audioService = new AudioService();
