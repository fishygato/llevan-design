// An original, offline score. No audio files or network requests.
window.LlevanSound = (() => {
  let context, master, musicBus, musicOutput, effectsBus, echoDelay;
  let echoSpeed = 1;
  let enabled = false, optedOut = false, volume = .45, lastBeat = -1;
  let running = false;
  const voices = new Set();
  const status = () => {
    const button = document.querySelector('#sound');
    button.setAttribute('aria-pressed', String(enabled));
    button.querySelector('span').textContent = enabled ? 'SOUND ON' : 'SOUND OFF';
  };
  function clearMusic() {
    lastBeat = -1;
    if (!context) return;
    voices.forEach(voice => {
      if (!voice.music) return;
      voice.gain.gain.cancelScheduledValues(context.currentTime);
      voice.gain.gain.setTargetAtTime(0, context.currentTime, .015);
      voice.source.stop(context.currentTime + .08);
    });
  }
  function buildSpace() {
    musicBus = context.createGain(); musicOutput = context.createGain(); effectsBus = context.createGain();
    musicBus.connect(musicOutput); musicOutput.connect(master); effectsBus.connect(master);
    musicOutput.gain.value = running ? 1 : 0;
    // A quiet stereo room and filtered echoes add depth without washing out the beat.
    const room = context.createConvolver(), roomSend = context.createGain();
    const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 1.4), context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      let seed = 9137 + channel * 317;
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 16807) % 2147483647;
        data[i] = (seed / 2147483647 * 2 - 1) * Math.pow(1 - i/data.length, 3) * .35;
      }
    }
    room.buffer = impulse; roomSend.gain.value = .19;
    musicBus.connect(room); room.connect(roomSend); roomSend.connect(musicOutput);
    const delay = context.createDelay(1), feedback = context.createGain(), echo = context.createGain(), filter = context.createBiquadFilter();
    echoDelay = delay;
    delay.delayTime.value = .375; feedback.gain.value = .24; echo.gain.value = .14;
    filter.type = 'lowpass'; filter.frequency.value = 2400;
    musicBus.connect(delay); delay.connect(filter); filter.connect(feedback); feedback.connect(delay);
    filter.connect(echo); echo.connect(musicOutput);
  }
  async function unlock(force = false) {
    if (optedOut && !force) return false;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Web Audio unavailable');
        context = new Audio();
        master = context.createGain();
        const limiter = context.createDynamicsCompressor();
        master.connect(limiter); limiter.connect(context.destination);
        master.gain.value = 0;
        buildSpace();
      }
      if (context.state !== 'running') await context.resume();
      // A later mute or tab switch must win over a pending resume.
      if (optedOut || document.hidden) return false;
      enabled = true;
      master.gain.setTargetAtTime(volume * .55, context.currentTime, .03);
      status(); return true;
    } catch {
      document.querySelector('#sound-note').textContent = 'SOUND UNAVAILABLE IN THIS BROWSER';
      return false;
    }
  }
  function tone(frequency, length = .25, level = .16, type = 'sine', delay = 0, music = false, endFrequency, pan = 0, attack = .008) {
    if (!enabled || !context || context.state !== 'running' || document.hidden) return;
    const now = context.currentTime + delay;
    const source = context.createOscillator(), gain = context.createGain();
    source.type = type;
    source.frequency.setValueAtTime(frequency, now);
    if (endFrequency) source.frequency.exponentialRampToValueAtTime(endFrequency, now + length);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(level, now + Math.min(attack, length * .4));
    gain.gain.exponentialRampToValueAtTime(.0001, now + length);
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(type === 'sawtooth' ? 1800 : 6500, now);
    source.connect(filter); filter.connect(gain);
    const stereo = context.createStereoPanner ? context.createStereoPanner() : context.createGain();
    if (stereo.pan) stereo.pan.value = pan;
    gain.connect(stereo); stereo.connect(music ? musicBus : effectsBus);
    const voice = {source, gain, music}; voices.add(voice);
    source.onended = () => {voices.delete(voice); source.disconnect(); filter.disconnect(); gain.disconnect(); stereo.disconnect();};
    source.start(now); source.stop(now + length + .02);
  }
  function noise(length = .08, level = .09, music = false, frequency = 1800, pan = 0) {
    if (!enabled || !context || context.state !== 'running' || document.hidden) return;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * length), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * Math.pow(1-i/samples.length, 3);
    const source = context.createBufferSource(), gain = context.createGain(), filter = context.createBiquadFilter();
    source.buffer = buffer; filter.type = 'highpass'; filter.frequency.value = frequency;
    gain.gain.value = level;
    const stereo = context.createStereoPanner ? context.createStereoPanner() : context.createGain();
    if (stereo.pan) stereo.pan.value = pan;
    source.connect(filter); filter.connect(gain); gain.connect(stereo); stereo.connect(music ? musicBus : effectsBus);
    const voice = {source, gain, music}; voices.add(voice);
    source.onended = () => {voices.delete(voice); source.disconnect(); filter.disconnect(); gain.disconnect(); stereo.disconnect();};
    source.start(); source.stop(context.currentTime + length);
  }
  const midi = note => 440 * Math.pow(2, (note - 69) / 12);
  // 120 BPM, sixteen eighth-notes per chapter. The arrangement builds from
  // a bright marimba motif to syncopated drums and an open, resolving finale.
  const harmony = [[48,55,59,64,74],[50,57,60,65,72],[53,60,64,69,79],[49,55,60,63,74],[43,50,53,59,69],[48,55,59,64,74]];
  const melody = [[76,79,83,79,74,76,79,86],[77,81,84,81,76,77,81,88],[81,84,88,84,79,81,84,91],[75,79,86,82,74,75,79,87],[74,77,81,77,71,74,77,83],[76,79,83,86,83,79,76,74]];
  function pluck(note, speed, pan = 0, level = .075) {
    tone(midi(note), .32/speed, level, 'triangle', 0, true, undefined, pan);
    tone(midi(note+12), .12/speed, level*.28, 'sine', 0, true, undefined, -pan);
  }
  function update(time, chapter, speed) {
    if (!enabled || !running || document.hidden) return;
    if (speed !== echoSpeed) {
      echoDelay.delayTime.setTargetAtTime(.375/speed, context.currentTime, .08);
      echoSpeed = speed;
    }
    const beat = Math.floor(time / 250);
    if (beat === lastBeat) return;
    lastBeat = beat;
    const step = beat % 16, notes = harmony[chapter], dense = chapter >= 2;
    if (step % 2 === 0 || dense) {
      const note = notes[[0,2,1,3,2,4,3,1][step%8]]+12;
      pluck(note, speed, step%2 ? .42 : -.42, chapter === 0 ? .075 : .065);
    }
    if (step === 0 || step === 8) {
      notes.slice(1).forEach((note,index) => {
        tone(midi(note), 2.5/speed, .027, 'triangle', index*.012/speed, true, undefined, index%2 ? .55 : -.55, .15/speed);
        tone(midi(note)*1.004, 2.3/speed, .012, 'sine', 0, true, undefined, index%2 ? -.5 : .5, .2/speed);
      });
    }
    if ([0,6,8,14].includes(step)) {
      tone(midi(notes[0] - (step===6 || step===14 ? 5 : 12)), .38/speed, .17, 'triangle', 0, true);
    }
    if (step%4 === 0 || (dense && step===11)) tone(145,.18/speed,.24,'sine',0,true,42);
    if (chapter >= 1) {
      noise(step%4===2 ? .09 : .035, step%2 ? .035 : .055, true, 5500, step%2 ? .55 : -.35);
      if (step===4 || step===12) {
        noise(.13,.13,true,1000); tone(185,.085/speed,.07,'triangle',0,true,110);
        noise(.07,.04,true,2200,.25);
      }
    }
    if (dense && (step%2===0 || chapter===3 && step%4===3)) {
      tone(midi(melody[chapter][Math.floor(step/2)%8]), .44/speed, .065, 'sine', 0, true, undefined, .18);
      tone(midi(melody[chapter][Math.floor(step/2)%8])*1.002, .38/speed, .025, 'triangle', .025/speed, true, undefined, -.2);
    }
    if (chapter===3 && (step===0 || step===15)) {
      noise(.2,.12,true,800,-.45); tone(midi(49),.2/speed,.055,'sawtooth',0,true,midi(55),.4);
    }
    if (chapter===4 && (step===4 || step===12)) {noise(.045,.16,true);tone(150,.12/speed,.18,'sine',0,true,55);}
    if (chapter===5 && step%4===0) pluck(melody[5][step/2]+12,speed,step%8 ? -.65 : .65,.045);
  }
  async function effect(action) {
    if (!await unlock()) return;
    if (action === 'give') {tone(330,.22,.2,'sine',0,false,660); tone(990,.2,.07,'sine',.1);}
    if (action === 'ask') {tone(392,.24,.13,'sine'); tone(587,.32,.15,'sine',.1);}
    if (action === 'speak') {tone(440,.23,.12,'triangle'); tone(554,.27,.12,'sine',.07); tone(659,.32,.12,'sine',.14);}
    if (action === 'press') {noise(.045,.24); tone(150,.12,.26,'sine',0,false,55); tone(660,.17,.07,'sine',.1);}
    if (action === 'friction') {noise(.18,.15); tone(233,.3,.13,'sawtooth',0,false,196); tone(247,.3,.09,'triangle',.02,false,262);}
  }
  return {
    unlock, effect, update,
    setPlayback(value) {
      running = value;
      if (!value) clearMusic();
      if (musicOutput) musicOutput.gain.setTargetAtTime(value ? 1 : 0, context.currentTime, .025);
      if (context && document.hidden) voices.forEach(voice => {
        voice.gain.gain.cancelScheduledValues(context.currentTime);
        voice.gain.gain.setTargetAtTime(0, context.currentTime, .015);
        voice.source.stop(context.currentTime + .08);
      });
    },
    seek: clearMusic,
    async toggle() {
      if (enabled) {
        optedOut = true; enabled = false; clearMusic();
        master.gain.setTargetAtTime(0, context.currentTime, .02); status();
      } else {optedOut = false; await unlock(true);}
    },
    setVolume(value) {volume = value; if (context && enabled) master.gain.setTargetAtTime(volume * .55, context.currentTime, .025);}
  };
})();
