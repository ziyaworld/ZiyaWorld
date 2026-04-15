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
    toggleText.innerText = "Already have an account? Login";
    agreeLabel.style.display = "block"; // ✅ show checkbox
  } else {
    title.innerText = "Login";
    nameInput.style.display = "none";
    loginBtn.style.display = "block";
    signupBtn.style.display = "none";
    toggleText.innerText = "Don't have an account? Sign up";
    agreeLabel.style.display = "none"; // ✅ hide checkbox
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

fetch("https://ziyaworld-backend-r9xm.onrender.com/api/user/login", {
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

  if(data.success === false){
    showPopup(data.message || data.msg || "Login failed");
    return;
  }

  if(!data.token){
    showPopup(data.message || data.msg || "Invalid login");
    return;
  }

  // ✅ SUCCESS
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("loginTime", Date.now()); // ⭐ ADD THIS

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

fetch("https://ziyaworld-backend-r9xm.onrender.com/api/user/register", {
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
  localStorage.setItem("user", JSON.stringify(data.user));
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
  popup.style.padding = "15px 25px";
  popup.style.borderRadius = "6px";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 2000);
} 

function openAuth() {
  const modal = document.getElementById("authModal");
  if(modal) modal.style.display = "flex";
}

function closeAuth() {
  const modal = document.getElementById("authModal");
  if(modal) modal.style.display = "none";
}

window.onload = function(){

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if(mode === "signup"){
    toggleAuth(); // switch to signup automatically
  }

};