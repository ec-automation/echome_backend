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
  const token = localStorage.getItem('auth_token');
  const response = await fetch('/clients', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const clients = await response.json();
  const clientList = document.getElementById('clientList');
  clientList.innerHTML = '';

  if (clients.length === 0) {
    clientList.innerHTML = `<tr><td colspan="4" style="text-align: center;">No existen clientes</td></tr>`;
  } else {
    clients.forEach(client => {
      clientList.innerHTML += `<tr>
        <td>${client.id}</td>
        <td><input type='text' id='name-${client.id}' value='${client.name}'/></td>
        <td><input type='email' id='email-${client.id}' value='${client.email}'/></td>
        <td>
          <button onclick="updateClient(${client.id})">Actualizar</button>
          <button onclick="deleteClient(${client.id})">Eliminar</button>
        </td>
      </tr>`;
    });
  }

  // Agregar botón para crear cliente nuevo
  const clientContainer = document.getElementById('clientContainer');
  if (!document.getElementById('createClientBtn')) {
    const createClientBtn = document.createElement('button');
    createClientBtn.id = 'createClientBtn';
    createClientBtn.innerText = 'Crear Cliente Nuevo';
    createClientBtn.onclick = () => document.getElementById('clientForm').scrollIntoView();
    clientContainer.appendChild(createClientBtn);
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
