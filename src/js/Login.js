document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        if(response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            console.log('Redirigiendo a index.html');
            window.location.href = './../../index.html';
        } else {
            alert('Inicio de sesión fallido. Verifica tu usuario o contraseña.');
        }
    }catch (error) {
        console.error('Error', error);
        alert('Hubo un problema al iniciar sesión. Por favor, intenta de nuevo mas tarde.');
    }
})