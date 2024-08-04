
// function fitElementToParent(el, padding) {
//   let timeout = null;

//   function resize() {
//     if (timeout) clearTimeout(timeout);
//     anime.set(el, { scale: 1 });
//     let pad = padding || 0;
//     let parentEl = el.parentNode;
//     let elOffsetWidth = el.offsetWidth - pad;
//     let parentOffsetWidth = parentEl.offsetWidth;
//     let ratio = parentOffsetWidth / elOffsetWidth;
//     timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
//   }

//   resize();
//   window.addEventListener("resize", resize);
// }


