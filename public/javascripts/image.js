const key = "xgz4LFJyZJXhjgR1mdZDbzAspWJUTX2h4onn1_hj_QM";

let form = document.getElementById("search_form");
let input = document.getElementById("search_input");
let product = document.querySelector(".product");

let s_input = "";

async function searchImages() {
  s_input = input.value;
  let url = `https://api.unsplash.com/search/photos?query=${s_input}&client_id=${key}`;

  const response = await fetch(url);
  const rawData = await response.json();
  const result = rawData.results[0]; // Fetch the first image result

  product.innerHTML = ""; // Clear previous product

  const image = document.createElement("img");
  image.src = result.urls.small;

  const detailsDiv = document.createElement("div");
  const nameSpan = document.createElement("span");
  nameSpan.textContent = s_input;
  const spicyP = document.createElement("p");
  spicyP.textContent = "Extra Spicy";
  const mayoP = document.createElement("p");
  mayoP.textContent = "No mayo";

  detailsDiv.appendChild(nameSpan);
  detailsDiv.appendChild(spicyP);
  detailsDiv.appendChild(mayoP);

  const quantityDiv = document.createElement("div");
  const minusButton = document.createElement("button");
  minusButton.textContent = "-";
  const quantityLabel = document.createElement("label");
  quantityLabel.textContent = "1"; // Default quantity
  const plusButton = document.createElement("button");
  plusButton.textContent = "+";

  minusButton.addEventListener("click", () => {
    let currentQuantity = parseInt(quantityLabel.textContent);
    if (currentQuantity > 1) {
      quantityLabel.textContent = (currentQuantity - 1).toString();
    }
  });

  plusButton.addEventListener("click", () => {
    let currentQuantity = parseInt(quantityLabel.textContent);
    quantityLabel.textContent = (currentQuantity + 1).toString();
  });

  quantityDiv.appendChild(minusButton);
  quantityDiv.appendChild(quantityLabel);
  quantityDiv.appendChild(plusButton);

  product.appendChild(image);
  product.appendChild(detailsDiv);
  product.appendChild(quantityDiv);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchImages();
});
