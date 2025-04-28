document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Gather the payment information from the form
  const paymentInfo = {
    cardName: document.getElementById('cardName').value,
    cardNumber: document.getElementById('cardNumber').value,
    expiration: document.getElementById('expiration').value,
    cvv: document.getElementById('cvv').value,
    dorm: document.getElementById('dorm').value,
    room: document.getElementById('room').value,
    phone: document.getElementById('phone').value
  };

  // Save payment information in local storage
  localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

  // Initialize delivery info based on cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const deliveryStatus = cart.map(item => ({
    name: item.name,
    status: 'Not yet sent',  // Default status for all items
    eta: Math.floor(Math.random() * 15) + 5, // Random ETA between 5-20 mins
    deliverer: 'Alex Johnson',  // Default delivery person
    comment: ''
  }));

  // Save delivery status in local storage
const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
  // Save per-user delivery data
  localStorage.setItem("deliveryStatus_" + currentUser, JSON.stringify(deliveryStatus));

  // For regular users, also store in "deliveryStatus" for viewing
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    localStorage.setItem("deliveryStatus", JSON.stringify(deliveryStatus));
  }

  // Clear the cart
  localStorage.removeItem('cart');

  // Redirect to delivery status page
  window.location.href = 'delivery.html';
} else {
  alert("Error: No user logged in. Please log in again.");
}
