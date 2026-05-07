(function () {
  const t = window.TIMING;
  const totalDuration = t.duration;
  const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' }, paused: true });
  const el = (id) => document.getElementById(id);
  const has = (id) => !!el(id);
  const compId = document.querySelector('[data-composition-id]').getAttribute('data-composition-id');
  window.__timelines = window.__timelines || {};
  window.__timelines[compId] = tl;

  tl.fromTo(document.getElementById('stage'),
    { scale: 1.07 },
    { scale: 1.0, duration: totalDuration, ease: 'none' },
    0
  );

  tl.fromTo(el('glow-main'),
    { opacity: 0 },
    { opacity: 1, duration: totalDuration * 0.4, ease: 'none' },
    0
  );

  tl.fromTo(el('logo'),
    { autoAlpha: 0 },
    { autoAlpha: 0.35, duration: 1.0 },
    t.logo.start
  );

  tl.fromTo(el('eyebrow'),
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    t.eyebrow.start
  );

  tl.fromTo(el('headline'),
    { autoAlpha: 0, scale: 0.96, transformOrigin: 'center center' },
    { autoAlpha: 1, scale: 1, duration: 1.0 },
    t.headline.start
  );

  tl.fromTo(el('divider'),
    { autoAlpha: 0, scaleX: 0, transformOrigin: 'center center' },
    { autoAlpha: 1, scaleX: 1, duration: 0.7 },
    t.divider.start
  );

  if (has('pills')) {
    tl.fromTo(el('pills'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.7 },
      t.pills.start
    );
  }

  tl.fromTo(el('subline'),
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    t.subline.start
  );

  if (has('grid')) {
    tl.fromTo(el('grid').children,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
      t.grid.start
    );
  }

  tl.fromTo(el('cta'),
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    t.cta.start
  );

  const ctaPulseStart = t.cta.start + 1.0;
  const ctaPulseCycle = 1.4;
  const ctaPulseRepeat = Math.max(0, Math.floor((totalDuration - ctaPulseStart) / ctaPulseCycle) - 1);
  tl.to(el('cta'), {
    scale: 1.04,
    duration: ctaPulseCycle,
    repeat: ctaPulseRepeat,
    yoyo: true,
    ease: 'sine.inOut',
  }, ctaPulseStart);
}());
