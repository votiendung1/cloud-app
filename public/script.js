// Thêm sản phẩm
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;

  const response = await fetch('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, description })
  });
  const result = await response.json();
  alert(result.message);
  e.target.reset();
  loadProductList();
});

// Tìm kiếm sản phẩm
async function searchProduct() {
  const keyword = document.getElementById('searchName').value.toLowerCase().trim();
  const response = await fetch('/products'); // Lấy toàn bộ danh sách sản phẩm
  const result = await response.json();
  const searchResult = document.getElementById('searchResult');

  if (response.ok && Object.keys(result).length > 0) {
    // Lọc sản phẩm có tên chứa từ khóa
    const filteredProducts = Object.entries(result).filter(([id, p]) =>
      p.name.toLowerCase().includes(keyword)
    );
    if (filteredProducts.length > 0) {
      searchResult.innerHTML = filteredProducts.map(([id, p]) =>
        `<div class="p-2 border-bottom">${p.name} - ${p.price} - ${p.description}</div>`
      ).join('');
    } else {
      searchResult.innerHTML = `<div class="p-2 text-muted">Không tìm thấy sản phẩm nào phù hợp</div>`;
    }
  } else {
    searchResult.innerHTML = `<div class="p-2 text-muted">Chưa có sản phẩm nào</div>`;
  }
}

// Xóa sản phẩm
async function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    const response = await fetch(`/products/${id}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
    loadProductList();
  }
}

// Hiển thị modal cập nhật
function showUpdateForm(id, name, price, description) {
  document.getElementById('updateId').value = id;
  document.getElementById('updateName').value = name;
  document.getElementById('updatePrice').value = price;
  document.getElementById('updateDescription').value = description;
  const modal = new bootstrap.Modal(document.getElementById('updateModal'));
  modal.show();
}

// Cập nhật sản phẩm
document.getElementById('updateProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('updateId').value;
  const name = document.getElementById('updateName').value;
  const price = document.getElementById('updatePrice').value;
  const description = document.getElementById('updateDescription').value;

  const response = await fetch(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, description })
  });
  const result = await response.json();
  alert(result.message);
  bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
  loadProductList();
});

// Tải danh sách sản phẩm
async function loadProductList() {
  const response = await fetch('/products');
  const result = await response.json();
  const productList = document.getElementById('productList');
  // Giữ tiêu đề mặc định, chỉ cập nhật danh sách bên dưới
  let productItems = '';
  if (response.ok && Object.keys(result).length > 0) {
    productItems = Object.entries(result).map(([id, p]) =>
      `<div class="product-item">
         <div><span>${p.name}</span></div>
         <div><span>${p.price}</span></div>
         <div><span>${p.description}</span></div>
         <div>
           <button class="btn btn-warning btn-sm me-1" onclick="showUpdateForm('${id}', '${p.name}', '${p.price}', '${p.description}')">Sửa</button>
           <button class="btn btn-danger btn-sm" onclick="deleteProduct('${id}')">Xóa</button>
         </div>
       </div>`
    ).join('');
  } else {
    productItems = '<div class="product-item text-muted"><div><span>Chưa có sản phẩm</span></div><div></div><div></div><div></div></div>';
  }
  // Thêm danh sách sản phẩm sau tiêu đề
  productList.innerHTML = `
    <div class="product-header">
      <div><span>Tên sản phẩm</span></div>
      <div><span>Giá</span></div>
      <div><span>Mô tả</span></div>
      <div><span>Hành động</span></div>
    </div>
    ${productItems}
  `;
}

// Tải danh sách khi trang được tải
window.onload = loadProductList;