const API_URL = '/api/products';

// DOM Elements
const productForm = document.getElementById('product-form');
const formTitle = document.getElementById('form-title');
const productIdInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const categoryInput = document.getElementById('category');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const productTableBody = document.getElementById('product-table-body');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const lowStockSection = document.getElementById('low-stock-section');
const lowStockList = document.getElementById('low-stock-list');
const productCount = document.getElementById('product-count');
const toast = document.getElementById('toast');

let isEditing = false;

// ===== Toast Notification =====
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== API Calls =====
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    if (result.success) {
      renderProducts(result.data);
      productCount.textContent = `Total Products: ${result.count}`;
      checkLowStock(result.data);
    }
  } catch (error) {
    showToast('Failed to fetch products', 'error');
    console.error('Fetch error:', error);
  }
}

async function createProduct(productData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const result = await response.json();
    if (result.success) {
      showToast('Product added successfully!', 'success');
      resetForm();
      fetchProducts();
    } else {
      const errorMsg = result.errors
        ? result.errors.join(', ')
        : result.message;
      showToast(errorMsg, 'error');
    }
  } catch (error) {
    showToast('Failed to add product', 'error');
    console.error('Create error:', error);
  }
}

async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const result = await response.json();
    if (result.success) {
      showToast('Product updated successfully!', 'success');
      resetForm();
      fetchProducts();
    } else {
      const errorMsg = result.errors
        ? result.errors.join(', ')
        : result.message;
      showToast(errorMsg, 'error');
    }
  } catch (error) {
    showToast('Failed to update product', 'error');
    console.error('Update error:', error);
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result.success) {
      showToast('Product deleted successfully!', 'success');
      fetchProducts();
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    showToast('Failed to delete product', 'error');
    console.error('Delete error:', error);
  }
}

async function searchProducts(query) {
  try {
    const response = await fetch(
      `${API_URL}/search?q=${encodeURIComponent(query)}`
    );
    const result = await response.json();
    if (result.success) {
      renderProducts(result.data);
      productCount.textContent = `Search Results: ${result.count} product(s) found`;
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    showToast('Search failed', 'error');
    console.error('Search error:', error);
  }
}

// ===== Render Products Table =====
function renderProducts(products) {
  if (products.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">No products found.</td>
      </tr>
    `;
    return;
  }

  productTableBody.innerHTML = products
    .map(
      (product, index) => `
    <tr class="${product.quantity < 5 ? 'low-stock' : ''}">
      <td>${index + 1}</td>
      <td>
        ${escapeHtml(product.name)}
        ${product.quantity < 5 ? '<span class="low-stock-badge">Low Stock</span>' : ''}
      </td>
      <td>${parseFloat(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${escapeHtml(product.category)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit" onclick="editProduct('${product._id}', '${escapeAttr(product.name)}', ${product.price}, ${product.quantity}, '${escapeAttr(product.category)}')">
            Edit
          </button>
          <button class="btn btn-delete" onclick="deleteProduct('${product._id}')">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

// ===== Low Stock Alert =====
function checkLowStock(products) {
  const lowStockProducts = products.filter((p) => p.quantity < 5);
  if (lowStockProducts.length > 0) {
    lowStockSection.style.display = 'block';
    lowStockList.innerHTML = lowStockProducts
      .map(
        (p) =>
          `<li><strong>${escapeHtml(p.name)}</strong> — Only ${p.quantity} left in stock</li>`
      )
      .join('');
  } else {
    lowStockSection.style.display = 'none';
  }
}

// ===== Edit Product (populate form) =====
function editProduct(id, name, price, quantity, category) {
  isEditing = true;
  productIdInput.value = id;
  nameInput.value = name;
  priceInput.value = price;
  quantityInput.value = quantity;
  categoryInput.value = category;
  formTitle.textContent = 'Update Product';
  submitBtn.textContent = 'Update Product';
  cancelBtn.style.display = 'inline-block';
  nameInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Reset Form =====
function resetForm() {
  productForm.reset();
  productIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Add New Product';
  submitBtn.textContent = 'Add Product';
  cancelBtn.style.display = 'none';
}

// ===== Utility: Escape HTML =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Utility: Escape attribute value =====
function escapeAttr(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

// ===== Event Listeners =====

// Form Submit (Add / Update)
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const productData = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value),
    quantity: parseInt(quantityInput.value, 10),
    category: categoryInput.value.trim(),
  };

  // Client-side validation
  if (!productData.name) {
    showToast('Product name is required', 'error');
    return;
  }
  if (isNaN(productData.price) || productData.price < 0) {
    showToast('Price must be a valid positive number', 'error');
    return;
  }
  if (isNaN(productData.quantity) || productData.quantity < 0) {
    showToast('Quantity must be a valid non-negative integer', 'error');
    return;
  }
  if (!productData.category) {
    showToast('Category is required', 'error');
    return;
  }

  if (isEditing) {
    updateProduct(productIdInput.value, productData);
  } else {
    createProduct(productData);
  }
});

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

// Search
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchProducts(query);
  } else {
    showToast('Please enter a search term', 'warning');
  }
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Clear Search
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  fetchProducts();
});

// ===== Initial Load =====
document.addEventListener('DOMContentLoaded', fetchProducts);
