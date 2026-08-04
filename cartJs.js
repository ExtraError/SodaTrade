const cartItemsDiv = document.getElementById('cartItems');

async function loadCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        cartItemsDiv.innerHTML = '<p>Please log in to view your cart.</p>';
        return;
    }

    const res = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
    const items = await res.json();

    if (items.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let grandTotal = 0;

    const itemsHTML = items
        .map(item => {
            const lineTotal = parseFloat(item.price) * item.quantity;
            grandTotal += lineTotal;

            return `
                <div>
                    <img src="${API_URL}${item.image}" width="80">
                    <h3>${item.name}</h3>
                    ${item.variant ? `<p>Variant: ${item.variant}</p>` : ''}
                    <div class="qtyStepper" data-cart-id="${item.cart_id}">
                        <button type="button" class="cartQtyMinus">−</button>
                        <span class="cartQtyValue">${item.quantity}</span>
                        <button type="button" class="cartQtyPlus">+</button>
                    </div>
                    <p>₱ ${item.price} each — Subtotal: ₱${lineTotal.toFixed(2)}</p>
                    <button data-id="${item.cart_id}" class="removeBtn">Remove</button>
                </div>
            `;
        })
        .join('');

    cartItemsDiv.innerHTML = `
        ${itemsHTML}
        <h2>Total: ₱${grandTotal.toFixed(2)}</h2>
    `;
}

cartItemsDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('removeBtn')) {
        const id = e.target.dataset.id;
        await fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE' });
        if (window.updateCartCount) window.updateCartCount();
        loadCart();
        return;
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
            return;
        }

        valueEl.textContent = current;

        await fetch(`${API_URL}/api/cart/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: current })
        });

        if (window.updateCartCount) window.updateCartCount();
        loadCart();
    }
});

document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        alert('Please log in first.');
        return;
    }

    await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
    });

    if (window.updateCartCount) window.updateCartCount();

    window.location.href = 'userDashboard.html';
});



loadCart();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        loadCart();
    }
});