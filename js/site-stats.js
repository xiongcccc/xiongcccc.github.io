(function () {
  if (window.__pginternalsSiteStatsLoaded) return;
  window.__pginternalsSiteStatsLoaded = true;

  function loadBusuanzi() {
    if (!document.querySelector("[id^='busuanzi_container_']")) return;
    if (document.querySelector("script[data-site-stats='busuanzi']")) return;

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.dataset.siteStats = "busuanzi";
    script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    document.body.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadBusuanzi, { once: true });
  } else {
    loadBusuanzi();
  }
})();
