import express from 'express';
import {
  getAllVlogs,
  getVlogById,
  createVlog,
  updateVlog,
  deleteVlog,
} from '../controllers/vlogController';

const router = express.Router();

// 获取全部 vlogs
router.get('/', getAllVlogs);

// 根据 ID 获取单个 vlog
router.get('/:id', getVlogById);

// 创建新的 vlog
router.post('/', createVlog);

// 更新 vlog
router.put('/:id', updateVlog);

// 删除 vlog
router.delete('/:id', deleteVlog);

export default router;
