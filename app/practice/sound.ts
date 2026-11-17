/** Tiny synthesized sound effects (WebAudio, no assets). */
import { getState } from './store';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (!getState().settings.sound) return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  gain = 0.08,
) {
  const a = audio();
  if (!a) return;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = a.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  correct(combo = 0) {
    const base = 660 + Math.min(combo, 8) * 40;
    tone(base, 0, 0.12, 'triangle');
    tone(base * 1.5, 0.08, 0.16, 'triangle');
  },
  wrong() {
    tone(220, 0, 0.18, 'sawtooth', 0.04);
    tone(180, 0.1, 0.22, 'sawtooth', 0.04);
  },
  finish() {
    const notes = [523, 659, 784, 1047];
    for (let i = 0; i < notes.length; i++) tone(notes[i], i * 0.09, 0.25, 'triangle', 0.07);
  },
  tick() {
    tone(1200, 0, 0.04, 'square', 0.02);
  },
};
