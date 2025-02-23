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
    const response = await fetch('/clients');
    const clients = await response.json();
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';
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
  