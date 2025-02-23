function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
  }
  
  function loadSection(section) {
    const content = document.getElementById('content');
    if (section === 'dashboard') {
      content.innerHTML = `
        <h1>Resumen General</h1>
        <canvas id="overviewChart"></canvas>
      `;
      renderDashboardChart();
    } else if (section === 'clients') {
      content.innerHTML = `
        <h1>Gestión de Clientes</h1>
        <form id="clientForm">
          <input type="text" id="clientName" placeholder="Nombre del Cliente" required />
          <input type="email" id="clientEmail" placeholder="Email" required />
          <button type="submit">Agregar Cliente</button>
        </form>
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
          </thead>
          <tbody id="clientList"></tbody>
        </table>
      `;
      setupClientCrud();
    } else {
      content.innerHTML = `<h1>Gestión de ${section.charAt(0).toUpperCase() + section.slice(1)}</h1><p>En desarrollo...</p>`;
    }
  }
  