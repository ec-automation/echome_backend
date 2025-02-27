function renderDashboardChart() {
  const socket = io(); // Initialize Socket.IO
  const ctx = document.getElementById('overviewChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Usuarios', 'Clientes', 'Compañías', 'Productos', 'Órdenes', 'Facturas'],
      datasets: [{
        label: 'Resumen General',
        data: [0, 0, 0, 0, 0, 0], // Initial data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: 'white' } }
      },
      scales: {
        x: { ticks: { color: 'white' } },
        y: { ticks: { color: 'white' } }
      }
    }
  });

  // Listen for real-time updates
  socket.on('db_update', (data) => {
    chart.data.datasets[0].data = [
      data.users,
      data.clients,
      data.companies,
      data.products,
      data.orders,
      data.invoices
    ];
    chart.update();
  });

  // Request initial data
  socket.emit('request_db_update');
}