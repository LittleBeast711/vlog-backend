const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname,'../../data/categories.json');

// 读取 JSON 数据
function readCategories() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return []; // 文件不存在或者格式错误时返回空数组
  }
}


// 保存 JSON 数据
function saveCategories(categories) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(categories, null, 2), 'utf-8');
}


// 统一返回格式
function sendSuccess(res, data, message = 'ok') {
  res.json({ success: true, data, message });
}

function sendError(res, message = 'Error', status = 400) {
  res.status(status).json({ success: false, data: null, message });
}

// 获取全部分类
exports.getAllCategories = (_req, res) => {
  const categories = readCategories();
  sendSuccess(res, categories);
};

// 根据 ID 获取分类
exports.getCategoryById = (req, res) => {
  const id = parseInt(req.params.id);
  const categories = readCategories();
  const category = categories.find(c => c.id === id);
  if (category) {
    sendSuccess(res, category);
  } else {
    sendError(res, 'Category not found', 404);
  }
};

// 新增分类
exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return sendError(res, 'Name is required', 400);

  const categories = readCategories();
  if (categories.find(c => c.name === name)) {
    return sendError(res, 'Category already exists', 400);
  }

  const newCategory = {
    id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
    name,
    createdAt: new Date().toISOString().split('T')[0],
  };
  categories.push(newCategory);
  saveCategories(categories);

  sendSuccess(res, newCategory, 'Category created');
};


// 更新分类
exports.updateCategory = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  const categories = readCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return sendError(res, 'Category not found', 404);

  categories[index] = { ...categories[index], name, createdAt: new Date().toISOString().split('T')[0], };
  saveCategories(categories);

  sendSuccess(res, categories[index], 'Category updated');
};


// 删除分类
exports.deleteCategory = (req, res) => {
  const id = parseInt(req.params.id);
  let categories = readCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return sendError(res, 'Category not found', 404);

  const removed = categories.splice(index, 1);
  saveCategories(categories);

  sendSuccess(res, removed[0], 'Category deleted');
};