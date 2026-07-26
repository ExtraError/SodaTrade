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
            <p>Quantity: ${item.quantity}</p>
            <p>₱ ${item.price}</p>
            <button data-id="${item.cart_id}" class="removeBtn">Remove</button>
        </div>
    `)
    .join('');
}

cartItemsDiv.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('removeBtn')) return;
    const id = e.target.dataset.id;
    await fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE' });
    loadCart();
    if (window.updateCartCount) window.updateCartCount();
});

loadCart();