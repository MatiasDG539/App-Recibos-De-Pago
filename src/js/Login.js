document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        
        if(response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/private/mainMenu.html';
        } else {
            alert('Inicio de sesión fallido. Verifica tu usuario o contraseña.');
        }
    }catch (error) {
        console.error('Error', error);
        alert('Hubo un problema al iniciar sesión. Por favor, intenta de nuevo mas tarde.');
    }
})

//Función para mostrar/ocultar contraseña
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