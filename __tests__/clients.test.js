import { jest } from '@jest/globals';
import { loadClients, updateClient, deleteClient } from '../src/public/dashboard-visual/clients.js'; // Asegurar la extensión .js

global.fetch = jest.fn((url, options) => {
  if (options?.method === 'PUT') {
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 1, name: 'Juan Modificado', email: 'juanmod@example.com' }) });
  }
  if (options?.method === 'DELETE') {
    return Promise.resolve({ ok: true, status: 200 });
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve([{ id: 1, name: 'Juan', email: 'juan@example.com' }])
  });
});

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => 'fake-token'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

test('loadClients debe cargar la lista de clientes', async () => {
  document.body.innerHTML = '<table><tbody id="clientList"></tbody></table>';

  await loadClients();

  console.log("Contenido de la tabla:", document.getElementById('clientList').innerHTML);
  expect(document.getElementById('clientList').innerHTML).toContain('Juan');
});

test('updateClient debe actualizar el nombre y correo del cliente', async () => {
    document.body.innerHTML = '<table><tbody id="clientList"><tr id="client-1">' +
      '<td>1</td>' +
      '<td><input type="text" id="name-1" value="Juan"/></td>' +
      '<td><input type="email" id="email-1" value="juan@example.com"/></td>' +
      '<td><button onclick="updateClient(1)">Actualizar</button></td>' +
      '</tr></tbody></table>';
  
    // 🔥 Mockear `prompt()` para que no falle en Jest
    global.prompt = jest.fn()
      .mockReturnValueOnce('Juan Modificado') // Simula entrada de nombre
      .mockReturnValueOnce('juanmod@example.com'); // Simula entrada de email
  
    await updateClient(1);
  
    expect(global.fetch).toHaveBeenCalledWith('/clients/1', expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name: 'Juan Modificado', email: 'juanmod@example.com' })
    }));
  });
  

test('deleteClient debe eliminar un cliente', async () => {
  document.body.innerHTML = '<table><tbody id="clientList"><tr id="client-1">' +
    '<td>1</td>' +
    '<td>Juan</td>' +
    '<td>juan@example.com</td>' +
    '<td><button onclick="deleteClient(1)">Eliminar</button></td>' +
    '</tr></tbody></table>';

  global.confirm = jest.fn(() => true); // Simula que el usuario confirma la eliminación

  await deleteClient(1);

  expect(global.fetch).toHaveBeenCalledWith('/clients/1', expect.objectContaining({
    method: 'DELETE'
  }));
});
