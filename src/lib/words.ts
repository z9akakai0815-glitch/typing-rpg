// 単語データ - レベル別
export interface Word {
  display: string;  // 表示する日本語
  reading: string;  // 読み（ひらがな/カタカナ）
}

// レベル1-2: 簡単な単語（2-4文字）
const level1Words: Word[] = [
  // あ行
  { display: 'あめ', reading: 'あめ' },
  { display: 'いぬ', reading: 'いぬ' },
  { display: 'うみ', reading: 'うみ' },
  { display: 'えき', reading: 'えき' },
  { display: 'おに', reading: 'おに' },
  // か行
  { display: 'かさ', reading: 'かさ' },
  { display: 'きつね', reading: 'きつね' },
  { display: 'くま', reading: 'くま' },
  { display: 'けむし', reading: 'けむし' },
  { display: 'こい', reading: 'こい' },
  // さ行
  { display: 'さる', reading: 'さる' },
  { display: 'しか', reading: 'しか' },
  { display: 'すし', reading: 'すし' },
  { display: 'せみ', reading: 'せみ' },
  { display: 'そら', reading: 'そら' },
  // た行
  { display: 'たい', reading: 'たい' },
  { display: 'ちず', reading: 'ちず' },
  { display: 'つき', reading: 'つき' },
  { display: 'てら', reading: 'てら' },
  { display: 'とり', reading: 'とり' },
  // な行
  { display: 'なす', reading: 'なす' },
  { display: 'にく', reading: 'にく' },
  { display: 'ぬま', reading: 'ぬま' },
  { display: 'ねこ', reading: 'ねこ' },
  { display: 'のり', reading: 'のり' },
  // は行
  { display: 'はな', reading: 'はな' },
  { display: 'ひと', reading: 'ひと' },
  { display: 'ふね', reading: 'ふね' },
  { display: 'へび', reading: 'へび' },
  { display: 'ほし', reading: 'ほし' },
  // ま行
  { display: 'まめ', reading: 'まめ' },
  { display: 'みず', reading: 'みず' },
  { display: 'むし', reading: 'むし' },
  { display: 'めだか', reading: 'めだか' },
  { display: 'もも', reading: 'もも' },
  // や行
  { display: 'やま', reading: 'やま' },
  { display: 'ゆき', reading: 'ゆき' },
  { display: 'よる', reading: 'よる' },
  // ら行
  { display: 'らいおん', reading: 'らいおん' },
  { display: 'りす', reading: 'りす' },
  { display: 'るす', reading: 'るす' },
  { display: 'れもん', reading: 'れもん' },
  { display: 'ろば', reading: 'ろば' },
  // わ行
  { display: 'わに', reading: 'わに' },
  // カタカナ
  { display: 'イカ', reading: 'イカ' },
  { display: 'エビ', reading: 'エビ' },
  { display: 'カニ', reading: 'カニ' },
  { display: 'トラ', reading: 'トラ' },
  { display: 'ゾウ', reading: 'ゾウ' },
  { display: 'パン', reading: 'パン' },
];

// レベル3-5: 中級の単語（4-7文字）
const level2Words: Word[] = [
  // あ行
  { display: 'あさがお', reading: 'あさがお' },
  { display: 'いちご', reading: 'いちご' },
  { display: 'うさぎ', reading: 'うさぎ' },
  { display: 'えんぴつ', reading: 'えんぴつ' },
  { display: 'おにぎり', reading: 'おにぎり' },
  // か行
  { display: 'かたつむり', reading: 'かたつむり' },
  { display: 'きりん', reading: 'きりん' },
  { display: 'くじら', reading: 'くじら' },
  { display: 'けしごむ', reading: 'けしごむ' },
  { display: 'こおり', reading: 'こおり' },
  // さ行
  { display: 'さくら', reading: 'さくら' },
  { display: 'しんかんせん', reading: 'しんかんせん' },
  { display: 'すいか', reading: 'すいか' },
  { display: 'せんせい', reading: 'せんせい' },
  { display: 'そうじき', reading: 'そうじき' },
  // た行
  { display: 'たいよう', reading: 'たいよう' },
  { display: 'ちきゅう', reading: 'ちきゅう' },
  { display: 'つくえ', reading: 'つくえ' },
  { display: 'てんき', reading: 'てんき' },
  { display: 'ともだち', reading: 'ともだち' },
  // な行
  { display: 'なつやすみ', reading: 'なつやすみ' },
  { display: 'にんじん', reading: 'にんじん' },
  { display: 'ぬいぐるみ', reading: 'ぬいぐるみ' },
  { display: 'ねずみ', reading: 'ねずみ' },
  { display: 'のりもの', reading: 'のりもの' },
  // は行
  { display: 'ひまわり', reading: 'ひまわり' },
  { display: 'ふうせん', reading: 'ふうせん' },
  { display: 'へいわ', reading: 'へいわ' },
  { display: 'ほうせき', reading: 'ほうせき' },
  // ま行
  { display: 'まほう', reading: 'まほう' },
  { display: 'みかん', reading: 'みかん' },
  { display: 'むらさき', reading: 'むらさき' },
  { display: 'めがね', reading: 'めがね' },
  { display: 'もみじ', reading: 'もみじ' },
  // や行
  { display: 'やさい', reading: 'やさい' },
  { display: 'ゆうえんち', reading: 'ゆうえんち' },
  { display: 'ようふく', reading: 'ようふく' },
  // ら行
  { display: 'らくだ', reading: 'らくだ' },
  { display: 'りんご', reading: 'りんご' },
  { display: 'れいぞうこ', reading: 'れいぞうこ' },
  { display: 'ろうそく', reading: 'ろうそく' },
  // わ行
  { display: 'わたがし', reading: 'わたがし' },
  // カタカナ（長音含む）
  { display: 'ラーメン', reading: 'ラーメン' },
  { display: 'ケーキ', reading: 'ケーキ' },
  { display: 'カレー', reading: 'カレー' },
  { display: 'ジュース', reading: 'ジュース' },
  { display: 'ペンギン', reading: 'ペンギン' },
  { display: 'ノート', reading: 'ノート' },
  { display: 'プール', reading: 'プール' },
  { display: 'コーヒー', reading: 'コーヒー' },
  { display: 'ハンバーガー', reading: 'ハンバーガー' },
];

