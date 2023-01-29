
const btnLogin = document.getElementById('btn-login');
const email = document.getElementById('email');
const password = document.getElementById('password');

async function login() {
    const data = {
        email: email.value,
        password: password.value
    }

    const loginData = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    const responseData = await loginData.json();

    if (responseData.message === 'Login Success') {
        location.replace("http://localhost:3000/admin")
    }
    alert(responseData.message);
}

btnLogin.addEventListener('click', login);