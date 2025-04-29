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
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const deliveryStatus = cart.map(item => ({
    name: item.name,
    status: 'Not yet sent',
    eta: Math.floor(Math.random() * 15) + 5,
    deliverer: 'Alex Johnson',
    comment: ''
  }));

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    // ✅ Save per-user delivery data
    localStorage.setItem("deliveryStatus_" + currentUser, JSON.stringify(deliveryStatus));

    // ✅ If not admin, save general deliveryStatus
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      localStorage.setItem("deliveryStatus", JSON.stringify(deliveryStatus));
    }

    // ✅ Clear the cart
    localStorage.removeItem('cart');

    // ✅ Redirect to delivery page
    window.location.href = "../html/delivery.html";
  } else {
    alert("Error: No user logged in. Please log in again.");
  }
});
