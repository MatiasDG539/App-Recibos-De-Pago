document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    this.resizeTo();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Error registrando usuario');
    }
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = './../src/assets/img/visible-eye-open.png';
    } else {
        passwordInput.type = 'password';
        eyeIcon.src = './../src/assets/img/eye-close.png';
    }
}