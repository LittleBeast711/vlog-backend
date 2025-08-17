const express = require('express');
const cors = require('cors');
const vlogRoutes = require('./routes/vlog');
const categoryRoutes = require('./routes/category')
const path = require('path');

const app = express();

app.use(cors());            // 跨域
app.use(express.json());    // 解析 JSON
app.use('/api/vlogs', vlogRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));
app.use('/api/categories',categoryRoutes)


const uploadDir = path.join(__dirname, '../../public/uploads');
console.log('静态资源目录:', uploadDir);


module.exports = app;
