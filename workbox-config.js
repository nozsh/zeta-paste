module.exports = {
  cacheId: "cache-v1",
  globDirectory: "public/", // Output dir
  globPatterns: ["**/*.{html,js,css,json,ico,png,jpg,svg}"],
  swDest: "public/service-worker.js", // Where Service Worker be saved
  runtimeCaching: [
    {
      urlPattern: /\/paste\//, // Pattern for caching
      handler: "StaleWhileRevalidate", // Caching strategy
      // handler: "NetworkFirst", // Caching strategy
      // handler: "CacheFirst", // Caching strategy
    },
  ],
  skipWaiting: true, // Immediate activation of new Service Worker
  clientsClaim: true, // Take control of all open tabs (clients) right away
  cleanupOutdatedCaches: true, // Automatic removal of outdated caches
  sourcemap: false,
};
