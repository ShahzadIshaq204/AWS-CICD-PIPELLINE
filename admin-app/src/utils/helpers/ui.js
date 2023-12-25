export function toggleFullscreen() {
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

export function toggleMobileSidebar() {
  var body = document.body;
  if (window.screen.width <= 998) {
    body.classList.toggle("sidebar-enable");
  } else {
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }
}

export function scrollElement(item, ref) {
  if (item && ref && ref.current) {
    const currentPosition = item.offsetTop;
    if (currentPosition > window.innerHeight) {
      ref.current.getScrollElement().scrollTop = currentPosition - 300;
    }
  }
}

export function activateParentDropdown(item, ref) {
  if (!item || !(ref && ref.current)) return;

  item.classList.add("active");
  const parent = item.parentElement;
  const parent2El = parent.childNodes[1];
  if (parent2El && parent2El.id !== "side-menu") {
    parent2El.classList.add("mm-show");
  }

  if (parent) {
    parent.classList.add("mm-active");
    const parent2 = parent.parentElement;

    if (parent2) {
      parent2.classList.add("mm-show"); // ul tag

      const parent3 = parent2.parentElement; // li tag

      if (parent3) {
        parent3.classList.add("mm-active"); // li
        parent3.childNodes[0].classList.add("mm-active"); //a
        const parent4 = parent3.parentElement; // ul
        if (parent4) {
          parent4.classList.add("mm-show"); // ul
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("mm-show"); // li
            parent5.childNodes[0].classList.add("mm-active"); // a tag
          }
        }
      }
    }
    scrollElement(item, ref);
    return false;
  }
  scrollElement(item, ref);
  return false;
}
