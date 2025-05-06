// Fake item data
let defaultItems = [
  { name: 'Chips', price: 2 },
  { name: 'Soda', price: 1.5 },
  { name: 'Notebook', price: 3 }
];

let items = JSON.parse(localStorage.getItem("storeItems")) || defaultItems;

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isAdmin = false;

function saveCart() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
  }
}

function loadCart() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    const storedCart = localStorage.getItem(`cart_${user}`);
    cart = storedCart ? JSON.parse(storedCart) : [];
  } else {
    cart = [];
  }
}


// Handle login logic
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === "admin" && pass === "admin123") {
    isAdmin = true;
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("currentUser", "admin");
    loadCart(); // load from localStorage to memory
    saveCart(); // sync memory back to user-specific storage
    window.location.href = "html/home.html";
  } else if (user) {
    isAdmin = false;
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("currentUser", user);
    loadCart();
    saveCart();
    window.location.href = "html/home.html";
  } else {
    alert("Enter a username.");
  }
}

// On home page load
// Only run this block if we’re on home.html
const path = window.location.pathname;
if (path.endsWith("home.html") || path.endsWith("/home.html")) {
  isAdmin = localStorage.getItem("isAdmin") === "true";
  if (isAdmin) {
    const adminPanel = document.getElementById("admin-panel");
    if (adminPanel) adminPanel.classList.remove("d-none");
    showAdminItemControls();
  }
  if (typeof loadCart === "function") loadCart();
  if (typeof updateCart === "function") updateCart();
  if (typeof loadItems === "function") loadItems();
}



function loadItems() {
  const store = document.getElementById("store-items");
  store.innerHTML = '';
  items.forEach((item, index) => {
    store.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card p-3">
          <h5>${item.name}</h5>
          <p>$${item.price.toFixed(2)}</p>

          <img src="${item.imageUrl}" alt="${item.name}" class="card-img-top mb-2" style="max-height: 150px; object-fit: cover;">
          
	  <button class="btn btn-sm btn-primary" onclick="addToCart(${index})">Add to Cart</button>
        </div>
      </div>`;
  });
}

function addToCart(index) {
  cart.push(items[index]);
  saveCart();
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}


function updateCart() {
  const cartEl = document.getElementById("cart");
  const summaryEl = document.getElementById("cart-summary");
  cartEl.innerHTML = '';

  cart.forEach((item, idx) => {
    cartEl.innerHTML += `<li class="list-group-item">${item.name} - $${item.price.toFixed(2)}
      <button class="btn btn-sm btn-danger float-end" onclick="removeFromCart(${idx})">X</button></li>`;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  summaryEl.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''} | Total: $${total.toFixed(2)}`;

  const cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
      cartBadge.textContent = cart.length;
      cartBadge.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}


function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}

// Admin functions
function addItem() {
  const name = prompt("Item name:");
  const price = parseFloat(prompt("Item price:"));
  if (name && !isNaN(price)) {
    items.push({ name, price });
    localStorage.setItem("storeItems", JSON.stringify(items));
    loadItems();
    showAdminItemControls();
  }
}

function removeLastItem() {
  items.pop();
  loadItems();
}

function showAdminItemControls() {
  const list = document.getElementById("admin-item-list");
  if (!list) return;

  list.innerHTML = '';
  items.forEach((item, index) => {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} - $${item.price.toFixed(2)}
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Delete</button>
      </li>`;
  });
}


function removeItem(index) {
  items.splice(index, 1);
  localStorage.setItem("storeItems", JSON.stringify(items));
  loadItems();
  showAdminItemControls();
}


function goToCheckout() {
  window.location.href = "checkout.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAdmin");
  window.location.href = "../index.html"; // adjust if your login page path is different
}

function goToDelivery() {
  const deliveryStatus = localStorage.getItem("deliveryStatus");
  if (deliveryStatus) {
    window.location.href = "delivery.html";
  } else {
    alert("No current deliveries to show.");
  }
}
