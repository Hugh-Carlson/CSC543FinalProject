document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault(); // ✅ Prevent form from actually submitting and reloading the page

  // ✅ Gather the payment information from the form
  const paymentInfo = {
    cardName: document.getElementById('cardName').value,
    cardNumber: document.getElementById('cardNumber').value,
    expiration: document.getElementById('expiration').value,
    cvv: document.getElementById('cvv').value,
    dorm: document.getElementById('dorm').value,
    room: document.getElementById('room').value,
    phone: document.getElementById('phone').value
  };

  // ✅ Save payment information in local storage
  localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

  // ✅ Initialize delivery info based on cart
  const currentUser = localStorage.getItem("currentUser");
  const cartKey = "cart_" + currentUser;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // 🔁 Count quantities per unique item
  const itemCounts = {};
  cart.forEach(item => {
    if (!itemCounts[item.name]) {
      itemCounts[item.name] = { ...item, quantity: 1 };
    } else {
      itemCounts[item.name].quantity += 1;
    }
  });

  // 📦 Build deliveryStatus with quantities
  const deliveryStatus = Object.values(itemCounts).map(item => ({
    name: item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name,
    status: 'Not yet sent',
    eta: Math.floor(Math.random() * 15) + 5,
    deliverer: 'Alex Johnson',
    comment: ''
  }));

  if (currentUser) {
    // ✅ Load any existing deliveries
    const existingDeliveriesRaw = localStorage.getItem("deliveryStatus_" + currentUser);
    let existingDeliveries = existingDeliveriesRaw ? JSON.parse(existingDeliveriesRaw) : [];

    // ✅ Combine old and new deliveries
    const updatedDeliveries = existingDeliveries.concat(deliveryStatus);

    // ✅ Save the updated list
    localStorage.setItem("deliveryStatus_" + currentUser, JSON.stringify(updatedDeliveries));

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // ✅ Also update general deliveryStatus if not admin
    if (!isAdmin) {
      localStorage.setItem("deliveryStatus", JSON.stringify(updatedDeliveries));
    }

    // ✅ Clear the cart
    localStorage.removeItem(cartKey);

    // ✅ Redirect to delivery page
    window.location.href = "../html/delivery.html";
  } else {
    alert("Error: No user logged in. Please log in again.");
  }
});
