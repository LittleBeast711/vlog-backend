const fs = require('fs');
const path = require('path');
const multer = require('multer');

// 上传文件存放目录
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer 配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// 上传封面接口
exports.uploadCover = [
  upload.single('file'), // 前端 Upload 的 name: 'file'
  (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: '未上传文件' });
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    console.log('上传文件名:', req.file.filename);

    res.json({ success: true, data: { url: fullUrl }, message: '上传成功' });
  },
];

// JSON 数据文件路径
const DATA_PATH = path.join(__dirname, '../../data/vlogs.json');

// 读取 JSON 数据
function readVlogs() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return []; // 文件不存在或者格式错误时返回空数组
  }
}

// 保存 JSON 数据
function saveVlogs(vlogs) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(vlogs, null, 2), 'utf-8');
}

// 统一返回格式
function sendSuccess(res, data, message = 'ok') {
  res.json({ success: true, data , message });
}

function sendError(res, message = 'Error', status = 400) {
  res.status(status).json({ success: false, data: null, message });
}

// 获取全部 vlogs
exports.getAllVlogs = (_req, res) => {
  const vlogs = readVlogs();
  console.log('vlogs:', vlogs);
  sendSuccess(res, vlogs);
};

// 根据 ID 获取 vlog
exports.getVlogById = (req, res) => {
  const id = parseInt(req.params.id);
  const vlogs = readVlogs();
  const vlog = vlogs.find(v => v.id === id);
  if (vlog) {
    sendSuccess(res, vlog);
  } else {
    sendError(res, 'Vlog not found', 404);
  }
};

// 新增 vlog
exports.createVlog = (req, res) => {
  const { title, category, cover, createdAt } = req.body;
  if (!title || !category || !cover || !createdAt) {
    return sendError(res, 'Missing fields', 400);
  }
  const vlogs = readVlogs();
  const newVlog = {
    id: Date.now(),
    title,
    category,
    cover,
    createdAt
  };
  vlogs.push(newVlog);
  saveVlogs(vlogs);
  sendSuccess(res, newVlog, 'Vlog created');
};

// 更新 vlog
exports.updateVlog = (req, res) => {
  const id = parseInt(req.params.id);
  const vlogs = readVlogs();
  const index = vlogs.findIndex(v => v.id === id);
  if (index !== -1) {
    vlogs[index] = { ...vlogs[index], ...req.body };
    saveVlogs(vlogs);
    sendSuccess(res, vlogs[index], 'Vlog updated');
  } else {
    sendError(res, 'Vlog not found', 404);
  }
};

// 删除 vlog
exports.deleteVlog = (req, res) => {
  const id = parseInt(req.params.id);
  const vlogs = readVlogs();
  const index = vlogs.findIndex(v => v.id === id);
  if (index !== -1) {
    const removed = vlogs.splice(index, 1);
    saveVlogs(vlogs);
    sendSuccess(res, removed[0], 'Vlog deleted');
  } else {
    sendError(res, 'Vlog not found', 404);
  }
};
