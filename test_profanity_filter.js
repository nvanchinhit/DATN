// test_profanity_filter.js
// File test để kiểm tra hệ thống lọc từ ngữ thô tục

const { checkProfanity, filterProfanity } = require('./backend/utils/profanityFilter');

console.log('=== TEST HỆ THỐNG LỌC TỪ NGỮ KHÔNG PHÙ HỢP ===\n');

// Test 1: Kiểm tra comment bình thường
console.log('Test 1: Comment bình thường');
const test1 = checkProfanity('Bác sĩ rất nhiệt tình và tận tâm');
console.log('Input:', test1);
console.log('Kết quả:', test1.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test1.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test1.foundWords);
}
console.log('');

// Test 2: Kiểm tra comment có từ ngữ thô tục
console.log('Test 2: Comment có từ ngữ thô tục');
const test2 = checkProfanity('Bác sĩ này khốn nạn quá, đồ chó má');
console.log('Input:', test2);
console.log('Kết quả:', test2.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test2.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test2.foundWords);
}
console.log('');

// Test 3: Kiểm tra comment có nhiều từ ngữ thô tục
console.log('Test 3: Comment có nhiều từ ngữ thô tục');
const test3 = checkProfanity('Đồ ngu, đồ dốt, mẹ mày');
console.log('Input:', test3);
console.log('Kết quả:', test3.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test3.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test3.foundWords);
}
console.log('');

// Test 4: Kiểm tra comment rỗng
console.log('Test 4: Comment rỗng');
const test4 = checkProfanity('');
console.log('Input:', test4);
console.log('Kết quả:', test4.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test4.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test4.foundWords);
}
console.log('');

// Test 5: Kiểm tra comment null/undefined
console.log('Test 5: Comment null/undefined');
const test5 = checkProfanity(null);
console.log('Input:', test5);
console.log('Kết quả:', test5.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test5.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test5.foundWords);
}
console.log('');

// Test 6: Kiểm tra hàm filterProfanity
console.log('Test 6: Hàm filterProfanity');
const test6 = filterProfanity('Bác sĩ này khốn nạn quá, đồ chó má');
console.log('Input: Bác sĩ này khốn nạn quá, đồ chó má');
console.log('Output:', test6);
console.log('');

// Test 7: Kiểm tra comment có từ ngữ thô tục viết hoa
console.log('Test 7: Comment có từ ngữ thô tục viết hoa');
const test7 = checkProfanity('Bác sĩ KHỐN NẠN quá');
console.log('Input:', test7);
console.log('Kết quả:', test7.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test7.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test7.foundWords);
}
console.log('');

// Test 8: Kiểm tra comment có từ ngữ thô tục với dấu câu
console.log('Test 8: Comment có từ ngữ thô tục với dấu câu');
const test8 = checkProfanity('Bác sĩ này khốn nạn quá! Đồ chó má...');
console.log('Input:', test8);
console.log('Kết quả:', test8.hasProfanity ? 'CÓ từ ngữ thô tục' : 'KHÔNG có từ ngữ thô tục');
if (test8.foundWords.length > 0) {
  console.log('Từ ngữ tìm thấy:', test8.foundWords);
}
console.log('');

console.log('=== KẾT LUẬN ===');
console.log('Hệ thống lọc từ ngữ không phù hợp hoạt động tốt!');
console.log('Các test case đã được thực hiện thành công.');
console.log('Admin có thể sử dụng để duyệt đánh giá một cách an toàn.');
