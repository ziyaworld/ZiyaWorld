// ================= CONFIG =================
const API_BASE = "https://ziyaworld-backend.onrender.com/api";

// ================= ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin page loaded");

  const loginBtn = document.getElementById("adminLoginBtn");

  if (!loginBtn) {
    console.error("Login button not found!");
    return;
  }

  // Single listener
  loginBtn.addEventListener("click", loginAdmin);

  // AUTO LOGIN
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token found, auto logging in...");
    showDashboard();
    fetchAdminOrders();
  }
});

// ================= LOGIN =================
async function loginAdmin(e) {
  e?.preventDefault(); // stop form from submitting if inside <form>

  const loginBtn = document.getElementById("adminLoginBtn");

  // Disable button to prevent multiple clicks
  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  console.log("✅ Login button clicked");

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
    return;
  }

  try {
    console.log("🚀 Sending request...");

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("📦 Data:", data);

    if (!res.ok) {
      alert(data.message || "Login failed ❌");
      loginBtn.disabled = false;
      loginBtn.innerText = "Login";
      return;
    }

    // ✅ STORE TOKEN
    localStorage.setItem("token", data.token);

    // ✅ SHOW DASHBOARD
    showDashboard();
    fetchAdminOrders();

  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("Login error, check console");
  } finally {
    // Re-enable button no matter what
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
  }
}

// ================= SHOW DASHBOARD =================
function showDashboard() {
  document.getElementById("adminLoginModal").style.display = "none";
  document.getElementById("adminDashboard").style.display = "block";
}

// ================= FETCH ORDERS =================
async function fetchAdminOrders() {
  const token = localStorage.getItem("token");
  if (!token) return logout();

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("Orders data:", data);

    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    if (!res.ok || data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No orders found</td></tr>";
      return;
    }

    data.forEach(order => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order._id}</td>
        <td>${order.email || order.userId || "N/A"}</td>
        <td>₦${order.amount}</td>
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
    console.log("Update response:", data);

    if (!res.ok) return alert(data.msg || "Failed to update status");

    fetchAdminOrders();
  } catch (err) {
    console.error(err);
    alert("Error updating order");
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  document.getElementById("adminDashboard").style.display = "none";
  document.getElementById("adminLoginModal").style.display = "flex";
}