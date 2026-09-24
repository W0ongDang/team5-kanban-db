/** Original, synthesized pack effects. Audio stays off until setEnabled(true). */
export function createPackAudio() {
  const AudioContextClass = typeof window !== 'undefined'
    ? (window.AudioContext || window.webkitAudioContext)
    : null;
  let context = null;
  let master = null;
  let noiseBuffer = null;
  let isEnabled = false;
  let enableRequest = 0;
  let volume = 0.25;
  const cues = new Set();
  const floor = 0.0001;

  function dispose(cue) {
    if (!cues.delete(cue)) return;
    clearTimeout(cue.timer);
    for (const source of cue.sources) {
      source.onended = null;
      try { source.stop(); } catch { /* Source already finished. */ }
    }
    for (const node of cue.nodes) {
      try { node.disconnect(); } catch { /* Already disconnected. */ }
    }
    cue.nodes.clear();
    cue.sources.clear();
  }

  function stop() {
    if (!context) return;
    const now = context.currentTime;
    for (const cue of cues) {
      // Fade the entire cue, including voices scheduled to start in the future.
      const gain = cue.bus.gain;
      if (typeof gain.cancelAndHoldAtTime === 'function') {
        gain.cancelAndHoldAtTime(now);
      } else {
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(gain.value, now);
      }
      gain.linearRampToValueAtTime(0, now + 0.035);
      for (const source of cue.sources) {
        try { source.stop(now + 0.04); } catch { /* Source already finished. */ }
      }
      clearTimeout(cue.timer);
      // Also clean up when the browser suspends audio before onended is fired.
      cue.timer = setTimeout(() => dispose(cue), 100);
    }
  }

  async function setEnabled(value) {
    const request = ++enableRequest;
    isEnabled = false;
    if (!value || !AudioContextClass) {
      stop();
      return false;
    }
    try {
      if (!context) {
        // Attempted on page load and retried from a user gesture when autoplay is blocked.
        context = new AudioContextClass();
        master = context.createGain();
        master.gain.value = volume * 0.7;
        master.connect(context.destination);
      }
      if (context.state !== 'running') await context.resume();
      if (request !== enableRequest) return false;
      isEnabled = context.state === 'running';
      return isEnabled;
    } catch {
      if (request === enableRequest) {
        isEnabled = false;
        stop();
      }
      return false;
    }
  }

  function createCue(duration) {
    const bus = context.createGain();
    const start = context.currentTime;
    bus.gain.setValueAtTime(0, start);
    bus.gain.linearRampToValueAtTime(1, start + 0.02);
    bus.connect(master);
    const cue = { bus, start, nodes: new Set([bus]), sources: new Set(), timer: null };
    cues.add(cue);
    cue.timer = setTimeout(() => dispose(cue), (duration + 0.3) * 1000);
    return cue;
  }

  function setVolume(value) {
    if (!Number.isFinite(value)) return;
    volume = Math.max(0, Math.min(1, value));
    if (master) master.gain.setTargetAtTime(volume * 0.7, context.currentTime, 0.015);
  }

  function addSource(cue, source, gain, start, end, filters = []) {
    const nodes = [source, ...filters, gain];
    nodes.forEach((node) => cue.nodes.add(node));
    nodes.forEach((node, index) => node.connect(nodes[index + 1] || cue.bus));
    cue.sources.add(source);
    source.onended = () => {
      cue.sources.delete(source);
      for (const node of nodes) {
        node.disconnect();
        cue.nodes.delete(node);
      }
      if (!cue.sources.size) dispose(cue);
    };
    source.start(start);
    source.stop(end);
  }

  function noise() {
    if (!noiseBuffer) {
      noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
    }
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    return source;
  }

  function tone(cue, frequency, start, duration, volume, type = 'sine', endFrequency = frequency) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const end = start + duration;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, end);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + Math.min(0.025, duration / 5));
    gain.gain.exponentialRampToValueAtTime(floor, end - Math.min(0.02, duration / 5));
    gain.gain.linearRampToValueAtTime(0, end);
    addSource(cue, oscillator, gain, start, end);
  }

  function opening(durationSeconds = 2.7) {
    if (!isEnabled || context?.state !== 'running') return;
    stop();
    const duration = Number.isFinite(durationSeconds) ? Math.min(8, Math.max(0.15, durationSeconds)) : 2.7;
    const cue = createCue(duration);
    const start = cue.start;
    const end = start + duration;
    const gain = context.createGain();
    const bandpass = context.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.value = 0.8;
    bandpass.frequency.setValueAtTime(240, start);
    bandpass.frequency.exponentialRampToValueAtTime(2800, end);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.1, start + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.38, start + duration * 0.88);
    gain.gain.linearRampToValueAtTime(0, end);
    addSource(cue, noise(), gain, start, end, [bandpass]);
    tone(cue, 98, start, duration, 0.1, 'triangle', 196);
    tone(cue, 392, start + duration * 0.42, duration * 0.58, 0.035, 'sine', 784);
  }

  function hint(index = 0) {
    if (!isEnabled || context?.state !== 'running' || document.hidden) return;
    stop();
    const cue = createCue(0.28);
    const start = cue.start;
    const note = [523.25, 659.25, 783.99][Math.max(0, Math.min(2, Math.trunc(index)))];
    // Each hint rises in pitch so the three clues are easy to hear and distinguish.
    tone(cue, 180, start, 0.055, 0.22, 'sine', 90);
    tone(cue, note, start + 0.008, 0.23, 0.3, 'sine', note * 1.012);
    tone(cue, note * 2, start + 0.012, 0.14, 0.045);
  }

  function reveal() {
    if (!isEnabled || context?.state !== 'running' || document.hidden) return;
    stop();
    const cue = createCue(1.1);
    const start = cue.start;
    // A warm, restrained impact followed by three brief, consonant highlights.
    tone(cue, 110, start, 0.48, 0.64, 'sine', 55);
    tone(cue, 196, start + 0.015, 0.48, 0.16, 'triangle', 130.81);
    [783.99, 987.77, 1174.66].forEach((frequency, index) => {
      tone(cue, frequency, start + 0.075 + index * 0.07, 0.65, 0.065 - index * 0.012);
    });
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, start);
    filter.frequency.exponentialRampToValueAtTime(500, start + 0.35);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(floor, start + 0.34);
    gain.gain.linearRampToValueAtTime(0, start + 0.36);
    addSource(cue, noise(), gain, start, start + 0.36, [filter]);
  }

  return {
    supported: Boolean(AudioContextClass),
    get enabled() { return isEnabled && context?.state === 'running'; },
    setEnabled,
    setVolume,
    hint,
    opening,
    reveal,
    stop,
  };
}
