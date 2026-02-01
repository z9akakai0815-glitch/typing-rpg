// 単語データ - レベル別
export interface Word {
  display: string;  // 表示する日本語
  romaji: string;   // 入力するローマ字
}

// レベル1-2: 簡単な単語（2-4文字）
const level1Words: Word[] = [
  // あ行
  { display: 'あめ', romaji: 'ame' },
  { display: 'いぬ', romaji: 'inu' },
  { display: 'うみ', romaji: 'umi' },
  { display: 'えき', romaji: 'eki' },
  { display: 'おに', romaji: 'oni' },
  // か行
  { display: 'かさ', romaji: 'kasa' },
  { display: 'きつね', romaji: 'kitune' },
  { display: 'くま', romaji: 'kuma' },
  { display: 'けむし', romaji: 'kemusi' },
  { display: 'こい', romaji: 'koi' },
  // さ行
  { display: 'さる', romaji: 'saru' },
  { display: 'しか', romaji: 'sika' },
  { display: 'すし', romaji: 'susi' },
  { display: 'せみ', romaji: 'semi' },
  { display: 'そら', romaji: 'sora' },
  // た行
  { display: 'たい', romaji: 'tai' },
  { display: 'ちず', romaji: 'tizu' },
  { display: 'つき', romaji: 'tuki' },
  { display: 'てら', romaji: 'tera' },
  { display: 'とり', romaji: 'tori' },
  // な行
  { display: 'なす', romaji: 'nasu' },
  { display: 'にく', romaji: 'niku' },
  { display: 'ぬま', romaji: 'numa' },
  { display: 'ねこ', romaji: 'neko' },
  { display: 'のり', romaji: 'nori' },
  // は行
  { display: 'はな', romaji: 'hana' },
  { display: 'ひと', romaji: 'hito' },
  { display: 'ふね', romaji: 'hune' },
  { display: 'へび', romaji: 'hebi' },
  { display: 'ほし', romaji: 'hosi' },
  // ま行
  { display: 'まめ', romaji: 'mame' },
  { display: 'みず', romaji: 'mizu' },
  { display: 'むし', romaji: 'musi' },
  { display: 'めだか', romaji: 'medaka' },
  { display: 'もも', romaji: 'momo' },
  // や行
  { display: 'やま', romaji: 'yama' },
  { display: 'ゆき', romaji: 'yuki' },
  { display: 'よる', romaji: 'yoru' },
  // ら行
  { display: 'らいおん', romaji: 'raion' },
  { display: 'りす', romaji: 'risu' },
  { display: 'るす', romaji: 'rusu' },
  { display: 'れもん', romaji: 'remon' },
  { display: 'ろば', romaji: 'roba' },
  // わ行
  { display: 'わに', romaji: 'wani' },
  // カタカナ
  { display: 'イカ', romaji: 'ika' },
  { display: 'エビ', romaji: 'ebi' },
  { display: 'カニ', romaji: 'kani' },
  { display: 'トラ', romaji: 'tora' },
  { display: 'ゾウ', romaji: 'zou' },
  { display: 'パン', romaji: 'pan' },
];

// レベル3-5: 中級の単語（4-7文字）
const level2Words: Word[] = [
  // あ行
  { display: 'あさがお', romaji: 'asagao' },
  { display: 'いちご', romaji: 'itigo' },
  { display: 'うさぎ', romaji: 'usagi' },
  { display: 'えんぴつ', romaji: 'enpitu' },
  { display: 'おにぎり', romaji: 'onigiri' },
  // か行
  { display: 'かたつむり', romaji: 'katatumuri' },
  { display: 'きりん', romaji: 'kirin' },
  { display: 'くじら', romaji: 'kuzira' },
  { display: 'けしごむ', romaji: 'kesigomu' },
  { display: 'こおり', romaji: 'koori' },
  // さ行
  { display: 'さくら', romaji: 'sakura' },
  { display: 'しんかんせん', romaji: 'sinkansen' },
  { display: 'すいか', romaji: 'suika' },
  { display: 'せんせい', romaji: 'sensei' },
  { display: 'そうじき', romaji: 'souziki' },
  // た行
  { display: 'たいよう', romaji: 'taiyou' },
  { display: 'ちきゅう', romaji: 'tikyuu' },
  { display: 'つくえ', romaji: 'tukue' },
  { display: 'てんき', romaji: 'tenki' },
  { display: 'ともだち', romaji: 'tomodati' },
  // な行
  { display: 'なつやすみ', romaji: 'natuyasumi' },
  { display: 'にんじん', romaji: 'ninzin' },
  { display: 'ぬいぐるみ', romaji: 'nuigurumi' },
  { display: 'ねずみ', romaji: 'nezumi' },
  { display: 'のりもの', romaji: 'norimono' },
  // は行
  { display: 'ひまわり', romaji: 'himawari' },
  { display: 'ふうせん', romaji: 'huusen' },
  { display: 'へいわ', romaji: 'heiwa' },
  { display: 'ほうせき', romaji: 'houseki' },
  // ま行
  { display: 'まほう', romaji: 'mahou' },
  { display: 'みかん', romaji: 'mikan' },
  { display: 'むらさき', romaji: 'murasaki' },
  { display: 'めがね', romaji: 'megane' },
  { display: 'もみじ', romaji: 'momizi' },
  // や行
  { display: 'やさい', romaji: 'yasai' },
  { display: 'ゆうえんち', romaji: 'yuuenti' },
  { display: 'ようふく', romaji: 'youhuku' },
  // ら行
  { display: 'らくだ', romaji: 'rakuda' },
  { display: 'りんご', romaji: 'ringo' },
  { display: 'れいぞうこ', romaji: 'reizouko' },
  { display: 'ろうそく', romaji: 'rousoku' },
  // わ行
  { display: 'わたがし', romaji: 'watagasi' },
  // カタカナ（長音はハイフン対応）
  { display: 'ラーメン', romaji: 'raamen' },
  { display: 'ケーキ', romaji: 'keeki' },
  { display: 'カレー', romaji: 'karee' },
  { display: 'ジュース', romaji: 'zyuusu' },
  { display: 'ペンギン', romaji: 'pengin' },
  { display: 'ノート', romaji: 'nooto' },
  { display: 'プール', romaji: 'puuru' },
];

