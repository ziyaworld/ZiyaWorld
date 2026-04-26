// ================= GLOBAL =================
let logoutTimer;
const LOGOUT_TIME = 20 * 60 * 1000; // ✅ 20 mins

// ================= CONFIG =================
const API_BASE = "https://ziyaworld-backend-r9xm.onrender.com/api";

// ================= ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  console.log("Admin page loaded");

  const loginBtn = document.getElementById("adminLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", loginAdmin);
  }

  const token = localStorage.getItem("adminToken");

  if (token) {
    // ✅ stay logged in
    showDashboard();
    fetchAdminOrders();
    startLogoutTimer();
  } else {
    // ✅ only show login if no token
    logout();
  }

});

// ================= LOGIN =================
async function loginAdmin(e) {
  e?.preventDefault();

  const loginBtn = document.getElementById("adminLoginBtn");
  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!email || !password) {
    ("Enter email and password");
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
    return;
  }

  try {
    console.log("Sending login request...");

    const res = await fetch("https://ziyaworld-backend-r9xm.onrender.com/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Not JSON:", text);
      alert("Server error (wrong route)");
      return;
    }

    console.log("Response:", data);

    if (!res.ok || !data.success) {
      showPopup(data.msg || data.message || "Login failed ❌");
      return;
    }

if (data.user.role !== "admin") {
  showPopup("You are not an admin");
  return;
}

console.log("Saved user:", data.user);
console.log("Saved token:", data.token);

localStorage.setItem("adminToken", data.token);
localStorage.setItem("adminUser", JSON.stringify(data.user));

    showDashboard();
    fetchAdminOrders();

    startLogoutTimer();
showPopup("Login successful ✅");

  } catch (err) {
    console.error(err);
    showPopup("Login error, check console");
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
  }
}

// ================= TOKEN VALIDATION =================
async function validateToken(token) {
  try {
    const res = await fetch(`${API_BASE}/auth/validate-token`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      console.log("Token invalid or expired, logging out...");
      return logout();
    }

    // if (token) {
//   validateToken(token);
// }

    console.log("Token valid ✅");
    showDashboard();
    fetchAdminOrders();

  } catch (err) {
    console.error("Token validation error:", err);
    logout();
  }
}

// ================= SHOW DASHBOARD =================
function showDashboard() {
  const loginModal = document.getElementById("adminLoginModal");
  const dashboard = document.getElementById("adminDashboard");

  if (loginModal) loginModal.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
}

// ================= FETCH ORDERS =================
async function fetchAdminOrders() {
const token = localStorage.getItem("adminToken");
  if (!token) return logout();

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

let result = {};
try {
  result = await res.json();
} catch (err) {
  result = {};
}

const tbody = document.querySelector("#ordersTable tbody");
tbody.innerHTML = "";

if (!res.ok) {
  tbody.innerHTML = `<tr><td colspan="5">Error: ${result.message || 'Failed to fetch orders'}</td></tr>`;
  if (res.status === 401) logout(); 
  return;
}

if (!result.orders || result.orders.length === 0) {
  tbody.innerHTML = `<tr><td colspan="5">No orders found</td></tr>`;
  return;
}

result.orders.forEach(order => {
  const tr = document.createElement("tr");
const name = order.name || order.userId?.name || "No name";
const phone = order.phone || "No phone";
const email = order.userId?.email || "No email";

tr.innerHTML = `
  <td>${order._id.slice(-6)}</td>

  <td class="customer-box">
    <div class="cust-title">Customer Details</div>

    <div class="cust-name">${name}</div>

    <div class="cust-row">
      📞 ${phone}
    </div>

    ${email && email !== "No email" ? `
    <div class="cust-row">
      📧 ${email}
    </div>` : ""}
  </td>

  <td class="amount">₦${Number(order.amount).toLocaleString()}</td>

  <td>
    <span class="status ${order.status.toLowerCase()}">
      ${order.status}
    </span>
  </td>

  <td class="actions">
    <button class="ship-btn" onclick="updateStatus('${order._id}','Shipped', this)">
      Ship
    </button>

    <button class="deliver-btn" onclick="updateStatus('${order._id}','Delivered', this)">
      Deliver
    </button>
  </td>

  <button class="details-btn" onclick='openOrderModal(${JSON.stringify(order)})'>
    Details
  </button>
</td>
`;
  tbody.appendChild(tr);
});

  } catch (err) {
    console.error(err);
    showPopup("Error loading orders");
  }
}

