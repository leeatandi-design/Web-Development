const loadUsersBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusEl = document.getElementById('status');
const usersListEl = document.getElementById('users-list');

let allUsers = [];

async function loadUsers() {
    try {
        loadUsersBtn.disabled = true;
        statusEl.textContent = 'Loading users...';
        usersListEl.innerHTML = '';

        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        allUsers = users;

        renderUsers(allUsers);
        statusEl.textContent = `Loaded ${allUsers.length} users successfully.`;

    } catch (error) {
        statusEl.textContent = `Failed to load users: ${error.message}`;
        console.error(error);
    } finally {
        loadUsersBtn.disabled = false;
    }
}

function renderUsers(list) {
    usersListEl.innerHTML = '';

    if (list.length === 0 && allUsers.length > 0) {
        statusEl.textContent = 'No users match your filter.';
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');
        
        const name = document.createElement('strong');
        name.textContent = user.name;
        
        const email = document.createElement('span');
        email.textContent = ` - ${user.email}`;

        const city = document.createElement('span');
        city.textContent = ` - City: ${user.address.city}`;

        const company = document.createElement('span');
        company.textContent = ` - Company: ${user.company.name}`;

        li.appendChild(name);
        li.appendChild(email);
        li.appendChild(city);
        li.appendChild(company);

        usersListEl.appendChild(li);
    });
}

function handleFilter() {
    const filterText = filterInput.value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(filterText)
    );
    renderUsers(filtered);

    if (filtered.length > 0 && filterText) {
        statusEl.textContent = `Showing ${filtered.length} of ${allUsers.length} users.`;
    } else if (filtered.length > 0 && !filterText) {
        statusEl.textContent = `Loaded ${allUsers.length} users successfully.`;
    }
}

loadUsersBtn.addEventListener('click', loadUsers);
filterInput.addEventListener('input', handleFilter);