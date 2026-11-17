/** Browser text-to-speech for dictation games (no network, works offline where voices exist). */

export function canSpeak(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-GB' && /natural|google|daniel|serena/i.test(v.name)) ??
    voices.find((v) => v.lang === 'en-US' && /natural|google|samantha/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith('en'))
  );
}

export function speak(text: string, rate = 0.92): void {
  if (!canSpeak() || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? 'en-US';
  u.rate = rate;
  synth.speak(u);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