// ================= UPDATE ORDER STATUS =================
async function updateStatus(orderId, status, btn) {
  const token = localStorage.getItem("adminToken");

  btn.innerText = "Updating...";
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (!data.success) {
      showPopup(data.message || "Failed to update");
      btn.innerText = "Error";
      btn.disabled = false;
      return;
    }

    showPopup("Order updated ✅");

   fetchAdminOrders(); // active stays updated
loadAdminOrders();  // history also refreshes (optional but correct)

  } catch (err) {
    console.error(err);
    showPopup("Network error");
  }
}

// ================= LOGOUT =================
function logout() {
localStorage.removeItem("adminToken");
localStorage.removeItem("adminUser");

  showPopup("Session expired ⏱ Logged out");


  const dashboard = document.getElementById("adminDashboard");
  if (dashboard) dashboard.style.display = "none";

  const loginModal = document.getElementById("adminLoginModal");
  if (loginModal) loginModal.style.display = "flex";
}


function openOrderModal(order) {
  const modal = document.getElementById("orderModal");
  const content = document.getElementById("orderDetailsContent");

  const email = order.email || order.userId?.email || "Not available";

  content.innerHTML = `
    <div class="order-header">
      <h3>${order.name}</h3>
      <span class="status ${order.status.toLowerCase()}">
        ${order.status}
      </span>
    </div>

    <div class="order-info">
      <p><strong>📦 order-id:</strong> ${order._id}</p>
      <p><strong>📧 Email:</strong> ${email}</p>
      <p><strong>📞 Phone:</strong> ${order.phone}</p>
      <p><strong>📍 Address:</strong> ${order.address}</p>
      <p><strong>💰 Amount:</strong> ₦${Number(order.amount).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod || "Not set"}</p>

    </div>

    <h4 class="items-title">Items</h4>

    <div class="order-items">
      ${order.items.map(item => `
        <div class="order-item">
          <img src="${item.image || 'images/default.jpg'}" />

          <div class="item-info">
            <p class="item-name">${item.name}</p>
            <p>Qty: ${item.quantity || item.qty || 1}</p>
            <p>₦${item.price}</p>
          </div>
        </div>
      `).join("")}
    </div>

  <div class="order-footer">
    <button class="cancel-order" onclick="cancelOrder('${order._id}')">
      🗑 Cancel Order
    </button>
  </div>
  `;

  modal.style.display = "flex";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}


async function cancelOrder(orderId) {

  const token = localStorage.getItem("adminToken");

  showConfirm("Cancel this order?", async (result) => {
    if (!result) return;

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, { // ✅ FIXED
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return showPopup(data.message || "Cancel failed ❌");
      }

showPopup("Moved to history ✅");

closeOrderModal();
fetchAdminOrders();
loadAdminOrders(); // 🔥 important sync

    } catch (err) {
      console.error(err);
      showPopup("Error cancelling ❌");
    }
  });
}

let popupTimeout;

function showPopup(message) {
  const overlay = document.getElementById("popupOverlay");
  const msg = document.getElementById("popupMessage");

  msg.innerText = message;
  overlay.style.display = "flex";

  clearTimeout(popupTimeout);

  popupTimeout = setTimeout(() => {
    overlay.style.display = "none";
  }, 6000);
}


function startLogoutTimer() {

  clearTimeout(logoutTimer);

  const lastActivity = localStorage.getItem("lastActivity");

  if (!lastActivity) {
    localStorage.setItem("lastActivity", Date.now());
    return;
  }

  const now = Date.now();
  const timePassed = now - parseInt(lastActivity);

  const timeLeft = LOGOUT_TIME - timePassed;

  if (timeLeft <= 0) {
    logout(); // 🔥 already expired
    return;
  }

  logoutTimer = setTimeout(() => {
    logout();
    showPopup("Session expired ⏱ Logged out");
  }, timeLeft);
}

