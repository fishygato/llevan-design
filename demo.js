(() => {
  'use strict';
  const duration = 24000;
  const chapters = [
    ['THE FOUNDATION', 'Start with<br>some <em>order.</em>', 'A visible grid. A confident ink line. Structure gives every idea a place to begin.', 'ORDER IS THE STARTING POINT'],
    ['SHAPE AS POSTURE', 'Every shape<br>has a <em>purpose.</em>', 'An open hand gives. An envelope asks. A tag speaks. A key turns intention into action.', 'GIVE / ASK / SPEAK / PRESS'],
    ['COLOR AS CHARACTER', 'Clear heads.<br><em>Human hearts.</em>', 'Azure thinks. Sky asks. Pink feels. Color carries a point of view, rather than filling a space.', 'THREE VOICES / ONE VOCABULARY'],
    ['PRODUCTIVE TENSION', 'A little<br><span class="highlight">friction.</span>', 'Cross a line. Lean into disagreement. One burnt-orange interruption pushes the system somewhere new.', 'LET THE CONFLICT SHOW'],
    ['WEIGHT & MOVEMENT', 'Potential.<br>Then <em>impulse.</em>', 'Hard shadows give ideas weight. A physical push releases the energy already waiting inside.', 'STILL DOES NOT MEAN STATIC'],
    ['A LIVING LANGUAGE', 'Different voices.<br><em>Common ground.</em>', 'Structure and personality find a shared composition. Keep the difference. Make something move.', 'BUILT ON A GRID / DRIVEN BY A FEELING']
  ];
  const $ = selector => document.querySelector(selector);
  const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = [];
  const responsiveTracks = [];
  const sound = window.LlevanSound;
  const forms = [...document.querySelectorAll('[data-action]')];
  const meterBars = [...document.querySelectorAll('.rhythm-meter i')];
  const reactions = new Map();
  const highlightTimers = new WeakMap();
  const actions = {
    give: {chapter:0, key:'g', message:'GIVE — An idea leaves your hands. Pass it on.', move:'translate(0,-18px) rotate(-5deg)'},
    ask: {chapter:1, key:'a', message:'ASK — An invitation opens. Leave room for the unknown.', move:'translate(0,-8px) rotate(4deg)'},
    speak: {chapter:2, key:'s', message:'SPEAK — Three notes. One human signature.', move:'translate(0,-6px) rotate(10deg)'},
    press: {chapter:4, key:'Enter', message:'PRESS — A tactile click. Potential becomes movement.', move:'translate(6px,6px)'},
    friction: {chapter:3, key:'x', message:'FRICTION — A little dissonance. A new possibility.', move:'rotate(90deg) scale(1.15)'}
  };
  let time = 0, playing = !preference.matches, speed = 1, frame = null, previous = null, activeChapter = -1;
  let dragging = false, explicitPlayback = false;

  // Every pose is evaluated on one clock, so scrubbing also scrubs the artwork.
  function track(selector, poses) {
    const element = $(selector);
    const lively = /^\.(give|ask|speak|interruption)$/.test(selector);
    function makeFrames() {
    const resolved = typeof poses === 'function' ? poses() : poses;
    const frames = resolved.flatMap((pose, index) => lively ? [
      {...pose, offset:index/6},
      {...pose, transform:`${pose.transform} translate(0,-${index===3 ? 16 : 8}px) rotate(${index%2 ? 3 : -3}deg)`,offset:(index+.22)/6},
      {...pose, transform:`${pose.transform} translate(0,${index===3 ? 7 : 3}px) rotate(${index%2 ? -2 : 2}deg)`,offset:(index+.48)/6},
      {...pose, transform:`${pose.transform} translate(0,-5px)`,offset:(index+.72)/6},
      {...pose,offset:(index+.86)/6}
    ] : [
      {...pose, offset: index / 6},
      {...pose, offset: (index + .65) / 6}
    ]);
    frames.push({...resolved[0], offset: 1});
    return frames;
    }
    const animation = element.animate(makeFrames(), {duration, fill: 'both', easing: 'cubic-bezier(.22,.8,.25,1)'});
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
    if (typeof poses === 'function') responsiveTracks.push(() => animation.effect.setKeyframes(makeFrames()));
  }
  const pose = (transform, opacity = 1) => ({transform, opacity});
  function travel(desktop, mobile, visibility = [1,1,1,1,1,1]) {
    return () => (window.innerWidth <= 700 ? mobile : desktop).map(([x,y,angle,scale=1],index) => {
      if (window.innerHeight <= 600 && window.innerWidth > 700) y = y*.65-6;
      return pose(`translate(-50%,-50%) translate(${x}vw,${y}vh) rotate(${angle}deg) scale(${scale})`,visibility[index]);
    });
  }
  track('.grid', [pose('scale(1)'),pose('scale(1)',.7),pose('scale(1)',.5),pose('rotate(8deg) scale(1.15)',.4),pose('scale(1)',.7),pose('scale(1)')]);
  track('.give', travel([[24,-10,-5],[-23,12,-8],[-25,10,-14],[-16,12,-22],[24,-16,-7],[-24,10,-8]], [[8,-7,-5],[-23,-5,-8],[-23,-4,-12],[-23,1,-20],[23,-8,-7],[-23,-4,-8]]));
  track('.ask', travel([[26,-18,0],[26,-19,4],[27,-19,8],[25,-17,16],[-22,10,-3],[27,-19,4]], [[23,-9,0],[23,-9,4],[23,-9,8],[23,-6,14],[-23,4,-3],[23,-9,4]], [0,1,1,1,.4,.85]));
  track('.speak', travel([[24,10,0],[25,11,6],[25,10,10],[17,15,20],[-22,9,7],[25,10,8]], [[14,12,0],[15,12,6],[16,12,9],[17,13,15],[-17,12,7],[16,12,8]], [0,1,1,1,.65,1]));
  track('.press', travel([[-2,18,0],[-3,17,0],[-4,18,0],[-25,18,-8],[2,5,0],[-2,18,-3]], [[-22,14,0],[-22,14,0],[-22,14,0],[-22,15,-5],[0,7,0],[-22,14,-3]], [0,1,.35,.2,1,1]));
  track('.interruption', travel([[36,-28,0,0],[36,-28,0,0],[5,-10,0,.8],[32,3,90,1.3],[-1,-12,180,.9],[5,-10,180]], [[30,-9,0,0],[30,-9,0,0],[0,2,0,.8],[0,0,90,1.1],[26,11,180,.8],[0,2,180,.8]], [0,0,.4,1,1,1]));
  track('.ink-band', [pose('rotate(-5deg) scale(.8)',0),pose('rotate(-5deg) scale(.8)',0),pose('rotate(-5deg) scale(.8)',0),pose('rotate(-5deg) scale(1)'),pose('rotate(3deg) translateY(10%)',0),pose('rotate(-5deg) scale(.8)',0)]);
  track('.give-arrow', [pose('translate(0,0)'),pose('translate(0,0)'),pose('translate(5%,-5%)'),pose('translate(10%,-10%)'),pose('translate(0,0)'),pose('translate(5%,-5%)')]);
  // Add a press and release within the impulse chapter.
  const key = $('.press').animate([
    {transform:'translate(0,0)',offset:0},
    {transform:'translate(0,0)',offset:.67},
    {transform:'translate(6px,6px)',boxShadow:'0px 0px 0 #22231f',offset:.71},
    {transform:'translate(-3px,-12px) rotate(-4deg)',boxShadow:'9px 18px 0 #22231f',offset:.76},
    {transform:'translate(6px,6px)',boxShadow:'0px 0px 0 #22231f',offset:.80},
    {transform:'translate(-2px,-3px) rotate(-3deg)',boxShadow:'8px 9px 0 #22231f',offset:.85},
    {transform:'translate(0,0)',offset:.95},
    {transform:'translate(0,0)',offset:1}
  ], {duration, fill:'both', easing:'ease-in-out', composite:'add'});
  key.pause(); animations.push(key);
  track('.wash-blue', [pose('translate(-10%,-10%) scale(.8)',.35),pose('translate(8%,-5%)',.5),pose('translate(-8%,15%) scale(1.25)',.75),pose('translate(25%,5%) scale(1.3)',.5),pose('translate(-10%,10%)',.4),pose('translate(-5%,-8%) scale(1.15)',.65)]);
  track('.wash-pink', [pose('scale(.5)',0),pose('translate(-5%,5%)',.25),pose('translate(-18%,-10%) scale(1.2)',.65),pose('translate(-5%,-35%) scale(1.3)',.6),pose('translate(5%,-10%)',.4),pose('translate(-15%,-5%) scale(1.1)',.6)]);
  track('.orbit-one', [pose('rotate(-30deg) scale(.85)',.35),pose('rotate(30deg)',.5),pose('rotate(95deg) scale(1.05)',.65),pose('rotate(165deg) scale(1.18)',.8),pose('rotate(235deg) scale(.95)',.5),pose('rotate(300deg)',.6)]);
  track('.orbit-two', [pose('rotate(45deg) scale(.7)',0),pose('rotate(-15deg) scale(.9)',.4),pose('rotate(-75deg)',.65),pose('rotate(-140deg) scale(1.2)',.7),pose('rotate(-205deg)',.4),pose('rotate(-270deg)',.6)]);
  track('.motion-traces', [pose('scale(.85)',0),pose('scale(.95)',.3),pose('rotate(-4deg)',.65),pose('rotate(10deg) scale(1.1)',.8),pose('rotate(-5deg)',.4),pose('scale(1)',.55)]);
  track('.voice-think', [pose('translate(0,0)',0),pose('translate(0,0)',.7),pose('translate(8px,-5px)',1),pose('translate(-6px,10px) rotate(-9deg)',.7),pose('translate(0,0)',.5),pose('translate(4px,-2px)',1)]);
  track('.voice-feel', [pose('translate(0,0)',0),pose('translate(0,0)',.4),pose('translate(-5px,4px) rotate(6deg)',1),pose('translate(8px,-12px) rotate(12deg)',.7),pose('translate(0,0)',.5),pose('translate(-3px,2px)',1)]);
  ['.trace-blue','.trace-pink'].forEach((selector,index) => {
    const path = $(selector), length = path.getTotalLength();
    const animation = path.animate([
      {strokeDasharray:`${length*.22} ${length*.1}`,strokeDashoffset:0},
      {strokeDasharray:`${length*.22} ${length*.1}`,strokeDashoffset:(index ? 1 : -1)*length*3}
    ], {duration,fill:'both',easing:'linear'});
    animation.pause(); animations.push(animation);
  });

  function render() {
    animations.forEach(animation => {animation.currentTime = time;});
    const chapter = Math.min(5, Math.floor(time / 4000));
    if (chapter !== activeChapter) {
      activeChapter = chapter;
      $('.film-shell').dataset.act = String(chapter);
      const [name, title, description, study] = chapters[chapter];
      $('#chapter-number').textContent = `${String(chapter + 1).padStart(2,'0')} / ${name}`;
      $('#headline').innerHTML = title;
      $('#description').textContent = description;
      $('#study-label').textContent = `FIG. 0${chapter + 1} / ${study}`;
      chapterButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === chapter)));
      if (playing && !dragging && !preference.matches) {
        pulse($('#headline'), [{transform:'translateY(14px)',opacity:.3},{transform:'translateY(-3px)',opacity:1},{transform:'translateY(0)',opacity:1}]);
      }
    }
    // Transparent forms must not remain invisible click or keyboard targets.
    forms.forEach(element => {element.disabled = Number(getComputedStyle(element).opacity) < .2;});
    chapterButtons.forEach((button, index) => button.style.setProperty('--chapter-progress', `${Math.max(0,Math.min(1,(time-index*4000)/4000))*100}%`));
    $('#scrub').value = String(time / 1000);
    $('#scrub').setAttribute('aria-valuetext', `${(time / 1000).toFixed(1)} seconds of 24`);
    $('#time').textContent = `${(time/1000).toFixed(1).padStart(4,'0')} / 24.0`;
    document.documentElement.style.setProperty('--progress', String(time / duration));
    const beat = .5 + .5*Math.cos(time/500*Math.PI*2);
    $('.canvas').style.setProperty('--beat', preference.matches ? '0' : String(beat));
    meterBars.forEach((bar,index) => {
      const height = preference.matches ? .3 : .18 + .82*Math.abs(Math.sin(time/340 + index*.7)*Math.cos(time/900-index*.4));
      bar.style.transform = `scaleY(${height})`;
    });
    sound.update(time, chapter, speed);
  }
  function tick(timestamp) {
    frame = null;
    if (!playing || document.hidden || dragging) {previous = null; return;}
    if (previous !== null) time = (time + Math.min(timestamp - previous, 100) * speed) % duration;
    previous = timestamp;
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null;
    $('#play').innerHTML = playing ? 'Ⅱ <span>PAUSE</span>' : '▷ <span>PLAY</span>';
    $('#play').setAttribute('aria-label', playing ? 'Pause film' : 'Play film');
    sound.setPlayback(playing && !document.hidden && !dragging);
    if (playing && !document.hidden && !dragging) frame = requestAnimationFrame(tick);
  }
  function chooseChapter(index) {
    time = Math.max(0,Math.min(5,index)) * 4000;
    playing = false;
    sound.seek();
    sync(); render();
  }
  $('#play').addEventListener('click', () => {explicitPlayback = true; playing = !playing; if (playing) sound.unlock(); sync();});
  $('#replay').addEventListener('click', () => {explicitPlayback = true; time = 0; playing = true; sound.seek(); sound.unlock(); render(); sync();});
  $('#speed').addEventListener('change', event => {speed = Number(event.target.value); sound.seek();});
  chapterButtons.forEach((button,index) => button.addEventListener('click', () => chooseChapter(index)));
  $('#scrub').addEventListener('pointerdown', () => {dragging = true; sync();});
  $('#scrub').addEventListener('input', event => {time = Number(event.target.value)*1000; previous = null; sound.seek(); render();});
  function endScrub() {if (!dragging) return; dragging = false; sync();}
  window.addEventListener('pointerup', endScrub);
  window.addEventListener('pointercancel', endScrub);
  window.addEventListener('resize', () => {responsiveTracks.forEach(refresh => refresh()); render();});
  $('#scrub').addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) {playing = false; sync();}
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === 'm') {event.preventDefault(); $('#sound').click(); return;}
    if (key === 'k') {event.preventDefault(); $('#keycaps').click(); return;}
    const action = Object.keys(actions).find(name => actions[name].key === key);
    if (action && !(key === 'Enter' && /^(BUTTON|A)$/.test(event.target.tagName))) {event.preventDefault(); activate(action); return;}
    if (/^(BUTTON|A)$/.test(event.target.tagName)) return;
    if (event.code === 'Space') {event.preventDefault(); $('#play').click();}
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); chooseChapter((activeChapter + (event.key === 'ArrowRight' ? 1 : 5)) % 6);}
  });
  function pulse(element, frames) {
    if (preference.matches) return;
    reactions.get(element)?.cancel();
    const animation = element.animate(frames, {duration:460, easing:'cubic-bezier(.2,.8,.2,1)', composite:'add'});
    reactions.set(element, animation);
    animation.onfinish = () => {if (reactions.get(element) === animation) reactions.delete(element);};
  }
  function activate(name) {
    const action = actions[name], element = $(`[data-action="${name}"]`);
    if (element.disabled) chooseChapter(action.chapter);
    sound.effect(name);
    $('#interaction-feedback').textContent = action.message;
    element.classList.add('is-struck');
    clearTimeout(highlightTimers.get(element));
    highlightTimers.set(element, setTimeout(() => element.classList.remove('is-struck'), 450));
    pulse(element, [{transform:'translate(0,0)',offset:0},{transform:action.move,offset:.28},{transform:'translate(0,0)',offset:1}]);
    if (name === 'give') pulse($('.give-arrow'), [{transform:'translate(0,0)'},{transform:'translate(18px,-18px)'},{transform:'translate(0,0)'}]);
    if (name === 'ask') pulse($('.ask svg'), [{transform:'scaleY(1)'},{transform:'scaleY(-.3)'},{transform:'scaleY(1)'}]);
    if (name === 'friction') {
      forms.filter(form => form !== element).forEach((form,index) => pulse(form, [{transform:'rotate(0deg)'},{transform:`rotate(${index%2 ? -8 : 8}deg)`},{transform:'rotate(0deg)'}]));
      pulse($('.grid'), [{transform:'rotate(0deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(0deg)'}]);
    }
  }
  forms.forEach(element => element.addEventListener('click', () => activate(element.dataset.action)));
  $('#keycaps').addEventListener('click', () => {
    const hidden = document.body.classList.toggle('hide-keycaps');
    $('#keycaps').setAttribute('aria-pressed', String(!hidden));
    $('#keycaps').innerHTML = `<kbd>K</kbd> KEYCAPS ${hidden ? 'OFF' : 'ON'}`;
  });
  $('#sound').addEventListener('click', () => sound.toggle());
  $('#volume').addEventListener('input', event => sound.setVolume(Number(event.target.value)/100));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {reactions.forEach(animation => animation.cancel()); reactions.clear();}
    sync();
  });
  preference.addEventListener('change', () => {if (!explicitPlayback) {playing = !preference.matches; sync();}});
  render(); sync();
})();
