(function () {
  if (window.__pginternalsSessionBlockquotesEnhanced) return;
  window.__pginternalsSessionBlockquotesEnhanced = true;

  const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  function toRoman(number) {
    return romanNumerals[number] || String(number);
  }

  function sessionDepth(blockquote) {
    let depth = 1;
    let parent = blockquote.parentElement ? blockquote.parentElement.closest("blockquote") : null;

    while (parent) {
      depth += 1;
      parent = parent.parentElement ? parent.parentElement.closest("blockquote") : null;
    }

    return depth;
  }

  function enhanceSessionBlockquotes() {
    const blocks = Array.from(document.querySelectorAll(".content blockquote"))
      .filter((block) => block.querySelector("pre, .highlight"));

    blocks.forEach((block) => {
      if (block.classList.contains("session-blockquote")) return;

      const depth = sessionDepth(block);

      block.classList.add("session-blockquote");
      block.dataset.sessionMarker = toRoman(depth);
      block.dataset.sessionLabel = `会话 ${toRoman(depth)}`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceSessionBlockquotes, { once: true });
  } else {
    enhanceSessionBlockquotes();
  }
})();
