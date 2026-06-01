const express = require('express');

const {
  getJobTypes,
  createJobType,
  updateJobType,
  deleteJobType,
  addToolToJobType,
  removeToolFromJobType,
  getJobTypeChecklist
} = require('../controllers/jobTypeController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getJobTypes);
router.post('/', authMiddleware, adminMiddleware, createJobType);
router.put('/:id', authMiddleware, adminMiddleware, updateJobType);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJobType);

router.get('/:id/checklist', authMiddleware, getJobTypeChecklist);
router.post('/:jobTypeId/tools', authMiddleware, adminMiddleware, addToolToJobType);
router.delete('/tools/:itemId', authMiddleware, adminMiddleware, removeToolFromJobType);

module.exports = router;