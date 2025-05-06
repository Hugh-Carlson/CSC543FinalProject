// js/delivery.js
window.onload = function () {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    showAllDeliveriesForAdmin();
  } else {
    showCurrentUserDelivery();
  }
};

function showCurrentUserDelivery() {
  const user = localStorage.getItem("currentUser");
  const deliveryStatus = JSON.parse(localStorage.getItem("deliveryStatus_" + user));

  if (!deliveryStatus || deliveryStatus.length === 0) {
    window.location.href = "home.html";
    return;
  }

  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = '';

  deliveryStatus.forEach((item, index) => {
    if (!item.comments) item.comments = [];

    const currentUser = user || "U";
    const initial = currentUser.charAt(0).toUpperCase();

    const commentsHTML = item.comments.map(c => `
      <div class="card mb-2">
        <div class="card-body p-2 d-flex">
          <div class="me-2">
            <div class="bg-secondary text-white rounded-circle text-center" style="width:32px; height:32px; line-height:32px;">
              ${initial}
            </div>
          </div>
          <div>
            <small class="text-muted">${c.time}</small><br>
            ${c.text}
          </div>
        </div>
      </div>
    `).join("") || "<div class='text-muted'>No comments yet.</div>";

    const listItem = document.createElement("li");
    listItem.className = "list-group-item";

    listItem.innerHTML = `
      <strong>${item.name}</strong><br>
      Status: ${item.status} | ETA: ${item.eta} min | Deliverer: ${item.deliverer}
      <div class="mt-3">
        <h6>Comments:</h6>
        <div id="comments-${index}" class="mb-2" style="max-height: 200px; overflow-y: auto;">
          ${commentsHTML}
        </div>
        <textarea class="form-control mb-2" id="input-${index}" rows="2" placeholder="Add a comment"></textarea>
        <button class="btn btn-sm btn-primary" onclick="addComment(${index})">Add Comment</button>
      </div>
    `;

    itemsList.appendChild(listItem);
  });

  localStorage.setItem("deliveryStatus_" + user, JSON.stringify(deliveryStatus));
}

function addComment(index) {
  const user = localStorage.getItem("currentUser");
  const input = document.getElementById(`input-${index}`);
  const commentText = input.value.trim();
  if (!commentText) return;

  const deliveryStatus = JSON.parse(localStorage.getItem("deliveryStatus_" + user)) || [];
  const timestamp = new Date().toLocaleString();

  deliveryStatus[index].comments = deliveryStatus[index].comments || [];
  deliveryStatus[index].comments.push({ text: commentText, time: timestamp });

  localStorage.setItem("deliveryStatus_" + user, JSON.stringify(deliveryStatus));
  showCurrentUserDelivery();
}

function showAllDeliveriesForAdmin() {
  const deliveryInfoElement = document.getElementById("deliveryInfo");
  deliveryInfoElement.innerHTML = "<h3>All User Deliveries</h3>";
  document.getElementById("itemsList").style.display = "none";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("deliveryStatus_")) {
      const username = key.replace("deliveryStatus_", "");
      const deliveries = JSON.parse(localStorage.getItem(key));

      const section = document.createElement("div");
      section.classList.add("border", "p-3", "mb-3");

      section.innerHTML = `
        <strong>User:</strong> ${username}<br>
        <ul class="list-group mt-2">
          ${deliveries.map(item => `
            <li class="list-group-item">
              <strong>${item.name}</strong><br>
              Status: ${item.status} | ETA: ${item.eta} min | Deliverer: ${item.deliverer}
              ${item.comments?.length ? `<br><em>Comments:</em><ul>${item.comments.map(c => `<li>${c.time}: ${c.text}</li>`).join("")}</ul>` : ""}
            </li>`).join("")}
        </ul>
        <button class="btn btn-danger btn-sm mt-2" onclick="cancelDelivery('${username}')">Cancel All Deliveries</button>
      `;

      deliveryInfoElement.appendChild(section);
    }
  }
}

function cancelDelivery(username) {
  if (confirm(`Cancel all deliveries for ${username}?`)) {
    localStorage.removeItem("deliveryStatus_" + username);
    alert("Deliveries canceled.");
    showAllDeliveriesForAdmin();
  }
}
