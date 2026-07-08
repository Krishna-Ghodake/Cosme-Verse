// Web Audio API Synthesizer for CosmosVerse Space Platform

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambienceGain = null;
    this.ambienceOscs = [];
    this.ambienceLfo = null;
    
    // Settings
    this.isMuted = false;
    this.masterVolume = 0.5;
    this.ambienceVolume = 0.2;
    this.isAmbiencePlaying = false;
  }

  // Dispatch captions for accessibility visual sound effects
  dispatchCaption(text) {
    window.dispatchEvent(new CustomEvent('play-sound-caption', { detail: { text } }));
  }

  // Initialize Audio Context on user interaction
  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    
    // Master volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Ambience volume control
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
    this.ambienceGain.connect(this.masterGain);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        mute ? 0 : this.masterVolume,
        this.ctx.currentTime + 0.1
      );
    }
  }

  setVolume(vol) {
    this.masterVolume = vol;
    this.init();
    if (this.masterGain && !this.isMuted && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // Deep Space Drone Synthesizer
  startAmbience() {
    this.init();
    this.resume();
    if (this.isAmbiencePlaying || !this.ctx) return;

    try {
      this.isAmbiencePlaying = true;
      const t = this.ctx.currentTime;

      // Deep Oscillator 1 (55Hz - low hum)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, t);

      // Low-frequency detuned oscillator for beating effect (55.4Hz)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.4, t);

      // Filter to make it a warm, muffled hum
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, t);
      filter.Q.setValueAtTime(4, t);

      // LFO to slowly modulate the filter cutoff (breathing hum effect)
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, t);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, t);

      // Connect LFO modulation
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Connections
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambienceGain);

      // Start all nodes
      osc1.start(t);
      osc2.start(t);
      lfo.start(t);

      // Fade in ambience gain to prevent clicks
      this.ambienceGain.gain.setValueAtTime(0, t);
      this.ambienceGain.gain.linearRampToValueAtTime(this.ambienceVolume, t + 2);

      // Save references
      this.ambienceOscs = [osc1, osc2, lfo];
      this.dispatchCaption('🌌 [Background Space Ambience Drone Starts]');
    } catch (e) {
      console.warn('Failed to start ambience synthesizer:', e);
    }
  }

  stopAmbience() {
    if (!this.isAmbiencePlaying || !this.ctx) return;
    const t = this.ctx.currentTime;
    
    this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, t);
    this.ambienceGain.gain.linearRampToValueAtTime(0, t + 1);

    setTimeout(() => {
      this.ambienceOscs.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.ambienceOscs = [];
      this.isAmbiencePlaying = false;
    }, 1000);
  }

  // Play Hover Sound (high speed frequency sweep)
  playHover() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.08);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
    this.dispatchCaption('🔊 [Navigation Hover]');
  }

  // Play Click Sound (quick decay blip)
  playClick() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.1);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
    this.dispatchCaption('🔊 [System Beep]');
  }

  // Play Planet Selection Sound (deep resonance)
  playPlanetSelect() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(90, t);
    osc1.frequency.linearRampToValueAtTime(220, t + 0.4);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90.5, t);
    osc2.frequency.linearRampToValueAtTime(220.5, t + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.4);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.5);
    osc2.stop(t + 0.5);
    this.dispatchCaption('🔊 [Resonance telemetry Lock]');
  }

  // Play Rocket Launch Rumble Sound (dynamic noise sweep)
  playLaunch() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const duration = 4.0;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    
    filter.frequency.setValueAtTime(45, t);
    filter.frequency.exponentialRampToValueAtTime(250, t + 1.5);
    filter.frequency.linearRampToValueAtTime(60, t + 4.0);

    const gain = this.ctx.createGain();
    
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.3);
    gain.gain.linearRampToValueAtTime(0.25, t + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.0);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseNode.start(t);
    noiseNode.stop(t + duration);
    this.dispatchCaption('🚀 [Booster Thruster Rumble]');
  }

  // Play Achievement Unlock Sound (majestic triad chord sweep)
  playAchievement() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25];
    
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const noteDelay = idx * 0.1;
      
      osc.frequency.setValueAtTime(freq, t + noteDelay);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0, t + noteDelay);
      gain.gain.linearRampToValueAtTime(0.06, t + noteDelay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + noteDelay + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + noteDelay);
      osc.stop(t + noteDelay + 0.8);
    });
    this.dispatchCaption('🎖️ [Achievement Triad Chord]');
  }

  // Play Galaxy/View Transition Sound (deep cosmic sweep)
  playTransition() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const duration = 1.0;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.9);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration);
    this.dispatchCaption('🌀 [Cosmic Warp Sweep]');
  }
}

const spaceSounds = new SoundManager();
export default spaceSounds;
