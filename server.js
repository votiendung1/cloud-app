const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, query, orderByChild, equalTo } = require('firebase/database');

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình Firebase (thay bằng thông tin của bạn từ Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyB7B-yf4hgnuUqfgDDYGL2Yyi9wLhpEbGc",
    authDomain: "product-manager-bf2d0.firebaseapp.com",
    projectId: "product-manager-bf2d0",
    storageBucket: "product-manager-bf2d0.firebasestorage.app",
    messagingSenderId: "837943426105",
    appId: "1:837943426105:web:fbc2611c4f8e53c94e21e8",
    measurementId: "G-MTRPMBZSWZ"
};

// Khởi tạo Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});

// TK SP
app.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    const productId = Date.now().toString(); // ID đơn giản dựa trên thời gian
    try {
        await set(ref(database, 'products/' + productId), {
            name,
            price,
            description
        });
        res.status(201).json({ message: 'Thêm sản phẩm thành công', id: productId });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    }
});
app.get('/products/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên sản phẩm để tìm kiếm' });
    }
    try {
        const productsRef = ref(database, 'products');
        const searchQuery = query(productsRef, orderByChild('name'), equalTo(name));
        const snapshot = await get(searchQuery);
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val());
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm nào với tên này' });
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error); // Log lỗi ra console để kiểm tra
        res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
});

//xóa SP
const { remove } = require('firebase/database'); // Thêm import này ở đầu file

app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await remove(ref(database, 'products/' + productId));
        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
});

// Update SP
app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    try {
        await set(ref(database, 'products/' + productId), {
            name,
            price,
            description
        });
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
});