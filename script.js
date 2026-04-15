// ================= PRODUCTS =================

const shoes = [
{ name:"Ankle Platform Boots", price:65000, image:"images/shoes/ankle-platform-boots.jpg"},
{ name:"Attico Devon Sandals", price:60000, image:"images/shoes/attico-devon-sandals.jpg"},
{ name:"Avo Chunky Slippers", price:45000, image:"images/shoes/avo-chunky-slippers.jpg"},
{ name:"Black Platform Wedges", price:70000, image:"images/shoes/black-platform-wedges.jpg"},
{ name:"Black Slingback Stiletto", price:68000, image:"images/shoes/black-slingback-stiletto.jpg"},
{ name:"Black Sock Boots", price:72000, image:"images/shoes/black-sock-boots.jpg"},
{ name:"Brown Mary Platform", price:64000, image:"images/shoes/brown-mary-platform.jpg"},
{ name:"Burgundy Slingback Heels", price:66000, image:"images/shoes/burgundy-slingback-heels.jpg"},
{ name:"Chanel Slingback Heels", price:90000, image:"images/shoes/chanel-slingback-heels.jpg"},
{ name:"Chunky Loafers", price:50000, image:"images/shoes/chunky-loafers.jpg"},
{ name:"Decollete Slingback Fiorato", price:75000, image:"images/shoes/decollete-slingback-fiorato.jpg"},
{ name:"Humble Heels", price:42000, image:"images/shoes/humble-heels.jpg"},
{ name:"Manolo Blahnik Sandals", price:120000, image:"images/shoes/manolo-blahnik-sandals.jpg"},
{ name:"Marley Slingback Pumps", price:67000, image:"images/shoes/marley-slingback-pumps.jpg"},
{ name:"Melissa Thong Wedge", price:53000, image:"images/shoes/melissa-thong-wedge.jpg"},
{ name:"New Balance 725", price:85000, image:"images/shoes/new-balance-725.jpg"},
{ name:"Peony Pearl Heels", price:73000, image:"images/shoes/peony-pearl-heels.jpg"},
{ name:"Square Toe Slingback Flats", price:48000, image:"images/shoes/square-toe-slingback-flats.jpg"}
];

const clothes = [
{ name:"Adunni Dress", price:55000, image:"images/clothes/adunni-dress.jpg"},
{ name:"Ankara Balloon Skirt", price:40000, image:"images/clothes/ankara-balloon-skirt.jpg"},
{ name:"Asymmetric Neckline Dress", price:60000, image:"images/clothes/asymmetric-neckline-dress.jpg"},
{ name:"Aya Dress", price:50000, image:"images/clothes/aya-dress.jpg"},
{ name:"Boho Vintage", price:45000, image:"images/clothes/boho-vintage.jpg"},
{ name:"Boubou", price:70000, image:"images/clothes/boubou.jpg"},
{ name:"Boubou Inspired Ensemble", price:75000, image:"images/clothes/boubou-inspired-ensemble.jpg"},
{ name:"Cascade Dress", price:58000, image:"images/clothes/cascade-dress.jpg"},
{ name:"Houndstooth Patterned Jacket", price:62000, image:"images/clothes/houndstooth-patterned-jacket.jpg"},
{ name:"Keyina Kouture", price:85000, image:"images/clothes/keyina-kouture.jpg"},
{ name:"Lantern Sleeve Co-ord", price:65000, image:"images/clothes/lantern-sleeve-wide-leg-co-ord.jpg"},
{ name:"Maxi Length Kaftan", price:68000, image:"images/clothes/maxi-length-kaftan.jpg"},
{ name:"Mynali", price:47000, image:"images/clothes/mynali.jpg"},
{ name:"Navy Blue Satin Jumpsuit", price:72000, image:"images/clothes/navy-blue-satin-jumpsuit.jpg"},
{ name:"Red Formal Gown", price:95000, image:"images/clothes/red-formal-gown.jpg"},
{ name:"Seige and Brown Gown", price:88000, image:"images/clothes/seige-and-brown-gown.jpg"},
{ name:"Shaina Set 2.0", price:54000, image:"images/clothes/shaina-set-2-0.jpg"},
{ name:"Tandoori Maxi Dress", price:76000, image:"images/clothes/tandoori-maxi-dress.jpg"}
];

// ================= STORAGE =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= PRODUCT DISPLAY =================

