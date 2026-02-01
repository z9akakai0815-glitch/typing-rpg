import { writable, derived } from 'svelte/store';
import { enemies, getRandomWord, difficultySettings, type Difficulty, type Word, type Enemy } from './words';
import { RomajiChecker, getDisplayRomaji } from './romajiConverter';

type GameState = 'title' | 'difficulty' | 'battle' | 'clear' | 'gameover';

interface GameData {
  state: GameState;
  difficulty: Difficulty;
  currentEnemyIndex: number;
  enemyHp: number;
  playerHp: number;
  currentWord: Word | null;
  displayRomaji: string;
  typedText: string;
  timeLeft: number;
  maxTime: number;
  combo: number;
  maxCombo: number;
  score: number;
  showDamage: boolean;
}

const initialState: GameData = {
  state: 'title',
  difficulty: 'normal',
  currentEnemyIndex: 0,
  enemyHp: 0,
  playerHp: 100,
  currentWord: null,
  displayRomaji: '',
  typedText: '',
  timeLeft: 0,
  maxTime: 0,
  combo: 0,
  maxCombo: 0,
  score: 0,
  showDamage: false,
};

function createGameStore() {
  const { subscribe, set, update } = writable<GameData>(initialState);
  let timer: ReturnType<typeof setInterval> | null = null;
  let romajiChecker: RomajiChecker | null = null;

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    clearTimer();
    timer = setInterval(() => {
      update(state => {
        if (state.state !== 'battle') {
          clearTimer();
          return state;
        }
        
        const newTimeLeft = state.timeLeft - 0.1;
        
        if (newTimeLeft <= 0) {
          // 時間切れ = プレイヤーにダメージ
          const newPlayerHp = state.playerHp - 20;
          
          if (newPlayerHp <= 0) {
            clearTimer();
            return { ...state, state: 'gameover' as const, playerHp: 0, combo: 0, showDamage: true };
          }
          
          // 新しい単語を出題
          const enemy = enemies[state.currentEnemyIndex];
          const newWord = getRandomWord(enemy.level);
          const displayRomaji = getDisplayRomaji(newWord.reading);
          romajiChecker = new RomajiChecker(newWord.reading);
          const charCount = newWord.reading.length;
          const maxTime = charCount * difficultySettings[state.difficulty];
          
          return {
            ...state,
            playerHp: newPlayerHp,
            currentWord: newWord,
            displayRomaji,
            typedText: '',
            timeLeft: maxTime,
            maxTime,
            combo: 0,
            showDamage: true,
          };
        }
        
        return { ...state, timeLeft: newTimeLeft, showDamage: false };
      });
    }, 100);
  }

  function setNextWord() {
    update(state => {
      const enemy = enemies[state.currentEnemyIndex];
      const newWord = getRandomWord(enemy.level);
      const displayRomaji = getDisplayRomaji(newWord.reading);
      romajiChecker = new RomajiChecker(newWord.reading);
      const charCount = newWord.reading.length;
      const maxTime = charCount * difficultySettings[state.difficulty];
      
      return {
        ...state,
        currentWord: newWord,
        displayRomaji,
        typedText: '',
        timeLeft: maxTime,
        maxTime,
        showDamage: false,
      };
    });
  }

  return {
    subscribe,
    
    goToDifficulty: () => {
      update(state => ({ ...state, state: 'difficulty' }));
    },
    
    startGame: (difficulty: Difficulty) => {
      const enemy = enemies[0];
      const word = getRandomWord(enemy.level);
      const displayRomaji = getDisplayRomaji(word.reading);
      romajiChecker = new RomajiChecker(word.reading);
      const charCount = word.reading.length;
      const maxTime = charCount * difficultySettings[difficulty];
      
      set({
        state: 'battle',
        difficulty,
        currentEnemyIndex: 0,
        enemyHp: enemy.hp,
        playerHp: 100,
        currentWord: word,
        displayRomaji,
        typedText: '',
        timeLeft: maxTime,
        maxTime,
        combo: 0,
        maxCombo: 0,
        score: 0,
        showDamage: false,
      });
      
      startTimer();
    },
    
    typeChar: (char: string) => {
      if (!romajiChecker) return;
      
      update(state => {
        if (state.state !== 'battle' || !state.currentWord) return state;
        
        const result = romajiChecker!.processKey(char);
        
        if (!result.accepted) {
          // ミス！プレイヤーにダメージ
          const newPlayerHp = state.playerHp - 5;
          
          if (newPlayerHp <= 0) {
            clearTimer();
            return { ...state, state: 'gameover' as const, playerHp: 0, combo: 0, showDamage: true };
          }
          
          return { ...state, playerHp: newPlayerHp, combo: 0, showDamage: true };
        }
        
        // 入力成功
        const newTypedText = romajiChecker!.getTypedRomaji();
        
        if (result.completed) {
          // 単語完成！敵にダメージ
          const newCombo = state.combo + 1;
          const damage = 10 + newCombo * 2;
          const newEnemyHp = state.enemyHp - damage;
          const newMaxCombo = Math.max(state.maxCombo, newCombo);
          const newScore = state.score + damage + Math.floor(state.timeLeft * 10);
          
          if (newEnemyHp <= 0) {
            // 敵を倒した！
            const nextEnemyIndex = state.currentEnemyIndex + 1;
            
            if (nextEnemyIndex >= enemies.length) {
              // 全クリア！
              clearTimer();
              return {
                ...state,
                state: 'clear' as const,
                enemyHp: 0,
                combo: newCombo,
                maxCombo: newMaxCombo,
                score: newScore,
                showDamage: false,
              };
            }
            
            // 次の敵
            const nextEnemy = enemies[nextEnemyIndex];
            const nextWord = getRandomWord(nextEnemy.level);
            const nextDisplayRomaji = getDisplayRomaji(nextWord.reading);
            romajiChecker = new RomajiChecker(nextWord.reading);
            const charCount = nextWord.reading.length;
            const maxTime = charCount * difficultySettings[state.difficulty];
            
            return {
              ...state,
              currentEnemyIndex: nextEnemyIndex,
              enemyHp: nextEnemy.hp,
              currentWord: nextWord,
              displayRomaji: nextDisplayRomaji,
              typedText: '',
              timeLeft: maxTime,
              maxTime,
              combo: newCombo,
              maxCombo: newMaxCombo,
              score: newScore,
              showDamage: false,
            };
          }
          
          // 敵はまだ生きている、次の単語
          const enemy = enemies[state.currentEnemyIndex];
          const nextWord = getRandomWord(enemy.level);
          const nextDisplayRomaji = getDisplayRomaji(nextWord.reading);
          romajiChecker = new RomajiChecker(nextWord.reading);
          const charCount = nextWord.reading.length;
          const maxTime = charCount * difficultySettings[state.difficulty];
          
          return {
            ...state,
            enemyHp: newEnemyHp,
            currentWord: nextWord,
            displayRomaji: nextDisplayRomaji,
            typedText: '',
            timeLeft: maxTime,
            maxTime,
            combo: newCombo,
            maxCombo: newMaxCombo,
            score: newScore,
            showDamage: false,
          };
        }
        
        // 単語は未完成、入力を続ける
        return {
          ...state,
          typedText: newTypedText,
          showDamage: false,
        };
      });
    },
    
    clearDamage: () => {
      update(state => ({ ...state, showDamage: false }));
    },
    
    reset: () => {
      clearTimer();
      romajiChecker = null;
      set(initialState);
    },
  };
}

export const gameStore = createGameStore();

export const currentEnemy = derived(gameStore, $game => 
  $game.state === 'battle' || $game.state === 'clear' || $game.state === 'gameover'
    ? enemies[$game.currentEnemyIndex] 
    : null
);
