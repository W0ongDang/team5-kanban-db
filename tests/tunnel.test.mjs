import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../tunnel.mjs', import.meta.url), 'utf8');

function setup({ reducedMotion = false, width = 1440, height = 900, loaded = true } = {}) {
  let now = 0;
  let frameId = 0;
  let stackDepth = 0;
  const frames = new Map();
  const calls = [];
  const gradient = { addColorStop() {} };
  const context = new Proxy({}, {
    get(_, method) {
      return (...args) => {
        for (const arg of args) {
          if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `${String(method)} must receive finite coordinates`);
        }
        if (method === 'save') stackDepth += 1;
        if (method === 'restore') stackDepth -= 1;
        assert.ok(stackDepth >= 0);
        calls.push([method, ...args]);
        return gradient;
      };
    },
    set() { return true; },
  });
  const canvas = {
    getContext: () => context,
    getBoundingClientRect: () => ({ width, height }),
  };
  const create = runInNewContext(`${source.replace('export function', 'function')}\ncreateTunnel;`, {
    Image: class {
      complete = loaded;
      naturalWidth = loaded ? 1672 : 0;
      naturalHeight = loaded ? 941 : 0;
    },
    performance: { now: () => now },
    window: {
      devicePixelRatio: 3,
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame(id) { frames.delete(id); },
      addEventListener() {},
    },
  });
  return {
    tunnel: create(canvas, reducedMotion), canvas, calls, frames,
    tick(time) {
      now = time;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(now));
      assert.equal(stackDepth, 0, 'canvas transforms must be restored each frame');
    },
  };
}

test('터널은 마지막 프레임에서 멈추고 건너뛰면 예약된 프레임을 취소한다', () => {
  const scene = setup();
  scene.tunnel.start(3140);
  for (const time of [0, 140, 740, 850, 1560, 2400, 3140]) {
    if (time === 850 || time === 1560) scene.tunnel.pulse(2);
    scene.tick(time);
  }
  assert.equal(scene.frames.size, 0);
  assert.ok(scene.calls.some(([method]) => method === 'drawImage'));
  assert.ok(scene.calls.some(([method]) => method === 'stroke'));
  scene.tunnel.start(3140);
  scene.tick(3300);
  assert.equal(scene.frames.size, 1);
  scene.tunnel.stop();
  scene.tunnel.pulse(2);
  assert.equal(scene.frames.size, 0);
  assert.equal(scene.calls.at(-1)[0], 'clearRect');
});

test('다시 열면 이전 힌트 충격과 색상 단계가 초기화된다', () => {
  const scene = setup();
  scene.tunnel.start(3140);
  scene.calls.length = 0;
  scene.tick(0);
  const firstFrame = JSON.stringify(scene.calls);
  scene.tick(800);
  scene.tunnel.pulse(2);
  scene.tick(850);
  scene.tunnel.stop();
  scene.tunnel.start(3140);
  scene.calls.length = 0;
  scene.tick(850);
  assert.equal(JSON.stringify(scene.calls), firstFrame);
});

test('동작 줄이기에서는 정지 배경만 한 번 그린다', () => {
  const scene = setup({ reducedMotion: true });
  scene.tunnel.start(3140);
  scene.tunnel.pulse(2);
  scene.tick(0);
  assert.equal(scene.frames.size, 0);
  assert.ok(scene.calls.some(([method]) => method === 'drawImage'));
  assert.ok(!scene.calls.some(([method]) => ['stroke', 'rotate', 'scale'].includes(method)));
});

test('세로 화면과 배경 로드 실패에도 렌더링을 끝낼 수 있다', () => {
  for (const loaded of [true, false]) {
    const scene = setup({ width: 390, height: 844, loaded });
    scene.tunnel.start(1000);
    scene.tick(0);
    scene.tick(500);
    scene.tick(1000);
    assert.equal(scene.frames.size, 0);
    assert.equal(scene.canvas.width, 585);
    assert.equal(scene.canvas.height, 1266);
    assert.ok(scene.calls.some(([method]) => method === 'fillRect'));
  }
});
