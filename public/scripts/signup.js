const btnCreateUser = document.getElementById('btn-create-user');
const email = document.getElementById('email');
const password = document.getElementById('password');

async function createUser() {

    data = {
        email: email.value,
        password: password.value
    };


    const response = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(response);
}

btnCreateUser.addEventListener('click', createUser)