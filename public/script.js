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
});

// Tìm kiếm sản phẩm
async function searchProduct() {
  const name = document.getElementById('searchName').value;
  const searchResult = document.getElementById('searchResult');

  if (!name) {
    searchResult.innerHTML = '<p>Vui lòng nhập tên sản phẩm để tìm kiếm.</p>';
    return;
  }

  try {
    const response = await fetch(`/products/search?name=${encodeURIComponent(name)}`);
    const result = await response.json();

    if (response.ok) {
      const products = Object.values(result || {});
      if (products.length > 0) {
        searchResult.innerHTML = products.map(p =>
          `<p>${p.name} - ${p.price} - ${p.description}</p>`
        ).join('');
      } else {
        searchResult.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
      }
    } else {
      searchResult.innerHTML = `<p>${result.error || result.message || 'Lỗi không xác định từ server'}</p>`;
    }
  } catch (error) {
    searchResult.innerHTML = `<p>Lỗi kết nối: ${error.message}</p>`;
  }
}