// SpeechSynthesis exposes voice names/languages, but no standard gender field.
// Prefer known male English voices, with British voices first for Morgan.
const maleNames = /\b(daniel|george|arthur|oliver|ryan|thomas|james|david|alex|fred|bruce|ralph|albert|guy|christopher|eric|roger|andrew|brian|reed|rocko|rishi|evan|nathan|lee|aaron|gordon)\b/i;
export function chooseMorganVoice(voices) {
  const english = voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang));
  const men = english.filter(v => maleNames.test(v.name));
  const rank = v => (/^en[-_]GB$/i.test(v.lang) ? 100 : 0)
    + (/\bdaniel\b/i.test(v.name) ? 40 : 0)
    + (/\bgeorge\b/i.test(v.name) ? 30 : 0)
    + (/natural|enhanced|premium/i.test(v.name) ? 10 : 0);
  return men.sort((a, b) => rank(b) - rank(a))[0] || english.find(v => v.default) || english[0] || null;
}
let cachedVoice = null;
if ('speechSynthesis' in window) {
  const refresh = () => { cachedVoice = chooseMorganVoice(window.speechSynthesis.getVoices()); };
  refresh();
  window.speechSynthesis.addEventListener('voiceschanged', refresh);
}
export function speakMorgan(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = chooseMorganVoice(synth.getVoices()) || cachedVoice;
  if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
  else utterance.lang = 'en-GB';
  utterance.rate = 0.78;
  utterance.pitch = 0.65;
  utterance.volume = 1;
  synth.speak(utterance);
}
