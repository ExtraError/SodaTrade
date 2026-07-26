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

    cartItemsDiv.innerHTML = items
    .map(item => `
        <div>
            <img src="${API_URL}${item.image}" width="80">
            <h3>${item.name}</h3>
            ${item.variant ? `<p>Variant: ${item.variant}</p>` : ''}
            <div class="qtyStepper" data-cart-id="${item.cart_id}">
                <button type="button" class="cartQtyMinus">−</button>
                <span class="cartQtyValue">${item.quantity}</span>
                <button type="button" class="cartQtyPlus">+</button>
            </div>
            <p>₱ ${item.price}</p>
            <button data-id="${item.cart_id}" class="removeBtn">Remove</button>
        </div>
    `)
    .join('');
}

cartItemsDiv.addEventListener('click', async (e) => {
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
    }
});

loadCart();