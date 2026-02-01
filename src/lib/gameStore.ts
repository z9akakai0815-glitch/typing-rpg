import { writable, derived } from 'svelte/store';
import { enemies, getRandomWord, difficultySettings, type Difficulty, type Word, type Enemy } from './words';
import { canTypeNextChar } from './romajiMap';

// 単語完成チェック（柔軟な入力対応）
function isWordComplete(romaji: string, input: string): boolean {
  // 代替入力のマッピング
  const alternatives: [string, string][] = [
    ['shi', 'si'], ['sha', 'sya'], ['shu', 'syu'], ['sho', 'syo'],
    ['chi', 'ti'], ['cha', 'tya'], ['chu', 'tyu'], ['cho', 'tyo'],
    ['tsu', 'tu'], ['fu', 'hu'],
    ['ji', 'zi'], ['ja', 'zya'], ['ju', 'zyu'], ['jo', 'zyo'],
    ['zu', 'du'],
  ];
  
  // 正規化: 入力を標準形式に変換
  let normalized = input.toLowerCase();
  for (const [standard, alt] of alternatives) {
    // 代替入力を標準形式に置換
    normalized = normalized.split(alt).join(standard);
  }
  
  // 標準形式と比較
  if (normalized === romaji.toLowerCase()) {
    return true;
  }
  
  // 入力長で簡易チェック
  return input.length >= romaji.length;
}

// ゲーム状態
export type GameState = 'title' | 'difficulty' | 'playing' | 'gameover' | 'clear' | 'ranking';

interface GameData {
  state: GameState;
  difficulty: Difficulty;
  playerHp: number;
  playerMaxHp: number;
  currentEnemyIndex: number;
  enemyHp: number;
  enemyMaxHp: number;
  currentWord: Word | null;
  typedText: string;
  acceptedInput: string;  // 実際に受け入れられた入力
  timeRemaining: number;
  totalTime: number;
  score: number;
  missCount: number;
  correctCount: number;
  totalTyped: number;
  startTime: number | null;
  endTime: number | null;
  damageFlash: boolean;  // ダメージエフェクト用
}

const initialState: GameData = {
  state: 'title',
  difficulty: 'normal',
  playerHp: 100,
  playerMaxHp: 100,
  currentEnemyIndex: 0,
  enemyHp: 50,
  enemyMaxHp: 50,
  currentWord: null,
  typedText: '',
  acceptedInput: '',
  timeRemaining: 100,
  totalTime: 0,
  score: 0,
  missCount: 0,
  correctCount: 0,
  totalTyped: 0,
  startTime: null,
  endTime: null,
  damageFlash: false,
};

