(() => {
  const duration = 12000;
  const animations = [];
  const interactions = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transport = document.querySelector('.motion-transport');
  const playButton = document.querySelector('#motion-play');
  const scrub = document.querySelector('#motion-scrub');
  const timeOutput = document.querySelector('#motion-time');
  let time = 0;
  let speed = 1;
  let playing = !reducedMotion.matches;
  let previous = null;
  let frame = null;
  let currentPhase = -1;
  let dragging = false;
  let resumeAfterScrub = false;
  let userChosePlayback = false;

  function animate(selector, keyframes, options = {}) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const frames = typeof keyframes === 'function' ? keyframes(element, index) : keyframes;
      const animation = element.animate(frames, { duration, iterations: Infinity, easing: 'ease-in-out', ...options });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    });
  }
  function movement(transforms) {
    return transforms.map((transform, index) => ({ transform, offset: index / (transforms.length - 1) }));
  }
  // All studies share a twelve-second clock: order, opposition, common ground.
  animate('.headline-make', movement(['translateX(0)', 'translateX(0)', 'translateX(3%)', 'translateX(-1%)', 'translateX(0)']));
  animate('.headline-room', movement(['translateX(0)', 'translateX(0)', 'translateX(-9%)', 'translateX(3%)', 'translateX(0)']));
  animate('.headline-for', movement(['rotate(-9deg)', 'rotate(-9deg)', 'rotate(13deg) translateY(-8px)', 'rotate(-16deg)', 'rotate(-9deg)']));
  animate('.headline-conflict', movement(['rotate(-3deg)', 'rotate(-3deg)', 'translateX(3%) rotate(2deg)', 'translateX(-1%) rotate(-5deg)', 'rotate(-3deg)']));
  animate('.headline-direction', movement(['rotate(8deg)', 'rotate(8deg)', 'translate(8px,-8px) rotate(-8deg)', 'translate(-2px,2px) rotate(12deg)', 'rotate(8deg)']));
  animate('.art-blue', movement(['rotate(-11deg)', 'rotate(-11deg)', 'translate(-15px,12px) rotate(4deg)', 'translate(6px,-7px) rotate(-15deg)', 'rotate(-11deg)']));
  animate('.art-pink', movement(['rotate(10deg)', 'rotate(10deg)', 'translate(5px,-16px) rotate(-7deg)', 'translate(-7px,4px) rotate(15deg)', 'rotate(10deg)']));
  animate('.art-orange', movement(['translateY(0)', 'translateY(0)', 'translate(-8px,12px) rotate(40deg)', 'translate(4px,-6px) rotate(-12deg)', 'translateY(0)']));
  animate('.axis-x', movement(['scaleX(1)', 'scaleX(1)', 'rotate(8deg) scaleX(.9)', 'rotate(-3deg) scaleX(1.05)', 'scaleX(1)']));
  animate('.axis-y', movement(['scaleY(1)', 'scaleY(1)', 'rotate(-10deg) scaleY(.9)', 'rotate(4deg)', 'scaleY(1)']));
  animate('.brand-icon', movement(['translate(0,0)', 'translate(0,0)', 'translate(2px,-2px)', 'translate(-1px,1px)', 'translate(0,0)']));
  animate('.hero-footer > span:last-child', movement(['translateY(0)', 'translateY(0)', 'translateY(4px)', 'translateY(-2px)', 'translateY(0)']));
  animate('.give', movement(['translate(0,0)', 'translate(0,0)', 'translate(-5px,-10px) rotate(-4deg)', 'translate(3px,3px) rotate(2deg)', 'translate(0,0)']));
  animate('.give .sample-arrow', movement(['translate(0,0)', 'translate(0,0)', 'translate(5px,-5px)', 'translate(-2px,2px)', 'translate(0,0)']));
  animate('.ask', movement(['translate(0,0)', 'translate(0,0)', 'translateY(-6px) rotate(3deg)', 'translateY(2px) rotate(-1deg)', 'translate(0,0)']));
  animate('.envelope', [{transform:'scaleY(1)',offset:0},{transform:'scaleY(1)',offset:.25},{transform:'scaleY(-.3)',offset:.5},{transform:'scaleY(.8)',offset:.75},{transform:'scaleY(1)',offset:1}]);
  animate('.speak', movement(['rotate(-5deg)', 'rotate(-5deg)', 'rotate(8deg) translateY(-6px)', 'rotate(-9deg) translateY(3px)', 'rotate(-5deg)']));
  animate('.press', [{transform:'translate(0,0)',boxShadow:'6px 7px 0 #22231f',offset:0},{transform:'translate(0,0)',boxShadow:'6px 7px 0 #22231f',offset:.25},{transform:'translate(6px,7px)',boxShadow:'0px 0px 0 #22231f',offset:.5},{transform:'translate(-2px,-3px)',boxShadow:'8px 10px 0 #22231f',offset:.75},{transform:'translate(0,0)',boxShadow:'6px 7px 0 #22231f',offset:1}]);
  animate('.small-cross', movement(['rotate(0deg)', 'rotate(0deg)', 'rotate(90deg)', 'rotate(72deg)', 'rotate(90deg)']));
  animate('.principle', (_, index) => movement(['translateX(0)', 'translateX(0)', `translateX(${index % 2 ? -8 : 8}px)`, 'translateX(0)', 'translateX(0)']));
  animate('.study-grid', [{opacity:1,transform:'scale(1)',offset:0},{opacity:1,transform:'scale(1)',offset:.25},{opacity:.4,transform:'rotate(5deg) scale(1.1)',offset:.5},{opacity:.8,transform:'rotate(-2deg) scale(1.02)',offset:.75},{opacity:1,transform:'scale(1)',offset:1}]);
  animate('.block-a', movement(['translate(0,0)', 'translate(0,0)', 'translate(28px,22px) rotate(-12deg)', 'translate(-5px,-3px) rotate(3deg)', 'translate(0,0)']));
  animate('.block-b', movement(['translate(0,0)', 'translate(0,0)', 'translate(-25px,-12px) rotate(13deg)', 'translate(3px,5px) rotate(-3deg)', 'translate(0,0)']));
  animate('.grid-cross', movement(['rotate(0deg)', 'rotate(0deg)', 'rotate(45deg)', 'rotate(-8deg)', 'rotate(0deg)']));
  animate('.plane-data', movement(['translate(0,0)', 'translate(0,0)', 'translate(18px,25px) rotate(-8deg)', 'translate(-3px,-3px) rotate(2deg)', 'translate(0,0)']));
  animate('.plane-ask', movement(['translate(0,0)', 'translate(0,0)', 'translate(-12px,-15px) rotate(7deg)', 'translate(2px,2px) rotate(-2deg)', 'translate(0,0)']));
  animate('.plane-human', movement(['rotate(-6deg)', 'rotate(-6deg)', 'translateY(-16px) rotate(9deg)', 'translateY(3px) rotate(-9deg)', 'rotate(-6deg)']));
  animate('.color-conflict', [{opacity:0,transform:'rotate(10deg) scale(.8)',offset:0},{opacity:0,transform:'rotate(10deg) scale(.8)',offset:.3},{opacity:.95,transform:'rotate(-8deg) scale(1)',offset:.5},{opacity:0,transform:'rotate(12deg) scale(.95)',offset:.8},{opacity:0,transform:'rotate(10deg) scale(.8)',offset:1}]);
  animate('.weight-key', movement(['translate(0,0)', 'translate(0,0)', 'translate(6px,10px)', 'translate(-3px,-12px) rotate(-3deg)', 'translate(0,0)']));
  animate('.weight-shadow', movement(['scale(1)', 'scale(1)', 'scale(1)', 'translate(5px,3px) scale(1.05)', 'scale(1)']));
  animate('.motion-icon svg', (_, index) => {
    const lean = index % 2 ? -6 : 6;
    return movement(['translate(0,0)', 'translate(0,0)', `translate(${lean / 2}px,-5px) rotate(${lean}deg)`, 'translate(-1px,2px) rotate(-2deg)', 'translate(0,0)']);
  });
  document.querySelectorAll('.motion-icon svg path, .motion-icon svg circle, .motion-icon svg rect, .art-pink svg path').forEach((shape, index) => {
    if (shape.getAttribute('stroke') === 'none' || shape.hasAttribute('stroke-dasharray')) return;
    try {
      const length = shape.getTotalLength();
      if (!length) return;
      const animation = shape.animate([
        {strokeDasharray:`${length} ${length}`,strokeDashoffset:0,offset:0},
        {strokeDasharray:`${length} ${length}`,strokeDashoffset:0,offset:.14 + (index % 4) * .015},
        {strokeDasharray:`${length} ${length}`,strokeDashoffset:length,offset:.24 + (index % 4) * .015},
        {strokeDasharray:`${length} ${length}`,strokeDashoffset:0,offset:.4 + (index % 4) * .015},
        {strokeDasharray:`${length} ${length}`,strokeDashoffset:0,offset:1}
      ], {duration,iterations:Infinity,easing:'ease-in-out'});
      animation.pause(); animation.currentTime = 0; animations.push(animation);
    } catch { /* A glyph remains usable if its geometry cannot be measured. */ }
  });
  animate('.contact-link span, .text-link > span', movement(['translate(0,0)', 'translate(0,0)', 'translate(4px,-4px)', 'translate(-1px,1px)', 'translate(0,0)']));

  function render() {
    const local = ((time % duration) + duration) % duration;
    animations.forEach(animation => { animation.currentTime = local; });
    scrub.value = String(local);
    document.documentElement.style.setProperty('--motion-progress', String(local / duration));
    timeOutput.textContent = `${(local / 1000).toFixed(1).padStart(4,'0')} / 12.0`;
    const phase = Math.min(2, Math.floor(local / 4000));
    if (phase !== currentPhase) {
      currentPhase = phase;
      document.querySelectorAll('[data-phase]').forEach((el,index) => el.setAttribute('aria-current',String(index === phase)));
    }
  }
  function tick(timestamp) {
    frame = null;
    if (!playing || document.hidden || dragging) { previous = null; return; }
    if (previous !== null) time += Math.min(timestamp - previous,100) * speed;
    previous = timestamp;
    render();
    frame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    transport.classList.toggle('is-paused', !playing);
    playButton.innerHTML = playing ? 'Ⅱ <span>PAUSE</span>' : '▷ <span>PLAY</span>';
    playButton.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    interactions.forEach(animation => playing ? animation.play() : animation.pause());
    previous = null;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = playing && !document.hidden && !dragging ? requestAnimationFrame(tick) : null;
  }
  playButton.addEventListener('click', () => { userChosePlayback = true; playing = !playing; syncPlayback(); });
  document.querySelector('#motion-replay').addEventListener('click', () => { time = 0; render(); previous = null; });
  document.querySelector('#motion-speed').addEventListener('change', event => {
    speed = Number(event.target.value);
    interactions.forEach(animation => { animation.playbackRate = speed; });
  });
  scrub.addEventListener('pointerdown', () => { dragging = true; resumeAfterScrub = playing; syncPlayback(); });
  scrub.addEventListener('input', () => { time = Number(scrub.value); render(); });
  function finishScrub() { if (!dragging) return; dragging = false; playing = resumeAfterScrub; syncPlayback(); }
  window.addEventListener('pointerup', finishScrub);
  window.addEventListener('pointercancel', finishScrub);
  scrub.addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) {
      playing = false; syncPlayback();
    }
  });
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    if (!userChosePlayback) { playing = !reducedMotion.matches; syncPlayback(); }
  });
  function trackInteraction(animation) {
    animation.playbackRate = speed;
    interactions.add(animation);
    animation.onfinish = () => { interactions.delete(animation); animation.cancel(); };
    animation.oncancel = () => interactions.delete(animation);
    return animation;
  }
  document.querySelectorAll('.motion-icon').forEach(button => button.addEventListener('click', () => {
    if (!playing) return;
    const old = button.getAnimations(); old.forEach(animation => animation.cancel());
    trackInteraction(button.animate([
      {transform:'translate(0,0)'},
      {transform:'translate(3px,-5px)',offset:.45},
      {transform:'translate(0,0)'}
    ],{duration:400,easing:'cubic-bezier(.2,.8,.3,1)'}));
  }));
  // Manual posture interactions still work, and obey the shared clock's pause state.
  document.querySelectorAll('.sample').forEach(button => button.addEventListener('click', () => {
    if (!playing) return;
    trackInteraction(button.animate([{translate:'0 0'},{translate:'0 -8px',offset:.4},{translate:'0 0'}],{duration:450,easing:'ease-out'}));
  }));
  render(); syncPlayback();
})();
