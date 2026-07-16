import * as THREE from 'three';

const section = document.querySelector('[data-dandy-archive]');

if (section) {
  const products = [
    { id: 'grilled-cornbread', name: 'Grilled Cornbread', year: 2017, displayYear: 2017, category: 'food', type: 'Opening seed', image: '/assets/media/archive-cards/grilled-cornbread.webp', imagePosition: '65% 50%', mobileImagePosition: '65% 50%', description: "An opening-era Dandy Lane dish that became one of the first seeds in the cafe's evolving menu." },
    { id: 'wine-infused-benedict', name: 'Wine-Infused Benedict', year: 2017.35, displayYear: 2017, category: 'food', type: 'Benny lineage', image: '/assets/media/archive-cards/wine-infused-benedict.webp', imagePosition: '50% 54%', description: "Bacon Benny represents the first chapter of Dandy Lane's wine-infused Benedict lineage, beginning in 2017." },
    { id: 'parmesan-dill-rosti', name: 'Parmesan Dill Rosti', year: 2018, displayYear: 2018, category: 'food', type: 'Rosti lineage', image: '/assets/media/archive-cards/parmesan-dill-rosti.webp', imagePosition: '50% 52%', description: "A house-made rosti of grated potato, onion, dill and parmesan, beginning Dandy Lane's enduring rosti lineage." },
    { id: 'smashed-avo', name: 'Smashed Avo', year: 2018.3, displayYear: 2018, category: 'food', type: 'Brunch', image: '/assets/media/archive-cards/smashed-avo.webp', imagePosition: '50% 56%', description: "An early Dandy Lane brunch staple, remembered as part of the cafe's growing 2018 menu story." },
    { id: 'dirty-burger', name: 'Dirty Burger', year: 2018.6, displayYear: 2018, category: 'food', type: 'Past special', image: '/assets/media/archive-cards/dirty-burger.webp', imagePosition: '50% 50%', description: 'An early Dandy Lane burger that brought a bold new savoury chapter to the 2018 menu.' },
    { id: 'zucchini-fritter', name: 'Zucchini Fritter', year: 2019, displayYear: 2019, category: 'food', type: 'Fritter', image: '/assets/media/archive-cards/zucchini-fritter.webp', imagePosition: '50% 50%', description: "A standalone zucchini fritter marking the first of two distinct fritter chapters in Dandy Lane's archive." },
    { id: 'fried-chicken-benny', name: 'Fried Chicken Benny', year: 2019.3, displayYear: 2019, category: 'food', type: 'Benny lineage', image: '/assets/media/archive-cards/fried-chicken-benny.webp', imagePosition: '50% 74%', mobileImagePosition: '50% 77%', description: "A 2019 brunch crossover bringing fried chicken into Dandy Lane's evolving family of Benny dishes." },
    { id: 'dandy-fried-chicken', name: 'Dandy Fried Chicken', year: 2019.6, displayYear: 2019, category: 'food', type: 'Past special', image: '/assets/media/archive-cards/dandy-fried-chicken.webp', imagePosition: '51% 55%', description: 'A standalone 2019 fried chicken special, distinct from the Fried Chicken Benny introduced that same year.' },
    { id: 'dirty-wrap', name: 'Dirty Wrap', year: 2020, displayYear: 2020, category: 'food', type: 'Past special', image: '/assets/media/archive-cards/dirty-wrap.webp', imagePosition: '50% 55%', description: "A warm, satisfying limited-time special that became a memorable part of Dandy Lane's 2020 archive." },
    { id: 'banana-mango-smoothie', name: 'Banana Mango Smoothie', year: 2020.45, displayYear: 2020, category: 'drink', type: 'Drink', image: '/assets/media/archive-cards/banana-mango-smoothie.webp', imagePosition: '51% 50%', description: 'A banana-and-mango smoothie that opened a bright, fruit-led drinks chapter for Dandy Lane in 2020.' },
    { id: 'mushroom-arancini', name: 'Mushroom Arancini', year: 2021, displayYear: 2021, category: 'food', type: 'Past special', image: '/assets/media/archive-cards/mushroom-arancini.webp', imagePosition: '48% 52%', description: "A 2021 savoury special centred on mushroom arancini and preserved within Dandy Lane's evolving menu archive." },
    { id: 'corn-mint-fritter', name: 'Corn Mint Fritter', year: 2022, displayYear: 2022, category: 'food', type: 'Fritter', image: '/assets/media/archive-cards/corn-mint-fritter.webp', imagePosition: '50% 54%', description: 'A distinct corn-and-mint fritter introduced in 2022, separate from the earlier zucchini fritter chapter.' },
    { id: 'pulled-pork-benny', name: 'Pulled Pork Benny', year: 2022.5, displayYear: 2022, category: 'food', type: 'Benny lineage', image: '/assets/media/archive-cards/pulled-pork-benny.webp', imagePosition: '47% 54%', mobileImagePosition: '47% 57%', description: "A 2022 Benedict variation bringing pulled pork into Dandy Lane's growing family of Benny dishes." },
    { id: 'scotch-steak-sandwich', name: 'Scotch Steak Sandwich', year: 2023, displayYear: 2023, category: 'food', type: 'Past special', image: '/assets/media/archive-cards/scotch-steak-sandwich.webp', imagePosition: '50% 52%', description: 'Confit-garlic-marinated Scotch steak with caramelised onions, tomato and aioli, served on sourdough.' },
    { id: 'luxury-hot-chocolate', name: 'Luxury Hot Chocolate', year: 2023.5, displayYear: 2023, category: 'drink', type: 'Drink', image: '/assets/media/archive-cards/luxury-hot-chocolate.webp', imagePosition: '50% 55%', description: 'A 2023 Dandy Lane drink remembered for turning classic hot chocolate into a special cafe moment.' },
    { id: 'okonomiyaki-benny', name: 'Okonomiyaki Benny', year: 2024, displayYear: 2024, category: 'food', type: 'Benny lineage', image: '/assets/media/archive-cards/okonomiyaki-benny.webp', imagePosition: '58% 48%', description: "A 2024 Benny variation inspired by okonomiyaki, extending Dandy Lane's Benedict story in a playful direction." },
    { id: 'toasted-marshmallow-iced-coffee', name: 'Toasted Marshmallow Iced Coffee', year: 2024.5, displayYear: 2024, category: 'drink', type: 'Drink · Returned Jun 2026', image: '/assets/media/archive-cards/toasted-marshmallow-iced-coffee.webp', imagePosition: '50% 52%', description: 'A familiar iced coffee finished with golden toasted marshmallow cream, first appearing in 2024.' },
    { id: 'strawberry-matcha', name: 'Strawberry Matcha', year: 2024.7, displayYear: 2024, category: 'drink', type: 'Drink', image: '/assets/media/archive-cards/strawberry-matcha.webp', imagePosition: '52% 50%', description: 'A layered strawberry-and-matcha drink that added a bright new drinks chapter to Dandy Lane in 2024.' },
    { id: 'wild-mushroom-benny', name: 'Wild Mushroom Benny', year: 2025, displayYear: 2025, category: 'food', type: 'Benny lineage', image: '/assets/media/archive-cards/wild-mushroom-benny.webp', imagePosition: '50% 55%', description: 'Butter-poached mushrooms, truffle mayo, pistachio dukkah, poached eggs and hollandaise in a signature Benny.' },
    { id: 'stack-me-up', name: 'Stack Me Up', year: 2025.3, displayYear: 2025, category: 'food', type: 'Sweet brunch', image: '/assets/media/archive-cards/stack-me-up.webp', imagePosition: '50% 55%', description: 'Pancakes layered with banana, bacon, egg, maple syrup and honeycomb butter for a generous sweet-savoury stack.' },
    { id: 'luxury-wagyu-beef-chilli-scramble', name: 'Luxury Wagyu Beef Chilli Scramble', year: 2026.08, displayYear: 2026, category: 'food', type: 'January special', image: '/assets/media/archive-cards/luxury-wagyu-beef-chilli-scramble.webp', imagePosition: '50% 46%', mobileImagePosition: '50% 49%', imageFilter: 'brightness(1.08) contrast(1.06) saturate(.9) sepia(.04)', description: 'A 2026 special placing Wagyu beef and chilli at the centre of a savoury scramble.' },
    { id: 'rosti-steak', name: 'Rosti Steak', year: 2026.25, displayYear: 2026, category: 'food', type: 'March special', image: '/assets/media/archive-cards/rosti-steak.webp', imagePosition: '50% 50%', description: "A March 2026 special connecting steak with Dandy Lane's long-running Parmesan Dill Rosti lineage." },
    { id: 'croissant-chili-scramble', name: 'Croissant Chili Scramble', year: 2026.42, displayYear: 2026, category: 'food', type: 'May special', image: '/assets/media/archive-cards/croissant-chili-scramble.webp', imagePosition: '50% 52%', description: 'A May 2026 special combining a golden croissant with a warm, savoury chilli scramble.' }
  ];

  const shell = section.querySelector('[data-archive-shell]');
  const canvas = section.querySelector('#archive-canvas');
  const label = section.querySelector('[data-node-label]');
  const detail = section.querySelector('[data-archive-detail]');
  const detailMedia = detail.querySelector('[data-detail-media]');
  const detailImage = detail.querySelector('[data-detail-image]');
  const detailMeta = detail.querySelector('[data-detail-meta]');
  const detailTitle = detail.querySelector('[data-detail-title]');
  const detailDescription = detail.querySelector('[data-detail-description]');
  const detailClose = detail.querySelector('[data-detail-close]');
  const filters = Array.from(section.querySelectorAll('[data-archive-filter]'));
  let isMobile = shell.clientWidth ? shell.clientWidth <= 720 : matchMedia('(max-width: 720px)').matches;
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const depthPattern = [.1,.72,.38,.9,.54,.22,.76,.46,.12,.86,.33,.65,.18,.82,.43,.7,.28,.94,.5,.78,.31,.88,.59];
  const spreadPattern = [-.78,.34,-.18,.72,-.42,.1,.58,-.65,.26,-.04,.82,-.5,.44,-.3,.06,.68,-.72,.2,-.12,.52,-.56,.76,-.25];
  const detailImageCache = new Map();
  let detailImageRequestId = 0;

  function preloadDetailImage(src, fetchPriority = 'auto') {
    if (detailImageCache.has(src)) return detailImageCache.get(src);

    const request = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = fetchPriority;
      image.addEventListener('load', async () => {
        try { await image.decode(); } catch (error) { /* load already succeeded */ }
        resolve(image);
      }, { once: true });
      image.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });
      image.src = src;
    }).catch(error => {
      detailImageCache.delete(src);
      throw error;
    });

    detailImageCache.set(src, request);
    return request;
  }

  function scheduleDesktopImageWarmup() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const constrainedNetwork = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || constrainedNetwork) return;

    const queue = [...new Set(products.map(product => product.image).filter(Boolean))];
    let nextIndex = 0;
    const worker = async () => {
      while (nextIndex < queue.length) {
        const src = queue[nextIndex++];
        try { await preloadDetailImage(src, 'low'); } catch (error) { /* retry on demand */ }
      }
    };
    const start = () => { void Promise.all([worker(), worker(), worker(), worker()]); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1400 });
    else window.setTimeout(start, 600);
  }

  function populateDetail(product) {
    const hasImage = Boolean(product.image);
    const sameProduct = detail.dataset.productId === product.id;
    const currentImageState = detail.dataset.imageState;
    detail.classList.toggle('has-no-image', !hasImage);
    detail.classList.remove('has-image-error');
    detail.dataset.productId = product.id;
    detailMeta.textContent = `${product.displayYear ?? Math.floor(product.year)} · ${product.type}`;
    detailTitle.textContent = product.name;
    detailDescription.textContent = product.description;

    const imagePosition = shell.clientWidth <= 720 && product.mobileImagePosition
      ? product.mobileImagePosition
      : product.imagePosition || '50% 50%';
    detailImage.style.objectPosition = imagePosition;
    detailImage.style.filter = product.imageFilter || 'none';

    if (!hasImage) {
      detailImageRequestId += 1;
      detail.dataset.imageState = 'empty';
      detail.setAttribute('aria-busy', 'false');
      detail.classList.remove('is-image-loading');
      detailMedia.hidden = true;
      detailImage.hidden = true;
      detailImage.classList.remove('is-image-ready');
      detailImage.removeAttribute('src');
      delete detailImage.dataset.imageSrc;
      detailImage.alt = '';
      return;
    }

    detailMedia.hidden = false;
    detailImage.hidden = false;
    if (sameProduct && (
      currentImageState === 'loading' ||
      currentImageState === 'error' ||
      (currentImageState === 'ready' && detailImage.dataset.imageSrc === product.image)
    )) return;

    const requestId = ++detailImageRequestId;
    detail.dataset.imageState = 'loading';
    detail.setAttribute('aria-busy', 'true');
    detail.classList.add('is-image-loading');
    detailImage.classList.remove('is-image-ready');
    detailImage.removeAttribute('src');
    delete detailImage.dataset.imageSrc;
    detailImage.alt = '';

    preloadDetailImage(product.image, 'high').then(async () => {
      if (requestId !== detailImageRequestId || detail.dataset.productId !== product.id) return;

      detailImage.src = product.image;
      detailImage.dataset.imageSrc = product.image;
      detailImage.alt = product.name;
      try { await detailImage.decode(); } catch (error) {
        if (!detailImage.complete || !detailImage.naturalWidth) throw error;
      }

      if (requestId !== detailImageRequestId || detail.dataset.productId !== product.id) return;
      detail.dataset.imageState = 'ready';
      detail.setAttribute('aria-busy', 'false');
      detail.classList.remove('is-image-loading');
      requestAnimationFrame(() => {
        if (requestId === detailImageRequestId && detail.dataset.productId === product.id) {
          detailImage.classList.add('is-image-ready');
        }
      });
    }).catch(() => {
      if (requestId !== detailImageRequestId || detail.dataset.productId !== product.id) return;
      detail.dataset.imageState = 'error';
      detail.setAttribute('aria-busy', 'false');
      detail.classList.remove('is-image-loading');
      detail.classList.add('has-image-error');
      detailImage.hidden = true;
    });
  }

  scheduleDesktopImageWarmup();

  function renderFallback() {
    shell.classList.add('archive-shell--fallback');
    const origin = document.createElement('div');
    origin.className = 'archive-fallback-origin';
    origin.setAttribute('aria-hidden', 'true');
    shell.appendChild(origin);
    const fallbackNodes = [];
    let fallbackActive = null;

    const openFallback = (button, product) => {
      if (fallbackActive) {
        fallbackActive.classList.remove('is-active');
        fallbackActive.setAttribute('aria-pressed', 'false');
      }
      fallbackActive = button;
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      populateDetail(product);
      detail.classList.add('is-open');
      detail.setAttribute('aria-hidden','false');
      if (shell.clientWidth > 720) {
        const x = Math.min(shell.clientWidth - 340, Math.max(12, button.offsetLeft + 38));
        const y = Math.min(shell.clientHeight - 82, Math.max(82, button.offsetTop));
        detail.style.left = `${x}px`;
        detail.style.top = `${y}px`;
      }
      shell.classList.add('is-used');
    };

    products.forEach((product, index) => {
      const depth = depthPattern[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'archive-fallback-seed';
      button.dataset.category = product.category;
      button.setAttribute('aria-label', `${product.name}, ${product.displayYear ?? Math.floor(product.year)}`);
      button.setAttribute('aria-pressed', 'false');
      button.style.setProperty('--scale', `${.72 + depth*.42}`);
      button.style.setProperty('--opacity', `${.5 + depth*.42}`);
      button.style.setProperty('--layer', `${8 + Math.round(depth*20)}`);
      button.style.setProperty('--parallax-x', '0px');
      button.style.setProperty('--parallax-y', '0px');
      button.style.setProperty('--turn', `${index*29 - 30}deg`);
      button.style.setProperty('--speed', `${4.2 + depth*3}s`);
      button.style.setProperty('--delay', `${-index*.31}s`);
      button.innerHTML = `<span>${product.name}</span>`;
      button.addEventListener('mouseenter', () => openFallback(button, product));
      button.addEventListener('focus', () => openFallback(button, product));
      button.addEventListener('click', () => openFallback(button, product));
      shell.appendChild(button);
      fallbackNodes.push(button);
    });

    const layoutFallbackNodes = () => {
      const mobile = shell.clientWidth <= 720;
      fallbackNodes.forEach((button, index) => {
        const product = products[index];
        const t = (product.year - 2017) / 9.6;
        const depth = depthPattern[index];
        const spread = spreadPattern[index];
        const left = mobile ? 48 + spread * 32 : 9 + t * 84;
        const top = mobile ? 84 - t * 70 : 50 + spread * 34;
        button.style.setProperty('--left', `${left}%`);
        button.style.setProperty('--top', `${top}%`);
        button.style.setProperty('--size', `${mobile ? 45 + depth*26 : 44 + depth*35}px`);
      });
    };
    layoutFallbackNodes();
    new ResizeObserver(layoutFallbackNodes).observe(shell);

    shell.addEventListener('pointermove', event => {
      const rect = shell.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const py = ((event.clientY - rect.top) / rect.height - .5) * 2;
      fallbackNodes.forEach((button, index) => {
        const depth = depthPattern[index];
        button.style.setProperty('--parallax-x', `${px * depth * 16}px`);
        button.style.setProperty('--parallax-y', `${py * depth * 9}px`);
      });
    }, { passive: true });

    shell.addEventListener('pointerleave', () => {
      fallbackNodes.forEach(button => {
        button.style.setProperty('--parallax-x', '0px');
        button.style.setProperty('--parallax-y', '0px');
      });
    });

    detailClose.addEventListener('click', () => {
      if (fallbackActive) {
        fallbackActive.classList.remove('is-active');
        fallbackActive.setAttribute('aria-pressed', 'false');
      }
      fallbackActive = null;
      detail.classList.remove('is-open');
      detail.setAttribute('aria-hidden','true');
    });

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        const value = filter.dataset.archiveFilter;
        filters.forEach(item => item.classList.toggle('is-active', item === filter));
        fallbackNodes.forEach(node => node.classList.toggle('is-filtered', value !== 'all' && node.dataset.category !== value));
        shell.classList.add('is-used');
      });
    });
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: isMobile || coarsePointer ? 'default' : 'high-performance' });
  } catch (error) {
    renderer = null;
  }

  if (!renderer) renderFallback();

  if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile || coarsePointer ? 1.25 : 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x17130f, isMobile ? .026 : .032);
  const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 40, 1, .1, 100);
  camera.position.set(0, 0, isMobile ? 17.5 : 18.5);

  const world = new THREE.Group();
  scene.add(world);

  function seededRandom(seed) {
    const x = Math.sin(seed * 999.91) * 43758.5453;
    return x - Math.floor(x);
  }

  function createSeedTexture(category = 'food', origin = false) {
    const size = origin ? 512 : 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const cx = c.getContext('2d');
    const center = size / 2;
    const radius = size * (origin ? .39 : .34);
    const spokes = origin ? 118 : 54;
    cx.translate(center, center);
    cx.lineCap = 'round';
    for (let i = 0; i < spokes; i++) {
      const jitter = seededRandom(i + (origin ? 8 : 3));
      const angle = i / spokes * Math.PI * 2 + (jitter - .5) * .09;
      const inner = size * (.025 + jitter * .018);
      const outer = radius * (.78 + seededRandom(i + 21) * .3);
      const x1 = Math.cos(angle) * inner;
      const y1 = Math.sin(angle) * inner;
      const x2 = Math.cos(angle) * outer;
      const y2 = Math.sin(angle) * outer;
      const gradient = cx.createLinearGradient(x1, y1, x2, y2);
      const tint = category === 'drink' ? '205,226,205' : '255,248,226';
      gradient.addColorStop(0, `rgba(${tint},.78)`);
      gradient.addColorStop(.68, `rgba(${tint},.5)`);
      gradient.addColorStop(1, `rgba(${tint},0)`);
      cx.strokeStyle = gradient;
      cx.lineWidth = origin ? 1.3 : .85;
      cx.beginPath();
      cx.moveTo(x1, y1);
      cx.quadraticCurveTo(Math.cos(angle + .035) * outer * .55, Math.sin(angle + .035) * outer * .55, x2, y2);
      cx.stroke();
    }
    const glow = cx.createRadialGradient(0,0,0,0,0,size*.1);
    glow.addColorStop(0, category === 'drink' ? 'rgba(190,218,184,1)' : 'rgba(230,184,78,1)');
    glow.addColorStop(.25, category === 'drink' ? 'rgba(190,218,184,.7)' : 'rgba(230,184,78,.72)');
    glow.addColorStop(1, 'rgba(230,184,78,0)');
    cx.fillStyle = glow;
    cx.beginPath();
    cx.arc(0,0,size*.1,0,Math.PI*2);
    cx.fill();
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createPointTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const cx = c.getContext('2d');
    const g = cx.createRadialGradient(32,32,0,32,32,30);
    g.addColorStop(0,'rgba(255,247,232,.9)');
    g.addColorStop(.2,'rgba(255,247,232,.48)');
    g.addColorStop(1,'rgba(255,247,232,0)');
    cx.fillStyle = g;
    cx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(c);
  }

  function createGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const cx = c.getContext('2d');
    const g = cx.createRadialGradient(64,64,2,64,64,62);
    g.addColorStop(0,'rgba(255,246,185,.98)');
    g.addColorStop(.18,'rgba(246,199,88,.72)');
    g.addColorStop(.48,'rgba(230,184,78,.24)');
    g.addColorStop(1,'rgba(230,184,78,0)');
    cx.fillStyle = g;
    cx.fillRect(0,0,128,128);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const foodTexture = createSeedTexture('food');
  const drinkTexture = createSeedTexture('drink');
  const originTexture = createSeedTexture('food', true);
  const glowTexture = createGlowTexture();
  const nodeSprites = [];
  const glowSprites = [];

  const originMaterial = new THREE.SpriteMaterial({ map: originTexture, transparent: true, opacity: .82, depthWrite: false });
  const originSprite = new THREE.Sprite(originMaterial);
  originSprite.scale.setScalar(isMobile ? 2.7 : 3.2);
  world.add(originSprite);

  products.forEach((product, index) => {
    const material = new THREE.SpriteMaterial({
      map: product.category === 'drink' ? drinkTexture : foodTexture,
      transparent: true,
      opacity: .55 + depthPattern[index] * .35,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.userData = {
      product,
      index,
      baseScale: .68 + depthPattern[index] * .48,
      baseOpacity: material.opacity,
      filtered: false
    };
    sprite.scale.setScalar(sprite.userData.baseScale);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    }));
    glow.renderOrder = 2;
    sprite.renderOrder = 3;
    glow.scale.setScalar(sprite.userData.baseScale * 2.7);
    nodeSprites.push(sprite);
    glowSprites.push(glow);
    world.add(glow);
    world.add(sprite);
  });

  function setNodeLayout() {
    products.forEach((product, index) => {
      const t = (product.year - 2017) / 9.6;
      const depth = depthPattern[index];
      const spread = spreadPattern[index];
      const sprite = nodeSprites[index];
      if (isMobile) {
        sprite.position.set(spread * 2.55, -5.1 + t * 10.2, (depth - .5) * 5.2);
      } else {
        sprite.position.set(-7.5 + t * 15.2, spread * 3.2, (depth - .5) * 6.2);
      }
      sprite.userData.baseZ = sprite.position.z;
      sprite.userData.baseX = sprite.position.x;
      sprite.userData.baseY = sprite.position.y;
      glowSprites[index].position.copy(sprite.position);
    });
    originSprite.position.set(isMobile ? -2.25 : -8.1, isMobile ? -5.35 : -2.85, -1.2);
  }
  setNodeLayout();

  const particleCount = isMobile ? 125 : 320;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i*3] = (Math.random() - .5) * (isMobile ? 8 : 20);
    particlePositions[i*3+1] = (Math.random() - .5) * (isMobile ? 13 : 8);
    particlePositions[i*3+2] = (Math.random() - .5) * 10;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    map: createPointTexture(), size: isMobile ? .2 : .16, transparent: true,
    opacity: .42, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  world.add(particles);

  function resetParticleLayout() {
    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - .5) * (isMobile ? 8 : 20);
      positions[i*3+1] = (Math.random() - .5) * (isMobile ? 13 : 8);
      positions[i*3+2] = (Math.random() - .5) * 10;
    }
    particleMaterial.size = isMobile ? .2 : .16;
    particleGeometry.attributes.position.needsUpdate = true;
  }

  const windTrailGroup = new THREE.Group();
  world.add(windTrailGroup);
  function addWindTrails() {
    windTrailGroup.children.forEach(line => {
      line.geometry.dispose();
      line.material.dispose();
    });
    windTrailGroup.clear();
    for (let i = 0; i < (isMobile ? 4 : 6); i++) {
      const points = [];
      for (let j = 0; j < 24; j++) {
        const t = j / 23;
        if (isMobile) {
          points.push(new THREE.Vector3(
            Math.sin(t * Math.PI * 2.1 + i) * (.35 + i*.08),
            -5.5 + t * 11,
            -1.8 + Math.cos(t * Math.PI * 1.7 + i) * 1.4 + i*.18
          ));
        } else {
          points.push(new THREE.Vector3(
            -8.4 + t * 17.2,
            Math.sin(t * Math.PI * 2 + i) * (.45 + i*.12) - 1.5 + i*.55,
            -2 + Math.cos(t * Math.PI * 1.5 + i) * 1.3 + i*.24
          ));
        }
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
      const material = new THREE.LineBasicMaterial({ color: i % 2 ? 0xe6b84e : 0xfff3d4, transparent: true, opacity: .055 + i*.009 });
      windTrailGroup.add(new THREE.Line(geometry, material));
    }
  }
  addWindTrails();

  const stemMaterial = new THREE.LineBasicMaterial({ color: 0x9a6b31, transparent: true, opacity: .55 });
  const stemLine = new THREE.Line(new THREE.BufferGeometry(), stemMaterial);
  world.add(stemLine);
  function setStemLayout() {
    const stemPoints = isMobile
      ? [new THREE.Vector3(-2.3,-7,-1.2), new THREE.Vector3(-2.25,-5.75,-1.2)]
      : [new THREE.Vector3(-8.4,-4.7,-1.2), new THREE.Vector3(-8.1,-3.25,-1.2)];
    stemLine.geometry.dispose();
    stemLine.geometry = new THREE.BufferGeometry().setFromPoints(stemPoints);
  }
  setStemLayout();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9,9);
  const projected = new THREE.Vector3();
  let hovered = null;
  let active = null;
  let locked = false;
  let dragStart = null;
  let dragged = false;
  let userRotationY = 0;
  let userRotationX = 0;
  let pointerX = 0;
  let pointerY = 0;
  let rotationVelocityX = 0;
  let rotationVelocityY = 0;

  function pointerFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function showProduct(sprite, shouldLock = false) {
    if (!sprite || sprite.userData.filtered) return;
    active = sprite;
    if (shouldLock) locked = true;
    const product = sprite.userData.product;
    populateDetail(product);
    detail.classList.add('is-open');
    detail.setAttribute('aria-hidden','false');
    label.textContent = product.name;
    label.classList.add('is-open');
    shell.classList.add('is-used');
  }

  function hideProduct() {
    if (locked) return;
    active = null;
    detail.classList.remove('is-open');
    detail.setAttribute('aria-hidden','true');
    label.classList.remove('is-open');
  }

  function hitTest() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(nodeSprites, false).find(hit => !hit.object.userData.filtered)?.object || null;
  }

  canvas.addEventListener('pointermove', event => {
    pointerFromEvent(event);
    pointerX = pointer.x;
    pointerY = pointer.y;
    if (dragStart) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) dragged = true;
      const sensitivity = event.pointerType === 'touch' || coarsePointer ? .0032 : .00235;
      const deltaY = dx * sensitivity;
      const deltaX = dy * sensitivity * .58;
      const dt = Math.max(8, event.timeStamp - dragStart.time);
      const velocityScale = Math.min(2, 16 / dt);
      rotationVelocityY = THREE.MathUtils.clamp(deltaY * velocityScale, -.045, .045);
      rotationVelocityX = THREE.MathUtils.clamp(deltaX * velocityScale, -.026, .026);
      userRotationY = THREE.MathUtils.clamp(userRotationY + deltaY, -.68, .68);
      userRotationX = THREE.MathUtils.clamp(userRotationX + deltaX, -.28, .28);
      dragStart = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    }
    if (!isMobile && !locked && !dragStart) {
      hovered = hitTest();
      if (hovered) showProduct(hovered, false); else hideProduct();
    }
  }, { passive: true });

  canvas.addEventListener('pointerdown', event => {
    pointerFromEvent(event);
    dragStart = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    dragged = false;
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener('pointerup', event => {
    pointerFromEvent(event);
    const pausedBeforeRelease = dragStart && event.timeStamp - dragStart.time > 90;
    if (!dragged) {
      rotationVelocityX = 0;
      rotationVelocityY = 0;
      const hit = hitTest();
      if (hit) showProduct(hit, true);
    }
    if (pausedBeforeRelease) {
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    }
    dragStart = null;
  });

  canvas.addEventListener('pointerleave', () => {
    dragStart = null;
    rotationVelocityX = 0;
    rotationVelocityY = 0;
    if (!locked) hideProduct();
  });

  canvas.addEventListener('pointercancel', () => {
    dragStart = null;
    rotationVelocityX = 0;
    rotationVelocityY = 0;
  });

  detailClose.addEventListener('click', () => {
    locked = false;
    hovered = null;
    hideProduct();
  });

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const value = filter.dataset.archiveFilter;
      filters.forEach(item => item.classList.toggle('is-active', item === filter));
      nodeSprites.forEach(sprite => {
        const filtered = value !== 'all' && sprite.userData.product.category !== value;
        sprite.userData.filtered = filtered;
        sprite.visible = !filtered;
        glowSprites[sprite.userData.index].visible = !filtered;
      });
      locked = false;
      hideProduct();
      shell.classList.add('is-used');
    });
  });

  function placeOverlay() {
    if (!active || !active.visible) return;
    active.getWorldPosition(projected);
    projected.project(camera);
    const x = (projected.x * .5 + .5) * shell.clientWidth;
    const y = (-projected.y * .5 + .5) * shell.clientHeight;
    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
    if (!isMobile) {
      const cardWidth = 315;
      const cardHeight = detail.offsetHeight || 350;
      const safeX = Math.min(shell.clientWidth - cardWidth - 22, Math.max(12, x + 34));
      const safeY = Math.min(shell.clientHeight - cardHeight / 2 - 14, Math.max(cardHeight / 2 + 14, y));
      detail.style.left = `${safeX}px`;
      detail.style.top = `${safeY}px`;
    }
  }

  function resize() {
    const rect = shell.getBoundingClientRect();
    const nextMobile = rect.width <= 720;
    if (nextMobile !== isMobile) {
      isMobile = nextMobile;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile || coarsePointer ? 1.25 : 1.8));
      scene.fog.density = isMobile ? .026 : .032;
      originSprite.scale.setScalar(isMobile ? 2.7 : 3.2);
      userRotationX = 0;
      userRotationY = 0;
      rotationVelocityX = 0;
      rotationVelocityY = 0;
      setNodeLayout();
      resetParticleLayout();
      addWindTrails();
      setStemLayout();
    }
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    if (!isMobile) {
      const horizontalFov = THREE.MathUtils.degToRad(62);
      camera.fov = THREE.MathUtils.clamp(
        THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(horizontalFov / 2) / camera.aspect)),
        28,
        42
      );
    } else camera.fov = 48;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(shell);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    const time = clock.getElapsedTime();
    const motion = reducedMotion ? .18 : 1;
    if (!dragStart) {
      userRotationY = THREE.MathUtils.clamp(userRotationY + rotationVelocityY, -.68, .68);
      userRotationX = THREE.MathUtils.clamp(userRotationX + rotationVelocityX, -.28, .28);
      rotationVelocityY *= .91;
      rotationVelocityX *= .91;
    }
    const targetY = userRotationY + (isMobile ? 0 : pointerX * .19);
    const targetX = userRotationX + (isMobile ? 0 : -pointerY * .085);
    world.rotation.y += (targetY - world.rotation.y) * .045 * motion;
    world.rotation.x += (targetX - world.rotation.x) * .045 * motion;
    world.position.z = Math.sin(time * .28) * .24 * motion;
    const cameraX = isMobile ? 0 : pointerX * .52;
    const cameraY = isMobile ? 0 : pointerY * .26;
    camera.position.x += (cameraX - camera.position.x) * .028 * motion;
    camera.position.y += (cameraY - camera.position.y) * .028 * motion;
    camera.position.z = (isMobile ? 17.5 : 18.5) + Math.sin(time * .22) * .12 * motion;
    camera.lookAt(0, 0, 0);

    originSprite.material.rotation = time * .018 * motion;
    nodeSprites.forEach((sprite, index) => {
      const isSelected = sprite === active;
      const targetScale = sprite.userData.baseScale * (isSelected ? 1.48 : 1);
      const current = sprite.scale.x + (targetScale - sprite.scale.x) * .09;
      sprite.scale.setScalar(current);
      sprite.material.opacity += ((isSelected ? 1 : sprite.userData.baseOpacity) - sprite.material.opacity) * .14;
      sprite.material.color.setHex(isSelected ? 0xffef9a : 0xffffff);
      sprite.material.rotation = time * (.018 + index*.00045) * motion + index*.17;
      const depthMotion = .7 + depthPattern[index] * .65;
      sprite.position.x = sprite.userData.baseX + Math.sin(time * .34 + index * 1.13) * .07 * depthMotion * motion;
      sprite.position.y = sprite.userData.baseY + Math.cos(time * .39 + index * .87) * .055 * depthMotion * motion;
      sprite.position.z = sprite.userData.baseZ + Math.sin(time * .55 + index*.8) * .17 * depthMotion * motion;
      const glow = glowSprites[index];
      const pulse = 1 + Math.sin(time * 3.1 + index) * .08;
      const glowTarget = sprite.userData.baseScale * 2.9 * pulse;
      const glowScale = glow.scale.x + (glowTarget - glow.scale.x) * .12;
      glow.scale.setScalar(glowScale);
      glow.position.copy(sprite.position);
      glow.material.opacity += ((isSelected ? .9 : 0) - glow.material.opacity) * .16;
    });

    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      if (isMobile) {
        positions[i*3+1] += (.0018 + (i%7)*.00013) * motion;
        if (positions[i*3+1] > 6.8) positions[i*3+1] = -6.8;
      } else {
        positions[i*3] += (.0022 + (i%7)*.00016) * motion;
        if (positions[i*3] > 10.2) positions[i*3] = -10.2;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;
    particles.rotation.z = Math.sin(time*.12) * .025 * motion;
    particles.rotation.y = Math.sin(time*.17) * .055 * motion;
    particles.rotation.x = Math.cos(time*.14) * .025 * motion;
    placeOverlay();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  }
}
