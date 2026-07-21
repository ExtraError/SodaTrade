const API_URL = 'http://localhost:3000';
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

    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();
    const product = products.find(p => p.id == btn.dataset.id);

    console.log('Add to cart:', product);
});