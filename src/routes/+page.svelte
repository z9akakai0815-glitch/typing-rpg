<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { gameStore, currentEnemy } from '$lib/gameStore';
  import { difficultySettings, type Difficulty, enemies } from '$lib/words';
  import { 
    initAudio, startBGM, stopBGM, toggleMute,
    playTypeSound, playDamageSound, playCompleteSound, 
    playDefeatSound, playGameOverSound 
  } from '$lib/audio';

  let audioInitialized = false;
  let isMuted = false;
  let prevEnemyHp = 0;
  let prevState = 'title';

  // キー入力
  function handleKeydown(e: KeyboardEvent) {
    if ($gameStore.state !== 'battle') return;
    
    // 英字とハイフンを受け付ける
    if (e.key.length === 1 && /[a-zA-Z\-]/.test(e.key)) {
      gameStore.typeChar(e.key);
    }
  }

  // 音声初期化（ユーザー操作後に呼ぶ必要がある）
  function initializeAudio() {
    if (!audioInitialized && browser) {
      audioInitialized = initAudio();
    }
  }

  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', handleKeydown);
      stopBGM();
    }
  });

  // ダメージフラッシュ監視
  $: if ($gameStore.showDamage && browser) {
    playDamageSound();
    setTimeout(() => {
      gameStore.clearDamage();
    }, 200);
  }

  // 状態変化を監視して効果音を再生
  $: {
    if (browser && audioInitialized) {
      // バトル開始
      if ($gameStore.state === 'battle' && prevState !== 'battle') {
        startBGM();
      }
      // バトル終了
      if ($gameStore.state !== 'battle' && prevState === 'battle') {
        stopBGM();
      }
      // ゲームオーバー
      if ($gameStore.state === 'gameover' && prevState !== 'gameover') {
        playGameOverSound();
      }
      // クリア
      if ($gameStore.state === 'clear' && prevState !== 'clear') {
        playDefeatSound();
      }
      prevState = $gameStore.state;
    }
  }

  // 敵のHP変化を監視
  $: {
    if (browser && audioInitialized && $gameStore.state === 'battle') {
      // 敵にダメージ
      if ($gameStore.enemyHp < prevEnemyHp && $gameStore.enemyHp > 0) {
        playCompleteSound();
      }
      // 敵撃破
      if (prevEnemyHp > 0 && $gameStore.enemyHp <= 0) {
        playDefeatSound();
      }
      prevEnemyHp = $gameStore.enemyHp;
    }
  }

  function handleMuteToggle() {
    isMuted = toggleMute();
  }

  function selectDifficulty(d: Difficulty) {
    gameStore.startGame(d);
  }

  // HP バーの幅を計算
  $: playerHpPercent = $gameStore.playerHp;
  $: enemyHpPercent = $currentEnemy ? ($gameStore.enemyHp / $currentEnemy.hp) * 100 : 0;
  $: timePercent = $gameStore.maxTime > 0 ? ($gameStore.timeLeft / $gameStore.maxTime) * 100 : 0;

  // 入力済み/未入力のローマ字を分割
  $: typedPart = $gameStore.typedText;
  $: remainingPart = $gameStore.displayRomaji.slice($gameStore.typedText.length);
  
  // 図鑑用：倒したモンスターのカウント（localStorage保存）
  let defeatedMonsters: Record<string, number> = {};
  
  onMount(() => {
    if (browser) {
      const saved = localStorage.getItem('defeatedMonsters');
      if (saved) {
        defeatedMonsters = JSON.parse(saved);
      }
    }
  });
  
  // モンスター撃破時に記録
  $: if ($gameStore.state === 'clear' && browser) {
    // 全モンスターをカウント
    enemies.forEach(e => {
      defeatedMonsters[e.name] = (defeatedMonsters[e.name] || 0) + 1;
    });
    localStorage.setItem('defeatedMonsters', JSON.stringify(defeatedMonsters));
  }
  
  // 図鑑表示フラグ
  let showEncyclopedia = false;
</script>

