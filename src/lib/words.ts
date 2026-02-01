// 単語データ - レベル別
export interface Word {
  display: string;  // 表示する日本語
  romaji: string;   // 入力するローマ字
}

export const wordsByLevel: Word[][] = [
  // レベル1-2（2-3文字）敵: スライム、コウモリ
  [
    { display: 'たい', romaji: 'tai' },
    { display: 'いぬ', romaji: 'inu' },
    { display: 'ねこ', romaji: 'neko' },
    { display: 'うし', romaji: 'ushi' },
    { display: 'うま', romaji: 'uma' },
    { display: 'とり', romaji: 'tori' },
    { display: 'さる', romaji: 'saru' },
    { display: 'くま', romaji: 'kuma' },
    { display: 'イカ', romaji: 'ika' },
    { display: 'カニ', romaji: 'kani' },
    { display: 'エビ', romaji: 'ebi' },
    { display: 'トラ', romaji: 'tora' },
    { display: 'ゾウ', romaji: 'zou' },
    { display: 'パン', romaji: 'pan' },
    { display: 'あめ', romaji: 'ame' },
    { display: 'いも', romaji: 'imo' },
    { display: 'かき', romaji: 'kaki' },
    { display: 'すし', romaji: 'sushi' },
    { display: 'もち', romaji: 'mochi' },
  ],
  // レベル3-5（4-6文字）敵: おおねずみ、ゴブリン、ガイコツ
  [
    { display: 'きりん', romaji: 'kirin' },
    { display: 'うさぎ', romaji: 'usagi' },
    { display: 'さくら', romaji: 'sakura' },
    { display: 'りんご', romaji: 'ringo' },
    { display: 'ぶどう', romaji: 'budou' },
    { display: 'いちご', romaji: 'ichigo' },
    { display: 'ペンギン', romaji: 'pengin' },
    { display: 'ライオン', romaji: 'raion' },
    { display: 'ひまわり', romaji: 'himawari' },
    { display: 'たいよう', romaji: 'taiyou' },
    { display: 'おにぎり', romaji: 'onigiri' },
    { display: 'カレー', romaji: 'karee' },
    { display: 'ラーメン', romaji: 'raamen' },
    { display: 'ノート', romaji: 'nooto' },
    { display: 'えんぴつ', romaji: 'enpitsu' },
    { display: 'せんせい', romaji: 'sensei' },
    { display: 'がっこう', romaji: 'gakkou' },
  ],
  // レベル6-8（熟語）敵: オオカミ、ゴーレム、まどうし
  [
    { display: '友達', romaji: 'tomodachi' },
    { display: '元気', romaji: 'genki' },
    { display: '勉強', romaji: 'benkyou' },
    { display: '算数', romaji: 'sansuu' },
    { display: '国語', romaji: 'kokugo' },
    { display: '音楽', romaji: 'ongaku' },
    { display: '体育', romaji: 'taiiku' },
    { display: '図工', romaji: 'zukou' },
    { display: '給食', romaji: 'kyuushoku' },
    { display: '遠足', romaji: 'ensoku' },
    { display: '運動会', romaji: 'undoukai' },
    { display: '夏休み', romaji: 'natsuyasumi' },
    { display: '小学校', romaji: 'shougakkou' },
    { display: '図書館', romaji: 'toshokan' },
    { display: '動物園', romaji: 'doubutsuen' },
    { display: '水族館', romaji: 'suizokukan' },
    { display: 'ランドセル', romaji: 'randoseru' },
  ],
  // レベル9-10（四字熟語・ことわざ）敵: デーモン、ドラゴン
  [
    { display: '一石二鳥', romaji: 'issekinichou' },
    { display: '十人十色', romaji: 'juunintoiro' },
    { display: '一生懸命', romaji: 'isshoukenmei' },
    { display: '以心伝心', romaji: 'ishindenshin' },
    { display: '二人三脚', romaji: 'nininsankyaku' },
    { display: '自由自在', romaji: 'jiyuujizai' },
    { display: '七転び八起き', romaji: 'nanakorobiyaoki' },
    { display: '犬も歩けば棒に当たる', romaji: 'inumoarukebabouniataru' },
    { display: '猿も木から落ちる', romaji: 'sarumokikaraochiru' },
    { display: '石の上にも三年', romaji: 'ishinouenimosannen' },
    { display: '早起きは三文の徳', romaji: 'hayaokihasanmonnotoku' },
    { display: '継続は力なり', romaji: 'keizokuhachikaranari' },
  ],
];

// 敵の情報
export interface Enemy {
  name: string;
  hp: number;
  level: number;  // 0-3 で wordsByLevel のインデックス
}

export const enemies: Enemy[] = [
  { name: 'スライム', hp: 50, level: 0 },
  { name: 'コウモリ', hp: 60, level: 0 },
  { name: 'おおねずみ', hp: 70, level: 1 },
  { name: 'ゴブリン', hp: 80, level: 1 },
  { name: 'ガイコツ', hp: 100, level: 1 },
  { name: 'オオカミ', hp: 120, level: 2 },
  { name: 'ゴーレム', hp: 140, level: 2 },
  { name: 'まどうし', hp: 160, level: 2 },
  { name: 'デーモン', hp: 180, level: 3 },
  { name: 'ドラゴン', hp: 200, level: 3 },
];

// 難易度設定（1文字あたりの秒数）
export const difficultySettings = {
  easy: 3.5,
  normal: 2.0,
  hard: 1.5,
} as const;

export type Difficulty = keyof typeof difficultySettings;

// ランダムな単語を取得
export function getRandomWord(level: number): Word {
  const words = wordsByLevel[Math.min(level, wordsByLevel.length - 1)];
  return words[Math.floor(Math.random() * words.length)];
}
