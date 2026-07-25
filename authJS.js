const API_URL = 'http://localhost:3000';

// ---------- SIGN UP ----------
const signUpForm = document.getElementById('signUpForm');
const signUpMessage = document.getElementById('signUpMessage');

if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        const res = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            signUpMessage.textContent = data.error || 'Signup failed.';
            signUpMessage.style.color = 'red';
            return;
        }

        signUpMessage.textContent = 'Account created! Redirecting to login...';
        signUpMessage.style.color = 'green';
        signUpForm.reset();

        setTimeout(() => {
            window.location.href = 'userLogin.html';
        }, 1000);
    });
}

// ---------- LOG IN ----------
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            loginMessage.textContent = data.error || 'Login failed.';
            loginMessage.style.color = 'red';
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(data));

        loginMessage.textContent = 'Login successful! Redirecting...';
        loginMessage.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'userDashboard.html';
        }, 1000);
    });
}

// ---------- HEADER: show username + logout if logged in ----------
window.updateHeaderAuth = function () {
    const signUpLoginDiv = document.getElementById('signUpLogin');
    if (!signUpLoginDiv) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser) {
        signUpLoginDiv.innerHTML = `
            <h2>${currentUser.firstName}</h2>
            <span> | </span>
            <h2><a href="#" id="headerLogoutBtn">Log out</a></h2>
        `;

        document.getElementById('headerLogoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
};

// ---------- DASHBOARD LOGOUT BUTTON ----------
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'userLogin.html';
    });
}

// ---------- Run header check automatically if signUpLogin exists directly on this page (not fetched) ----------
document.addEventListener('DOMContentLoaded', () => {
    window.updateHeaderAuth();
});