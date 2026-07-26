

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadProduct() {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();
    const product = products.find(p => p.id == id);

    const detailContainer = document.querySelector('.productDetail');

    if (!product) {
        detailContainer.innerHTML = `<p>Product not found.</p>`;
        return;
    }

    document.getElementById('detailImage').src = `${API_URL}${product.image}`;
    document.getElementById('detailImage').alt = product.name;
    document.getElementById('detailName').textContent = product.name;
    document.getElementById('detailPrice').textContent = `₱ ${product.price}`;

    const variants = product.variants ? JSON.parse(product.variants) : [];
    const variantSelect = document.getElementById('detailVariant');
    const priceEl = document.getElementById('detailPrice');

    if (variants.length > 0) {
    variantSelect.innerHTML = variants
        .map(v => `<option value="${v.size}">${v.size} - ₱${v.price}</option>`)
        .join('');
    variantSelect.style.display = 'inline-block';

    priceEl.textContent = `₱ ${variants[0].price}`;

    variantSelect.addEventListener('change', () => {
        const selected = variants.find(v => v.size === variantSelect.value);
        priceEl.textContent = `₱ ${selected.price}`;
    });
} else {
    variantSelect.style.display = 'none';
}

    document.getElementById('detailDescription').textContent = product.description || '';

    document.getElementById('detailAddToCart').addEventListener('click', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        alert('Please log in first to add items to your cart.');
        return;
    }

    const selectedVariant = variants.length > 0 ? variantSelect.value : null;

    const cartRes = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
    const cartItems = await cartRes.json();
    const alreadyInCart = cartItems.some(item =>
        item.id == product.id && (item.variant || null) === (selectedVariant || null)
    );

    if (alreadyInCart) {
        alert('This product (and variant) is already in your cart. Open your cart to change the quantity.');
        return;
    }

    const quantity = parseInt(document.getElementById('detailQtyValue').textContent) || 1;

    await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_id: product.id,
            variant: selectedVariant,
            quantity: quantity
        })
    });

    if (window.updateCartCount) {
        window.updateCartCount();
    }

    alert('Added to cart!');
});
}

document.getElementById('detailQtyMinus').addEventListener('click', () => {
    const valueEl = document.getElementById('detailQtyValue');
    let current = parseInt(valueEl.textContent) || 1;
    if (current > 1) current--;
    valueEl.textContent = current;
});

document.getElementById('detailQtyPlus').addEventListener('click', () => {
    const valueEl = document.getElementById('detailQtyValue');
    let current = parseInt(valueEl.textContent) || 1;
    current++;
    valueEl.textContent = current;
});

loadProduct();