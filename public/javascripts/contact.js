const button = document.querySelector("#submit");
button.addEventListener("click", function () {
  button.textContent = "Submitted";
});

gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,

  // for tablet smooth
  tablet: { smooth: true },

  // for mobile
  smartphone: { smooth: true },
});
locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  // follwoing line is not required to work pinning on touch screen

  /* pinType: document.querySelector("#main").style.transform
    ? "transform"
    : "fixed"*/
});

var tl = gsap.timeline();

tl.from("#nav ,#navpart-2 h1,#navpart-3", {
  y: -100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
});

tl.from(".connect", {
  x: -200,
  scrub: 2,
  opacity: 0,
  stagger: 0.2,
});

tl.from(".contact-form", {
  x: 200,
  scrub: 2,
  opacity: 0,
  stagger: 0.2,
});

tl.from(".addresses .address", {
  y: 200,
  scrub: 2,
  opacity: 0,
  stagger: 0.2,
});
