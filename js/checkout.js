let currentUser = localStorage.getItem("currentUser");
let cart = [];

function loadCart() {
  if (currentUser) {
    const storedCart = localStorage.getItem(`cart_${currentUser}`);
    cart = storedCart ? JSON.parse(storedCart) : [];
  } else {
    cart = [];
  }
}

function saveCart() {
  if (currentUser) {
    localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));
  }
}

function renderCart() {
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total-price");
  cartEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price;
    cartEl.innerHTML += `
      <li class="list-group-item">
        ${item.name} - $${item.price.toFixed(2)}
        <button class="btn btn-sm btn-danger float-end" onclick="removeFromCart(${idx})">Remove</button>
      </li>`;
  });

  totalEl.textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart(); // ✅ Save using user key
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart(); // ✅ Save using user key
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }
  saveCart(); // ✅ ensure latest cart is saved
  window.location.href = "payment.html";
}

window.onload = function () {
  loadCart();   // ✅ Load on page load
  renderCart();
};
