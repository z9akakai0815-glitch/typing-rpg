// ひらがな→ローマ字変換（複数パターン対応）
// 入力されたローマ字が「読み」として正しいかを判定する

// ひらがな1文字に対する有効なローマ字入力パターン
const hiraganaToRomaji: Record<string, string[]> = {
  // 基本
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'さ': ['sa'], 'し': ['si', 'shi', 'ci'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'た': ['ta'], 'ち': ['ti', 'chi'], 'つ': ['tu', 'tsu'], 'て': ['te'], 'と': ['to'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['hu', 'fu'], 'へ': ['he'], 'ほ': ['ho'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'を': ['wo', 'o'], 'ん': ['n', 'nn'],
  
  // 濁音
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du', 'zu'], 'で': ['de'], 'ど': ['do'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  
  // 拗音
  'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
  'しゃ': ['sya', 'sha'], 'しゅ': ['syu', 'shu'], 'しょ': ['syo', 'sho'],
  'ちゃ': ['tya', 'cha', 'cya'], 'ちゅ': ['tyu', 'chu', 'cyu'], 'ちょ': ['tyo', 'cho', 'cyo'],
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
  
  // カタカナ
  'ア': ['a'], 'イ': ['i'], 'ウ': ['u'], 'エ': ['e'], 'オ': ['o'],
  'カ': ['ka'], 'キ': ['ki'], 'ク': ['ku'], 'ケ': ['ke'], 'コ': ['ko'],
  'サ': ['sa'], 'シ': ['si', 'shi', 'ci'], 'ス': ['su'], 'セ': ['se'], 'ソ': ['so'],
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
  'チャ': ['tya', 'cha', 'cya'], 'チュ': ['tyu', 'chu', 'cyu'], 'チョ': ['tyo', 'cho', 'cyo'],
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

// 文字チャンク（促音処理済み）
interface CharChunk {
  char: string;           // 元の日本語文字
  patterns: string[];     // 有効なローマ字パターン
  isDoubleConsonant: boolean; // 促音による子音重ねか
}

// 日本語テキストをチャンクに分解
function parseJapanese(japanese: string): CharChunk[] {
  const chunks: CharChunk[] = [];
  let i = 0;
  
  while (i < japanese.length) {
    // 2文字の拗音を先にチェック
    if (i + 1 < japanese.length) {
      const twoChar = japanese.substring(i, i + 2);
      if (hiraganaToRomaji[twoChar]) {
        chunks.push({
          char: twoChar,
          patterns: [...hiraganaToRomaji[twoChar]],
          isDoubleConsonant: false,
        });
        i += 2;
        continue;
      }
    }
    
    const char = japanese[i];
    
    // 促音（っ/ッ）の処理
    if (char === 'っ' || char === 'ッ') {
      // 次の文字の子音を取得
      if (i + 1 < japanese.length) {
        let nextPatterns: string[] | undefined;
        
        // 次の2文字が拗音かチェック
        if (i + 2 < japanese.length) {
          const nextTwo = japanese.substring(i + 1, i + 3);
          nextPatterns = hiraganaToRomaji[nextTwo];
        }
        if (!nextPatterns) {
          nextPatterns = hiraganaToRomaji[japanese[i + 1]];
        }
        
        if (nextPatterns) {
          // 子音を重ねる（例: kk, tt, ss）
          const consonants: string[] = [];
          for (const pattern of nextPatterns) {
            const firstChar = pattern[0];
            // 母音で始まる場合はスキップ
            if (!'aiueo'.includes(firstChar)) {
              consonants.push(firstChar);
            }
          }
          
          if (consonants.length > 0) {
            chunks.push({
              char: char,
              patterns: [...new Set(consonants)],
              isDoubleConsonant: true,
            });
            i++;
            continue;
          }
        }
      }
      
      // 単独の促音（xtu/ltu等）
      chunks.push({
        char: char,
        patterns: hiraganaToRomaji[char] || [''],
        isDoubleConsonant: false,
      });
      i++;
      continue;
    }
    
    // 通常の1文字
    if (hiraganaToRomaji[char]) {
      chunks.push({
        char: char,
        patterns: [...hiraganaToRomaji[char]],
        isDoubleConsonant: false,
      });
    } else {
      // 未知の文字はそのまま
      chunks.push({
        char: char,
        patterns: [char],
        isDoubleConsonant: false,
      });
    }
    i++;
  }
  
  return chunks;
}

// 入力チェッカークラス
export class RomajiChecker {
  private chunks: CharChunk[];
  private chunkIndex: number = 0;
  private charInChunk: number = 0;
  private currentValidPatterns: string[] = [];
  private typedRomaji: string = '';
  
  constructor(japanese: string) {
    this.chunks = parseJapanese(japanese);
    if (this.chunks.length > 0) {
      this.currentValidPatterns = [...this.chunks[0].patterns];
    }
  }
  
  // キー入力を処理
  processKey(key: string): { accepted: boolean; completed: boolean } {
    const lowerKey = key.toLowerCase();
    
    // 全チャンク完了済み
    if (this.chunkIndex >= this.chunks.length) {
      return { accepted: false, completed: true };
    }
    
    // 現在の位置で有効なパターンをフィルタ
    const matchingPatterns = this.currentValidPatterns.filter(pattern => {
      return this.charInChunk < pattern.length && pattern[this.charInChunk] === lowerKey;
    });
    
    if (matchingPatterns.length === 0) {
      // どのパターンにもマッチしない = 入力ミス
      return { accepted: false, completed: false };
    }
    
    // マッチした！
    this.typedRomaji += lowerKey;
    this.charInChunk++;
    this.currentValidPatterns = matchingPatterns;
    
    // 完了したパターンがあるかチェック
    const completedPattern = matchingPatterns.find(p => p.length === this.charInChunk);
    
    if (completedPattern) {
      // このチャンクは完了、次へ
      this.chunkIndex++;
      this.charInChunk = 0;
      
      if (this.chunkIndex >= this.chunks.length) {
        // 全チャンク完了！
        return { accepted: true, completed: true };
      }
      
      // 次のチャンクのパターンをセット
      this.currentValidPatterns = [...this.chunks[this.chunkIndex].patterns];
    }
    
    return { accepted: true, completed: false };
  }
  
  // 入力済みのローマ字を取得
  getTypedRomaji(): string {
    return this.typedRomaji;
  }
  
  // 進捗率を取得（0-1）
  getProgress(): number {
    if (this.chunks.length === 0) return 1;
    return this.chunkIndex / this.chunks.length;
  }
}

// 表示用ローマ字を生成（最初のパターンを使用）
export function getDisplayRomaji(japanese: string): string {
  const chunks = parseJapanese(japanese);
  return chunks.map(chunk => chunk.patterns[0] || '').join('');
}