function displayProducts(items,type){

const container = document.getElementById("products");

container.innerHTML = "";
container.style.display = "grid";

document.getElementById("hero").style.display = "none";
document.getElementById("backBtn").style.display = "block"; // show back button
items.forEach((item,index)=>{

container.innerHTML += `

<div class="card">

<img src="${item.image}" onclick="openViewer('${item.name}', ${item.price}, '${item.image}')">

<h3>${item.name}</h3>

<p class="price">₦${item.price.toLocaleString()}</p>

<div class="qty-box">

<button onclick="changeProductQty('${type}',${index},-1)">-</button>

<input id="qty-${type}-${index}" value="1" min="1">

<button onclick="changeProductQty('${type}',${index},1)">+</button>

</div>

<button class="main-btn" onclick="addToCart('${type}',${index})">

Add to Cart

</button>

</div>

`;

});

}

function showClothes(){
  closeMenu();
  displayProducts(clothes,"clothes");
}

function showShoes(){
  closeMenu();
  displayProducts(shoes,"shoes");
}

function showHome(){
  document.getElementById("hero").style.display = "flex";
  document.getElementById("products").style.display = "none";
  const backBtn = document.getElementById("backBtn");
  if(backBtn) backBtn.style.display = "none"; // hide when going home
}

// ================= QUANTITY =================

function changeProductQty(type,index,change){

const input=document.getElementById(`qty-${type}-${index}`);

let value=parseInt(input.value)||1;

value+=change;

if(value<1)value=1;

input.value=value;

}

// ================= CART SYSTEM =================

// Save cart to browser storage
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}


// Add product to cart
function addToCart(type, index){

  const item = type === "shoes" ? shoes[index] : clothes[index];
  const quantityInput = document.getElementById(`qty-${type}-${index}`);
  const quantity = parseInt(quantityInput.value) || 1;

  const existingItem = cart.find(cartItem => cartItem.name === item.name);

  if(existingItem){
    existingItem.quantity += quantity;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: quantity
    });
  }

  saveCart();
  alert("added to cart!");

 quantityInput.value = 1;   // ⭐ RESET CLEANLY

  renderCart();
}


// Open cart panel
function openCart(){

   closeMenu(); // 🔥

  closePanels(); // close other side panels

  const cartPanel = document.getElementById("cartPanel");

  if(!cartPanel){
    console.error("Cart panel not found in HTML.");
    return;
  }

  cartPanel.classList.add("active");

  renderCart();
}


// Render cart items
function renderCart(){

  const container = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("cartTotal");

  if(!container || !totalDisplay) return;

  container.innerHTML = "";

  if(cart.length === 0){
    container.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    totalDisplay.innerText = "Total: ₦0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {

    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">

        <img src="${item.image}" alt="${item.name}">

        <div class="cart-details">
          <p><strong>${item.name}</strong></p>
          <p>₦${item.price.toLocaleString()}</p>

          <div class="cart-qty">
            <button onclick="decreaseQty(${index})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>
        </div>

        <button class="remove-btn" onclick="removeItem(${index})">✖</button>

      </div>
    `;
  });

  totalDisplay.innerText = "Total: ₦" + total.toLocaleString();
}


// Increase item quantity
function increaseQty(index){

  cart[index].quantity++;

  saveCart();
  renderCart();
}


// Decrease item quantity
function decreaseQty(index){

  if(cart[index].quantity > 1){
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}


// Remove item completely
function removeItem(index){

  cart.splice(index, 1);

  saveCart();
  renderCart();
}


// Clear entire cart (optional function)
function clearCart(){

  cart = [];

  saveCart();
  renderCart();
}


// Close cart panel
function closeCart(){
  document.getElementById("cartPanel").classList.remove("active");
}


window.onload = function(){
  renderCart();
  document.getElementById("checkoutOverlay").style.display = "none";
  closePanels();
};



// ================= FULL CHECKOUT SYSTEM =================


// RENDER CHECKOUT SUMMARY
function renderCheckoutSummary() {

  const itemsContainer = document.getElementById("checkoutItems");
  const subtotalText = document.getElementById("checkoutSubtotal");
  const deliveryText = document.getElementById("checkoutDelivery");
  const totalText = document.getElementById("checkoutTotal");

  itemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {

    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsContainer.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <div>
          <strong>${item.name}</strong> (x${item.quantity})
          <br>
          <small>₦${item.price.toLocaleString()} each</small>
        </div>
        <div>
          ₦${itemTotal.toLocaleString()}
        </div>
      </div>
    `;
  });

  const deliveryFee = parseInt(document.getElementById("deliveryMethod").value || 0);

  subtotalText.innerText = "Subtotal: ₦" + subtotal.toLocaleString();
  deliveryText.innerText = "Delivery: ₦" + deliveryFee.toLocaleString();
  totalText.innerText = "Total: ₦" + (subtotal + deliveryFee).toLocaleString();
}


