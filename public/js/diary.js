const table = document.querySelector('table');

//get entries for the table
const getEntries = async () => {
    const res = await fetch('/api/diary/entries');
    const data = await res.json();
    data.map((entry) => {
        let tr = `<tr>
        <td class="defined">${entry.content}</td>
        <td class="defined">${Date(entry.timestamp).toLocaleString('en-US')}</td>
        <td><button class="delete button">x</button></td>
    </tr>`;
        table.innerHTML += tr;
    });

    //delete entries
    const deleteEntry = document.querySelectorAll('.delete');
    deleteEntry.forEach((button, i) => {
        button.addEventListener('click', async () => {
            display.textContent = '';
            const id = data[i]._id;
            const res = await fetch('/api/diary/entries/' + id, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            });
            const dataDelete = await res.json();
            location.assign('/diary');
        });
    });
}
getEntries();

const form = document.querySelector('form');
const content = document.querySelector('#content');
const display = document.querySelector('.error');

form.addEventListener('submit', async (e) => {
    display.textContent = '';
    e.preventDefault();
    try {
        const res = await fetch('/api/diary/entries', {
            method: 'POST',
            body: JSON.stringify({ content: content.value }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (res.status === 400 || res.status === 401) {
            return display.textContent = `${data.message}. ${data.error ? data.error : ''}`;
        }
        location.assign('/diary');
    } catch (err) {
        console.log(err.message);
    }
})