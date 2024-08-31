document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('/auth/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('userMessage').innerText = `¡Bienvenido ${data.username}!`;
        } else if (response.status === 401 || response.status === 403) {
            window.location.href = '/index.html';
        } else {
            console.error('Error al obtener la información del usuario');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        window.location.href = '/index.html';
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/index.html'; // Redirige si no hay token
        return;
    }

    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/index.html';
        } else {
            console.error('Error al cerrar sesión:', await response.text());
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});