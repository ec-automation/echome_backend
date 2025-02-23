function setupClientCrud() {
  document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch('/clients', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });
    
    if (response.ok) {
      document.getElementById('clientForm').reset();
      loadClients();
    } else {
      console.error('Error al crear cliente');
    }
  });
  loadClients();
}

async function loadClients() {
  const clientContainer = document.getElementById('clientsContainer');
  
  if (!clientContainer) {
    console.error("❌ Error: clientContainer no encontrado en el DOM.");
    return;
  }

  clientContainer.innerHTML = "<p>Cargando clientes...</p>";
  
  try {
    const response = await fetch('/clients');
    const clients = await response.json();

    if (clients.length === 0) {
      clientContainer.innerHTML = "<p>No hay clientes registrados.</p>";
    } else {
      clientContainer.innerHTML = `
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${clients.map(client => `
              <tr>
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>
                  <button onclick="updateClient(${client.id})">Editar</button>
                  <button onclick="deleteClient(${client.id})">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } catch (error) {
    console.error("❌ Error al cargar clientes:", error);
    clientContainer.innerHTML = "<p>Error al cargar los clientes.</p>";
  }
}


async function updateClient(id) {
  const name = document.getElementById(`name-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email })
  });
  
  if (response.ok) {
    loadClients();
  } else {
    console.error('Error al actualizar cliente');
  }
}

async function deleteClient(id) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      loadClients();
    } else {
      console.error('Error al eliminar cliente');
    }
  }
}

// Restaurar función de cierre de sesión
function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login/login.html';
  });
}

document.addEventListener('DOMContentLoaded', setupLogout);