// UPDATE TOTAL WHEN DELIVERY CHANGES
function updateDeliveryTotal(){
  renderCheckoutSummary();
}

function saveOrderToBackend(order){

  const token = localStorage.getItem("token");

  if(!token){
    alert("Please login first!");
    window.location.href = "auth.html";
    return;
  }

  const backendOrder = {
    items: order.items,
    amount: order.total,
    address: order.customer.address,
    phone: order.customer.phone,
    name: order.customer.name,
    paymentMethod: order.paymentMethod
  };

  fetch('https://ziyaworld-backend-r9xm.onrender.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token   // ⭐ ADD THIS
    },
    body: JSON.stringify(backendOrder)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Saved:", data);
  })
  .catch(err => {
    console.error(err);
  });
}

function updateCheckoutUI(){
  const token = localStorage.getItem("token");
  const btn = document.querySelector(".checkout-btn");

  if(!btn) return;

  if(!token){
    btn.innerText = "Login to Order";
  } else {
    btn.innerText = "Proceed Order";
  }
}


// PLACE ORDER
let pendingTransferOrder = null;

function checkout() {

  const token = localStorage.getItem("token");

  if (!token) {
    showToast("login before placing order");
     showAuthChoice(); // 🔥 NEW POPUP
    return; // stop checkout
  }

const user = JSON.parse(localStorage.getItem("user")) || {};
const profile = JSON.parse(localStorage.getItem("profile")) || {};

const name = user.name || profile.name || document.getElementById("custName").value.trim();
const phone = profile.phone || document.getElementById("custPhone").value.trim();
const address = profile.address || document.getElementById("custAddress").value.trim();

  const delivery = parseInt(document.getElementById("deliveryMethod").value || 0);
  const payment = document.getElementById("paymentMethod").value;

  if (!phone || !address || !name) {
    alert("Please enter all delivery details");
    return;
  }

  // ✅ SAVE PROFILE (THIS IS WHAT YOU WANTED BACK)
  localStorage.setItem("profile", JSON.stringify({
    name,
    phone,
    address
  }));

  if(profile.name){
  document.getElementById("custName").readOnly = true;
}

if(profile.phone){
  document.getElementById("custPhone").readOnly = true;
}

if(profile.address){
  document.getElementById("custAddress").readOnly = true;
}

  let subtotal = 0;
  cart.forEach(i => subtotal += i.price * i.quantity);
  const total = subtotal + delivery;

  const newOrder = {
    id: Date.now(),
    customer: { name, phone, address },
    items: [...cart],
    subtotal,
    deliveryFee: delivery,
    total,
    paymentMethod: payment,
    status: "",
    date: new Date().toLocaleString()
  };

  if (!token) {
  localStorage.setItem("redirectAfterLogin", "checkout"); // ⭐ ADD
  showAuthChoice();
  return;
}

  // ✅ COD
  if (payment === "cod") {
    newOrder.status = "Processing";

    saveOrderToBackend(newOrder);
    finishCheckout();

    alert("Order placed! Pay on delivery.");
    renderOrders();
    return;
  }

  // ✅ TRANSFER
  if (payment === "transfer") {
    newOrder.status = "Pending Confirmation";
    pendingTransferOrder = newOrder;

    openTransferModal(newOrder.total);
    document.getElementById("checkoutOverlay").style.display = "none";
    return;
  }

  // 3️⃣ Card Payment
  if(payment === "card") {
    const email = "ziyaworldonline@gmail.com"; // use customer's email
    const amount = total * 100; // convert to kobo

    let handler = PaystackPop.setup({
    key: "pk_test_e42bfdd67356f1f0db6f49574934828cba61c233",

    email: email,

    // ✅ Paystack uses kobo
    amount: total * 100,
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      currency: "NGN",
      callback: function(response) {
        // call your backend to verify payment
        fetch("https://ziyaworld-backend-r9xm.onrender.com/api/payment/verify/" + response.reference)
          .then(res => res.json())
          .then(data => {
if(data.success){
  newOrder.status = "Completed";

  saveOrderToBackend(newOrder); // ✅ SEND

  finishCheckout();
              alert("Payment successful! Ref: " + response.reference);
              renderOrders();
            } else {
              alert("Payment verification failed!");
            }
          })
          .catch(err => alert("Verification error: " + err));
      },
      onClose: function(){
        alert("Payment cancelled.");
      }
    });

    handler.openIframe();
    return;
  }

} // ✅ CLOSE checkout() FUNCTION HERE


