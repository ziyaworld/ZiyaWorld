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
let orders = JSON.parse(localStorage.getItem("orders")) || [];

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


// Auto-load cart when page loads
window.addEventListener("load", function(){
  renderCart();
});
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


// PLACE ORDER
let pendingTransferOrder = null;

function checkout() {

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const delivery = parseInt(document.getElementById("deliveryMethod").value || 0);
  const payment = document.getElementById("paymentMethod").value;

  if(!name || !phone || !address){
    alert("Fill all delivery details!");
    return;
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

  // ================= PAYMENT TYPES =================

  // 🧾 PAY ON DELIVERY
  if(payment === "cod") {

    newOrder.status = "Processing";

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    finishCheckout();

    alert("Order placed! Status: Processing");

    return;
  }

  // 🏦 BANK TRANSFER
if(payment === "transfer") {

  newOrder.status = "Pending Confirmation";

  // DO NOT SAVE YET
  pendingTransferOrder = newOrder;

  // Show transfer popup
  openTransferModal(newOrder.total);

  // Close checkout temporarily
  document.getElementById("checkoutOverlay").style.display = "none";

  return;
}

 // CARD PAYMENT
  if(payment === "card") {
    // Open Card Payment popup
    openCardPayment(newOrder);
    document.getElementById("checkoutOverlay").style.display = "none";
    return;
  }
}

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

  orders.push(pendingTransferOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  pendingTransferOrder = null;

  finishCheckout(); // clears cart + closes checkout

  closeTransferModal();

  alert("Payment recorded! Order is Pending Confirmation.");

  renderOrders();
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

    // Save order
    orders.push(pendingCardOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

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
  const container = document.getElementById("ordersList");
  if (!container) return;

  const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
  container.innerHTML = "";

  if (savedOrders.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No orders yet.</p>";
    return;
  }

  // Display latest orders first
  savedOrders.slice().reverse().forEach(order => {
    const div = document.createElement("div");
    div.className = "order-card";
    div.style.cursor = "pointer";

    // Build items summary HTML
    let itemsHTML = "";
    order.items.forEach(item => {
      itemsHTML += `
        <div style="display:flex; align-items:center; margin-bottom:6px;">
          <img src="${item.image}" style="width:40px; height:40px; object-fit:cover; margin-right:10px;">
          <div>
            <strong>${item.name}</strong> x${item.quantity}<br>
            ₦${item.price.toLocaleString()} each | Total: ₦${(item.price * item.quantity).toLocaleString()}
          </div>
        </div>
      `;
    });

    div.innerHTML = `
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <div>${itemsHTML}</div>
    `;

    container.appendChild(div);
  });
}

// Open individual order details (if you still want a separate popup)
function openOrderDetails(id) {
  const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = savedOrders.find(o => o.id === id);
  if (!order) return alert("Order not found!");

  const container = document.getElementById("fullOrderDetails");
  container.innerHTML = "";

  let itemsHTML = "";
  order.items.forEach(item => {
    itemsHTML += `
      <div style="display:flex; align-items:center; margin-bottom:8px;">
        <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
        <div>
          <strong>${item.name}</strong> x${item.quantity}<br>
          ₦${item.price.toLocaleString()} each | Total: ₦${(item.price * item.quantity).toLocaleString()}
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <p><strong>Name:</strong> ${order.customer.name}</p>
    <p><strong>Phone:</strong> ${order.customer.phone}</p>
    <p><strong>Address:</strong> ${order.customer.address}</p>
    <hr>
    ${itemsHTML}
    <hr>
    <h3>Total: ₦${order.total.toLocaleString()}</h3>
  `;

  document.getElementById("orderDetailsOverlay").style.display = "flex";
}

function closeOrderDetails() {
  document.getElementById("orderDetailsOverlay").style.display = "none";
}

// ================================
// PROFESSIONAL PROFILE SETTINGS
// ================================

function openSettings(){
  closeMenu(); // 
  closePanels();
  document.getElementById("settingsPanel").classList.add("active");
  loadProfile();
}

function closeSettings(){
  document.getElementById("settingsPanel").classList.remove("active");
}

function saveProfile(){

  const fullName = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();
  const address = document.getElementById("profileAddress").value.trim();

  if(!fullName || !email){
    alert("Full name and email are required.");
    return;
  }

  const profile = {
    fullName,
    email,
    phone,
    address,
    savedAt: new Date().toLocaleString()
  };

  localStorage.setItem("profile", JSON.stringify(profile));

  alert("Profile saved successfully.");
}


function loadProfile(){

  const profile = JSON.parse(localStorage.getItem("profile"));

  if(!profile) return;

  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const phoneInput = document.getElementById("profilePhone");
  const addressInput = document.getElementById("profileAddress");

  if(nameInput) nameInput.value = profile.fullName || "";
  if(emailInput) emailInput.value = profile.email || "";
  if(phoneInput) phoneInput.value = profile.phone || "";
  if(addressInput) addressInput.value = profile.address || "";
}
// ================= CONTACT =================

function openContact(){
  closeMenu(); // 
  closePanels();
  document.getElementById("contactPanel").classList.add("active");
}

// ================= CLOSE PANELS =================

function closePanels(){
  document.querySelectorAll(".side-panel").forEach(panel=>{
    panel.classList.remove("active");
  });
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

function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  const address = document.getElementById("profileAddress").value.trim();

  if (!name || !address) {
    alert("Please fill in your name and address.");
    return;
  }

  const profile = {
    name: name,
    address: address
  };

  // Save to browser storage
  localStorage.setItem("profile", JSON.stringify(profile));

  alert("Profile saved successfully!");
}


// Load profile automatically when page loads
window.addEventListener("load", function () {
  const savedProfile = JSON.parse(localStorage.getItem("profile"));

  if (savedProfile) {
    document.getElementById("profileName").value = savedProfile.name;
    document.getElementById("profileAddress").value = savedProfile.address;
  }
});

function cancelCheckout(){

  // Hide checkout overlay
  document.getElementById("checkoutOverlay").style.display = "none";

  // Reopen cart panel
  document.getElementById("cartPanel").classList.add("active");
}

function changeTheme(theme){

  const colors = {
    black: "#000",
    red: "#8b0000",
    blue: "#001f4d",
    green: "#003300",
    gold: "#b8860b"
  };

  document.documentElement
    .style
    .setProperty("--main-color", colors[theme]);
}

window.onload = function(){
  document.getElementById("checkoutOverlay").style.display = "none";
  closePanels();
};

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

function changeColor(color){

document.documentElement.style.setProperty("--main-color", color);

localStorage.setItem("siteColor", color);

}

const savedColor = localStorage.getItem("siteColor");

if(savedColor){
document.documentElement.style.setProperty("--mainColor", savedColor);
}

function closeMenu(){
  const menu = document.getElementById("sideMenu");
  if(menu) menu.classList.remove("active");
}

const backBtn = document.getElementById('backBtn');

// Show the button
backBtn.style.display = 'block';

// Hide the button
backBtn.style.display = 'none';

// Or toggle
backBtn.addEventListener('click', () => {
  backBtn.style.display = 'none';
});