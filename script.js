// ================= PRODUCTS =================
const shoes = [
  { name:"Ankle Platform Boots", price:65000, image:"images/shoes/ankle-platform-boots.jpg" },
  { name:"Attico Devon Sandals", price:60000, image:"images/shoes/attico-devon-sandals.jpg" },
  { name:"Avo Chunky Slippers", price:45000, image:"images/shoes/avo-chunky-slippers.jpg" },
  { name:"Black Platform Wedges", price:70000, image:"images/shoes/black-platform-wedges.jpg" },
  { name:"Black Slingback Stiletto", price:68000, image:"images/shoes/black-slingback-stiletto.jpg" },
  { name:"Black Sock Boots", price:72000, image:"images/shoes/black-sock-boots.jpg" },
  { name:"Brown Mary Platform", price:64000, image:"images/shoes/brown-mary-platform.jpg" },
  { name:"Burgundy Slingback Heels", price:66000, image:"images/shoes/burgundy-slingback-heels.jpg" },
  { name:"Chanel Slingback Heels", price:90000, image:"images/shoes/chanel-slingback-heels.jpg" },
  { name:"Chunky Loafers", price:50000, image:"images/shoes/chunky-loafers.jpg" },
  { name:"Decollete Slingback Fiorato", price:75000, image:"images/shoes/decollete-slingback-fiorato.jpg" },
  { name:"Humble Heels", price:42000, image:"images/shoes/humble-heels.jpg" },
  { name:"Manolo Blahnik Sandals", price:120000, image:"images/shoes/manolo-blahnik-sandals.jpg" },
  { name:"Marley Slingback Pumps", price:67000, image:"images/shoes/marley-slingback-pumps.jpg" },
  { name:"Melissa Thong Wedge", price:53000, image:"images/shoes/melissa-thong-wedge.jpg" },
  { name:"New Balance 725", price:85000, image:"images/shoes/new-balance-725.jpg" },
  { name:"Peony Pearl Heels", price:73000, image:"images/shoes/peony-pearl-heels.jpg" },
  { name:"Square Toe Slingback Flats", price:48000, image:"images/shoes/square-toe-slingback-flats.jpg" }
];

const clothes = [
  { name:"Adunni Dress", price:55000, image:"images/clothes/adunni-dress.jpg" },
  { name:"Ankara Balloon Skirt", price:40000, image:"images/clothes/ankara-balloon-skirt.jpg" },
  { name:"Asymmetric Neckline Dress", price:60000, image:"images/clothes/asymmetric-neckline-dress.jpg" },
  { name:"Aya Dress", price:50000, image:"images/clothes/aya-dress.jpg" },
  { name:"Boho Vintage", price:45000, image:"images/clothes/boho-vintage.jpg" },
  { name:"Boubou", price:70000, image:"images/clothes/boubou.jpg" },
  { name:"Boubou Inspired Ensemble", price:75000, image:"images/clothes/boubou-inspired-ensemble.jpg" },
  { name:"Cascade Dress", price:58000, image:"images/clothes/cascade-dress.jpg" },
  { name:"Houndstooth Patterned Jacket", price:62000, image:"images/clothes/houndstooth-patterned-jacket.jpg" },
  { name:"Keyina Kouture", price:85000, image:"images/clothes/keyina-kouture.jpg" },
  { name:"Lantern Sleeve Co-ord", price:65000, image:"images/clothes/lantern-sleeve-wide-leg-co-ord.jpg" },
  { name:"Maxi Length Kaftan", price:68000, image:"images/clothes/maxi-length-kaftan.jpg" },
  { name:"Mynali", price:47000, image:"images/clothes/mynali.jpg" },
  { name:"Navy Blue Satin Jumpsuit", price:72000, image:"images/clothes/navy-blue-satin-jumpsuit.jpg" },
  { name:"Red Formal Gown", price:95000, image:"images/clothes/red-formal-gown.jpg" },
  { name:"Seige and Brown Gown", price:88000, image:"images/clothes/seige-and-brown-gown.jpg" },
  { name:"Shaina Set 2.0", price:54000, image:"images/clothes/shaina-set-2-0.jpg" },
  { name:"Tandoori Maxi Dress", price:76000, image:"images/clothes/tandoori-maxi-dress.jpg" }
];

// ================= STORAGE =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ================= DISPLAY PRODUCTS =================

