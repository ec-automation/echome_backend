function setupClientCrud() {
  document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    await fetch('/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    loadClients();
  });
  loadClients();
}

async function loadClients() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('No se encontró el token de autenticación');
    window.location.href = '/login/login.html'; // Redirigir si no hay token
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


async function updateClient(id) {
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

async function deleteClient(id) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    await fetch(`/clients/${id}`, { method: 'DELETE' });
    loadClients();
  }
}
