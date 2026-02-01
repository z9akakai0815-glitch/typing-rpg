// ローマ字の複数入力対応マップ
// 同じ日本語に対して複数の入力方法を許容する

// 文字ごとの代替入力パターン
export const charAlternatives: Record<string, string[]> = {
  // 基本の代替
  'si': ['si', 'shi'],
  'shi': ['shi', 'si'],
  'ti': ['ti', 'chi'],
  'chi': ['chi', 'ti'],
  'tu': ['tu', 'tsu'],
  'tsu': ['tsu', 'tu'],
  'hu': ['hu', 'fu'],
  'fu': ['fu', 'hu'],
  'zi': ['zi', 'ji'],
  'ji': ['ji', 'zi'],
  
  // 拗音
  'sya': ['sya', 'sha'],
  'sha': ['sha', 'sya'],
  'syu': ['syu', 'shu'],
  'shu': ['shu', 'syu'],
  'syo': ['syo', 'sho'],
  'sho': ['sho', 'syo'],
  
  'tya': ['tya', 'cha'],
  'cha': ['cha', 'tya'],
  'tyu': ['tyu', 'chu'],
  'chu': ['chu', 'tyu'],
  'tyo': ['tyo', 'cho'],
  'cho': ['cho', 'tyo'],
  
  'zya': ['zya', 'ja', 'jya'],
  'ja': ['ja', 'zya', 'jya'],
  'jya': ['jya', 'ja', 'zya'],
  'zyu': ['zyu', 'ju', 'jyu'],
  'ju': ['ju', 'zyu', 'jyu'],
  'jyu': ['jyu', 'ju', 'zyu'],
  'zyo': ['zyo', 'jo', 'jyo'],
  'jo': ['jo', 'zyo', 'jyo'],
  'jyo': ['jyo', 'jo', 'zyo'],
  
  // づ/ず
  'du': ['du', 'zu'],
  'zu': ['zu', 'du'],
  
  // 長音（ハイフン対応）
  '-': ['-', 'ー'],
  'ー': ['ー', '-'],
};

// 次の入力文字が有効かチェック
export function canTypeNextChar(romaji: string, typed: string, char: string): boolean {
  const lower = char.toLowerCase();
  const remaining = romaji.toLowerCase().substring(typed.length);
  
  if (remaining.length === 0) return false;
  
  // 直接一致
  if (remaining[0] === lower) {
    return true;
  }
  
  // ハイフンで長音を入力
  if (lower === '-' && remaining[0] === 'a' && typed.length > 0) {
    // 長音として許可（例: ra-men → raamen）
    const lastChar = typed[typed.length - 1]?.toLowerCase();
    if (lastChar === remaining[0]) {
      return true;
    }
  }
  
  // 代替入力パターンをチェック
  // 現在の入力位置から始まる代替パターンを探す
  for (let len = 3; len >= 2; len--) {
    const chunk = remaining.substring(0, len);
    if (charAlternatives[chunk]) {
      for (const alt of charAlternatives[chunk]) {
        if (alt[0] === lower) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// 入力を受け入れて次の状態を返す
export function processInput(
  romaji: string, 
  currentInput: string, 
  char: string
): { accepted: boolean; newInput: string; completed: boolean } {
  const lower = char.toLowerCase();
  const inputPos = currentInput.length;
  const remaining = romaji.toLowerCase().substring(inputPos);
  
  if (remaining.length === 0) {
    return { accepted: false, newInput: currentInput, completed: true };
  }
  
  // 直接一致
  if (remaining[0] === lower) {
    const newInput = currentInput + lower;
    return { 
      accepted: true, 
      newInput, 
      completed: newInput.length >= romaji.length 
    };
  }
  
  // ハイフンで長音を入力（連続する母音を1つのハイフンで代替）
  if (lower === '-') {
    // 例: "raamen" の位置で、前が 'a' で次も 'a' なら、ハイフンで代替可能
    if (inputPos > 0) {
      const prevChar = currentInput[inputPos - 1]?.toLowerCase();
      if (remaining[0] === prevChar && 'aeiou'.includes(prevChar)) {
        const newInput = currentInput + prevChar; // 内部的には正しい文字を追加
        return {
          accepted: true,
          newInput,
          completed: newInput.length >= romaji.length
        };
      }
    }
  }
  
  // 代替入力パターンをチェック
  for (let len = 3; len >= 2; len--) {
    const standardChunk = remaining.substring(0, len);
    if (charAlternatives[standardChunk]) {
      for (const alt of charAlternatives[standardChunk]) {
        // 今入力しようとしている文字が代替パターンの先頭と一致するか
        if (alt[0] === lower) {
          // 代替パターンを使って入力を進める
          const newInput = currentInput + lower;
          // 完了チェック: 代替パターンの長さ分進んだかどうか
          // 簡易的に文字数で判定
          return {
            accepted: true,
            newInput,
            completed: false // 完了判定は別途行う
          };
        }
      }
    }
  }
  
  return { accepted: false, newInput: currentInput, completed: false };
}

// 単語が完成したかチェック（柔軟な判定）
export function isWordComplete(romaji: string, input: string): boolean {
  // 正規化して比較
  const normalizedRomaji = normalizeRomaji(romaji);
  const normalizedInput = normalizeRomaji(input);
  
  return normalizedInput === normalizedRomaji;
}

// ローマ字を正規化（代替入力を標準形式に変換）
function normalizeRomaji(text: string): string {
  let result = text.toLowerCase();
  
  // 代替入力を標準形式に変換
  const replacements: [string, string][] = [
    ['shi', 'si'],
    ['chi', 'ti'],
    ['tsu', 'tu'],
    ['fu', 'hu'],
    ['ji', 'zi'],
    ['sha', 'sya'],
    ['shu', 'syu'],
    ['sho', 'syo'],
    ['cha', 'tya'],
    ['chu', 'tyu'],
    ['cho', 'tyo'],
    ['ja', 'zya'],
    ['ju', 'zyu'],
    ['jo', 'zyo'],
  ];
  
  for (const [from, to] of replacements) {
    result = result.split(from).join(to);
  }
  
  return result;
}
