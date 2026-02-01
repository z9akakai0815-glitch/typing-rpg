<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gameStore, currentEnemy } from '$lib/gameStore';
  import { difficultySettings, type Difficulty } from '$lib/words';

  let lastTime = 0;
  let animationId: number;

  // ゲームループ
  function gameLoop(time: number) {
    if (lastTime > 0) {
      const deltaTime = (time - lastTime) / 1000;
      gameStore.tick(deltaTime);
    }
    lastTime = time;
    animationId = requestAnimationFrame(gameLoop);
  }

  // キー入力
  function handleKeydown(e: KeyboardEvent) {
    if ($gameStore.state !== 'playing') return;
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      gameStore.type(e.key);
    }
  }

  onMount(() => {
    animationId = requestAnimationFrame(gameLoop);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('keydown', handleKeydown);
  });

  function selectDifficulty(d: Difficulty) {
    gameStore.startGame(d);
  }

  // HP バーの幅を計算
  $: playerHpPercent = ($gameStore.playerHp / $gameStore.playerMaxHp) * 100;
  $: enemyHpPercent = ($gameStore.enemyHp / $gameStore.enemyMaxHp) * 100;
  $: timePercent = ($gameStore.timeRemaining / $gameStore.totalTime) * 100;

  // 入力済み/未入力のローマ字を分割
  $: typedPart = $gameStore.currentWord?.romaji.slice(0, $gameStore.typedText.length) ?? '';
  $: remainingPart = $gameStore.currentWord?.romaji.slice($gameStore.typedText.length) ?? '';
</script>

