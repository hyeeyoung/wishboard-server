const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  // 1초에 1개의 요청만 가능하도록
  windowMs: 1000, // 1초 ... 15 * 60 * 1000 15분
  max: 1,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many accounts created from this IP',
});

module.exports = limiter;
