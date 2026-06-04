/**
 * Vercel Speed Insights initialization
 * This script initializes Speed Insights for tracking web vitals
 */
(function() {
  // Initialize the queue for Speed Insights
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };
  
  // Inject the Speed Insights script
  var script = document.createElement('script');
  script.src = '/_vercel/speed-insights/script.js';
  script.defer = true;
  script.dataset.sdkn = '@vercel/speed-insights';
  script.dataset.sdkv = '2.0.0';
  
  script.onerror = function() {
    console.log('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled.');
  };
  
  document.head.appendChild(script);
})();