// ================= FINISH CHECKOUT =================
function finishCheckout() {

  cart = [];
  saveCart();
  renderCart();

  document.getElementById("checkoutOverlay").style.display = "none";
}

// ================= BANK TRANSFER =================

function openTransferModal(amount) {

  document.getElementById("transferAmount").innerText =
    amount.toLocaleString();

  document.getElementById("transferModal").style.display = "block";
}

function closeTransferModal() {
  document.getElementById("transferModal").style.display = "none";
}

// When user clicks "I HAVE PAID"

document.getElementById("confirmTransferBtn").onclick = function () {

  if(!pendingTransferOrder) return;

  saveOrderToBackend(pendingTransferOrder); // ✅ SEND

  pendingTransferOrder = null;

  finishCheckout();
  closeTransferModal();

  alert("Payment recorded! Order is Pending Confirmation.");
};

let pendingCardOrder = null;

// Open Card Payment Modal
function openCardPayment(order) {
  pendingCardOrder = order;

  document.getElementById("cardPaymentModal").style.display = "flex";
  document.getElementById("cardInputSection").style.display = "flex";
  document.getElementById("cardScanSection").style.display = "none";
  document.getElementById("paymentSuccess").style.display = "none";

  document.getElementById("cardAmountDisplay").innerText = order.total.toLocaleString();
  document.getElementById("cardAmountScan").innerText = order.total.toLocaleString();
}

// Cancel card payment → back to checkout
function cancelCardPayment() {
  pendingCardOrder = null;
  document.getElementById("cardPaymentModal").style.display = "none";
  document.getElementById("checkoutOverlay").style.display = "flex";
}

// Open scan section
document.getElementById("scanCardBtn").onclick = async function() {
  if(!pendingCardOrder) return;

  document.getElementById("cardInputSection").style.display = "none";
  document.getElementById("cardScanSection").style.display = "flex";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    document.getElementById("scanVideo").srcObject = stream;
  } catch (err) {
    alert("Cannot access camera: " + err);
    document.getElementById("cardScanSection").style.display = "none";
    document.getElementById("cardInputSection").style.display = "flex";
  }
};

// Capture card via camera
function captureScan() {
  const video = document.getElementById("scanVideo");
  const canvas = document.getElementById("scanCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Stop camera
  video.srcObject.getTracks().forEach(track => track.stop());

  // OCR scan with Tesseract.js
  Tesseract.recognize(canvas, 'eng', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      console.log("OCR Result:", text);

      const cardNumberMatch = text.replace(/\s/g,'').match(/\d{16}/);
      if(cardNumberMatch)
        document.getElementById("cardNumber").value = cardNumberMatch[0].replace(/(.{4})/g,"$1 ").trim();

      const expiryMatch = text.match(/(0[1-9]|1[0-2])\/?([0-9]{2})/);
      if(expiryMatch)
        document.getElementById("cardExpiry").value = expiryMatch[0];

      const nameMatch = text.match(/[A-Z]{2,}(?: [A-Z]{2,})?/);
      if(nameMatch)
        document.getElementById("cardName").value = nameMatch[0];

      // Return to manual input
      document.getElementById("cardScanSection").style.display = "none";
      document.getElementById("cardInputSection").style.display = "flex";
    });
}

// Cancel scan → back to input
function closeScan() {
  document.getElementById("cardScanSection").style.display = "none";
  document.getElementById("cardInputSection").style.display = "flex";

  const video = document.getElementById("scanVideo");
  if(video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());
}

// Pay Now button
document.getElementById("payCardBtn").onclick = function() {
  if(!pendingCardOrder) return;

  const number = document.getElementById("cardNumber").value.trim();
  const name = document.getElementById("cardName").value.trim();

  if(!number || !name) { alert("Enter card details!"); return; }

  // Show success UI
  document.getElementById("cardInputSection").style.display = "none";
  document.getElementById("paymentSuccess").style.display = "block";

  setTimeout(() => {
    pendingCardOrder.status = "Completed";
    saveOrderToBackend(pendingCardOrder);


    pendingCardOrder = null;
    document.getElementById("cardPaymentModal").style.display = "none";

    // Clear cart
    cart = [];
    saveCart();
    renderCart();

    renderOrders();
    alert("Order placed successfully!");
  }, 1200);
};