function displayProducts(items, type){
  const container = document.getElementById("products");
  container.innerHTML = "";
  container.style.display = "grid";

  document.getElementById("hero").style.display = "none";
  document.getElementById("backBtn").style.display = "block";

  items.forEach((item, index) => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.image}">
        <h3>${item.name}</h3>
        <p class="price">₦${item.price.toLocaleString()}</p>

        <div class="qty-box">
          <button onclick="changeProductQty('${type}', ${index}, -1)">-</button>
          <input type="number" id="qty-${type}-${index}" value="1" min="1">
          <button onclick="changeProductQty('${type}', ${index}, 1)">+</button>
        </div>

        <button class="main-btn"
          onclick="addToCart('${type}', ${index})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

function showClothes(){ displayProducts(clothes, "clothes"); }
function showShoes(){ displayProducts(shoes, "shoes"); }

function changeProductQty(type, index, change){
  const input = document.getElementById(`qty-${type}-${index}`);
  let value = parseInt(input.value);
  value += change;
  if(value < 1) value = 1;
  input.value = value;
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
  alert("Added to cart successfully!");

  renderCart();
}


// Open cart panel
function openCart(){

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
function checkout(){

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const deliveryFee = parseInt(document.getElementById("deliveryMethod").value || 0);
  const paymentMethod = document.getElementById("paymentMethod").value;

  if(!name || !phone || !address){
    alert("Please fill in all delivery details.");
    return;
  }

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const total = subtotal + deliveryFee;

  const newOrder = {
    id: Date.now(),
    customer: { name, phone, address },
    items: [...cart],
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    status: "Pending",
    date: new Date().toLocaleString()
  };


  // ================= PAYMENT LOGIC =================

  // 1️⃣ PAY ON DELIVERY
  if(paymentMethod === "cod"){

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();

    alert("Order placed successfully! Pay on delivery selected.");

    document.getElementById("checkoutOverlay").style.display = "none";
    renderCart();
    return;
  }


  // 2️⃣ BANK TRANSFER
  if(paymentMethod === "transfer"){

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();

    alert("Please complete your bank transfer. Order saved.");

    document.getElementById("checkoutOverlay").style.display = "none";
    renderCart();
    return;
  }


  // 3️⃣ CARD (for now simulated)
  if(paymentMethod === "card"){

    alert("Redirecting to secure card payment...");

    // Simulated card success
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();

    document.getElementById("checkoutOverlay").style.display = "none";

    alert("Card payment successful! Order confirmed.");
    renderCart();
    return;
  }

}


// CANCEL CHECKOUT
function cancelCheckout(){
  document.getElementById("checkoutOverlay").style.display = "none";
  openCart();
}

// ================= ORDERS =================

function openOrders(){
  closePanels();
  document.getElementById("orderPanel").classList.add("active");
  renderOrders();
}

function openOrderDetails(id) {

  const order = orders.find(o => o.id === id);

  const container = document.getElementById("fullOrderDetails");

  let itemsHTML = "";

  order.items.forEach(item => {
    itemsHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>${item.name} (x${item.quantity})</span>
        <span>₦${(item.price * item.quantity).toLocaleString()}</span>
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

function closeOrderDetails(){
  document.getElementById("orderDetailsOverlay").style.display = "none";
}

// ================================
// PROFESSIONAL PROFILE SETTINGS
// ================================

function openSettings(){
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

  // BLACK
  if(theme === "black"){
    document.documentElement.style.setProperty("--primary-color", "#000000");
    document.documentElement.style.setProperty("--background-color", "#111111");
    document.documentElement.style.setProperty("--accent-color", "#ffffff");
  }

  // RED
  if(theme === "red"){
    document.documentElement.style.setProperty("--primary-color", "#7a0000");
    document.documentElement.style.setProperty("--background-color", "#2a0000");
    document.documentElement.style.setProperty("--accent-color", "#ff4d4d");
  }

  // BLUE
  if(theme === "blue"){
    document.documentElement.style.setProperty("--primary-color", "#001f4d");
    document.documentElement.style.setProperty("--background-color", "#001433");
    document.documentElement.style.setProperty("--accent-color", "#3399ff");
  }

  // GREEN
  if(theme === "green"){
    document.documentElement.style.setProperty("--primary-color", "#003300");
    document.documentElement.style.setProperty("--background-color", "#001a00");
    document.documentElement.style.setProperty("--accent-color", "#33cc66");
  }

  // GOLD (Luxury Mode 👑)
  if(theme === "gold"){
    document.documentElement.style.setProperty("--primary-color", "#b8860b");
    document.documentElement.style.setProperty("--background-color", "#3d2f00");
    document.documentElement.style.setProperty("--accent-color", "#ffd700");
  }
}

window.onload = function(){
  document.getElementById("checkoutOverlay").style.display = "none";
  closePanels();
};