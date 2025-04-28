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
  const deliveryStatus = JSON.parse(localStorage.getItem("deliveryStatus"));

  if (!deliveryStatus || deliveryStatus.length === 0) {
    window.location.href = "home.html"; // Redirect if no delivery data
    return;
  }

  const deliveryInfoElement = document.getElementById("deliveryInfo");
  const itemsList = document.getElementById("itemsList");
  const commentsSection = document.getElementById("commentsSection");

  deliveryStatus.forEach((item, index) => {
    const listItem = `
      <li class="list-group-item">
        <strong>${item.name}</strong><br>
        Status: ${item.status} | ETA: ${item.eta} min | Deliverer: ${item.deliverer}
      </li>
    `;
    itemsList.innerHTML += listItem;

    if (!item.comment) {
      item.comment = "";
    }
  });

  document.getElementById("addCommentBtn").addEventListener("click", function () {
    const commentText = document.getElementById("commentText").value;
    if (commentText.trim()) {
      deliveryStatus.forEach(item => {
        item.comment += (item.comment ? "\n" : "") + commentText;
      });

      localStorage.setItem("deliveryStatus", JSON.stringify(deliveryStatus));
      displayComments(deliveryStatus);
      document.getElementById("commentText").value = "";
    }
  });

  displayComments(deliveryStatus);
}

function displayComments(items) {
  const commentsSection = document.getElementById("commentsSection");
  const commentsHTML = items
    .map(item => item.comment).filter(comment => comment?.trim() !== "")
    .join("\n\n");

  commentsSection.innerHTML = `
    <h4>Comments:</h4>
    <pre class="bg-light p-2">${commentsHTML || "No comments yet."}</pre>
  `;
}

function showAllDeliveriesForAdmin() {
  const deliveryInfoElement = document.getElementById("deliveryInfo");
  deliveryInfoElement.innerHTML = "<h3>All User Deliveries</h3>";

  document.getElementById("itemsList").style.display = "none";
  document.getElementById("commentsSection").style.display = "none";

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
              ${item.comment ? `<br><em>Comment:</em> ${item.comment}` : ""}
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

