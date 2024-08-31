document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('Token no encontrado en localStorage');
            window.location.href = '/index.html';
            return;
        }

        const response = await fetch('/auth/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);

        if (response.status === 401 || response.status === 403) {
            console.log('No autorizado o acceso prohibido');
            window.location.href = '/index.html';
        } else if (response.ok) {
            const data = await response.json();
            console.log(`Usuario autenticado: ${data.username}`);
        } else {
            console.log('Respuesta inesperada:', await response.text());
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        window.location.href = '/index.html';
    }
});