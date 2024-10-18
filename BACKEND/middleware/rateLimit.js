const rateLimit = require('express-rate-limit');

// rate limiter middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // time in ms (1 min)
    max: 100, // Limit each IP
    standardHeaders: true, 
    legacyHeaders: false,
});

// rate limit for auth routes
const authLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50, 
    standardHeaders: true,                  
    legacyHeaders: false, 
});


module.exports = { limiter, authLimit };
