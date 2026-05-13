(function () {
  if (window.__pginternalsSiteStatsLoaded) return;
  window.__pginternalsSiteStatsLoaded = true;

  function createStatsElement() {
    const stats = document.createElement("div");
    stats.className = "site-visit-stats";
    stats.setAttribute("aria-label", "访问统计");
    stats.innerHTML = [
      '<span id="busuanzi_container_site_pv" class="site-visit-stat">总访问量 <span id="busuanzi_value_site_pv">--</span> 次</span>',
      '<span id="busuanzi_container_site_uv" class="site-visit-stat">访客数 <span id="busuanzi_value_site_uv">--</span> 人</span>',
      '<span id="busuanzi_container_page_pv" class="site-visit-stat">本页阅读 <span id="busuanzi_value_page_pv">--</span> 次</span>'
    ].join("");
    return stats;
  }

  function injectStats() {
    if (document.querySelector(".site-visit-stats")) return true;

    const footer = document.querySelector("footer.hextra-footer");
    if (!footer) return false;

    const copyright = footer.querySelector(".hx-text-xs");
    const stats = createStatsElement();

    if (copyright && copyright.parentElement) {
      copyright.parentElement.insertBefore(stats, copyright);
    } else {
      footer.appendChild(stats);
    }

    return true;
  }

  function loadBusuanzi() {
    if (!injectStats()) return;
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
