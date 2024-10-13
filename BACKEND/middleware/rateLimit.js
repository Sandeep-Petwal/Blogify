const rateLimit = require('express-rate-limit');

// rate limiter middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 20, // Limit each IP
    standardHeaders: true, 
    legacyHeaders: false,
});



// rate limit for auth routes
const authLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5, 
    standardHeaders: true, 
    legacyHeaders: false, 
});


module.exports = { limiter, authLimit };