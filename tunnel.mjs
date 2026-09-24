const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const CAMERA_TRAVEL = 1.05;
const FINAL_LIGHT_START = .55;
const FULL_SCREEN_LIGHT_START = .62;
const LIGHT_PULL_TRAVEL = .72;
const IMPACT_DURATION_MS = 520;

function smoothstep(start, end, value) {
  const progress = clamp((value - start) / (end - start), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function accelerateCamera(progress) {
  return .16 * progress + .84 * Math.pow(progress, 1.7);
}

function blendLight(cold, warm, progress, alpha) {
  const channels = cold.map((channel, index) => Math.round(channel + (warm[index] - channel) * progress));
  return `rgba(${channels.join(', ')}, ${alpha})`;
}

export function createTunnel(canvas, reducedMotion) {
  const context = canvas.getContext('2d');
  if (!context) return { start() {}, stop() {}, pulse() {} };
  const tunnelTexture = new Image();
  tunnelTexture.decoding = 'async';
  tunnelTexture.src = 'assets/game/stadium-tunnel-v1.png';
  let animationFrame = 0;
  let startTime = 0;
  let duration = 1;
  let active = false;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let impactTime = -Infinity;
  let impactStrength = 0;
  let colorStage = 0;
  // Fixed seeds keep trajectories smooth and avoid allocating particles per frame.
  const particles = Array.from({ length: 84 }, (_, index) => ({
    angle: index * 2.399963,
    phase: ((index * 37) % 83) / 83,
    speed: .7 + ((index * 17) % 13) / 16,
    radius: .45 + ((index * 11) % 19) / 24,
  }));

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(bounds.width));
    const nextHeight = Math.max(1, Math.round(bounds.height));
    const nextRatio = Math.min(window.devicePixelRatio || 1, nextWidth < 760 ? 1.5 : 2);
    if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextRatio;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function drawTunnelTexture(cameraProgress, lightPull) {
    const backdrop = context.createLinearGradient(0, 0, 0, height);
    backdrop.addColorStop(0, '#08131a');
    backdrop.addColorStop(1, '#020608');
    context.fillStyle = backdrop;
    context.fillRect(0, 0, width, height);
    if (!tunnelTexture.complete || !tunnelTexture.naturalWidth) return;

    const scale = Math.max(width / tunnelTexture.naturalWidth, height / tunnelTexture.naturalHeight) * (1.04 + cameraProgress * CAMERA_TRAVEL + lightPull * LIGHT_PULL_TRAVEL);
    const imageWidth = tunnelTexture.naturalWidth * scale;
    const imageHeight = tunnelTexture.naturalHeight * scale;
    const imageX = (width - imageWidth) / 2;
    const imageY = (height - imageHeight) / 2 + height * (cameraProgress * .055 + lightPull * .04);

    context.save();
    context.globalAlpha = 1 - smoothstep(.1, 1, lightPull) * .76;
    context.imageSmoothingQuality = 'high';
    context.drawImage(tunnelTexture, imageX, imageY, imageWidth, imageHeight);
    context.restore();
  }

  function drawTrails(progress, seconds, impact, lightPull) {
    const centerX = width / 2;
    const centerY = height * .49;
    const reach = Math.hypot(width, height) * .66;
    const travel = seconds * .48 + progress * progress * 1.8;
    const count = width < 760 ? 44 : particles.length;
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';
    for (let index = 0; index < count; index += 1) {
      const particle = particles[index];
      const depth = (particle.phase + travel * particle.speed) % 1;
      const radius = (.035 + depth * depth * 1.24) * reach * particle.radius;
      const tail = radius * (.055 + progress * .12 + impact * .13 + lightPull * .2);
      const x = Math.cos(particle.angle);
      const y = Math.sin(particle.angle);
      // Keep the center quiet so the three hints remain readable.
      const alpha = smoothstep(.12, .4, depth) * (1 - smoothstep(.83, 1, depth));
      const warm = lightPull * .9;
      context.strokeStyle = blendLight(
        index % 3 ? [85, 173 - colorStage * 20, 255] : [206, 248, 255],
        [255, 220, 153], warm, alpha * (.28 + impact * .32),
      );
      context.lineWidth = (index % 4 === 0 ? 2 : .8) + depth * 1.5;
      context.beginPath();
      context.moveTo(centerX + x * Math.max(0, radius - tail), centerY + y * Math.max(0, radius - tail));
      context.lineTo(centerX + x * radius, centerY + y * radius);
      context.stroke();
    }
    context.restore();
  }

  function drawImpact(impactProgress, strength) {
    if (impactProgress >= 1 || strength === 0) return;
    const expansion = 1 - Math.pow(1 - impactProgress, 3);
    const radius = Math.max(width, height) * (.035 + expansion * .68);
    const opacity = (1 - impactProgress) * strength;
    context.save();
    context.globalCompositeOperation = 'lighter';
    const wave = context.createRadialGradient(width / 2, height * .49, 0, width / 2, height * .49, radius);
    wave.addColorStop(0, `rgba(130, 204, 255, ${opacity * .11})`);
    wave.addColorStop(.72, 'rgba(79, 148, 255, 0)');
    wave.addColorStop(.92, `rgba(103, 189, 255, ${opacity * .26})`);
    wave.addColorStop(1, 'rgba(103, 189, 255, 0)');
    context.fillStyle = wave;
    context.fillRect(0, 0, width, height);

    // An anamorphic glint expands horizontally behind each hint.
    context.translate(width / 2, height * .49);
    context.scale(1, .035);
    const glint = context.createRadialGradient(0, 0, 0, 0, 0, width * .58);
    glint.addColorStop(0, `rgba(232, 250, 255, ${opacity * .75})`);
    glint.addColorStop(.18, `rgba(90, 177, 255, ${opacity * .4})`);
    glint.addColorStop(1, 'rgba(58, 124, 255, 0)');
    context.fillStyle = glint;
    context.fillRect(-width, -width, width * 2, width * 2);
    context.restore();
  }

  function drawEdgeLight(progress, impact, lightPull) {
    const strength = .15 + progress * .17 + impact * .24;
    const color = blendLight([42, 157 - colorStage * 24, 255], [255, 212, 132], lightPull, strength);
    const wash = context.createLinearGradient(0, 0, width, 0);
    wash.addColorStop(0, color);
    wash.addColorStop(.3, 'rgba(20, 70, 130, 0)');
    wash.addColorStop(.7, 'rgba(20, 70, 130, 0)');
    wash.addColorStop(1, color);
    context.save();
    context.globalCompositeOperation = 'screen';
    context.fillStyle = wash;
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  function drawLightGrade(finalLight, lightPull) {
    const shadowFade = 1 - lightPull * .94;
    const shade = context.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, `rgba(1, 7, 11, ${.3 * shadowFade})`);
    shade.addColorStop(.56, `rgba(2, 8, 11, ${.06 * shadowFade})`);
    shade.addColorStop(1, `rgba(1, 5, 8, ${.36 * shadowFade})`);
    context.fillStyle = shade;
    context.fillRect(0, 0, width, height);

    const exitLight = context.createRadialGradient(width / 2, height * .49, 0, width / 2, height * .49, Math.hypot(width, height) * (.12 + lightPull * 1.45));
    exitLight.addColorStop(0, blendLight([48, 129, 126], [255, 245, 211], finalLight, .1 + finalLight * .3 + lightPull * .55));
    exitLight.addColorStop(.3, blendLight([16, 76, 78], [255, 233, 179], finalLight, .04 + lightPull * .45));
    exitLight.addColorStop(1, 'rgba(5, 10, 13, 0)');
    context.fillStyle = exitLight;
    context.fillRect(0, 0, width, height);
  }

  function drawFinalWash(lightPull) {
    const fullScreenLight = smoothstep(FULL_SCREEN_LIGHT_START, 1, lightPull);
    if (fullScreenLight === 0) return;
    context.fillStyle = `rgba(255, 253, 241, ${fullScreenLight * .96})`;
    context.fillRect(0, 0, width, height);
  }

  function drawVignette(lightPull) {
    const vignette = context.createRadialGradient(width / 2, height * .5, height * .18, width / 2, height * .5, Math.max(width, height) * .76);
    vignette.addColorStop(0, 'rgba(2, 7, 10, 0)');
    vignette.addColorStop(.72, 'rgba(2, 7, 10, .12)');
    vignette.addColorStop(1, `rgba(1, 4, 7, ${.64 - lightPull * .3})`);
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);
  }

  function draw(progress, now) {
    resize();
    const cameraProgress = accelerateCamera(progress);
    const finalLight = smoothstep(FINAL_LIGHT_START, 1, progress);
    const lightPull = smoothstep(FINAL_LIGHT_START, .98, progress);
    const impactProgress = clamp((now - impactTime) / IMPACT_DURATION_MS, 0, 1);
    const impact = reducedMotion ? 0 : Math.pow(1 - impactProgress, 2) * impactStrength;
    const seconds = (now - startTime) / 1000;
    context.clearRect(0, 0, width, height);
    context.save();
    if (!reducedMotion) {
      const shake = Math.min(width, height) * (.0015 * progress + .005 * impact);
      context.translate(width / 2 + Math.sin(seconds * 43) * shake, height / 2 + Math.cos(seconds * 37) * shake * .65);
      context.rotate(Math.sin(seconds * 5) * .003 * progress);
      context.scale(1 + impact * .035, 1 + impact * .035);
      context.translate(-width / 2, -height / 2);
    }
    drawTunnelTexture(cameraProgress, lightPull);
    drawLightGrade(finalLight, lightPull);
    if (!reducedMotion) {
      drawEdgeLight(progress, impact, lightPull);
      drawTrails(progress, seconds, impact, lightPull);
      drawImpact(impactProgress, impactStrength);
    }
    drawVignette(lightPull);
    drawFinalWash(lightPull);
    context.restore();
  }

  function render(now) {
    if (!active) return;
    const elapsedProgress = clamp((now - startTime) / duration, 0, 1);
    draw(reducedMotion ? 0 : elapsedProgress, now);
    if (elapsedProgress < 1 && !reducedMotion) {
      animationFrame = window.requestAnimationFrame(render);
    } else {
      active = false;
      animationFrame = 0;
    }
  }

  function start(nextDuration) {
    stop();
    duration = Math.max(1, Number.isFinite(nextDuration) ? nextDuration : 1);
    startTime = performance.now();
    colorStage = 0;
    active = true;
    pulse(0);
    animationFrame = window.requestAnimationFrame(render);
  }

  function pulse(index) {
    if (!active || reducedMotion) return;
    impactTime = performance.now();
    colorStage = clamp(index, 0, 2);
    impactStrength = .6 + colorStage * .2;
  }

  function stop() {
    active = false;
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    impactTime = -Infinity;
    impactStrength = 0;
    context.clearRect(0, 0, width, height);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  return { start, stop, pulse };
}
