// ひらがな→ローマ字変換（複数パターン対応）
// 入力されたローマ字が「読み」として正しいかを判定する

// ひらがな1文字に対する有効なローマ字入力パターン
const hiraganaToRomaji: Record<string, string[]> = {
  // 基本
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'さ': ['sa'], 'し': ['si', 'shi'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'た': ['ta'], 'ち': ['ti', 'chi'], 'つ': ['tu', 'tsu'], 'て': ['te'], 'と': ['to'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['hu', 'fu'], 'へ': ['he'], 'ほ': ['ho'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'を': ['wo', 'o'], 'ん': ['n', 'nn'],
  
  // 濁音
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu', 'du'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'だ': ['da'], 'ぢ': ['di', 'dhi'], 'づ': ['du', 'zu', 'dzu'], 'で': ['de'], 'ど': ['do'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  
  // 拗音
  'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
  'しゃ': ['sya', 'sha'], 'しゅ': ['syu', 'shu'], 'しょ': ['syo', 'sho'],
  'ちゃ': ['tya', 'cha'], 'ちゅ': ['tyu', 'chu'], 'ちょ': ['tyo', 'cho'],
  'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
  'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
  'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
  'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
  'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
  'じゃ': ['zya', 'ja', 'jya'], 'じゅ': ['zyu', 'ju', 'jyu'], 'じょ': ['zyo', 'jo', 'jyo'],
  'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
  'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],
  
  // 小文字
  'ぁ': ['xa', 'la'], 'ぃ': ['xi', 'li'], 'ぅ': ['xu', 'lu'], 'ぇ': ['xe', 'le'], 'ぉ': ['xo', 'lo'],
  'ゃ': ['xya', 'lya'], 'ゅ': ['xyu', 'lyu'], 'ょ': ['xyo', 'lyo'],
  'っ': ['xtu', 'ltu', 'xtsu', 'ltsu'],
  
  // 長音
  'ー': ['-'],
  
  // カタカナ（ひらがなと同じ読み）
  'ア': ['a'], 'イ': ['i'], 'ウ': ['u'], 'エ': ['e'], 'オ': ['o'],
  'カ': ['ka'], 'キ': ['ki'], 'ク': ['ku'], 'ケ': ['ke'], 'コ': ['ko'],
  'サ': ['sa'], 'シ': ['si', 'shi'], 'ス': ['su'], 'セ': ['se'], 'ソ': ['so'],
  'タ': ['ta'], 'チ': ['ti', 'chi'], 'ツ': ['tu', 'tsu'], 'テ': ['te'], 'ト': ['to'],
  'ナ': ['na'], 'ニ': ['ni'], 'ヌ': ['nu'], 'ネ': ['ne'], 'ノ': ['no'],
  'ハ': ['ha'], 'ヒ': ['hi'], 'フ': ['hu', 'fu'], 'ヘ': ['he'], 'ホ': ['ho'],
  'マ': ['ma'], 'ミ': ['mi'], 'ム': ['mu'], 'メ': ['me'], 'モ': ['mo'],
  'ヤ': ['ya'], 'ユ': ['yu'], 'ヨ': ['yo'],
  'ラ': ['ra'], 'リ': ['ri'], 'ル': ['ru'], 'レ': ['re'], 'ロ': ['ro'],
  'ワ': ['wa'], 'ヲ': ['wo', 'o'], 'ン': ['n', 'nn'],
  'ガ': ['ga'], 'ギ': ['gi'], 'グ': ['gu'], 'ゲ': ['ge'], 'ゴ': ['go'],
  'ザ': ['za'], 'ジ': ['zi', 'ji'], 'ズ': ['zu'], 'ゼ': ['ze'], 'ゾ': ['zo'],
  'ダ': ['da'], 'ヂ': ['di'], 'ヅ': ['du', 'zu'], 'デ': ['de'], 'ド': ['do'],
  'バ': ['ba'], 'ビ': ['bi'], 'ブ': ['bu'], 'ベ': ['be'], 'ボ': ['bo'],
  'パ': ['pa'], 'ピ': ['pi'], 'プ': ['pu'], 'ペ': ['pe'], 'ポ': ['po'],
  'キャ': ['kya'], 'キュ': ['kyu'], 'キョ': ['kyo'],
  'シャ': ['sya', 'sha'], 'シュ': ['syu', 'shu'], 'ショ': ['syo', 'sho'],
  'チャ': ['tya', 'cha'], 'チュ': ['tyu', 'chu'], 'チョ': ['tyo', 'cho'],
  'ニャ': ['nya'], 'ニュ': ['nyu'], 'ニョ': ['nyo'],
  'ヒャ': ['hya'], 'ヒュ': ['hyu'], 'ヒョ': ['hyo'],
  'ミャ': ['mya'], 'ミュ': ['myu'], 'ミョ': ['myo'],
  'リャ': ['rya'], 'リュ': ['ryu'], 'リョ': ['ryo'],
  'ギャ': ['gya'], 'ギュ': ['gyu'], 'ギョ': ['gyo'],
  'ジャ': ['zya', 'ja', 'jya'], 'ジュ': ['zyu', 'ju', 'jyu'], 'ジョ': ['zyo', 'jo', 'jyo'],
  'ビャ': ['bya'], 'ビュ': ['byu'], 'ビョ': ['byo'],
  'ピャ': ['pya'], 'ピュ': ['pyu'], 'ピョ': ['pyo'],
  'ッ': ['xtu', 'ltu', 'xtsu', 'ltsu'],
};

// 日本語テキストをローマ字パターンに変換
export function generateRomajiPatterns(japanese: string): string[][] {
  const patterns: string[][] = [];
  let i = 0;
  
  while (i < japanese.length) {
    // 2文字の拗音を先にチェック
    if (i + 1 < japanese.length) {
      const twoChar = japanese.substring(i, i + 2);
      if (hiraganaToRomaji[twoChar]) {
        patterns.push(hiraganaToRomaji[twoChar]);
        i += 2;
        continue;
      }
    }
    
    // 促音（っ/ッ）の処理
    const char = japanese[i];
    if (char === 'っ' || char === 'ッ') {
      // 次の文字の子音を重ねる
      if (i + 1 < japanese.length) {
        const nextChar = japanese[i + 1];
        // 次の2文字が拗音かチェック
        let nextRomaji: string[] | undefined;
        if (i + 2 < japanese.length) {
          const nextTwo = japanese.substring(i + 1, i + 3);
          nextRomaji = hiraganaToRomaji[nextTwo];
        }
        if (!nextRomaji) {
          nextRomaji = hiraganaToRomaji[nextChar];
        }
        
        if (nextRomaji) {
          // 子音を取得して重ねる
          const consonants = nextRomaji.map(r => {
            const consonant = r[0];
            // 母音で始まる場合は促音を入れない
            if ('aiueo'.includes(consonant)) return '';
            return consonant;
          });
          patterns.push([...new Set(consonants.filter(c => c !== ''))]);
          i++;
          continue;
        }
      }
      // 単独の促音
      patterns.push(hiraganaToRomaji[char] || ['']);
      i++;
      continue;
    }
    
    // 1文字
    if (hiraganaToRomaji[char]) {
      patterns.push(hiraganaToRomaji[char]);
    } else {
      // 漢字などはそのまま（読み仮名が必要）
      patterns.push([char]);
    }
    i++;
  }
  
  return patterns;
}

// 入力チェッカークラス
export class RomajiChecker {
  private patterns: string[][];
  private currentPatternIndex: number = 0;
  private currentCharIndex: number = 0;
  private selectedPattern: string[] = [];
  private typedRomaji: string = '';
  
  constructor(japanese: string) {
    this.patterns = generateRomajiPatterns(japanese);
    if (this.patterns.length > 0) {
      this.selectedPattern = [...this.patterns[0]];
    }
  }
  
  // キー入力を処理
  processKey(key: string): { accepted: boolean; completed: boolean } {
    const lowerKey = key.toLowerCase();
    
    if (this.currentPatternIndex >= this.patterns.length) {
      return { accepted: false, completed: true };
    }
    
    const currentPatterns = this.patterns[this.currentPatternIndex];
    
    // 現在のパターングループから、入力可能なパターンを探す
    const matchingPatterns = currentPatterns.filter(pattern => {
      if (this.currentCharIndex >= pattern.length) return false;
      return pattern[this.currentCharIndex] === lowerKey;
    });
    
    if (matchingPatterns.length > 0) {
      // マッチするパターンがあれば受け入れ
      this.typedRomaji += lowerKey;
      this.currentCharIndex++;
      
      // パターンが完了したかチェック
      const completedPatterns = matchingPatterns.filter(p => p.length === this.currentCharIndex);
      
      if (completedPatterns.length > 0) {
        // 次のパターングループへ
        this.currentPatternIndex++;
        this.currentCharIndex = 0;
        
        // 全完了チェック
        if (this.currentPatternIndex >= this.patterns.length) {
          return { accepted: true, completed: true };
        }
      }
      
      // まだ続きがあるパターンに絞る
      this.patterns[this.currentPatternIndex] = matchingPatterns;
      
      return { accepted: true, completed: false };
    }
    
    return { accepted: false, completed: false };
  }
  
  // 入力済みのローマ字を取得
  getTypedRomaji(): string {
    return this.typedRomaji;
  }
  
  // 進捗率を取得（0-1）
  getProgress(): number {
    if (this.patterns.length === 0) return 1;
    return this.currentPatternIndex / this.patterns.length;
  }
  
  // リセット
  reset(japanese: string) {
    this.patterns = generateRomajiPatterns(japanese);
    this.currentPatternIndex = 0;
    this.currentCharIndex = 0;
    this.typedRomaji = '';
  }
}

// 表示用ローマ字を生成（最初のパターンを使用）
export function getDisplayRomaji(japanese: string): string {
  const patterns = generateRomajiPatterns(japanese);
  return patterns.map(p => p[0] || '').join('');
}