// レベル6-8: 熟語（漢字含む）
const level3Words: Word[] = [
  // 学校関連
  { display: '小学校', romaji: 'syougakkou' },
  { display: '図書館', romaji: 'tosyokan' },
  { display: '教室', romaji: 'kyousitu' },
  { display: '体育館', romaji: 'taiikukan' },
  { display: '運動会', romaji: 'undoukai' },
  { display: '遠足', romaji: 'ensoku' },
  { display: '給食', romaji: 'kyuusyoku' },
  { display: '宿題', romaji: 'syukudai' },
  // 科目
  { display: '算数', romaji: 'sansuu' },
  { display: '国語', romaji: 'kokugo' },
  { display: '理科', romaji: 'rika' },
  { display: '社会', romaji: 'syakai' },
  { display: '音楽', romaji: 'ongaku' },
  { display: '図工', romaji: 'zukou' },
  { display: '体育', romaji: 'taiiku' },
  // 自然
  { display: '動物園', romaji: 'doubutuen' },
  { display: '水族館', romaji: 'suizokukan' },
  { display: '植物園', romaji: 'syokubuten' },
  { display: '公園', romaji: 'kouen' },
  // 家族
  { display: 'お父さん', romaji: 'otousan' },
  { display: 'お母さん', romaji: 'okaasan' },
  { display: 'お兄さん', romaji: 'oniisan' },
  { display: 'お姉さん', romaji: 'oneesan' },
  // 季節
  { display: '春休み', romaji: 'haruyasumi' },
  { display: '夏休み', romaji: 'natuyasumi' },
  { display: '冬休み', romaji: 'huyuyasumi' },
  // その他
  { display: '友達', romaji: 'tomodati' },
  { display: '元気', romaji: 'genki' },
  { display: '勉強', romaji: 'benkyou' },
  { display: '約束', romaji: 'yakusoku' },
  { display: '大切', romaji: 'taisetu' },
];

// レベル9-10: 四字熟語・ことわざ
const level4Words: Word[] = [
  // 四字熟語
  { display: '一石二鳥', romaji: 'issekinityou' },
  { display: '十人十色', romaji: 'zyuunintoiro' },
  { display: '一生懸命', romaji: 'issyoukenmei' },
  { display: '以心伝心', romaji: 'isindensin' },
  { display: '二人三脚', romaji: 'nininsan\'kyaku' },
  { display: '自由自在', romaji: 'ziyuuzizai' },
  { display: '四面楚歌', romaji: 'simansoka' },
  { display: '七転八起', romaji: 'sittenha\'ki' },
  { display: '一期一会', romaji: 'itigoitie' },
  { display: '温故知新', romaji: 'onkotisin' },
  { display: '起死回生', romaji: 'kisikaisei' },
  { display: '電光石火', romaji: 'denkousekka' },
  { display: '日進月歩', romaji: 'nissingetupou' },
  { display: '百発百中', romaji: 'hyappatuhyakatyuu' },
  { display: '無我夢中', romaji: 'mugamutyuu' },
  // ことわざ
  { display: '犬も歩けば棒に当たる', romaji: 'inumoarukebabouniataru' },
  { display: '猿も木から落ちる', romaji: 'sarumokikaraotiru' },
  { display: '石の上にも三年', romaji: 'isinouenimosannen' },
  { display: '早起きは三文の徳', romaji: 'hayaokihasanmonnotoku' },
  { display: '継続は力なり', romaji: 'keizokuhatikanari' },
  { display: '七転び八起き', romaji: 'nanakorobiyaoki' },
  { display: '花より団子', romaji: 'hanayoridango' },
  { display: '猫に小判', romaji: 'nekonikoban' },
  { display: '馬の耳に念仏', romaji: 'umanoministobutu' },
  { display: '塵も積もれば山となる', romaji: 'tirimotumorebayanaatonaru' },
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

// ローマ字を表示用に変換（長音をハイフンに）
export function formatRomajiForDisplay(romaji: string): string {
  // 連続する母音をハイフン表記に変換
  return romaji
    .replace(/aa/g, 'a-')
    .replace(/ii/g, 'i-')
    .replace(/uu/g, 'u-')
    .replace(/ee/g, 'e-')
    .replace(/oo/g, 'o-')
    .replace(/ou/g, 'o-');
}
