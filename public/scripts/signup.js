const btnCreateUser = document.getElementById('btn-create-user');
const email = document.getElementById('email');
const confirmEmail = document.getElementById('confirm-email');
const password = document.getElementById('password');

async function createUser() {

    if (email.value !== confirmEmail.value) {
        alert('Email does not match!');
        return false;
    }

    data = {
        email: email.value,
        password: password.value
    };


    const signupData = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const response = await signupData.json();
    alert(response.message);
    if (response.message === 'User Added') {
        email.value = '';
        confirmEmail.value = '';
        password.value = '';
    }
}

btnCreateUser.addEventListener('click', createUser)