// Open checkout overlay
function openCheckout() {

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  // ✅ AUTO FILL
  document.getElementById("custName").value = profile.name || "";
  document.getElementById("custPhone").value = profile.phone || "";
  document.getElementById("custAddress").value = profile.address || "";

  // ⭐ CLOSE CART PANEL
  const cartPanel = document.getElementById("cartPanel");
  if(cartPanel) cartPanel.classList.remove("active");

  // ⭐ LOAD SUMMARY
  renderCheckoutSummary();

  // ⭐ SHOW CHECKOUT
  document.getElementById("checkoutOverlay").style.display = "flex";
}

// Close checkout overlay
function closeCheckout() {
  document.getElementById("checkoutOverlay").style.display = "none";
}

// ================= ORDERS =================

function openOrders() {
  closeMenu(); // 🔥
  closePanels(); // close any other panels
  const panel = document.getElementById("orderPanel");
  if (!panel) return;
  panel.classList.add("active");
  renderOrders(); // render the list
}

// Render all orders
function renderOrders() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("ordersList");

  if (!container) return console.error("Orders container not found");

if (!token) {
  container.innerHTML = `
    <p> login to see your orders</p>
  `;
  return;
}

  container.innerHTML = "Loading orders...";

  fetch('https://ziyaworld-backend-r9xm.onrender.com/api/orders/user', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed request: " + res.status);
    return res.json();
  })
.then(data => {
  const orders = data.orders || data;
  container.innerHTML = "";

  if (!orders.length) {
    container.innerHTML = "No orders yet";
    return;
  }

  orders.reverse().forEach(order => {

let itemsHTML = "";

(order.items || []).forEach(item => {
  const itemTotal = item.price * item.quantity;

  itemsHTML += `
    <div style="
      display:flex;
      align-items:center;
      gap:10px;
      margin-bottom:10px;
      border:1px solid #ddd;
      padding:10px;
      border-radius:10px;
      background:#fff;
    ">
      <img src="${item.image}" style="
        width:60px;
        height:60px;
        object-fit:cover;
        border-radius:8px;
      ">

      <div style="flex:1;">
        <strong>${item.name}</strong><br>
        ₦${item.price.toLocaleString()} each<br>
        <small>Total: ₦${itemTotal.toLocaleString()}</small>
      </div>

      <div style="
        font-weight:bold;
        background:#000;
        color:#fff;
        padding:5px 10px;
        border-radius:6px;
      ">
        x${item.quantity}
      </div>
    </div>
  `;
});

    const div = document.createElement("div");
    div.className = "order-card";

div.innerHTML = `
  <p><strong>Order ID:</strong> ${order._id || order.id}</p>
  <p><strong>Status:</strong> 
    <span style="color:${
      order.status === "Completed" ? "green" :
      order.status === "Processing" ? "orange" :
      "red"
    }">
      ${order.status || "Unknown"}
    </span>
  </p>
  <p><strong>Total:</strong> ₦${(order.amount || order.total).toLocaleString()}</p>

  <div style="margin-top:10px;">${itemsHTML}</div>
`;

    container.appendChild(div);
  });
})
  .catch(err => {
    console.error(err);
    container.innerHTML = "Failed to load orders";
  });
}


