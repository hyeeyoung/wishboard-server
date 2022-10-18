const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  // 1초에 10개의 요청만 가능하도록
  windowMs: 60000, // 1초, 60 * 1000
  max: 10,
  delayMs: 1000,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many accounts created from this IP',
});

module.exports = limiter;
