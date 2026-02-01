// ローマ字の複数入力対応マップ
// 同じ日本語に対して複数の入力方法を許容する

// 基本的なローマ字変換の代替パターン
export const romajiVariants: Record<string, string[]> = {
  // し行
  'shi': ['shi', 'si'],
  'sha': ['sha', 'sya'],
  'shu': ['shu', 'syu'],
  'sho': ['sho', 'syo'],
  
  // ち行
  'chi': ['chi', 'ti'],
  'cha': ['cha', 'tya', 'cya'],
  'chu': ['chu', 'tyu', 'cyu'],
  'cho': ['cho', 'tyo', 'cyo'],
  
  // つ
  'tsu': ['tsu', 'tu'],
  
  // ふ
  'fu': ['fu', 'hu'],
  
  // じ行
  'ji': ['ji', 'zi'],
  'ja': ['ja', 'zya', 'jya'],
  'ju': ['ju', 'zyu', 'jyu'],
  'jo': ['jo', 'zyo', 'jyo'],
  
  // ず/づ
  'zu': ['zu', 'du'],
  
  // ん (次の文字によって n, nn が必要)
  'n': ['n', 'nn'],
  
  // 小さい文字
  'xtu': ['xtu', 'ltu', 'xtsu', 'ltsu'],
  
  // その他
  'wo': ['wo', 'o'],
};

// 入力文字列が期待するローマ字にマッチするかチェック
// 複数の入力方法を許容する
export function matchesRomaji(expected: string, input: string): { matches: boolean; consumed: number } {
  const lowerExpected = expected.toLowerCase();
  const lowerInput = input.toLowerCase();
  
  // 完全一致チェック
  if (lowerExpected.startsWith(lowerInput)) {
    return { matches: true, consumed: lowerInput.length };
  }
  
  // 代替パターンをチェック
  for (const [standard, variants] of Object.entries(romajiVariants)) {
    if (lowerExpected.startsWith(standard)) {
      for (const variant of variants) {
        if (variant.startsWith(lowerInput) || lowerInput.startsWith(variant)) {
          // 入力が代替パターンの一部または完全一致
          if (lowerInput.length <= variant.length) {
            return { matches: true, consumed: lowerInput.length };
          }
        }
      }
    }
  }
  
  return { matches: false, consumed: 0 };
}

