document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login/login.html';
    } else {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenPayload.exp < currentTime) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login/login.html';
      } else {
        document.getElementById('username').innerText = `Usuario: ${tokenPayload.username || 'Admin'}`;
      }
    }
  
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('auth_token');
      window.location.href = '/login/login.html';
    });
  });
  