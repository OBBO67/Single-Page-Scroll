// scroll type constants
const SCROLL_DOWN = "scroll_down";
const SCROLL_UP = "scroll_up";

// get all page divs
// const pages = document.querySelectorAll(".page");
// // main page container that will translated
// const pageContainer = document.querySelector(".page-container");

class FullPage {
  /**
   * @param {number} numOfPages number of pages that will be required for the website
   * @param {element} element element to perform the event on
   * @param {string} eventType event type that will be added to the window
   */
  constructor(numOfPages, element, eventType) {
    this.numOfPages = numOfPages;
    // current page, always one to start with
    this.currPage = 1;
  }

  calcTranslation() {
    return (100 / this.numOfPages) * (this.currPage - 1);
  }

  /**
   * @param {element} element element to perform the event on
   * @param {string} eventType event type that will be added to the window
   */
  createEventListener(element, eventType) {
    this.element = element;
    this.eventType = eventType;
    console.log("Adding event listener");
    if (this.eventType == "mousewheel") {
      window.addEventListener(
        this.eventType,
        FullPage.throttle(this.mouseWheelHandler.bind(this), 1000),
        false
      );
      // Firefox
      window.addEventListener(
        "DOMMouseScroll",
        FullPage.throttle(this.mouseWheelHandler.bind(this), 1000),
        false
      );
    } else if (this.eventType == "keydown") {
      console.log("adding event to window for keypress");
      window.addEventListener(
        this.eventType,
        FullPage.throttle(this.scrollKeyPress.bind(this)),
        false
      );
    }
  }

  // throttle function to limit calls to scroll event
  // taken from: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  static throttle(func, limit = 500) {
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

  handleScrollEvent(delta) {
    if (delta > 0) {
      // scroll up to next page
      this.scrollHandler.bind(this)(SCROLL_UP);
    } else if (delta < 0) {
      // scroll down to next page
      this.scrollHandler.bind(this)(SCROLL_DOWN);
    }
  }

  mouseWheelHandler(event) {
    // cross-browser wheel delta
    var event = window.event || event; // old IE support
    var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    console.log(`Delta: ${delta}`);

    if (delta) {
      this.handleScrollEvent.bind(this)(delta);
    }

    return false;
  }

  // function to handle the scrolling down or up
  scrollHandler(scrollType) {
    let translation = 0;
    if (scrollType == SCROLL_DOWN) {
      // moving down to next page
      ++this.currPage;
      translation = this.calcTranslation.bind(this)();
      console.log(translation);
      if (translation >= 100) {
        // never actually moved a page if in here
        --this.currPage;
        return;
      }
      this.element.style.transition = `transform 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 0.5)`;
      this.element.style.transform = `translate3d(0, ${-translation}%, 0)`;
    } else if (scrollType == SCROLL_UP) {
      // moving up to next page
      --this.currPage;
      translation = this.calcTranslation.bind(this)();
      console.log(translation);
      if (translation < 0) {
        // never actually moved a page if in here
        ++this.currPage;
        return;
      }
      this.element.style.transition = `transform 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 0.5)`;
      this.element.style.transform = `translate3d(0, ${-translation}%, 0)`;
    }
  }

  // function to move down the window by the height of the page div
  scrollKeyPress() {
    console.log(event);
    // if arrow down, go down page, else go up if arrow up
    if (event.keyCode == "40") {
      // scroll down to next page
      this.scrollHandler.bind(this)(SCROLL_DOWN);
    } else if (event.keyCode == "38") {
      // scroll up to next page
      this.scrollHandler.bind(this)(SCROLL_UP);
    }
  }
}

// const fullPage = new FullPage(4);
// fullPage.createEventListener(pageContainer, "keydown");
// fullPage.createEventListener(pageContainer, "mousewheel");

export default FullPage;