// 次に期待される文字をチェック（複数の入力方法を考慮）
export function isValidNextChar(romaji: string, currentInput: string, nextChar: string): boolean {
  const remaining = romaji.slice(currentInput.length).toLowerCase();
  const char = nextChar.toLowerCase();
  
  // 直接マッチ
  if (remaining.startsWith(char)) {
    return true;
  }
  
  // 代替パターンをチェック
  const fullInput = currentInput.toLowerCase() + char;
  
  // 各代替パターンをチェック
  for (const [standard, variants] of Object.entries(romajiVariants)) {
    // 期待するローマ字の中にこのパターンがあるか
    const standardPos = romaji.toLowerCase().indexOf(standard);
    if (standardPos !== -1) {
      for (const variant of variants) {
        // 現在の入力位置がこのパターンの範囲内か
        const variantStart = standardPos;
        const inputPos = currentInput.length;
        
        if (inputPos >= variantStart && inputPos < variantStart + variant.length) {
          // この位置で代替パターンが使えるか
          const expectedInVariant = variant[inputPos - variantStart];
          if (expectedInVariant === char) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

// 単語全体の入力を検証し、正規化された入力を返す
export function validateAndNormalizeInput(
  romaji: string,
  input: string
): { valid: boolean; normalizedLength: number } {
  let romajiPos = 0;
  let inputPos = 0;
  
  while (inputPos < input.length && romajiPos < romaji.length) {
    const remainingRomaji = romaji.slice(romajiPos).toLowerCase();
    const inputChar = input[inputPos].toLowerCase();
    
    // 直接マッチ
    if (remainingRomaji[0] === inputChar) {
      romajiPos++;
      inputPos++;
      continue;
    }
    
    // 代替パターンをチェック
    let found = false;
    for (const [standard, variants] of Object.entries(romajiVariants)) {
      if (remainingRomaji.startsWith(standard)) {
        for (const variant of variants) {
          if (variant[0] === inputChar) {
            // この代替パターンを使用
            const variantRemaining = input.slice(inputPos).toLowerCase();
            if (variantRemaining.startsWith(variant) || variant.startsWith(variantRemaining)) {
              // 代替パターンの長さだけ進む
              const matchLen = Math.min(variant.length, input.length - inputPos);
              const inputPart = input.slice(inputPos, inputPos + matchLen).toLowerCase();
              if (variant.startsWith(inputPart)) {
                if (inputPart.length === variant.length) {
                  romajiPos += standard.length;
                }
                inputPos += matchLen;
                found = true;
                break;
              }
            }
          }
        }
        if (found) break;
      }
    }
    
    if (!found) {
      return { valid: false, normalizedLength: romajiPos };
    }
  }
  
  return { valid: true, normalizedLength: romajiPos };
}

// シンプルな文字チェック: 現在の入力に対して次の文字が有効か
export function canTypeNextChar(romaji: string, typed: string, char: string): boolean {
  const lower = char.toLowerCase();
  const remaining = romaji.toLowerCase().substring(typed.length);
  
  // 直接一致
  if (remaining.startsWith(lower)) {
    return true;
  }
  
  // 代替入力チェック
  // shi -> si, chi -> ti, tsu -> tu, fu -> hu, ji -> zi
  const alternatives: [string, string][] = [
    ['shi', 'si'], ['si', 'shi'],
    ['sha', 'sya'], ['sya', 'sha'],
    ['shu', 'syu'], ['syu', 'shu'],
    ['sho', 'syo'], ['syo', 'sho'],
    ['chi', 'ti'], ['ti', 'chi'],
    ['cha', 'tya'], ['tya', 'cha'],
    ['chu', 'tyu'], ['tyu', 'chu'],
    ['cho', 'tyo'], ['tyo', 'cho'],
    ['tsu', 'tu'], ['tu', 'tsu'],
    ['fu', 'hu'], ['hu', 'fu'],
    ['ji', 'zi'], ['zi', 'ji'],
    ['ja', 'zya'], ['zya', 'ja'],
    ['ju', 'zyu'], ['zyu', 'ju'],
    ['jo', 'zyo'], ['zyo', 'jo'],
    ['zu', 'du'], ['du', 'zu'],
  ];
  
  // 現在位置から代替パターンを探す
  for (const [from, to] of alternatives) {
    if (remaining.startsWith(from)) {
      // fromの位置にいる場合、toの対応する文字も許可
      const posInFrom = 0; // 常に先頭から
      if (posInFrom < to.length && to[posInFrom] === lower) {
        return true;
      }
    }
  }
  
  return false;
}

// 入力を受け入れて、対応するローマ字の進行位置を返す
export function acceptInput(romaji: string, typed: string, char: string): { accepted: boolean; newTyped: string; romajiProgress: number } {
  const lower = char.toLowerCase();
  const currentPos = typed.length;
  const remaining = romaji.toLowerCase().substring(currentPos);
  
  // 直接一致
  if (remaining.startsWith(lower)) {
    return { 
      accepted: true, 
      newTyped: typed + lower,
      romajiProgress: currentPos + 1
    };
  }
  
  // 代替入力チェック
  const alternatives: [string, string][] = [
    ['shi', 'si'], ['sha', 'sya'], ['shu', 'syu'], ['sho', 'syo'],
    ['chi', 'ti'], ['cha', 'tya'], ['chu', 'tyu'], ['cho', 'tyo'],
    ['tsu', 'tu'], ['fu', 'hu'],
    ['ji', 'zi'], ['ja', 'zya'], ['ju', 'zyu'], ['jo', 'zyo'],
    ['zu', 'du'],
  ];
  
  for (const [standard, alt] of alternatives) {
    if (remaining.startsWith(standard)) {
      // 代替入力の先頭文字と一致するかチェック
      if (alt.startsWith(lower)) {
        return {
          accepted: true,
          newTyped: typed + lower,
          romajiProgress: currentPos + 1
        };
      }
    }
  }
  
  return { accepted: false, newTyped: typed, romajiProgress: currentPos };
}
