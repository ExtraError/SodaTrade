
const container = document.querySelector('.productCards');

async function renderCards() {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();

    container.innerHTML = products
        .map(product => `
            <a href="productDetail.html?id=${product.id}" class="productCard">
                <img src="${API_URL}${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₱ <span>${product.price}</span></p>
                <div class="addToCartBtn">
                    <button type="button" data-id="${product.id}">Add to Cart</button>
                </div>
            </a>
        `)
        .join('');
}

renderCards();

setInterval(renderCards, 5000); // then re-run every 5000ms (5 seconds)

container.addEventListener('click', async (e) => {
    const btn = e.target.closest('.addToCartBtn button');
    if (!btn) return;

    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        alert('Please log in first to add items to your cart.');
        return;
    }

    await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_id: btn.dataset.id,
            quantity: 1
        })
    });

    if (window.updateCartCount) {
        window.updateCartCount();
    }
});