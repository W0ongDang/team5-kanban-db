import test from 'node:test';
import assert from 'node:assert/strict';
import { createLobbyMusic } from '../lobby-music.mjs';

test('첫 로비 진입 시 시작 효과음을 한 번 재생한다', async () => {
  const listeners = new Map();
  const audio = {
    paused: true,
    volume: 0,
    async play() { this.paused = false; },
    pause() { this.paused = true; },
    addEventListener(name, listener) { listeners.set(`audio:${name}`, listener); },
  };
  const bar = { contains() { return false; } };
  const toggle = { addEventListener() {}, setAttribute() {}, title: '' };
  const volume = { value: '25', addEventListener() {}, setAttribute() {}, title: '' };
  const effects = {
    openingCount: 0,
    setVolume() {},
    async setEnabled() { return true; },
    opening() { this.openingCount += 1; },
  };
  globalThis.document = {
    hidden: false,
    querySelector(selector) {
      return { '#lobby-music': audio, '#sound-bar': bar, '#music-toggle': toggle, '#music-volume': volume }[selector];
    },
    addEventListener(name, listener) { listeners.set(`document:${name}`, listener); },
  };

  try {
    const music = createLobbyMusic(effects);
    music.setActive(true);
    music.setActive(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(effects.openingCount, 1);
  } finally {
    delete globalThis.document;
  }
});
