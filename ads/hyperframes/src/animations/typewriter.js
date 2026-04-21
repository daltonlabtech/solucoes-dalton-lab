(function () {
  const t = window.TIMING;
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const el = (id) => document.getElementById(id);
  const has = (id) => !!el(id);

  tl.fromTo(el('logo'),
    { autoAlpha: 0 },
    { autoAlpha: 0.35, duration: 0.5 },
    t.logo.start
  );

  tl.fromTo(el('eyebrow'),
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.4 },
    t.eyebrow.start
  );

  const headline = el('headline');
  tl.set(headline, { autoAlpha: 1 }, t.headline.start);

  function wrapWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/\s+/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part) {
          const outer = document.createElement('span');
          outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom';
          const inner = document.createElement('span');
          inner.className = 'tw-w';
          inner.style.cssText = 'display:inline-block';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(wrapWords);
    }
  }
  wrapWords(headline);

  tl.fromTo(headline.querySelectorAll('.tw-w'),
    { y: '105%' },
    { y: '0%', duration: 0.07, stagger: 0.055, ease: 'none' },
    t.headline.start
  );

  tl.fromTo(el('divider'),
    { autoAlpha: 0, scaleX: 0, transformOrigin: 'center center' },
    { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' },
    t.divider.start
  );

  if (has('pills')) {
    tl.fromTo(el('pills').children,
      { autoAlpha: 0, x: -20 },
      { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.1 },
      t.pills.start
    );
  }

  tl.fromTo(el('subline'),
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.55 },
    t.subline.start
  );

  if (has('grid')) {
    tl.fromTo(el('grid').children,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
      t.grid.start
    );
  }

  tl.fromTo(el('cta'),
    { autoAlpha: 0, scale: 0.85 },
    { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' },
    t.cta.start
  );

  tl.to(el('cta'), {
    scale: 1.04,
    duration: 0.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  }, t.cta.start + 0.55);
}());
