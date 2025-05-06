document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const paymentInfo = {
    cardName: document.getElementById('cardName').value,
    cardNumber: document.getElementById('cardNumber').value,
    expiration: document.getElementById('expiration').value,
    cvv: document.getElementById('cvv').value,
    dorm: document.getElementById('dorm').value,
    room: document.getElementById('room').value,
    phone: document.getElementById('phone').value
  };

  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  const expPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvPattern = /^\d{3}$/;
  const cardPattern = /^\d{13,19}$/;
  const roomPattern = /^\d+$/;

  if (
    !phonePattern.test(paymentInfo.phone) ||
    !expPattern.test(paymentInfo.expiration) ||
    !cvvPattern.test(paymentInfo.cvv) ||
    !cardPattern.test(paymentInfo.cardNumber) ||
    !roomPattern.test(paymentInfo.room)
  ) {
    alert("Please ensure all fields are filled out correctly.");
    return;
  }

  localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

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
    localStorage.setItem("deliveryStatus_" + currentUser, JSON.stringify(deliveryStatus));

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      localStorage.setItem("deliveryStatus", JSON.stringify(deliveryStatus));
    }

    localStorage.removeItem('cart');
    window.location.href = 'delivery.html';
  } else {
    alert("Error: No user logged in. Please log in again.");
  }
});

// Digit-only restriction and formatting
function restrictInputToDigits(id, maxLength = null) {
  const input = document.getElementById(id);
  input.addEventListener('input', function () {
    let digits = this.value.replace(/\D/g, '');
    if (maxLength) digits = digits.slice(0, maxLength);
    this.value = digits;
  });
}

restrictInputToDigits('cardNumber', 19);
restrictInputToDigits('cvv', 3);
restrictInputToDigits('room');

// Real-time block of non-digit keystrokes
function blockNonDigitsOnKeypress(id) {
  const input = document.getElementById(id);
  input.addEventListener('keypress', function (e) {
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  });
}

blockNonDigitsOnKeypress('cardNumber');
blockNonDigitsOnKeypress('cvv');
blockNonDigitsOnKeypress('room');
blockNonDigitsOnKeypress('phone');
blockNonDigitsOnKeypress('expiration');

// Phone input formatting: ###-###-####
document.getElementById('phone').addEventListener('input', function () {
  let digits = this.value.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 6) {
    this.value = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    this.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    this.value = digits;
  }
});

// Expiration input formatting: MM/YY
document.getElementById('expiration').addEventListener('input', function () {
  let val = this.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 3) {
    this.value = val.slice(0, 2) + '/' + val.slice(2);
  } else {
    this.value = val;
  }
});
