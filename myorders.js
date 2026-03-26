const token = localStorage.getItem('token'); // user JWT
const userId = localStorage.getItem('userId'); // store user ID after login

fetch(`https://ziyaworld-backend.onrender.com/api/orders/user`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(orders => {
  const container = document.getElementById('ordersContainer');
  if (!orders.length) container.innerHTML = '<p>No orders yet.</p>';

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
      <h3>Order ID: ${order._id}</h3>
      <p>Amount: ₦${order.amount}</p>
      <p>Status: ${order.status}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${order.status === 'Pending' ? 33 : order.status === 'Shipped' ? 66 : 100}%"></div>
      </div>
      <hr>
    `;
    container.appendChild(div);
  });
});