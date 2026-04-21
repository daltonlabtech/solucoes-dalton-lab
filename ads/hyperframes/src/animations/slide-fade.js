(function () {
  const t = window.TIMING;
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const el = (id) => document.getElementById(id);
  const has = (id) => !!el(id);

  tl.fromTo(el('logo'),
    { autoAlpha: 0, y: -28 },
    { autoAlpha: 0.35, y: 0, duration: 0.5 },
    t.logo.start
  );

  tl.fromTo(el('eyebrow'),
    { autoAlpha: 0, x: -24 },
    { autoAlpha: 1, x: 0, duration: 0.45 },
    t.eyebrow.start
  );

  tl.fromTo(el('headline'),
    { autoAlpha: 0, y: 48 },
    { autoAlpha: 1, y: 0, duration: 0.65 },
    t.headline.start
  );

  tl.fromTo(el('divider'),
    { autoAlpha: 0, scaleX: 0, transformOrigin: 'center center' },
    { autoAlpha: 1, scaleX: 1, duration: 0.45 },
    t.divider.start
  );

  if (has('pills')) {
    tl.fromTo(el('pills'),
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.5 },
      t.pills.start
    );
  }

  tl.fromTo(el('subline'),
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 0.55 },
    t.subline.start
  );

  if (has('grid')) {
    tl.fromTo(el('grid'),
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      t.grid.start
    );
  }

  tl.fromTo(el('cta'),
    { autoAlpha: 0, y: 32, scale: 0.93 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
    t.cta.start
  );

  tl.to(el('cta'), {
    scale: 1.04,
    duration: 0.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  }, t.cta.start + 0.7);
}());
