(function () {
  if (window.__pginternalsMarginaliaEnhanced) return;
  window.__pginternalsMarginaliaEnhanced = true;

  const notes = Array.from(document.querySelectorAll(".marginalia[data-note]"));
  if (!notes.length) return;

  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const popover = document.createElement("span");
  let activeNote = null;

  document.body.classList.add("marginalia-enhanced");
  popover.className = "marginalia-popover";
  popover.id = "marginalia-popover";
  popover.setAttribute("role", "tooltip");
  document.body.appendChild(popover);

  function readingArea() {
    const viewport = window.visualViewport;
    const area = {
      top: viewport ? viewport.offsetTop : 0,
      left: viewport ? viewport.offsetLeft : 0,
      right: viewport ? viewport.offsetLeft + viewport.width : window.innerWidth,
      bottom: viewport ? viewport.offsetTop + viewport.height : window.innerHeight,
    };
    const header = document.querySelector(".nav-container");
    if (header && ["sticky", "fixed"].includes(getComputedStyle(header).position)) {
      const rect = header.getBoundingClientRect();
      if (rect.top <= area.top && rect.bottom > area.top) area.top = rect.bottom;
    }
    return area;
  }

  function describeNote(note, open) {
    const ids = (note.getAttribute("aria-describedby") || "").split(/\s+/)
      .filter((id) => id && id !== popover.id);
    if (open) ids.push(popover.id);
    if (ids.length) note.setAttribute("aria-describedby", ids.join(" "));
    else note.removeAttribute("aria-describedby");
  }

  function placePopover(note) {
    if (!note) return false;

    const area = readingArea();
    // Inline notes can wrap: at least one text fragment must remain readable.
    const visible = Array.from(note.getClientRects()).some((rect) =>
      rect.width > 0 && rect.height > 0 && rect.bottom > area.top &&
      rect.top < area.bottom && rect.right > area.left && rect.left < area.right);
    if (!visible) {
      hidePopover();
      return false;
    }
    const viewportGap = 12;
    const arrowGap = 10;
    const sideGap = 14;
    const noteRect = note.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const minTop = area.top + viewportGap;
    const maxTop = area.bottom - popoverRect.height - viewportGap;
    if (maxTop < minTop) {
      hidePopover();
      return false;
    }
    const preferSideNote = !coarsePointer && window.innerWidth >= 1100;

    if (preferSideNote) {
      const rightSpace = area.right - noteRect.right - viewportGap;
      const leftSpace = noteRect.left - area.left - viewportGap;
      const placeRight = rightSpace >= popoverRect.width + sideGap || rightSpace >= leftSpace;
      const placement = placeRight ? "right" : "left";
      let left = placeRight
        ? noteRect.right + sideGap
        : noteRect.left - popoverRect.width - sideGap;

      left = Math.max(area.left + viewportGap, Math.min(left, area.right - popoverRect.width - viewportGap));

      let top = noteRect.top + noteRect.height / 2 - 20;
      top = Math.max(minTop, Math.min(top, maxTop));

      const arrowTop = noteRect.top + noteRect.height / 2 - top;

      popover.dataset.placement = placement;
      popover.style.left = `${Math.round(left)}px`;
      popover.style.top = `${Math.round(top)}px`;
      popover.style.removeProperty("--marginalia-arrow-left");
      popover.style.setProperty("--marginalia-arrow-top", `${Math.round(arrowTop)}px`);
      return true;
    }

    const canPlaceBelow = area.bottom - noteRect.bottom >= popoverRect.height + arrowGap + viewportGap;
    const placeBelow = canPlaceBelow || noteRect.top - area.top < popoverRect.height + arrowGap + viewportGap;
    const placement = placeBelow ? "bottom" : "top";

    let left = noteRect.left + noteRect.width / 2 - popoverRect.width / 2;
    left = Math.max(area.left + viewportGap, Math.min(left, area.right - popoverRect.width - viewportGap));

    const top = placeBelow
      ? noteRect.bottom + arrowGap
      : noteRect.top - popoverRect.height - arrowGap;
    const arrowLeft = noteRect.left + noteRect.width / 2 - left;

    popover.dataset.placement = placement;
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(Math.max(minTop, Math.min(top, maxTop)))}px`;
    popover.style.setProperty("--marginalia-arrow-left", `${Math.round(arrowLeft)}px`);
    popover.style.removeProperty("--marginalia-arrow-top");
    return true;
  }

  function showPopover(note) {
    if (!note) return;

    if (activeNote && activeNote !== note) {
      activeNote.classList.remove("is-open");
      activeNote.setAttribute("aria-expanded", "false");
      describeNote(activeNote, false);
    }

    activeNote = note;
    popover.textContent = note.dataset.note || "";
    note.classList.add("is-open");
    note.setAttribute("aria-expanded", "true");
    describeNote(note, true);
    if (placePopover(note)) popover.classList.add("is-visible");
  }

  function hidePopover() {
    if (!activeNote) return;

    activeNote.classList.remove("is-open");
    activeNote.setAttribute("aria-expanded", "false");
    describeNote(activeNote, false);
    activeNote = null;
    popover.classList.remove("is-visible");
  }

  notes.forEach((note, index) => {
    note.tabIndex = 0;
    note.setAttribute("role", "button");
    note.setAttribute("aria-expanded", "false");
    note.dataset.marginaliaId = String(index + 1);

    note.addEventListener("mouseenter", () => {
      if (!coarsePointer) showPopover(note);
    });

    note.addEventListener("mouseleave", () => {
      if (!coarsePointer && document.activeElement !== note) hidePopover();
    });

    note.addEventListener("focus", () => {
      if (!coarsePointer) showPopover(note);
    });

    note.addEventListener("blur", () => {
      if (activeNote === note) hidePopover();
    });

    note.addEventListener("click", (event) => {
      if (!coarsePointer) return;

      event.preventDefault();
      event.stopPropagation();

      if (activeNote === note) {
        hidePopover();
      } else {
        showPopover(note);
      }
    });

    note.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hidePopover();
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      if (activeNote === note) {
        hidePopover();
      } else {
        showPopover(note);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!coarsePointer || !activeNote) return;
    if (event.target.closest(".marginalia")) return;
    hidePopover();
  });

  window.addEventListener("scroll", () => placePopover(activeNote), { passive: true, capture: true });
  window.addEventListener("resize", () => placePopover(activeNote));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", () => placePopover(activeNote), { passive: true });
    window.visualViewport.addEventListener("resize", () => placePopover(activeNote));
  }
})();
