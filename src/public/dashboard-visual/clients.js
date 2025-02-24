export async function loadClients() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('No se encontró el token de autenticación');
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/login/login.html';
    }
    return;
  }

  const response = await fetch('/clients', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error('Error al cargar clientes:', response.status);
    return;
  }

  const clients = await response.json();
  const clientList = document.getElementById('clientList');
  clientList.innerHTML = '';

  if (clients.length === 0) {
    clientList.innerHTML = `<tr><td colspan="4" style="text-align: center;">No existen clientes</td></tr>`;
  } else {
    clients.forEach(client => {
      clientList.innerHTML += `<tr>
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>
          <button onclick="updateClient(${client.id})">Actualizar</button>
          <button onclick="deleteClient(${client.id})">Eliminar</button>
        </td>
      </tr>`;
    });
  }
}

export async function updateClient(id) {
  const name = prompt('Nuevo nombre:');
  const email = prompt('Nuevo email:');
  if (name && email) {
    await fetch(`/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    loadClients();
  }
}

export async function deleteClient(id) { // 🔥 Asegurar que está exportado
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    await fetch(`/clients/${id}`, { method: 'DELETE' });
    loadClients();
  }
}

export function loadClientsUI() {
  const content = document.getElementById('content');
  content.innerHTML = `<div id="clientsContainer"> <h1>Gestión de Clientes</h1>
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
    </table></div>`; // Se asegura de que exista antes de llamar a loadClients()
  loadClients();
}
