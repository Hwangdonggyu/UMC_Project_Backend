const crypto = require('crypto');

// session secrect key
// 실행 시 랜덤한 32바이트 길이의 난수로 생성
const randomBytes = crypto.randomBytes(32);
const COOKIE_SECRET = randomBytes.toString('hex');

console.log('Generated COOKIE_SECRET:', COOKIE_SECRET);
