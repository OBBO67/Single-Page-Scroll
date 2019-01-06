// scroll type constants
const SCROLL_DOWN = "scroll_down";
const SCROLL_UP = "scroll_up";

// debounce function to stop events from firing too much
// Taken from: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait = 40, immediate = true) {
  var timeout;
  return function() {
    var context = this,
      args = arguments; // the args supplied to the func
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    // create new timeout with later func and the wait time
    // overwrites the value which persists over multiple functions
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// throttle function to limit calls to scroll event
// taken from: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
function throttle(func, limit = 1000) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// animation easing function
function easeInQuart(t, b, c, d) {
  t /= d;
  return c * t * t * t * t + b;
}

// animation handler
function animationHandler(currentTime) {
  if (startTime === null) {
    startTime = currentTime;
  }
  let timePassed = currentTime - startTime;
  let animate = easeInQuart(timePassed);

  requestAnimationFrame(animationHandler);
}

// function to handle the scrolling down or up
function scrollHandler(scrollType) {
  let translation = 0;
  if (scrollType == SCROLL_DOWN) {
    // moving down to next page
    ++currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation >= 100) {
      // never actually moved a page if in here
      --currPage;
      return;
    }
    pageContainer.style.transition = `transform 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 0.5)`;
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
  } else if (scrollType == SCROLL_UP) {
    // moving up to next page
    --currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation < 0) {
      // never actually moved a page if in here
      ++currPage;
      return;
    }
    pageContainer.style.transition = `transform 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 0.5)`;
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
  }
}

// scrollDown function to move down the window by the height of the page div
function scrollKeyPress() {
  console.log(event);
  // if arrow down, go down page, else go up if arrow up
  if (event.keyCode == "40") {
    // scroll down to next page
    scrollHandler(SCROLL_DOWN);
  } else if (event.keyCode == "38") {
    // scroll up to next page
    scrollHandler(SCROLL_UP);
  }
}

function handleScrollEvent(delta) {
  if (delta > 0) {
    // scroll up to next page
    scrollHandler(SCROLL_UP);
  } else if (delta < 0) {
    // scroll down to next page
    scrollHandler(SCROLL_DOWN);
  }
}

function mouseWheelHandler(event) {
  // cross-browser wheel delta
  var event = window.event || event; // old IE support
  var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
  console.log(`Delta: ${delta}`);

  if (delta) {
    handleScrollEvent(delta);
  }

  return false;
}

// get all page divs
const pages = document.querySelectorAll(".page");
// main page container that will translated
const pageContainer = document.querySelector(".page-container");
// initial page on screen
var currPage = 1;

// add keydown event to window to scroll down by the height of the page div
window.addEventListener("keydown", throttle(scrollKeyPress), false);

/* Scroll Events */

// IE9, Chrome, Safari, Opera
window.addEventListener("mousewheel", throttle(mouseWheelHandler), false);
// Firefox
window.addEventListener("DOMMouseScroll", throttle(mouseWheelHandler), false);
// IE 6/7/8
// window.attachEvent("onmousewheel", mouseWheelHandler);
