const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

module.exports = ({ meta, config, managers, cache }) => {
  // Create a Redis client using the existing function from managers
  const redis = managers.cache;

  // Configure rate limiter with Redis store
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 minute (for testing)
    max: 100, // Limit each IP to 1 request per windowMs (for testing)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ...(redis && {
      store: new RedisStore({
        sendCommand: (...args) => redis.sendCommand(args), // Use the existing Redis client
      }),
    }),
    handler: (req, res) => {
      res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    },
  });

  // Return the middleware function
  return (req, res, next) => {
    limiter(req, res, next); // Correctly invoke the rate limiter
  };
};
