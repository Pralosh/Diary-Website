const form = document.querySelector('form');
const username = document.querySelector('#username');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const display = document.querySelector('.error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    display.textContent = '';
    try {
        const res = await fetch('/api/auth/update', {
            method: 'PUT',
            body: JSON.stringify({ username: username.value, name: name.value, email: email.value }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (res.status === 400 || res.status === 401) {
            return display.textContent = `${data.message}. ${data.error ? data.error : ''}`;
        }
        location.assign('/logout');
        alert('Profile Updated');
    } catch (err) {
        console.log(err.message);
    }
})