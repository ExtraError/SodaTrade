const API_URL = 'http://localhost:3000';

const form = document.getElementById('productForm');
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
    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('image', fileInput.files[0]);

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