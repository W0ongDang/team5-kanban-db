import test from 'node:test';
import assert from 'node:assert/strict';
import { createPackAudio } from '../pack-audio.mjs';

test('effects unlock, distinguish hints from reveal, and respect mute and hidden tabs', async () => {
  const sources = [];
  const gains = [];
  const parameter = () => ({
    value: 0,
    setValueAtTime(value) { this.value = value; },
    setTargetAtTime(value) { this.value = value; },
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
    cancelAndHoldAtTime() {},
  });
  const node = () => ({ connect() {}, disconnect() {} });
  class AudioContextMock {
    state = 'suspended';
    currentTime = 0;
    sampleRate = 48000;
    destination = node();
    async resume() { this.state = 'running'; }
    createGain() {
      const gain = { ...node(), gain: parameter() };
      gains.push(gain);
      return gain;
    }
    createOscillator() {
      const source = { ...node(), frequency: parameter(), start() { sources.push(this); }, stop() {} };
      return source;
    }
    createBuffer() { return { getChannelData: () => new Float32Array(32) }; }
    createBufferSource() { return { ...node(), start() { sources.push(this); }, stop() {} }; }
    createBiquadFilter() { return { ...node(), frequency: parameter(), Q: parameter() }; }
  }
  globalThis.window = { AudioContext: AudioContextMock };
  globalThis.document = { hidden: false };
  const audio = createPackAudio();
  try {
    audio.hint(0);
    assert.equal(sources.length, 0, 'effects must wait for a user gesture');
    assert.equal(await audio.setEnabled(true), true);
    const notes = [];
    for (let index = 0; index < 3; index += 1) {
      const before = sources.length;
      audio.hint(index);
      assert.equal(sources.length - before, 3);
      notes.push(sources[before + 1].frequency.value);
    }
    assert.ok(notes[0] < notes[1] && notes[1] < notes[2]);
    const beforeReveal = sources.length;
    audio.reveal();
    assert.equal(sources.length - beforeReveal, 6, 'reveal has a distinct impact and chime');
    audio.setVolume(0);
    assert.equal(gains[0].gain.value, 0);
    audio.setVolume(0.5);
    assert.equal(gains[0].gain.value, 0.35);
    await audio.setEnabled(false);
    const beforeMuted = sources.length;
    audio.hint(0);
    audio.reveal();
    assert.equal(sources.length, beforeMuted);
    await audio.setEnabled(true);
    document.hidden = true;
    audio.hint(2);
    audio.reveal();
    assert.equal(sources.length, beforeMuted);
  } finally {
    audio.stop();
    delete globalThis.window;
    delete globalThis.document;
  }
});