<svelte:head>
  <title>タイピングRPG</title>
  <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- タイトル画面 -->
  {#if $gameStore.state === 'title'}
    <div class="screen title-screen">
      <h1>⚔️ タイピングRPG ⚔️</h1>
      <p class="subtitle">〜 漢字の冒険 〜</p>
      <button class="pixel-btn" on:click={() => gameStore.goToDifficulty()}>
        ▶ はじめる
      </button>
    </div>

  <!-- 難易度選択 -->
  {:else if $gameStore.state === 'difficulty'}
    <div class="screen difficulty-screen">
      <h2>難易度を選んでね</h2>
      <div class="difficulty-buttons">
        <button class="pixel-btn easy" on:click={() => selectDifficulty('easy')}>
          🟢 かんたん<br><small>1文字 3.5秒</small>
        </button>
        <button class="pixel-btn normal" on:click={() => selectDifficulty('normal')}>
          🟡 ふつう<br><small>1文字 2.0秒</small>
        </button>
        <button class="pixel-btn hard" on:click={() => selectDifficulty('hard')}>
          🔴 むずかしい<br><small>1文字 1.5秒</small>
        </button>
      </div>
      <button class="pixel-btn back" on:click={() => gameStore.goToTitle()}>
        ◀ もどる
      </button>
    </div>

  <!-- ゲーム画面 -->
  {:else if $gameStore.state === 'playing'}
    <div class="screen game-screen">
      <!-- 敵情報 -->
      <div class="enemy-area">
        <div class="enemy-name">{$currentEnemy?.name}</div>
        <div class="enemy-sprite">
          {#if $gameStore.currentEnemyIndex === 0}👾
          {:else if $gameStore.currentEnemyIndex === 1}🦇
          {:else if $gameStore.currentEnemyIndex === 2}🐀
          {:else if $gameStore.currentEnemyIndex === 3}👺
          {:else if $gameStore.currentEnemyIndex === 4}💀
          {:else if $gameStore.currentEnemyIndex === 5}🐺
          {:else if $gameStore.currentEnemyIndex === 6}🗿
          {:else if $gameStore.currentEnemyIndex === 7}🧙
          {:else if $gameStore.currentEnemyIndex === 8}👿
          {:else}🐉
          {/if}
        </div>
        <div class="hp-bar enemy-hp">
          <div class="hp-fill" style="width: {enemyHpPercent}%"></div>
          <span class="hp-text">HP {$gameStore.enemyHp}/{$gameStore.enemyMaxHp}</span>
        </div>
      </div>

      <!-- タイピングエリア -->
      <div class="typing-area">
        <div class="word-display">{$gameStore.currentWord?.display}</div>
        <div class="romaji-display">
          <span class="typed">{typedPart}</span><span class="remaining">{remainingPart}</span>
        </div>
        <div class="time-bar">
          <div class="time-fill" style="width: {timePercent}%"></div>
        </div>
      </div>

      <!-- プレイヤー情報 -->
      <div class="player-area">
        <div class="hp-bar player-hp">
          <div class="hp-fill" style="width: {playerHpPercent}%"></div>
          <span class="hp-text">HP {$gameStore.playerHp}/{$gameStore.playerMaxHp}</span>
        </div>
        <div class="stats">
          <span>敵: {$gameStore.currentEnemyIndex + 1}/10</span>
          <span>ミス: {$gameStore.missCount}</span>
        </div>
      </div>
    </div>

  <!-- ゲームオーバー -->
  {:else if $gameStore.state === 'gameover'}
    <div class="screen result-screen gameover">
      <h2>💀 ゲームオーバー 💀</h2>
      <div class="result-stats">
        <p>倒した敵: {$gameStore.currentEnemyIndex}体</p>
        <p>ミス: {$gameStore.missCount}回</p>
        <p>スコア: {$gameStore.score}</p>
      </div>
      <button class="pixel-btn" on:click={() => gameStore.goToTitle()}>
        タイトルへ
      </button>
    </div>

  <!-- クリア -->
  {:else if $gameStore.state === 'clear'}
    <div class="screen result-screen clear">
      <h2>🎉 クリア！ 🎉</h2>
      <div class="result-stats">
        <p>全10体撃破！</p>
        <p>ミス: {$gameStore.missCount}回</p>
        <p>正確率: {$gameStore.totalTyped > 0 ? Math.floor(($gameStore.correctCount / $gameStore.totalTyped) * 100) : 100}%</p>
        <p class="score">スコア: {$gameStore.score}</p>
      </div>
      <button class="pixel-btn" on:click={() => gameStore.goToTitle()}>
        タイトルへ
      </button>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #1a1a2e;
    font-family: 'DotGothic16', sans-serif;
    color: #eee;
  }

  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .screen {
    background: #16213e;
    border: 4px solid #e94560;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
    min-width: 400px;
    max-width: 500px;
  }

  h1 {
    font-size: 2rem;
    color: #e94560;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px #0f3460;
  }

  h2 {
    font-size: 1.5rem;
    color: #e94560;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    color: #aaa;
    margin-bottom: 2rem;
  }

  .pixel-btn {
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.1rem;
    padding: 0.8rem 2rem;
    background: #0f3460;
    color: #fff;
    border: 3px solid #e94560;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.1s;
    margin: 0.5rem;
  }

  .pixel-btn:hover {
    background: #e94560;
    transform: scale(1.05);
  }

  .pixel-btn.back {
    background: #333;
    border-color: #666;
    font-size: 0.9rem;
    margin-top: 1.5rem;
  }

  .difficulty-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .difficulty-buttons .pixel-btn {
    padding: 1rem;
  }

  .difficulty-buttons .pixel-btn small {
    font-size: 0.8rem;
    color: #aaa;
  }

  /* ゲーム画面 */
  .game-screen {
    min-width: 450px;
  }

  .enemy-area {
    margin-bottom: 1.5rem;
  }

  .enemy-name {
    font-size: 1.3rem;
    color: #e94560;
    margin-bottom: 0.5rem;
  }

  .enemy-sprite {
    font-size: 5rem;
    margin: 1rem 0;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hp-bar {
    height: 24px;
    background: #333;
    border: 2px solid #666;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .hp-fill {
    height: 100%;
    transition: width 0.2s;
  }

  .enemy-hp .hp-fill {
    background: linear-gradient(to bottom, #e94560, #c73e54);
  }

  .player-hp .hp-fill {
    background: linear-gradient(to bottom, #4ade80, #22c55e);
  }

  .hp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    text-shadow: 1px 1px 2px #000;
  }

  .typing-area {
    background: #0f3460;
    border: 3px solid #e94560;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .word-display {
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 1rem;
  }

  .romaji-display {
    font-size: 1.8rem;
    font-family: monospace;
    letter-spacing: 2px;
  }

  .typed {
    color: #4ade80;
  }

  .remaining {
    color: #888;
  }

  .time-bar {
    height: 12px;
    background: #333;
    border-radius: 6px;
    margin-top: 1rem;
    overflow: hidden;
  }

  .time-fill {
    height: 100%;
    background: linear-gradient(to right, #fbbf24, #f59e0b);
    transition: width 0.1s linear;
  }

  .player-area {
    margin-top: 1rem;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
    color: #aaa;
    font-size: 0.9rem;
  }

  /* 結果画面 */
  .result-screen {
    min-width: 350px;
  }

  .result-screen.gameover h2 {
    color: #888;
  }

  .result-screen.clear h2 {
    color: #fbbf24;
    animation: pulse 0.5s infinite alternate;
  }

  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }

  .result-stats {
    background: #0f3460;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1.5rem 0;
  }

  .result-stats p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .result-stats .score {
    font-size: 1.5rem;
    color: #fbbf24;
    margin-top: 1rem;
  }
</style>