// Open individual order details (if you still want a separate popup)
function openOrderDetails(id) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login to view orders.");

  fetch('https://ziyaworld-backend-r9xm.onrender.com/api/orders/user', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    const orders = data.orders || data; // fallback if backend returns array directly
    const order = orders.find(o => (o._id || o.id) === id);

    if (!order) return alert("Order not found!");

    const container = document.getElementById("fullOrderDetails");
    if (!container) return;

    container.innerHTML = "";

let itemsHTML = "";

(order.items || []).forEach(item => {
  const itemTotal = item.price * item.quantity;

  itemsHTML += `
    <div style="
      display:flex;
      align-items:center;
      gap:10px;
      margin-bottom:10px;
      border:1px solid #ddd;
      padding:10px;
      border-radius:10px;
      background:#fff;
    ">
      <img src="${item.image}" style="
        width:60px;
        height:60px;
        object-fit:cover;
        border-radius:8px;
      ">

      <div style="flex:1;">
        <strong>${item.name}</strong><br>
        ₦${item.price.toLocaleString()} each<br>
        <small>Total: ₦${itemTotal.toLocaleString()}</small>
      </div>

      <div style="
        font-weight:bold;
        background:#000;
        color:#fff;
        padding:5px 10px;
        border-radius:6px;
      ">
        x${item.quantity}
      </div>
    </div>
  `;
});

    container.innerHTML = `
      <p><strong>Name:</strong> ${order.customer?.name || order.name || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.customer?.phone || order.phone || "N/A"}</p>
      <p><strong>Address:</strong> ${order.customer?.address || order.address || "N/A"}</p>
      <hr>
      ${itemsHTML}
      <hr>
      <h3>Total: ₦${(order.amount || order.total).toLocaleString()}</h3>
      <p><strong>Status:</strong> ${order.status || "Unknown"}</p>
    `;

    document.getElementById("orderDetailsOverlay").style.display = "flex";
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load order details");
  });
}

// ================================
// PROFESSIONAL PROFILE SETTINGS
// ================================

function openSettings() {
  document.getElementById("settingsPanel").classList.add("active");
}

function closePanels() {
  document.querySelectorAll(".side-panel").forEach(panel => {
    panel.classList.remove("active");
  });
}

// ================= PROFILE SYSTEM CLEAN =================

function openViewProfile() {
  document.getElementById("settingsPanel").style.display = "none";
  document.getElementById("viewProfilePanel").style.display = "block";
}

function openEditProfile() {
  document.getElementById("viewProfilePanel").style.display = "none";
  document.getElementById("editProfilePanel").style.display = "block";
}

function openSecurity() {
  document.getElementById("settingsPanel").style.display = "none";
  document.getElementById("securityPanel").style.display = "block";
}

function backToSettings() {
  document.getElementById("settingsPanel").style.display = "block";
  document.getElementById("viewProfilePanel").style.display = "none";
  document.getElementById("securityPanel").style.display = "none";
}

function backToViewProfile() {
  document.getElementById("editProfilePanel").style.display = "none";
  document.getElementById("viewProfilePanel").style.display = "block";
}

// LOAD PROFILE
function loadProfile(){
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  document.getElementById("viewName").innerText = profile.name || user.name || "User";
  document.getElementById("viewEmail").innerText = user.email || "";
  document.getElementById("viewPhone").innerText = profile.phone || "Not set";
  document.getElementById("viewAddress").innerText = profile.address || "Not set";
}

// LOAD EDIT PROFILE
function loadEditProfile(){
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  document.getElementById("editName").value = profile.name || user.name || "";
  document.getElementById("editEmail").value = user.email || "";
  document.getElementById("editPhone").value = profile.phone || "";
  document.getElementById("editAddress").value = profile.address || "";
}

// SAVE PROFILE
function saveProfile(){

  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const address = document.getElementById("editAddress").value.trim();

  if(!name || !email || !phone || !address){
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("profile", JSON.stringify({
    name,
    email,
    phone,
    address
  }));

  alert("Profile updated!");

  loadProfile();

  // AUTO RETURN
  backToViewProfile();
}

// CHANGE PASSWORD (basic)
function changePassword(){

  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;

  if(!oldPass || !newPass){
    alert("Fill all fields");
    return;
  }

  alert("Password updated successfully");

  backToSettings();
}

function openTerms() {
  document.getElementById("settingsPanel").style.display = "none";
  document.getElementById("termsPanel").style.display = "block";
}

function logoutUser(){

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");

  showPopup("Logged out");

  // Redirect to your homepage
  window.location.href = "index.html"; // ✅ goes to main site
}

// Assuming you have a file input for the user to upload their profile
// Get elements
const editProfileImage = document.getElementById("editProfileImage");
const profileImage = document.getElementById("profileImage");
const editProfileUpload = document.getElementById("editProfileUpload");

// Show preview when user selects a file
editProfileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    editProfileImage.src = reader.result;  // Update edit preview
    profileImage.src = reader.result;      // Update view profile image immediately
  };
  reader.readAsDataURL(file);
});


// ================= CONTACT =================

function openContact(){
  closeMenu(); // 
  closePanels();
  document.getElementById("contactPanel").classList.add("active");
}

