import { jest } from '@jest/globals';
import { loadClients } from '../src/public/dashboard-visual/clients.js'; // Asegurar que la extensión .js está incluida

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Asegura que la respuesta es válida
    status: 200, // Agrega un status para evitar `undefined`
    json: () => Promise.resolve([{ id: 1, name: 'Juan', email: 'juan@example.com' }])
  })
);

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => 'fake-token'), // Simula un token válido
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

test('loadClients debe cargar la lista de clientes', async () => {
  document.body.innerHTML = '<table><tbody id="clientList"></tbody></table>';

  await loadClients();

  console.log("Contenido de la tabla:", document.getElementById('clientList').innerHTML); // Debug

  expect(document.getElementById('clientList').innerHTML).toContain('Juan');
});
