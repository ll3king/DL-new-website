(() => {
  const canvas = document.createElement('canvas');
  canvas.className = 'dandelion-motion';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;

  const mobile = matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.1 : 1.75);
  const pointer = { x: 0, y: 0, active: false };
  const assets = [
    '/assets/media/dandelion-seed-sharp.webp',
    '/assets/media/dandelion-seed-soft.webp'
  ];
  const sprites = assets.map(src => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    return image;
  });

  let width = 0;
  let height = 0;
  let seeds = [];
  let last = performance.now();
  let lastPaint = 0;
  let animationFrameId = 0;
  let running = false;

  const random = (min, max) => min + Math.random() * (max - min);

  function makeSeed(index, subtle = false) {
    const depth = Math.random();
    const baseSize = mobile ? random(30, 54) : random(42, 88);
    const baseAlpha = mobile ? random(.52, .78) : random(.58, .9);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: random(8, 22),
      vy: random(-5, 8),
      wind: random(10, 24),
      size: subtle ? baseSize * random(.68, .86) : baseSize,
      alpha: subtle ? baseAlpha * random(.66, .78) : baseAlpha,
      angle: random(-Math.PI, Math.PI),
      spin: random(-.28, .28),
      phase: random(0, Math.PI * 2),
      frequency: random(.32, .68),
      orbitAngle: index * 2.399 + random(-.3, .3),
      orbitRadius: random(38, 118),
      sprite: subtle ? 1 : (depth > .42 ? 0 : 1),
      depth
    };
  }

  function resize() {
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseAreaCount = Math.round(width * height / (mobile ? 39000 : 30000));
    const baseCount = mobile
      ? Math.min(16, Math.max(11, baseAreaCount))
      : Math.min(38, Math.max(24, baseAreaCount));
    const targetAreaCount = Math.round(width * height / (mobile ? 30000 : 28500));
    const count = mobile
      ? Math.min(18, Math.max(14, targetAreaCount))
      : Math.min(42, Math.max(26, targetAreaCount));
    seeds = Array.from(
      { length: count },
      (_, index) => makeSeed(index, index >= baseCount)
    );
  }

  function resetAtEdge(seed) {
    seed.x = -seed.size;
    seed.y = random(-seed.size, height + seed.size);
    seed.vx = random(8, 22);
    seed.vy = random(-5, 8);
  }

  function update(seed, dt, now) {
    const motionScale = reducedMotion ? .2 : 1;
    const t = now * .001;

    if (!mobile && pointer.active) {
      const orbit = seed.orbitAngle + t * (.11 + seed.depth * .1);
      const targetX = pointer.x + Math.cos(orbit) * seed.orbitRadius;
      const targetY = pointer.y + Math.sin(orbit) * seed.orbitRadius * .68;
      const dx = targetX - seed.x;
      const dy = targetY - seed.y;
      seed.vx += dx * 1.05 * dt;
      seed.vy += dy * 1.05 * dt;

      const distance = Math.max(32, Math.hypot(dx, dy));
      seed.vx += (-dy / distance) * 12 * dt;
      seed.vy += (dx / distance) * 12 * dt;
      const drag = Math.pow(.976, dt * 60);
      seed.vx *= drag;
      seed.vy *= drag;
    } else {
      const airX = seed.wind + Math.sin(t * seed.frequency + seed.phase) * 10;
      const airY = Math.cos(t * seed.frequency * .73 + seed.phase) * 8;
      seed.vx += (airX - seed.vx) * .55 * dt;
      seed.vy += (airY - seed.vy) * .48 * dt;
    }

    const speed = Math.hypot(seed.vx, seed.vy);
    if (speed > 165) {
      seed.vx = seed.vx / speed * 165;
      seed.vy = seed.vy / speed * 165;
    }

    seed.x += seed.vx * dt * motionScale;
    seed.y += seed.vy * dt * motionScale;
    seed.angle += (seed.spin + Math.sin(t + seed.phase) * .05) * dt * motionScale;

    if (!pointer.active || mobile) {
      if (seed.x > width + seed.size) resetAtEdge(seed);
      if (seed.y > height + seed.size) seed.y = -seed.size;
      if (seed.y < -seed.size) seed.y = height + seed.size;
    }
  }

  function draw(seed) {
    const sprite = sprites[seed.sprite];
    if (!sprite.complete || !sprite.naturalWidth) return;

    ctx.save();
    ctx.translate(seed.x, seed.y);
    ctx.rotate(seed.angle);
    ctx.globalAlpha = seed.alpha;
    if (!mobile && seed.sprite === 0 && seed.depth > .52) {
      ctx.shadowColor = `rgba(48, 38, 24, ${.18 + seed.depth * .16})`;
      ctx.shadowBlur = 2.2 + seed.depth * 1.8;
      ctx.shadowOffsetY = 1;
    }
    if (seed.sprite === 1) ctx.filter = 'blur(.35px)';
    ctx.drawImage(sprite, -seed.size / 2, -seed.size / 2, seed.size, seed.size);
    ctx.restore();
  }

  function frame(now) {
    if (!running) return;

    animationFrameId = requestAnimationFrame(frame);
    const frameInterval = mobile
      ? 1000 / 30
      : (pointer.active ? 0 : 1000 / 50);

    if (frameInterval && now - lastPaint < frameInterval) return;

    lastPaint = now;
    const dt = Math.min(.034, Math.max(.001, (now - last) / 1000));
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (const seed of seeds) {
      update(seed, dt, now);
      draw(seed);
    }
  }

  function start() {
    if (running || reducedMotion || document.hidden) return;
    running = true;
    last = performance.now();
    lastPaint = 0;
    animationFrameId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  addEventListener('resize', resize, { passive: true });
  if (!mobile) {
    addEventListener('pointermove', event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }, { passive: true });
    document.addEventListener('mouseleave', () => { pointer.active = false; }, { passive: true });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  addEventListener('pagehide', stop, { passive: true });
  addEventListener('pageshow', start, { passive: true });

  Promise.all(sprites.map(sprite => sprite.decode().catch(() => undefined)))
    .finally(() => {
      resize();
      if (reducedMotion) {
        ctx.clearRect(0, 0, width, height);
        for (const seed of seeds) draw(seed);
      } else {
        start();
      }
    });
})();

