# タイピングRPG ⌨️⚔️

日本語のローマ字タイピングで敵を倒すRPGゲーム！

🎮 **プレイ:** https://typing-rpg-production.up.railway.app

## 概要

- **ジャンル:** タイピング + RPG
- **技術:** SvelteKit + TypeScript
- **デプロイ:** Railway

## 機能

### ✅ 実装済み
- 日本語→ローマ字タイピング
- 複数入力対応（「し」= si/shi/ci）
- 敵との戦闘システム
- HP・ダメージシステム
- ゲームオーバー / 勝利画面
- BGM・効果音（Web Audio API）
- ミュート機能

### 🔜 未実装（予定）
- レベルシステム
- 複数の敵
- ボス戦
- アイテム
- セーブ機能

## 遊び方

1. 画面に表示される日本語をローマ字で入力
2. 正確に入力すると敵にダメージ
3. 間違えると自分がダメージ
4. 敵のHPを0にすれば勝利！

## 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー
npm run dev

# ビルド
npm run build

# デプロイ
railway up --service typing-rpg
```

## ファイル構成

```
src/
├── lib/
│   ├── gameStore.ts       # ゲーム状態管理
│   ├── words.ts           # 日本語単語リスト
│   ├── romajiConverter.ts # ひらがな→ローマ字変換
│   └── audio.ts           # BGM・効果音
└── routes/
    └── +page.svelte       # メインページ
```

## ローマ字変換の特徴

- 複数の入力パターンに対応
- 「ん」の処理（nn/n'等）
- 拗音対応（しゃ = sha/sya）
- 促音対応（っ = 次の子音を重ねる）

## 開発履歴

- 2025-02-01: 初期開発
  - プロジェクト作成
  - タイピングシステム実装
  - 戦闘システム実装
  - BGM・効果音追加
  - Railway デプロイ

---

Made with 🌸 by カイリ & ララ
