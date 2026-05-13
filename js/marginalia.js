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

  function placePopover(note) {
    if (!note) return;

    const viewportGap = 12;
    const arrowGap = 10;
    const sideGap = 14;
    const noteRect = note.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const preferSideNote = !coarsePointer && window.innerWidth >= 1100;

    if (preferSideNote) {
      const rightSpace = window.innerWidth - noteRect.right - viewportGap;
      const leftSpace = noteRect.left - viewportGap;
      const placeRight = rightSpace >= popoverRect.width + sideGap || rightSpace >= leftSpace;
      const placement = placeRight ? "right" : "left";
      let left = placeRight
        ? noteRect.right + sideGap
        : noteRect.left - popoverRect.width - sideGap;

      left = Math.max(viewportGap, Math.min(left, window.innerWidth - popoverRect.width - viewportGap));

      let top = noteRect.top + noteRect.height / 2 - 20;
      top = Math.max(viewportGap, Math.min(top, window.innerHeight - popoverRect.height - viewportGap));

      const arrowTop = noteRect.top + noteRect.height / 2 - top;

      popover.dataset.placement = placement;
      popover.style.left = `${Math.round(left)}px`;
      popover.style.top = `${Math.round(top)}px`;
      popover.style.removeProperty("--marginalia-arrow-left");
      popover.style.setProperty("--marginalia-arrow-top", `${Math.round(arrowTop)}px`);
      return;
    }

    const canPlaceBelow = window.innerHeight - noteRect.bottom >= popoverRect.height + arrowGap + viewportGap;
    const placeBelow = canPlaceBelow || noteRect.top < popoverRect.height + arrowGap + viewportGap;
    const placement = placeBelow ? "bottom" : "top";

    let left = noteRect.left + noteRect.width / 2 - popoverRect.width / 2;
    left = Math.max(viewportGap, Math.min(left, window.innerWidth - popoverRect.width - viewportGap));

    const top = placeBelow
      ? noteRect.bottom + arrowGap
      : noteRect.top - popoverRect.height - arrowGap;
    const arrowLeft = noteRect.left + noteRect.width / 2 - left;

    popover.dataset.placement = placement;
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(Math.max(viewportGap, top))}px`;
    popover.style.setProperty("--marginalia-arrow-left", `${Math.round(arrowLeft)}px`);
    popover.style.removeProperty("--marginalia-arrow-top");
  }

  function showPopover(note) {
    if (!note) return;

    if (activeNote && activeNote !== note) {
      activeNote.classList.remove("is-open");
      activeNote.setAttribute("aria-expanded", "false");
      activeNote.removeAttribute("aria-describedby");
    }

    activeNote = note;
    popover.textContent = note.dataset.note || "";
    note.classList.add("is-open");
    note.setAttribute("aria-expanded", "true");
    note.setAttribute("aria-describedby", popover.id);
    placePopover(note);
    popover.classList.add("is-visible");
  }

  function hidePopover() {
    if (!activeNote) return;

    activeNote.classList.remove("is-open");
    activeNote.setAttribute("aria-expanded", "false");
    activeNote.removeAttribute("aria-describedby");
    activeNote = null;
    popover.classList.remove("is-visible");
  }

  notes.forEach((note, index) => {
    note.tabIndex = 0;
    note.setAttribute("role", "button");
    note.setAttribute("aria-expanded", "false");
    note.setAttribute("aria-label", `旁注：${note.dataset.note || ""}`);
    note.dataset.marginaliaId = String(index + 1);

    note.addEventListener("mouseenter", () => {
      if (!coarsePointer) showPopover(note);
    });

    note.addEventListener("mouseleave", () => {
      if (!coarsePointer) hidePopover();
    });

    note.addEventListener("focus", () => {
      if (!coarsePointer) showPopover(note);
    });

    note.addEventListener("blur", () => {
      if (!coarsePointer) hidePopover();
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
        note.blur();
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

  window.addEventListener("scroll", () => placePopover(activeNote), { passive: true });
  window.addEventListener("resize", () => placePopover(activeNote));
})();
