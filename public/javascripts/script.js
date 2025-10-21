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
});

var h1 = document.querySelectorAll("#page2 #scroll h1");

let data = [
  {
    name: "Ashray Akruti",
    src: "https://content.jdmagicbox.com/hyderabad/34/040pw000034/logo/202277b40525e24ddd5add4c7e274797.jpg",
  },
  {
    name: "Robin Hood Army",
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f3/The_Logo_of_the_Robin_Hood_Army.jpg",
  },
  { name: "Feeding India", src: "../images/feeding.png" },
  {
    name: "Feed The Need",
    src: "https://feedtheneed.org/wp-content/uploads/2017/09/Feed-the-Need-logo-MAIN.png",
  },
  { name: "Khaana Chahiye Organization", src: "../images/khanne.png" },
];

let yo = "";
data.forEach((e) => {
  yo += `
        <div class="person">
            <img src="${e.src}" alt="Portrait" title="Portrait"> 
            <h4>${e.name}</h4>
        </div>
    `;
});

document.querySelector("#people").innerHTML = yo;

h1.forEach((e) => {
  var h1Text = e.textContent;
  var clutter = "";
  var splittedText = h1Text.split("");
  splittedText.forEach((ele) => {
    clutter += `<span>${ele}</span>`;
  });

  e.innerHTML = clutter;
});

var tl = gsap.timeline();

tl.from("#hero #right video", {
  scale: 0,
  opacity: 0,
});

tl.from("#hero #left h1,#hero #left h3", {
  x: -500,
  opacity: 0,
  stagger: 0.2,
  scrub: 4,
});

tl.from("#nav ,#navpart-2 h1,#navpart-3", {
  y: -100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
});

tl.to("#page2 #scroll h1 span", {
  color: "#3a86ff",
  stagger: 1,
  scrollTrigger: {
    scroller: "#main",
    trigger: "#page2 #scroll h1",
    scrub: 4,
    start: "top 100%",
    end: "top 40%",
  },
});

tl.from("#page2 img", {
  scale: 0,
  opacity: 0,
  scrollTrigger: {
    scroller: "#main",
    trigger: "#page2  img",
    scrub: 1,
    // markers:true,
    start: "top 100%",
    end: "top 40%",
  },
});

tl.from("#page3 .testimonial-container", {
  scale: 0,
  opacity: 0,
  scrollTrigger: {
    scroller: "#main",
    trigger: "#page3 .testimonial-container",
    scrub: 1,
    // markers:true,
    start: "top 100%",
    end: "top 40%",
  },
});
tl.to("#donate", {
  scaleX: 1.2,
  scaleY: 1.2,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
});
