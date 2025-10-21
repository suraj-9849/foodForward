//     gsap.registerPlugin(ScrollTrigger);

// const locoScroll = new LocomotiveScroll({
//   el: document.querySelector("#main"),
//   smooth: true,

//   // for tablet smooth
//   tablet: { smooth: true },

//   // for mobile
//   smartphone: { smooth: true }
// });
// locoScroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger.scrollerProxy("#main", {
//   scrollTop(value) {
//     return arguments.length
//       ? locoScroll.scrollTo(value, 0, 0)
//       : locoScroll.scroll.instance.scroll.y;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight
//     };
//   }
// });
document.addEventListener("DOMContentLoaded", () => {
  const itemList = document.getElementById("item-list");
  const addItemBtn = document.getElementById("add");
  const removeItemBtn = document.getElementById("remove");
  const itemInput = document.getElementById("item");

  addItemBtn.addEventListener("click", () => {
    if (itemInput.value.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = itemInput.value.trim();
      itemList.appendChild(li);
      itemInput.value = "";
    }
  });

  removeItemBtn.addEventListener("click", () => {
    if (itemList.children.length > 0) {
      itemList.removeChild(itemList.lastElementChild);
    }
  });
});
