import { loadClientsUI } from './clients.js';
// Expón las funciones globalmente para que sean accesibles desde el HTML
window.loadSection = loadSection;
window.toggleSidebar = toggleSidebar;


function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function loadSection(section) {
  const content = document.getElementById('content');
  
  if (section === 'dashboard') {
    content.innerHTML = `<h1>Resumen General</h1><canvas id="overviewChart"></canvas>`;
    renderDashboardChart();
  } else if (section === 'clients') {
    content.innerHTML = `<div id="clientsContainer"></div>`;
    loadClientsUI();  // 🔥 Llamamos a una función externa para cargar la UI
  } else {
    content.innerHTML = `<h1>Gestión de ${section.charAt(0).toUpperCase() + section.slice(1)}</h1><p>En desarrollo...</p>`;
  }
}
