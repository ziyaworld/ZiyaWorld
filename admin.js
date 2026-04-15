// ================= CONFIG =================
const API_BASE = "https://ziyaworld-backend-r9xm.onrender.com/api";

// ================= ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin page loaded");

  const loginBtn = document.getElementById("adminLoginBtn");
  if (!loginBtn) return console.error("Login button not found!");

  loginBtn.addEventListener("click", loginAdmin);

  // AUTO LOGIN
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token found, attempting auto-login...");
    validateToken(token);
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
    alert("Enter email and password");
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
    return;
  }

  try {
    console.log("Sending login request...");

    const res = await fetch(`${API_BASE}/auth/admin/login`, {
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
      alert(data.msg || data.message || "Login failed ❌");
      return;
    }

if (data.user.role !== "admin") {
  alert("You are not an admin");
  return;
}

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showDashboard();
    fetchAdminOrders();

  } catch (err) {
    console.error(err);
    alert("Login error, check console");
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
  const token = localStorage.getItem("token");
  if (!token) return logout();

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

let data = [];
try {
  data = await res.json();
} catch (err) {
  data = [];
}

    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="5">Error: ${data.msg || 'Failed to fetch orders'}</td></tr>`;
      if (res.status === 401) logout(); 
      return;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No orders found</td></tr>`;
      return;
    }

    data.forEach(order => {
      const tr = document.createElement("tr");
      const email = order.email || order.userId || "N/A";

      tr.innerHTML = `
        <td>${order._id}</td>
        <td>${email}</td>
        <td>₦${Number(order.amount).toLocaleString()}</td>
        <td>${order.status}</td>
        <td>
          <button onclick="updateStatus('${order._id}','Shipped')">Shipped</button>
          <button onclick="updateStatus('${order._id}','Delivered')">Delivered</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    alert("Error loading orders");
  }
}

// ================= UPDATE ORDER STATUS =================
async function updateStatus(orderId, status) {
  const token = localStorage.getItem("token");
  const buttons = document.querySelectorAll("#ordersTable button");
  buttons.forEach(btn => btn.disabled = true);

  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();
    if (!res.ok || !data.success) return alert(data.msg || "Failed to update status");

    fetchAdminOrders();

  } catch (err) {
    console.error(err);
    alert("Error updating order");
  } finally {
    buttons.forEach(btn => btn.disabled = false);
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  const dashboard = document.getElementById("adminDashboard");
  if (dashboard) dashboard.style.display = "none";

  const loginModal = document.getElementById("adminLoginModal");
  if (loginModal) loginModal.style.display = "flex";
}