document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPassForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();

            if(response.ok) {
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch(error) {
            console.error('Error', error);
            alert('Hubo un problema con la solicitud');
        }
    });
});