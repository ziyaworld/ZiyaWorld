function toggleAuth(){

  const title = document.getElementById("authTitle");
  const nameInput = document.getElementById("authName");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const toggleText = document.getElementById("toggleAuth");

  if(title.innerText === "Login"){

    title.innerText = "Sign Up";
    nameInput.style.display = "block";

    loginBtn.style.display = "none";
    signupBtn.style.display = "block";

    // ✅ CHANGE TEXT
    toggleText.innerText = "Already have an account? Login";

  } else {

    title.innerText = "Login";
    nameInput.style.display = "none";

    loginBtn.style.display = "block";
    signupBtn.style.display = "none";

    // ✅ CHANGE TEXT BACK
    toggleText.innerText = "Don't have an account? Sign up";
  }
}


// ================= LOGIN =================
function login(){

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if(!email || !password){
    showpopup("Please fill all fields");
    return;
  }

  fetch("https://ziyaworld-backend.onrender.com/api/auth/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {

    console.log("LOGIN RESPONSE:", data); // 🔥 DEBUG

if(!data.token){
  showPopup(data.msg || "Account does not exist");
  return;
}

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showPopup("Login successful!");
    window.location.href = "index.html";

  })
  .catch(err => {
    console.error(err);
    showPopup("Server error during login");
  });
}


// ================= SIGNUP =================
function signup(){

  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if(!name || !email || !password){
    showpopup("Please fill all fields");
    return;
  }

  fetch("https://ziyaworld-backend.onrender.com/api/auth/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(async res => {
let data;

try {
  data = await res.json();
} catch {
  throw new Error("Server error (not JSON response)");
}

    return data;
  })
  .then(data => {

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

   showPopup("Account created!");
    window.location.href = "index.html";
  })
  .catch(err => {
    console.error(err);
    showPopup(err.message);
  });
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
  popup.style.top = "25px";
  popup.style.left = "55%";
  popup.style.transform = "translateX(-50%)";
  popup.style.background = "#000";
  popup.style.color = "#fff";
  popup.style.padding = "15px 25px";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000); // 1 second
} 