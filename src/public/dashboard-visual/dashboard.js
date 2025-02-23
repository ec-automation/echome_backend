function renderDashboardChart() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No se encontró el token de autenticación');
      return;
    }
  
    fetch('/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const ctx = document.getElementById('overviewChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Usuarios', 'Clientes', 'Órdenes', 'Facturas'],
            datasets: [{
              label: 'Resumen General',
              data: [data.total_users, data.total_clients, data.total_orders, data.total_invoices],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
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
      })
      .catch(error => console.error('Error al obtener datos del dashboard:', error));
  }
  