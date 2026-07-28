const orderItemsDiv = document.getElementById('orderItems');

async function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        orderItemsDiv.innerHTML = '<p>Please log in.</p>';
        return;
    }

    const res = await fetch(`${API_URL}/api/orders/${currentUser.id}`);
    const items = await res.json();

    if (items.length === 0) {
        orderItemsDiv.innerHTML = '<p>No items checked out yet.</p>';
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
                    <button data-id="${item.cart_id}" class="removeOrderBtn">Remove</button>
                </div>
            `;
        })
        .join('');

    orderItemsDiv.innerHTML = `
        ${itemsHTML}
        <h2>Total: ₱${grandTotal.toFixed(2)}</h2>
    `;
}

orderItemsDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('removeOrderBtn')) {
        const id = e.target.dataset.id;
        await fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE' });
        loadOrders();
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

        loadOrders();
    }
});

loadOrders();