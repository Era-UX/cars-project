// sound.js - Assignment 5: Sound Effects & Event-Triggered Animation
// Uses the Web Audio API to synthesize an aggressive V8 engine ignition + double throttle rev.

let sharedAudioCtx = null;

function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
        return null;
    }
    if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
}

// 1. Aggressive V8 Engine Ignition + Double Throttle Rev (Home page)
function playEngineRevSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.6;

    // Master filter & distortion waveshaper for growl
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(950, now + 0.35);  // First throttle blip
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.6);   // RPM drop
    filter.frequency.exponentialRampToValueAtTime(1400, now + 1.05); // Full 630 HP redline rev
    filter.frequency.exponentialRampToValueAtTime(140, now + duration);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    masterGain.gain.setValueAtTime(0.35, now + 1.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Oscillator 1: Deep V8 crankshaft sub-bass
    const subOsc = ctx.createOscillator();
    subOsc.type = "sawtooth";
    subOsc.frequency.setValueAtTime(38, now);
    subOsc.frequency.exponentialRampToValueAtTime(115, now + 0.35);
    subOsc.frequency.exponentialRampToValueAtTime(60, now + 0.6);
    subOsc.frequency.exponentialRampToValueAtTime(165, now + 1.05);
    subOsc.frequency.exponentialRampToValueAtTime(42, now + duration);

    // Oscillator 2: Detuned cylinder bank harmonic for throaty V8 rumble
    const v8Osc = ctx.createOscillator();
    v8Osc.type = "sawtooth";
    v8Osc.frequency.setValueAtTime(57, now);
    v8Osc.frequency.exponentialRampToValueAtTime(172, now + 0.35);
    v8Osc.frequency.exponentialRampToValueAtTime(90, now + 0.6);
    v8Osc.frequency.exponentialRampToValueAtTime(248, now + 1.05);
    v8Osc.frequency.exponentialRampToValueAtTime(63, now + duration);

    // Low-frequency firing pulse (simulates cylinder firing)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(28, now);
    lfo.frequency.linearRampToValueAtTime(65, now + 1.05);
    lfoGain.gain.setValueAtTime(20, now);
    lfo.connect(lfoGain);
    lfoGain.connect(subOsc.frequency);

    // Exhaust roar noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    subOsc.connect(filter);
    v8Osc.connect(filter);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    subOsc.start(now);
    v8Osc.start(now);
    lfo.start(now);
    whiteNoise.start(now);

    subOsc.stop(now + duration);
    v8Osc.stop(now + duration);
    lfo.stop(now + duration);
    whiteNoise.stop(now + duration);
}

// 2. Notification chime when a form step or booking succeeds
function playNotificationChime() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now);        // C5 note
    osc.frequency.setValueAtTime(659.25, now + 0.14); // E5 note

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
}

// Attach Engine Start button on Home page
document.addEventListener("DOMContentLoaded", function () {
    const revBtn = document.getElementById("rev-engine-btn");
    const heroImg = document.querySelector(".hero-img");
    const statusText = document.getElementById("engine-status");

    if (!revBtn) {
        return;
    }

    revBtn.addEventListener("click", function () {
        playEngineRevSound();

        // Trigger scale and glow animation on the hero car image
        if (heroImg) {
            heroImg.classList.add("engine-rev-active");
            setTimeout(function () {
                heroImg.classList.remove("engine-rev-active");
            }, 1500);
        }

        if (statusText) {
            statusText.textContent = "4.0L Twin-Turbo V8 Ignited — 630 HP at 6,500 RPM!";
        }
    });
});