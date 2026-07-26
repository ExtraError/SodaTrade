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

window.updateCartCount = async function () {
    const cartCountEl = document.getElementById('cartCount');
    if (!cartCountEl) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        cartCountEl.textContent = '0';
        return;
    }

    const res = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
    const items = await res.json();

    cartCountEl.textContent = items.length;
};

// ---------- CART SLIDER ----------
function buildCartSlider() {
    if (document.getElementById('cartSlider')) return;

    const style = document.createElement('style');
    style.textContent = `
        #cartSlider {
            position: fixed !important;
            top: 0;
            right: 0;
            width: 350px;
            height: 100%;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.2);
            transform: translateX(100%);
            visibility: hidden;
            transition: transform 0.3s ease, visibility 0s linear 0.3s;
            z-index: 9999;
            padding: 1rem;
            overflow-y: auto;
        }
        #cartSlider.open {
            transform: translateX(0);
            visibility: visible;
            transition: transform 0.3s ease, visibility 0s linear 0s;
        }
       #cartOverlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0s linear 0.3s;
        }
        #cartOverlay.open {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease, visibility 0s linear 0s;
        }
        .cartSliderItem {
            display: flex;
            gap: 0.5rem;
            border-bottom: 1px solid #ddd;
            padding: 0.5rem 0;
        }
        .cartSliderItem img {
            width: 60px;
            height: 60px;
            object-fit: cover;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    document.body.appendChild(overlay);

    const slider = document.createElement('div');
    slider.id = 'cartSlider';
    slider.innerHTML = `
        <button id="closeCartSlider">Close &times;</button>
        <h2>Your Cart</h2>
        <div id="cartSliderItems"></div>
    `;
    document.body.appendChild(slider);

    overlay.addEventListener('click', closeCartSlider);
    document.getElementById('closeCartSlider').addEventListener('click', closeCartSlider);
}

async function loadCartSliderItems() {
    const container = document.getElementById('cartSliderItems');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        container.innerHTML = '<p>Please log in to view your cart.</p>';
        return;
    }

    const res = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
    const items = await res.json();

    if (items.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    container.innerHTML = items
    .map(item => `
        <div class="cartSliderItem">
            <img src="${API_URL}${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                ${item.variant ? `<p>Variant: ${item.variant}</p>` : ''}
                <p>₱${item.price}</p>
                <div class="qtyStepper" data-cart-id="${item.cart_id}">
                    <button type="button" class="cartQtyMinus">−</button>
                    <span class="cartQtyValue">${item.quantity}</span>
                    <button type="button" class="cartQtyPlus">+</button>
                </div>
                <button data-id="${item.cart_id}" class="removeCartSliderBtn">Remove</button>
            </div>
        </div>
    `)
    .join('');
}

function openCartSlider() {
    buildCartSlider();

    const slider = document.getElementById('cartSlider');
    const overlay = document.getElementById('cartOverlay');

    // Force the browser to register the starting (closed) position first
    slider.getBoundingClientRect();

    requestAnimationFrame(() => {
        slider.classList.add('open');
        overlay.classList.add('open');
    });

    loadCartSliderItems();
}
function closeCartSlider() {
    const slider = document.getElementById('cartSlider');
    const overlay = document.getElementById('cartOverlay');
    if (slider) slider.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('#cartIconLink')) {
        e.preventDefault();
        openCartSlider();
    }

    if (e.target.classList.contains('removeCartSliderBtn')) {
        const id = e.target.dataset.id;
        await fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE' });
        loadCartSliderItems();
        if (window.updateCartCount) window.updateCartCount();
    }

    if (e.target.classList.contains('cartQtyMinus') || e.target.classList.contains('cartQtyPlus')) {
        const stepper = e.target.closest('.qtyStepper');
        const cartId = stepper.dataset.cartId;
        const valueEl = stepper.querySelector('.cartQtyValue');
        let current = parseInt(valueEl.textContent) || 1;

        if (e.target.classList.contains('cartQtyPlus')) {
            current++;
        } else if (current > 1) {
            current--;
        } else {
            return; // don't go below 1
        }

        valueEl.textContent = current;

        await fetch(`${API_URL}/api/cart/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: current })
        });

        if (window.updateCartCount) window.updateCartCount();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.updateHeaderAuth();
    window.updateCartCount();
});