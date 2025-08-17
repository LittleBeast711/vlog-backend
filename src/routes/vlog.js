const express = require('express');
const router = express.Router();
const {
  getAllVlogs,
  getVlogById,
  createVlog,
  updateVlog,
  deleteVlog,
  uploadCover
} = require('../controllers/vlogController');

router.post('/upload', uploadCover);
router.get('/', getAllVlogs);
router.get('/:id', getVlogById);
router.post('/', createVlog);
router.put('/:id', updateVlog);
router.delete('/:id', deleteVlog);

module.exports = router;
