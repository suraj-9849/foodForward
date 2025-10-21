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
tl.from("#why", {
  x: -200,
  scrub: 2,
  opacity: 0,
});

tl.fromTo(
  "#cont .c1",
  {
    y: -150,
    opacity: 0,
  },
  {
    y: 0,
    stagger: 0.259,
    scrub: 4,
    opacity: 1,
    delay: 0.2,
  }
);

tl.from("#quote p", {
  x: -100,
  opacity: 0,
});

tl.fromTo(
  ".images img",
  {
    height: 0,
    width: 0,
  },
  {
    height: 260,
    width: 260,
    scrollTrigger: {
      trigger: ".images",
      scroller: "#main",
      // markers: true,
      end: "top 85%",
      start: "top 95%",
      scrub: 2,
    },
  }
);
