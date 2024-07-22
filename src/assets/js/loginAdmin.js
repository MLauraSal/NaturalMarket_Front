document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
        errorMsg.textContent = '';
        alert('Inicio de sesión exitoso!');
        // Redirige a la página de administración
        window.location.href = '/src/pages/adminPanel.html';
    } else {
        errorMsg.textContent = 'Email o contraseña incorrectos';
    }
});
