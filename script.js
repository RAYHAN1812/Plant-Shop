const categoriesEl = document.getElementById("all-categories");
const plantsEl = document.getElementById("all-plants");
const cartEl = document.getElementById("cart-items");
const totalEl = document.getElementById("total-price");

let cart = [];
let total = 0;

fetch("https://openapi.programming-hero.com/api/categories")
  .then(res => res.json())
  .then(data => {
    data.categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.category_name;
      li.id = cat.id;
      li.className = "p-1 cursor-pointer";
      categoriesEl.appendChild(li);
    });
  });

categoriesEl.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#all-categories li").forEach(li => li.classList.remove("bg-green-800","text-white"));
    e.target.classList.add("bg-green-800","text-white");
    
    fetch(`https://openapi.programming-hero.com/api/category/${e.target.id}`)
      .then(res => res.json())
      .then(data => {
        plantsEl.innerHTML = "";
        data.plants.forEach(plant => {
          plantsEl.innerHTML += `
            <div class="p-4 border rounded bg-white">
              <img src="${plant.image}" class="w-32 h-32 object-cover mb-2"/>
              <h1 class="font-bold">${plant.name}</h1>
              <p class="text-gray-800">${plant.description}</p>
              <p class="text-green-900 font-semibold">Price: ${plant.price}৳</p>
              <button class="add-btn bg-green-700 rounded-xl" data-id="${plant.id}" data-name="${plant.name}" data-price="${plant.price}">Add to Cart</button>
            </div>
          `;
        });
        document.querySelectorAll(".add-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            cart.push({id: btn.dataset.id, name: btn.dataset.name, price: parseInt(btn.dataset.price)});
            total += parseInt(btn.dataset.price);
            renderCart();
          });
        });
      });
  }
});

function renderCart() {
  cartEl.innerHTML = "";
  cart.forEach((item,index) => {
    cartEl.innerHTML += `
      <li class="flex justify-between">
        <span>${item.name} - ${item.price}৳</span>
        <button class="remove-btn" data-index="${index}">❌</button>
      </li>
    `;
  });
  totalEl.textContent = total;
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      total -= cart[btn.dataset.index].price;
      cart.splice(btn.dataset.index,1);
      renderCart();
    });
  });
}
