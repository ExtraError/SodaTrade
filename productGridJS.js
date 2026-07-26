
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
                    <div class="qtyStepper" data-id="${product.id}">
                        <button type="button" class="qtyMinus">−</button>
                        <span class="qtyValue">1</span>
                        <button type="button" class="qtyPlus">+</button>
                    </div>
                    <button type="button" data-id="${product.id}">Add to Cart</button>
                </div>
            </a>
        `)
        .join('');
}

renderCards();


container.addEventListener('click', async (e) => {
    // Handle +/- stepper clicks first
    if (e.target.classList.contains('qtyMinus') || e.target.classList.contains('qtyPlus')) {
        e.preventDefault();
        const stepper = e.target.closest('.qtyStepper');
        const valueEl = stepper.querySelector('.qtyValue');
        let current = parseInt(valueEl.textContent) || 1;

        if (e.target.classList.contains('qtyPlus')) {
            current++;
        } else if (current > 1) {
            current--;
        }

        valueEl.textContent = current;
        return;
    }

    // Handle Add to Cart click
    const btn = e.target.closest('.addToCartBtn button');
    if (!btn) return;

    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        alert('Please log in first to add items to your cart.');
        return;
    }

    const cartRes = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
    const cartItems = await cartRes.json();
    const alreadyInCart = cartItems.some(item => item.id == btn.dataset.id);

    if (alreadyInCart) {
        alert('This product is already in your cart. Open your cart to change the quantity.');
        return;
    }

    const stepper = document.querySelector(`.qtyStepper[data-id="${btn.dataset.id}"]`);
    const quantity = stepper ? parseInt(stepper.querySelector('.qtyValue').textContent) || 1 : 1;

    await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_id: btn.dataset.id,
            quantity: quantity
        })
    });

    if (window.updateCartCount) {
        window.updateCartCount();
    }
});