<svelte:head>
  <title>タイピングRPG</title>
  <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- タイトル画面 -->
  {#if $gameStore.state === 'title' && !showEncyclopedia}
    <div class="screen title-screen">
      <h1>⚔️ タイピングRPG ⚔️</h1>
      <p class="subtitle">〜 漢字の冒険 〜</p>
      <button class="pixel-btn" on:click={() => { initializeAudio(); gameStore.goToDifficulty(); }}>
        ▶ はじめる
      </button>
      <button class="pixel-btn encyclopedia-btn" on:click={() => showEncyclopedia = true}>
        📖 ずかん
      </button>
      {#if audioInitialized}
        <button class="pixel-btn sound-btn" on:click={handleMuteToggle}>
          {isMuted ? '🔇 おとOFF' : '🔊 おとON'}
        </button>
      {/if}
    </div>

  <!-- 図鑑画面 -->
  {:else if showEncyclopedia}
    <div class="screen encyclopedia-screen">
      <h2>📖 モンスターずかん</h2>
      <div class="encyclopedia-grid">
        {#each enemies as enemy, i}
          {@const count = defeatedMonsters[enemy.name] || 0}
          <div class="encyclopedia-entry" class:discovered={count > 0}>
            <div class="entry-sprite">
              {#if count > 0}
                {#if i === 0}
                  <img src="/enemies/slime.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 1}
                  <img src="/enemies/bat.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 2}
                  <img src="/enemies/rat.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 3}
                  <img src="/enemies/goblin.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 4}
                  <img src="/enemies/skeleton.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 5}
                  <img src="/enemies/wolf.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 6}
                  <img src="/enemies/golem.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 7}
                  <img src="/enemies/mage.svg" alt={enemy.name} class="entry-img" />
                {:else if i === 8}
                  <img src="/enemies/demon.svg" alt={enemy.name} class="entry-img" />
                {:else}
                  <img src="/enemies/dragon.svg" alt={enemy.name} class="entry-img" />
                {/if}
              {:else}
                <div class="unknown">？</div>
              {/if}
            </div>
            <div class="entry-info">
              <div class="entry-name">{count > 0 ? enemy.name : '？？？'}</div>
              <div class="entry-count">倒した回数: {count}</div>
            </div>
          </div>
        {/each}
      </div>
      <button class="pixel-btn back" on:click={() => showEncyclopedia = false}>
        ◀ もどる
      </button>
    </div>

  <!-- 難易度選択 -->
  {:else if $gameStore.state === 'difficulty'}
    <div class="screen difficulty-screen">
      <h2>難易度をえらんでね</h2>
      <div class="difficulty-buttons">
        <button class="pixel-btn easy" on:click={() => selectDifficulty('easy')}>
          🟢 かんたん
        </button>
        <button class="pixel-btn normal" on:click={() => selectDifficulty('normal')}>
          🟡 ふつう
        </button>
        <button class="pixel-btn hard" on:click={() => selectDifficulty('hard')}>
          🔴 むずかしい
        </button>
      </div>
      <button class="pixel-btn back" on:click={() => gameStore.reset()}>
        ◀ もどる
      </button>
    </div>

  <!-- バトル画面 -->
  {:else if $gameStore.state === 'battle'}
    <div class="screen game-screen" class:damage-shake={$gameStore.showDamage}>
      {#if $gameStore.showDamage}
        <div class="damage-flash"></div>
      {/if}
      
      <!-- サウンドボタン -->
      <button class="sound-toggle" on:click={handleMuteToggle}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      <!-- 敵情報 -->
      <div class="enemy-area">
        <div class="enemy-name">{$currentEnemy?.name}</div>
        <div class="enemy-sprite">
          {#if $gameStore.currentEnemyIndex === 0}
            <img src="/enemies/slime.svg" alt="スライム" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 1}
            <img src="/enemies/bat.svg" alt="コウモリ" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 2}
            <img src="/enemies/rat.svg" alt="おおねずみ" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 3}
            <img src="/enemies/goblin.svg" alt="ゴブリン" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 4}
            <img src="/enemies/skeleton.svg" alt="ガイコツ" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 5}
            <img src="/enemies/wolf.svg" alt="オオカミ" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 6}
            <img src="/enemies/golem.svg" alt="ゴーレム" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 7}
            <img src="/enemies/mage.svg" alt="まどうし" class="enemy-img" />
          {:else if $gameStore.currentEnemyIndex === 8}
            <img src="/enemies/demon.svg" alt="デーモン" class="enemy-img" />
          {:else}
            <img src="/enemies/dragon.svg" alt="ドラゴン" class="enemy-img dragon" />
          {/if}
        </div>
        <div class="hp-bar enemy-hp">
          <div class="hp-fill" style="width: {enemyHpPercent}%"></div>
          <span class="hp-text">HP: {$gameStore.enemyHp}/{$currentEnemy?.hp}</span>
        </div>
      </div>

      <!-- 単語表示 -->
      <div class="word-area">
        <div class="word-display">{$gameStore.currentWord?.display}</div>
        <div class="romaji-display">
          <span class="typed">{typedPart}</span><span class="remaining">{remainingPart}</span>
        </div>
      </div>

      <!-- タイマー -->
      <div class="timer-bar">
        <div class="timer-fill" style="width: {timePercent}%"></div>
      </div>

      <!-- プレイヤー情報 -->
      <div class="player-area">
        <div class="hp-bar player-hp">
          <div class="hp-fill" style="width: {playerHpPercent}%"></div>
          <span class="hp-text">HP: {$gameStore.playerHp}/100</span>
        </div>
        <div class="stats">
          <span>コンボ: {$gameStore.combo}</span>
          <span>スコア: {$gameStore.score}</span>
        </div>
      </div>
    </div>

  <!-- クリア画面 -->
  {:else if $gameStore.state === 'clear'}
    <div class="screen clear-screen">
      <h1>🎉 クリア！ 🎉</h1>
      <div class="results">
        <p>スコア: {$gameStore.score}</p>
        <p>最大コンボ: {$gameStore.maxCombo}</p>
      </div>
      <button class="pixel-btn" on:click={() => gameStore.reset()}>
        タイトルへ
      </button>
    </div>

  <!-- ゲームオーバー画面 -->
  {:else if $gameStore.state === 'gameover'}
    <div class="screen gameover-screen">
      <h1>💀 ゲームオーバー 💀</h1>
      <div class="results">
        <p>スコア: {$gameStore.score}</p>
        <p>たおした敵: {$gameStore.currentEnemyIndex}体</p>
      </div>
      <button class="pixel-btn" on:click={() => gameStore.reset()}>
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
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  }

  .screen {
    background: #16213e;
    border: 4px solid #e94560;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
    width: 100%;
    max-width: 800px;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 2.5rem;
    color: #e94560;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 0 #0f3460;
  }

  h2 {
    font-size: 1.8rem;
    color: #e94560;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #888;
    margin-bottom: 2rem;
  }

  .pixel-btn {
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    margin: 0.5rem;
  }

  .pixel-btn:hover {
    background: #ff6b6b;
    transform: scale(1.05);
  }

  .pixel-btn.back {
    background: #0f3460;
    font-size: 1rem;
    margin-top: 1.5rem;
  }

  .pixel-btn.easy { background: #22c55e; }
  .pixel-btn.normal { background: #eab308; }
  .pixel-btn.hard { background: #ef4444; }

  .difficulty-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .enemy-area {
    margin-bottom: 2rem;
  }

  .enemy-name {
    font-size: 1.5rem;
    color: #e94560;
    margin-bottom: 0.5rem;
  }

  .enemy-sprite {
    margin: 1rem 0;
    animation: bounce 1s infinite;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .enemy-img {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .enemy-img.dragon {
    width: 160px;
    height: 160px;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hp-bar {
    height: 24px;
    background: #333;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    margin: 0.5rem auto;
    max-width: 300px;
  }

  .hp-fill {
    height: 100%;
    transition: width 0.3s;
  }

  .enemy-hp .hp-fill {
    background: linear-gradient(to right, #ef4444, #f97316);
  }

  .player-hp .hp-fill {
    background: linear-gradient(to right, #22c55e, #4ade80);
  }

  .hp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    color: white;
    text-shadow: 1px 1px 0 black;
  }

  .word-area {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #0f3460;
    border-radius: 8px;
  }

  .word-display {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: white;
  }

  .romaji-display {
    font-size: 2rem;
    letter-spacing: 0.1em;
  }

  .typed {
    color: #22c55e;
  }

  .remaining {
    color: #888;
  }

  .timer-bar {
    height: 12px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    margin: 1rem auto;
    max-width: 400px;
  }

  .timer-fill {
    height: 100%;
    background: linear-gradient(to right, #3b82f6, #60a5fa);
    transition: width 0.1s linear;
  }

  .player-area {
    margin-top: 2rem;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    font-size: 1.1rem;
  }

  .results {
    font-size: 1.5rem;
    margin: 2rem 0;
  }

  .results p {
    margin: 0.5rem 0;
  }

  .clear-screen h1 {
    color: #22c55e;
  }

  .gameover-screen h1 {
    color: #ef4444;
  }

  /* ダメージエフェクト */
  .damage-shake {
    animation: shake 0.2s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-5px); }
  }

  .damage-flash {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(239, 68, 68, 0.3);
    pointer-events: none;
    animation: flash 0.2s ease-out;
  }

  @keyframes flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .game-screen {
    position: relative;
  }

  /* 図鑑ボタン */
  .encyclopedia-btn {
    margin-top: 1rem;
    background: #1e3a5f;
  }

  /* 図鑑画面 */
  .encyclopedia-screen {
    overflow-y: auto;
  }

  .encyclopedia-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
    max-height: 50vh;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .encyclopedia-entry {
    background: #0f3460;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    opacity: 0.5;
  }

  .encyclopedia-entry.discovered {
    opacity: 1;
    border-color: #e94560;
  }

  .entry-sprite {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entry-img {
    width: 48px;
    height: 48px;
    image-rendering: pixelated;
  }

  .unknown {
    font-size: 2rem;
    color: #666;
  }

  .entry-info {
    flex: 1;
    text-align: left;
  }

  .entry-name {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .entry-count {
    font-size: 0.8rem;
    color: #888;
  }

  /* サウンドボタン */
  .sound-btn {
    margin-top: 1rem;
    background: #334155;
    font-size: 1rem;
  }

  .sound-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid #e94560;
    border-radius: 8px;
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 100;
  }

  .sound-toggle:hover {
    background: rgba(233, 69, 96, 0.3);
  }
</style>
