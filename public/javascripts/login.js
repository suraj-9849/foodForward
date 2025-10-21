const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const txt1 = document.getElementById("text1");
const txt2 = document.getElementById("text2");
const txt3 = document.getElementById("text3");
const head = document.getElementById("head");
var reg = document.querySelector(".regg");
var org = document.querySelector(".org");

btn1.addEventListener("click", function (event) {
  event.preventDefault();
  btn1.style.backgroundColor = "#0bdd12";
  btn1.style.color = "white";
  btn2.style.color = "black";
  reg.setAttribute("placeholder", "Enter NGO registration number");
  org.setAttribute("placeholder", "NGO name (as per records)");
  head.innerText = "logging in as NGO";
  head.style.color = "#0bdd12";
  btn2.style.backgroundColor = "";
  txt1.innerText = "What NGO gets ";
  txt2.innerText = "We help them by providing resources ";
  txt3.innerText = "We help them to help others ";
});

btn2.addEventListener("click", function (event) {
  event.preventDefault();
  btn1.style.color = "black";
  btn2.style.color = "white";
  head.innerText = "logging in as Donor";
  btn1.style.backgroundColor = "";
  org.setAttribute("placeholder", "Restaurant name ");
  reg.setAttribute("placeholder", "Enter restaurant regd number");
  head.style.color = "#0bdd12";
  btn2.style.backgroundColor = "#0bdd12";
  txt1.innerText = "What Restaurants get";
  txt2.innerText = "Community support  ";
  txt3.innerText = "Organic marketing and Tax exemption";
});