function createGameStore() {
  const { subscribe, set, update } = writable<GameData>(initialState);

  return {
    subscribe,
    
    // タイトルに戻る
    goToTitle: () => set(initialState),
    
    // 難易度選択画面へ
    goToDifficulty: () => update(s => ({ ...s, state: 'difficulty' })),
    
    // ゲーム開始
    startGame: (difficulty: Difficulty) => update(s => {
      const enemy = enemies[0];
      const word = getRandomWord(enemy.level);
      const timePerChar = difficultySettings[difficulty];
      return {
        ...initialState,
        state: 'playing',
        difficulty,
        currentWord: word,
        typedText: '',
        acceptedInput: '',
        timeRemaining: word.romaji.length * timePerChar,
        totalTime: word.romaji.length * timePerChar,
        enemyHp: enemy.hp,
        enemyMaxHp: enemy.hp,
        startTime: Date.now(),
        damageFlash: false,
      };
    }),
    
    // タイプ入力
    type: (char: string) => update(s => {
      if (s.state !== 'playing' || !s.currentWord) return s;
      
      const totalTyped = s.totalTyped + 1;
      const romaji = s.currentWord.romaji.toLowerCase();
      const input = char.toLowerCase();
      
      // 柔軟なローマ字入力チェック
      const isCorrect = canTypeNextChar(romaji, s.acceptedInput, input);
      
      // 正解
      if (isCorrect) {
        const newAcceptedInput = s.acceptedInput + input;
        const correctCount = s.correctCount + 1;
        
        // 単語完成チェック（柔軟に判定）
        const isComplete = isWordComplete(romaji, newAcceptedInput);
        
        if (isComplete) {
          const damage = 10;
          const newEnemyHp = s.enemyHp - damage;
          
          // 敵を倒した
          if (newEnemyHp <= 0) {
            const nextIndex = s.currentEnemyIndex + 1;
            
            // 全クリア
            if (nextIndex >= enemies.length) {
              return {
                ...s,
                state: 'clear',
                score: calculateScore(s),
                correctCount,
                totalTyped,
                endTime: Date.now(),
              };
            }
            
            // 次の敵
            const nextEnemy = enemies[nextIndex];
            const nextWord = getRandomWord(nextEnemy.level);
            const timePerChar = difficultySettings[s.difficulty];
            return {
              ...s,
              currentEnemyIndex: nextIndex,
              enemyHp: nextEnemy.hp,
              enemyMaxHp: nextEnemy.hp,
              currentWord: nextWord,
              typedText: '',
              acceptedInput: '',
              timeRemaining: nextWord.romaji.length * timePerChar,
              totalTime: nextWord.romaji.length * timePerChar,
              correctCount,
              totalTyped,
            };
          }
          
          // 同じ敵に次の単語
          const enemy = enemies[s.currentEnemyIndex];
          const nextWord = getRandomWord(enemy.level);
          const timePerChar = difficultySettings[s.difficulty];
          return {
            ...s,
            enemyHp: newEnemyHp,
            currentWord: nextWord,
            typedText: '',
            acceptedInput: '',
            timeRemaining: nextWord.romaji.length * timePerChar,
            totalTime: nextWord.romaji.length * timePerChar,
            correctCount,
            totalTyped,
          };
        }
        
        return { ...s, typedText: s.typedText + char, acceptedInput: newAcceptedInput, correctCount, totalTyped };
      }
      
      // ミス
      const missCount = s.missCount + 1;
      const newPlayerHp = s.playerHp - 10;
      
      if (newPlayerHp <= 0) {
        return {
          ...s,
          state: 'gameover',
          playerHp: 0,
          missCount,
          totalTyped,
          score: calculateScore(s),
          damageFlash: true,
          endTime: Date.now(),
        };
      }
      
      return { ...s, playerHp: newPlayerHp, missCount, totalTyped, damageFlash: true };
    }),
    
    // ダメージフラッシュをリセット
    clearDamageFlash: () => update(s => ({ ...s, damageFlash: false })),
    
    // 時間経過
    tick: (deltaTime: number) => update(s => {
      if (s.state !== 'playing') return s;
      
      const newTime = s.timeRemaining - deltaTime;
      
      if (newTime <= 0) {
        const newPlayerHp = s.playerHp - 10;
        
        if (newPlayerHp <= 0) {
          return {
            ...s,
            state: 'gameover',
            playerHp: 0,
            timeRemaining: 0,
            score: calculateScore(s),
            damageFlash: true,
            endTime: Date.now(),
          };
        }
        
        // 次の単語
        const enemy = enemies[s.currentEnemyIndex];
        const nextWord = getRandomWord(enemy.level);
        const timePerChar = difficultySettings[s.difficulty];
        return {
          ...s,
          playerHp: newPlayerHp,
          currentWord: nextWord,
          typedText: '',
          acceptedInput: '',
          timeRemaining: nextWord.romaji.length * timePerChar,
          totalTime: nextWord.romaji.length * timePerChar,
          damageFlash: true,
        };
      }
      
      return { ...s, timeRemaining: newTime };
    }),
    
    // ランキング画面へ
    goToRanking: () => update(s => ({ ...s, state: 'ranking' })),
  };
}

function calculateScore(s: GameData): number {
  const baseScore = 10000;
  const accuracy = s.totalTyped > 0 ? s.correctCount / s.totalTyped : 0;
  const accuracyBonus = Math.floor(accuracy * 10000);
  const missPenalty = s.missCount * 100;
  
  const difficultyMultiplier = {
    easy: 1.0,
    normal: 1.5,
    hard: 2.0,
  }[s.difficulty];
  
  return Math.floor((baseScore + accuracyBonus - missPenalty) * difficultyMultiplier);
}

export const gameStore = createGameStore();

// 現在の敵を取得
export const currentEnemy = derived(gameStore, $game => 
  $game.currentEnemyIndex < enemies.length ? enemies[$game.currentEnemyIndex] : null
);