// ================= HOME =================

function showHome(){
  document.getElementById("hero").style.display = "block";
  document.getElementById("products").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
}

function closeCheckout() {
  document.getElementById("checkoutOverlay").style.display = "none";
}

function loadCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const itemsContainer = document.getElementById("checkoutItems");
  const subtotalText = document.getElementById("checkoutSubtotal");
  const deliveryText = document.getElementById("checkoutDelivery");
  const totalText = document.getElementById("checkoutTotal");

  itemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsContainer.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <div>
          <strong>${item.name}</strong> (x${item.quantity})
        </div>
        <div>₦${itemTotal.toLocaleString()}</div>
      </div>
    `;
  });

  const deliveryCost = parseInt(document.getElementById("deliveryMethod").value);

  subtotalText.innerText = "Subtotal: ₦" + subtotal.toLocaleString();
  deliveryText.innerText = "Delivery: ₦" + deliveryCost.toLocaleString();
  totalText.innerText = "Total: ₦" + (subtotal + deliveryCost).toLocaleString();
}

// ================= SAVE & LOAD PROFILE =================


// Load profile automatically when page loads
window.addEventListener("load", function () {
  const savedProfile = JSON.parse(localStorage.getItem("profile"));

});

function cancelCheckout(){

  // Hide checkout overlay
  document.getElementById("checkoutOverlay").style.display = "none";

  // Reopen cart panel
  document.getElementById("cartPanel").classList.add("active");
}

function changeTheme(color){
  document.documentElement.style.setProperty("--main-color", color);
  localStorage.setItem("siteColor", color);
}

const savedColor = localStorage.getItem("siteColor");

if(savedColor){
  document.documentElement.style.setProperty("--main-color", savedColor);
}

function openViewer(name, price, image){
  document.getElementById("viewerImg").src = image;
  document.getElementById("viewerName").innerText = name;
  document.getElementById("viewerPrice").innerText = "₦" + price.toLocaleString();

  document.getElementById("productViewer").style.display = "flex";
}

function closeViewer(){
  document.getElementById("productViewer").style.display = "none";
}

function openImage(src){
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImg");

  img.src = src;
  modal.style.display = "flex";
}

function closeImage(){
  document.getElementById("imageModal").style.display = "none";
}

function toggleMenu(){

const menu = document.getElementById("sideMenu")

menu.classList.toggle("active")

}

function closeMenu(){
  const menu = document.getElementById("sideMenu");
  if(menu) menu.classList.remove("active");
}

const backBtn = document.getElementById('backBtn');

if (backBtn) {
  backBtn.style.display = 'none';

  backBtn.addEventListener('click', () => {
    backBtn.style.display = 'none';
  });
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000); // disappears after 3 seconds
}

function closeAuthPopup(){
  document.getElementById("authPopup").style.display = "none";
}

function goToAuth(){
  window.location.href = "auth.html"; // login/signup page
}

function checkSession(){
  const loginTime = localStorage.getItem("loginTime");

  if(!loginTime) return;

  const now = Date.now();
  const diff = now - parseInt(loginTime);

  const ONE_DAY = 24 * 60 * 60 * 1000;

  if(diff > ONE_DAY){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");

    showToast("Session expired. Login again", "error");
  }
}

function showAuthChoice(){

  const box = document.createElement("div");

  box.innerHTML = `
    <div id="authChoiceBox">
      <p>You need an account to place order</p>

      <button onclick="goToLogin()">Login</button>
      <button onclick="goToSignup()">Sign Up</button>
      <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
    </div>
  `;

  document.body.appendChild(box);
}

function handleLoginChoice(){
  document.getElementById("authChoiceBox").parentElement.remove();
window.location.href = "auth.html";
}

function handleSignupChoice(){
  document.getElementById("authChoiceBox").parentElement.remove();
window.location.href = "auth.html";

  setTimeout(() => {
    const title = document.getElementById("authTitle");
    if(title.innerText === "Login"){
      toggleAuth();
    }
  }, 100);
}

function goToLogin(){
  window.location.href = "auth.html";
}

function goToSignup(){
  window.location.href = "auth.html?mode=signup";
}

window.addEventListener("load", () => {

  const params = new URLSearchParams(window.location.search);

  if (params.get("openCheckout") === "true") {

    // small delay so UI finishes loading
    setTimeout(() => {
      openCheckout(); // 🔥 this must already exist in your main JS
    }, 500);

  }

});