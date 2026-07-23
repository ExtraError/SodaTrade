const API_URL = 'http://localhost:3000';

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
            .map(v => `<option value="${v.price}">${v.size} - ₱${v.price}</option>`)
            .join('');
        variantSelect.style.display = 'inline-block';

        priceEl.textContent = `₱ ${variants[0].price}`;

        variantSelect.addEventListener('change', () => {
            priceEl.textContent = `₱ ${variantSelect.value}`;
        });
    } else {
        variantSelect.style.display = 'none';
    }

    document.getElementById('detailDescription').textContent = product.description || '';

    document.getElementById('detailAddToCart').addEventListener('click', () => {
        console.log('Add to cart:', product);
    });
}

loadProduct();