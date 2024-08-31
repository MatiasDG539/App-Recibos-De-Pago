document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/private/mainMenu.html';
    } else {
        alert(data.message);
    }
});

// Función para mostrar/ocultar la contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = '/assets/img/visible-eye-open.png';
    } else {
        passwordInput.type = 'password';
        eyeIcon.src = '/assets/img/eye-close.png';
    }
}