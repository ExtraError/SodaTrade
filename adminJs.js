const API_URL = 'http://localhost:3000';

const form = document.getElementById('productForm');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const fileInput = document.getElementById('file');
const fileNameSpan = document.getElementById('file-name');
const adminList = document.getElementById('adminList');

fileInput.addEventListener('change', () => {
    fileNameSpan.textContent = fileInput.files[0]?.name || 'No file selected';
});

async function loadAdminList() {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();

    adminList.innerHTML = products
        .map(p => `
            <div>
                <img src="${API_URL}${p.image}" width="80">
                ${p.name} - ₱${p.price}
                <button data-id="${p.id}" class="deleteBtn">Delete</button>
            </div>
        `)
        .join('');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nameInput.value);
    formData.append('description', descriptionInput.value);
    formData.append('price', priceInput.value);
    if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
    }

    const variants = [];
    const sizes = [
        { size: '5kg', el: document.getElementById('price5kg') },
        { size: '10kg', el: document.getElementById('price10kg') },
        { size: '25kg', el: document.getElementById('price25kg') },
        { size: '50kg', el: document.getElementById('price50kg') },
    ];
    sizes.forEach(({ size, el }) => {
        if (el && el.value) {
            variants.push({ size, price: el.value });
        }
    });
    formData.append('variants', JSON.stringify(variants));

    await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: formData
    });

    form.reset();
    fileNameSpan.textContent = 'No file selected';
    loadAdminList();
});

adminList.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('deleteBtn')) return;
    const id = e.target.dataset.id;
    await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    loadAdminList();
});

loadAdminList();