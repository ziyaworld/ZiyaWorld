const token = localStorage.getItem('token');
const container = document.getElementById('ordersContainer');

if (!token) {
  container.innerHTML = "<p>Please login first</p>";
} else {

  fetch(`https://ziyaworld-backend.onrender.com/api/orders/user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(orders => {

    container.innerHTML = "";

    if (!orders || orders.length === 0) {
      container.innerHTML = '<p>No orders yet.</p>';
      return; // ⭐ STOP HERE
    }

    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'order-card';

      div.innerHTML = `
        <h3>Order ID: ${order._id}</h3>
        <p>Amount: ₦${order.amount}</p>
        <p>Status: ${order.status}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${
            order.status === 'Pending' ? 33 :
            order.status === 'Shipped' ? 66 : 100
          }%"></div>
        </div>
        <hr>
      `;

      container.appendChild(div);
    });

  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading orders</p>";
  });
}