function resetLogoutTimer() {
  localStorage.setItem("lastActivity", Date.now()); // ✅ SAVE TIME
  startLogoutTimer();
}
document.addEventListener("click", resetLogoutTimer);
document.addEventListener("keydown", resetLogoutTimer);
document.addEventListener("mousemove", resetLogoutTimer);

let confirmCallback = null;

function showConfirm(message, callback) {
  const box = document.getElementById("confirmBox");
  const text = document.getElementById("confirmText");

  text.innerText = message;
  box.style.display = "flex";

  confirmCallback = callback;
}

document.getElementById("confirmOk").onclick = () => {
  document.getElementById("confirmBox").style.display = "none";
  if (confirmCallback) confirmCallback(true);
};

document.getElementById("confirmCancel").onclick = () => {
  document.getElementById("confirmBox").style.display = "none";
  if (confirmCallback) confirmCallback(false);
};

// OPEN ADMIN HISTORY
function openAdminHistory(){
  document.getElementById("adminHistoryPanel").style.display = "flex";
  loadAdminOrders();
}

// CLOSE
function closeAdminHistory(){
  document.getElementById("adminHistoryPanel").style.display = "none";
}

function closeAdminOrder(){
  document.getElementById("adminOrderModal").style.display = "none";
}


// LOAD ORDERS (FROM LOCAL OR BACKEND)
async function loadAdminOrders(){
  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(`${API_BASE}/orders/history`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!data.success) {
      return showPopup("Failed to load history");
    }

    renderAdminHistory(data.orders);

  } catch (err) {
    console.error(err);
    showPopup("Error loading history");
  }
}

// RENDER HISTORY
function renderAdminHistory(orders){

  const container = document.getElementById("adminHistoryContainer");

  if(!orders.length){
    container.innerHTML = "<p>No history yet</p>";
    return;
  }

  container.innerHTML = "";

  orders.forEach(order => {

    const firstItem = order.items[0];

    const totalItems = order.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    container.innerHTML += `
      <div class="history-card">

        <img src="${firstItem?.image}" class="history-img">

        <div class="history-info">
          <strong>${firstItem?.name || "Item"}</strong>
          <p>${totalItems} item(s)</p>
          <p><strong>Name:</strong> ${order.name}</p>
        </div>

        <button class="view-btn"
          onclick='openAdminOrderDetails(${JSON.stringify(order)})'>
          View
        </button>

      </div>
    `;
  });
}

// OPEN FULL DETAILS
function openAdminOrderDetails(order){

  const container = document.getElementById("adminOrderContent");

  let itemsHTML = `<div class="order-grid">`;

  order.items.forEach(item => {
    itemsHTML += `
      <div class="order-item">
        <img src="${item.image}">
        <div class="item-info">
          <p>${item.name}</p>
          <small>₦${item.price.toLocaleString()}</small>
        </div>
        <div class="qty">x${item.quantity}</div>
      </div>
    `;
  });

  itemsHTML += `</div>`;

  container.innerHTML = `
    <div class="order-top">
      <p><strong>ID:</strong> ${order._id}</p>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Email:</strong> ${order.email || "N/A"}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || "Not set"}</p>

      <p>
        <strong>Status:</strong>
        <span class="status ${order.status.toLowerCase()}">
          ${order.status}
        </span>
      </p>
    </div>

    <hr>

    ${itemsHTML}

    <hr>

    <div class="order-bottom">
      <h3>Total: ₦${Number(order.amount).toLocaleString()}</h3>
    </div>
  `;

  document.getElementById("adminOrderModal").style.display = "flex";
}


// FINAL STATUS (ONLY 2 STATES)
function getFinalStatus(order){

  const s = (order.status || "").toLowerCase();

  if(s.includes("deliver") || s.includes("complete")){
    return "Delivered";
  }

  return "Cancelled";
}