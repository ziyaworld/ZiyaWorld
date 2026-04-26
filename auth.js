function toggleAuth(){
  const title = document.getElementById("authTitle");
  const nameInput = document.getElementById("authName");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const toggleText = document.getElementById("toggleAuth");
  const agreeLabel = document.getElementById("agreeLabel");

if(title.innerText === "Login"){
  title.innerText = "Sign Up";
  nameInput.style.display = "block";
  loginBtn.style.display = "none";
  signupBtn.style.display = "block";

  toggleText.innerHTML = "Already have an account? <span class='highlight'>Login</span>";

  agreeLabel.style.display = "block";
} else {
  title.innerText = "Login";
  nameInput.style.display = "none";
  loginBtn.style.display = "block";
  signupBtn.style.display = "none";

  toggleText.innerHTML = "Don't have an account? <span class='highlight'>Sign up</span>";

  agreeLabel.style.display = "none";
}
}

console.log("AUTH JS LOADED SUCCESSFULLY");

// ================= LOGIN =================
function login(){

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if(!email || !password){
    showPopup("Please fill all fields");
    return;
  }

fetch("https://ziyaworld-backend-r9xm.onrender.com/api/auth/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
.then(async res => {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid server response");
  }
  return data;
})
.then(data => {

  console.log("LOGIN RESPONSE:", data);

  // ❌ WRONG: generic message
  // showPopup("Login failed");

  // ✅ CORRECT: show backend message
if(!data || !data.success || !data.token){
  showPopup(data.message || "Login failed");
  return;
}

  if(!data.token){
    showPopup(data.message || "Invalid login");
    return;
  }

  // SUCCESS
  localStorage.setItem("token", data.token);
  localStorage.setItem("loginTime", Date.now());
localStorage.setItem("user", JSON.stringify({
_id: data.user._id || data.user.id,
  name: data.user.name,
  email: data.user.email,
  role: data.user.role,
}));

  showPopup("Login successful!");

const redirect = localStorage.getItem("redirectAfterLogin");

setTimeout(() => {

  if(redirect === "checkout"){
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "index.html?openCheckout=true";
  } else {
    window.location.href = "index.html";
  }

}, 1000);

})
  .catch(err => {
    console.error(err);
    showPopup("Network error");
  });
}


// ================= SIGNUP =================
function signup(){

  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  const agree = document.getElementById("agreeTerms").checked;

  if(!name || !email || !password){
    showPopup("Fill all fields");
    return;
  }

  if(!agree){
    showPopup("You must agree to continue");
    return;
  }

fetch("https://ziyaworld-backend-r9xm.onrender.com/api/auth/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
.then(async res => {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid server response");
  }
  return data;
})
.then(data => {

  console.log("SIGNUP RESPONSE:", data);

  if(data.success === false){
    showPopup(data.message || data.msg || "Signup failed");
    return;
  }

  if(!data.token){
    showPopup(data.message || data.msg || "Signup failed");
    return;
  }

  localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify({
_id: data.user._id || data.user.id,
  name: data.user.name,
  email: data.user.email,
  role: data.user.role,
}));

  localStorage.setItem("loginTime", Date.now()); // ⭐ ADD THIS

  showPopup("Account created!");

const redirect = localStorage.getItem("redirectAfterLogin");

setTimeout(() => {

  if(redirect === "checkout"){
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "index.html?openCheckout=true";
  } else {
    window.location.href = "index.html";
  }

}, 1000);

})
  .catch(err => {
    console.error(err);
    showPopup("Network error");
  });
}

function goBack(){
  window.location.href = "index.html";
}

function showToast(message){

  const toast = document.getElementById("toast");
  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1000); // ⏱ 1 second
  }

function showPopup(message){

  const popup = document.createElement("div");
  popup.innerText = message;

  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";

  popup.style.background = "#000";
  popup.style.color = "#fff";
  popup.style.padding = "12px 20px";
  popup.style.borderRadius = "6px";

  popup.style.zIndex = "999999";   // 🔥 IMPORTANT (HIGHER THAN MODAL)
  popup.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 2000);
} 

function openAuth() {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "flex";

  // 🚫 STOP BACKGROUND SCROLL
  document.body.classList.add("modal-open");
}

function closeAuth() {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "none";

  // ✅ RESTORE SCROLL
  document.body.classList.remove("modal-open");
}

window.onload = function(){

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if(mode === "signup"){
    toggleAuth(); // switch to signup automatically
  }

};

// OPEN MODAL
document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.getElementById("forgotLink");

  if(forgotLink){
    forgotLink.addEventListener("click", (e)=>{
      e.preventDefault();
      document.getElementById("forgotModal").style.display = "flex";
    });
  }
});

function openForgot() {
  const modal = document.getElementById("forgotModal");
  if (modal) modal.style.display = "flex";
}

// CLOSE MODAL
function closeForgot(){
  document.getElementById("forgotModal").style.display = "none";

  // 🔥 CLEAR FIELDS (important UX)
  document.getElementById("otpEmail").value = "";
  document.getElementById("otpCode").value = "";
  document.getElementById("otpPassword").value = "";
}

async function sendOTP() {
  const email = document.getElementById("otpEmail").value.trim();

  if (!email) {
    showPopup("Enter email");
    return;
  }

  const res = await fetch("https://ziyaworld-backend-r9xm.onrender.com/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  // 🔥 FIX: handle both object and string response safely
  if (typeof data === "string") {
    showPopup(data);
    return;
  }

  if (!data.success) {
    showPopup(data.message || "Failed to send code");
    return;
  }

  showPopup(data.message || "Code sent to email");
}

async function resetPassword() {
  const email = document.getElementById("otpEmail").value.trim();
  const otp = document.getElementById("otpCode").value.trim();
  const password = document.getElementById("otpPassword").value.trim();

  if (!email || !otp || !password) {
    showPopup("All fields required");
    return;
  }

  const res = await fetch("https://ziyaworld-backend-r9xm.onrender.com/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, password })
  });

  const data = await res.json();

  // 🔥 SAFE CHECK
  if (!data.success) {
    showPopup(data.message || "Reset failed");
    return;
  }

  showPopup(data.message || "Password updated");

  // ✅ AUTO CLOSE MODAL
  setTimeout(() => {
    closeForgot();
  }, 1200);
}

