// backend/utils/profanityFilter.js
// Danh sách từ ngữ thô tục cần lọc (tiếng Việt)
const PROFANITY_WORDS = [
  // Từ ngữ thô tục cơ bản
  'địt', 'đụ', 'đéo', 'đcm', 'đcmn', 'đcmnl', 'đcmnd', 'đcmnđ', 'đcmnđm', 'đcmnđụ',
  'đcmnđịt', 'đcmnđéo', 'đcmnđcm', 'đcmnđcmn', 'đcmnđcmnl', 'đcmnđcmnd', 'đcmnđcmnđ',
  'đcmnđcmnđm', 'đcmnđcmnđụ', 'đcmnđcmnđịt', 'đcmnđcmnđéo', 'đcmnđcmnđcm',
  'đcmnđcmnđcmn', 'đcmnđcmnđcmnl', 'đcmnđcmnđcmnd', 'đcmnđcmnđcmnđ',
  'đcmnđcmnđcmnđm', 'đcmnđcmnđcmnđụ', 'đcmnđcmnđcmnđịt', 'đcmnđcmnđcmnđéo',
  
  // Từ ngữ xúc phạm
  'khốn', 'khốn nạn', 'đồ khốn', 'đồ khốn nạn', 'đồ chó', 'đồ chó má', 'đồ chó đẻ',
  'đồ chó chết', 'đồ chó chết tiệt', 'đồ chó chết mẹ', 'đồ chó chết cha',
  'đồ chó chết ông', 'đồ chó chết bà', 'đồ chó chết cô', 'đồ chó chết chú',
  'đồ chó chết dì', 'đồ chó chết cậu', 'đồ chó chết mợ', 'đồ chó chết dượng',
  
  // Từ ngữ tục tĩu
  'lồn', 'cặc', 'buồi', 'dái', 'đít', 'đít', 'lồn', 'cặc', 'buồi', 'dái',
  'đít', 'đít', 'lồn', 'cặc', 'buồi', 'dái', 'đít', 'đít',
  
  // Từ ngữ xúc phạm gia đình
  'mẹ mày', 'cha mày', 'ông mày', 'bà mày', 'cô mày', 'chú mày', 'dì mày',
  'cậu mày', 'mợ mày', 'dượng mày', 'anh mày', 'chị mày', 'em mày',
  
  // Từ ngữ xúc phạm khác
  'đồ ngu', 'đồ dốt', 'đồ ngu dốt', 'đồ ngu si', 'đồ ngu đần', 'đồ ngu độn',
  'đồ ngu ngốc', 'đồ ngu ngốc', 'đồ ngu ngốc', 'đồ ngu ngốc'
];

// Hàm kiểm tra và lọc từ ngữ thô tục
function checkProfanity(text) {
  if (!text || typeof text !== 'string') {
    return { hasProfanity: false, foundWords: [] };
  }

  const lowerText = text.toLowerCase();
  const foundWords = [];

  PROFANITY_WORDS.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  });

  return {
    hasProfanity: foundWords.length > 0,
    foundWords: foundWords
  };
}

// Hàm lọc và thay thế từ ngữ thô tục
function filterProfanity(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let filteredText = text;
  PROFANITY_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });

  return filteredText;
}

module.exports = {
  checkProfanity,
  filterProfanity,
  PROFANITY_WORDS
};
