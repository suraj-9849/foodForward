// gsap.registerPlugin(ScrollTrigger);

// const locoScroll = new LocomotiveScroll({
//     el: document.querySelector("#main"),
//     smooth: true,
//     smartphone: { smooth: true },
//     tablet: { smooth: true }
// });

// locoScroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger.scrollerProxy("#main", {
//     scrollTop(value) {
//         return arguments.length
//             ? locoScroll.scrollTo(value, 0, 0)
//             : locoScroll.scroll.instance.scroll.y;
//     },
//     getBoundingClientRect() {
//         return {
//             top: 0,
//             left: 0,
//             width: window.innerWidth,
//             height: window.innerHeight
//         };
//     }
// });

var tl = gsap.timeline();

tl.from("#nav, #navpart-2 h1, #navpart-3", {
  y: -100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
});
