// debounce function to stop events from firing too much
// Taken from: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait = 20, immediate = true) {
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

// scrollDown function to move down the window by the height of the page div
function scrollKeyPress(event, pageContainer) {
  console.log(event);
  let translation = 0;
  // if arrow down, go down page, else go up if arrow up
  if (event.keyCode == "40") {
    // moving down to next page
    ++currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation >= 100) {
      // never actually moved a page if in here
      --currPage;
      return;
    }
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
  } else if (event.keyCode == "38") {
    // moving up to next page
    --currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation < 0) {
      // never actually moved a page if in here
      ++currPage;
      return;
    }
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
  }
}

function handleScrollEvent(delta) {
  let translation = 0;
  if (delta > 0) {
    // moving up to next page
    --currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation < 0) {
      // never actually moved a page if in here
      ++currPage;
      return;
    }
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
  } else if (delta < 0) {
    // moving down to next page
    ++currPage;
    translation = (100 / pages.length) * (currPage - 1);
    console.log(translation);
    if (translation >= 100) {
      // never actually moved a page if in here
      --currPage;
      return;
    }
    pageContainer.style.transform = `translate3d(0, ${-translation}%, 0)`;
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
window.addEventListener("keydown", event => {
  scrollKeyPress(event, pageContainer);
});

/* Scroll Events */

// IE9, Chrome, Safari, Opera
window.addEventListener("mousewheel", debounce(mouseWheelHandler), false);
// Firefox
window.addEventListener("DOMMouseScroll", debounce(mouseWheelHandler), false);
// IE 6/7/8
// window.attachEvent("onmousewheel", mouseWheelHandler);