// レベル6-8: 熟語（漢字含む）
const level3Words: Word[] = [
  // 学校関連
  { display: '小学校', reading: 'しょうがっこう' },
  { display: '図書館', reading: 'としょかん' },
  { display: '教室', reading: 'きょうしつ' },
  { display: '体育館', reading: 'たいいくかん' },
  { display: '運動会', reading: 'うんどうかい' },
  { display: '遠足', reading: 'えんそく' },
  { display: '給食', reading: 'きゅうしょく' },
  { display: '宿題', reading: 'しゅくだい' },
  // 科目
  { display: '算数', reading: 'さんすう' },
  { display: '国語', reading: 'こくご' },
  { display: '理科', reading: 'りか' },
  { display: '社会', reading: 'しゃかい' },
  { display: '音楽', reading: 'おんがく' },
  { display: '図工', reading: 'ずこう' },
  { display: '体育', reading: 'たいいく' },
  // 自然
  { display: '動物園', reading: 'どうぶつえん' },
  { display: '水族館', reading: 'すいぞくかん' },
  { display: '植物園', reading: 'しょくぶつえん' },
  { display: '公園', reading: 'こうえん' },
  // 家族
  { display: 'お父さん', reading: 'おとうさん' },
  { display: 'お母さん', reading: 'おかあさん' },
  { display: 'お兄さん', reading: 'おにいさん' },
  { display: 'お姉さん', reading: 'おねえさん' },
  // 季節
  { display: '春休み', reading: 'はるやすみ' },
  { display: '夏休み', reading: 'なつやすみ' },
  { display: '冬休み', reading: 'ふゆやすみ' },
  // その他
  { display: '友達', reading: 'ともだち' },
  { display: '元気', reading: 'げんき' },
  { display: '勉強', reading: 'べんきょう' },
  { display: '約束', reading: 'やくそく' },
  { display: '大切', reading: 'たいせつ' },
];

// レベル9-10: 四字熟語・ことわざ
const level4Words: Word[] = [
  // 四字熟語
  { display: '一石二鳥', reading: 'いっせきにちょう' },
  { display: '十人十色', reading: 'じゅうにんといろ' },
  { display: '一生懸命', reading: 'いっしょうけんめい' },
  { display: '以心伝心', reading: 'いしんでんしん' },
  { display: '自由自在', reading: 'じゆうじざい' },
  { display: '四面楚歌', reading: 'しめんそか' },
  { display: '一期一会', reading: 'いちごいちえ' },
  { display: '温故知新', reading: 'おんこちしん' },
  { display: '起死回生', reading: 'きしかいせい' },
  { display: '電光石火', reading: 'でんこうせっか' },
  { display: '日進月歩', reading: 'にっしんげっぽ' },
  { display: '無我夢中', reading: 'むがむちゅう' },
  // ことわざ
  { display: '犬も歩けば棒に当たる', reading: 'いぬもあるけばぼうにあたる' },
  { display: '猿も木から落ちる', reading: 'さるもきからおちる' },
  { display: '石の上にも三年', reading: 'いしのうえにもさんねん' },
  { display: '継続は力なり', reading: 'けいぞくはちからなり' },
  { display: '花より団子', reading: 'はなよりだんご' },
  { display: '猫に小判', reading: 'ねこにこばん' },
];

export const wordsByLevel: Word[][] = [
  level1Words,
  level2Words,
  level3Words,
  level4Words,
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
