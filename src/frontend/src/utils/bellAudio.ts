let audioCtx: AudioContext | null = null;
let bellInterval: ReturnType<typeof setInterval> | null = null;
let stopTimeout: ReturnType<typeof setTimeout> | null = null;
let onStopCallback: (() => void) | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playBellTone(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 1.5);

  gain.gain.setValueAtTime(0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

  osc.start(now);
  osc.stop(now + 2);
}

export function startBell(onStop: () => void) {
  stopBell();
  onStopCallback = onStop;
  const ctx = getAudioContext();
  playBellTone(ctx);
  bellInterval = setInterval(() => playBellTone(getAudioContext()), 3000);
  stopTimeout = setTimeout(() => stopBell(), 15 * 60 * 1000);
}

export function stopBell() {
  if (bellInterval) {
    clearInterval(bellInterval);
    bellInterval = null;
  }
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  if (onStopCallback) {
    onStopCallback();
    onStopCallback = null;
  }
}

export function isBellRinging(): boolean {
  return bellInterval !== null;
}
