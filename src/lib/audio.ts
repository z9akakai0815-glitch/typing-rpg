// 8bit風BGM生成（Web Audio API）

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let currentOscillators: OscillatorNode[] = [];
let bgmInterval: ReturnType<typeof setInterval> | null = null;

// 音階周波数
const NOTE_FREQ: Record<string, number> = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50,
};

// 初期化
export function initAudio(): boolean {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioContext.destination);
    return true;
  } catch (e) {
    console.error('Audio init failed:', e);
    return false;
  }
}

// 矩形波を生成（8bit風）
function createSquareOscillator(freq: number, duration: number): OscillatorNode | null {
  if (!audioContext || !masterGain) return null;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'square';
  osc.frequency.value = freq;
  
  gain.gain.setValueAtTime(0.2, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioContext.currentTime + duration);
  
  return osc;
}

// 効果音：攻撃
export function playAttackSound() {
  if (!audioContext || !masterGain) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.1);
}

// 効果音：ダメージ
export function playDamageSound() {
  if (!audioContext || !masterGain) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.4, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.2);
}

// 効果音：タイプ成功
export function playTypeSound() {
  if (!audioContext || !masterGain) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'square';
  osc.frequency.value = 880;
  
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.05);
}

// 効果音：単語完成
export function playCompleteSound() {
  if (!audioContext || !masterGain) return;
  
  const notes = ['C5', 'E5', 'G5', 'C6'];
  notes.forEach((note, i) => {
    setTimeout(() => {
      createSquareOscillator(NOTE_FREQ[note], 0.15);
    }, i * 80);
  });
}

// 効果音：敵撃破
export function playDefeatSound() {
  if (!audioContext || !masterGain) return;
  
  const notes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
  notes.forEach((note, i) => {
    setTimeout(() => {
      createSquareOscillator(NOTE_FREQ[note], 0.1);
    }, i * 50);
  });
}

// 効果音：ゲームオーバー
export function playGameOverSound() {
  if (!audioContext || !masterGain) return;
  
  const notes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
  notes.forEach((note, i) => {
    setTimeout(() => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = NOTE_FREQ[note];
      gain.gain.setValueAtTime(0.2, audioContext!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(masterGain!);
      osc.start();
      osc.stop(audioContext!.currentTime + 0.3);
    }, i * 150);
  });
}

// BGMメロディパターン（バトル用）
const battleMelody = [
  'E4', 'E4', 'E4', 'C4', 'E4', 'G4', 'G4',
  'C4', 'C4', 'G4', 'G4', 'E4', 'E4', 'A4', 'B4',
  'A4', 'A4', 'G4', 'E4', 'G4', 'A4', 'F4', 'G4',
  'E4', 'C4', 'D4', 'B4', 'B4', 'C5', 'C5', 'C5',
];

const battleBass = [
  'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'E4', 'E4',
  'F4', 'F4', 'C4', 'C4', 'G4', 'G4', 'G4', 'G4',
];

let melodyIndex = 0;
let bassIndex = 0;

// BGM再生
export function startBGM() {
  if (!audioContext || !masterGain || isPlaying) return;
  
  isPlaying = true;
  melodyIndex = 0;
  bassIndex = 0;
  
  // メロディ再生ループ
  bgmInterval = setInterval(() => {
    if (!isPlaying) return;
    
    // メロディ
    const melodyNote = battleMelody[melodyIndex % battleMelody.length];
    createSquareOscillator(NOTE_FREQ[melodyNote], 0.15);
    melodyIndex++;
    
    // ベース（2拍に1回）
    if (melodyIndex % 2 === 0) {
      const bassNote = battleBass[bassIndex % battleBass.length];
      const bassOsc = audioContext!.createOscillator();
      const bassGain = audioContext!.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.value = NOTE_FREQ[bassNote] / 2; // 1オクターブ下
      bassGain.gain.setValueAtTime(0.15, audioContext!.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.2);
      bassOsc.connect(bassGain);
      bassGain.connect(masterGain!);
      bassOsc.start();
      bassOsc.stop(audioContext!.currentTime + 0.2);
      bassIndex++;
    }
  }, 180); // BPM ~166
}

// BGM停止
export function stopBGM() {
  isPlaying = false;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  currentOscillators.forEach(osc => {
    try { osc.stop(); } catch (e) {}
  });
  currentOscillators = [];
}

// 音量設定
export function setVolume(vol: number) {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, vol));
  }
}

// ミュート
export function toggleMute(): boolean {
  if (masterGain) {
    if (masterGain.gain.value > 0) {
      masterGain.gain.value = 0;
      return true; // muted
    } else {
      masterGain.gain.value = 0.3;
      return false; // unmuted
    }
  }
  return false;
}
