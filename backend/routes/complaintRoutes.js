const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const ctrl = require('../controllers/complaintController');

// Public helper
router.get('/categories', ctrl.categories);

// Citizen
router.post('/', protect, upload.single('image'), ctrl.create);
router.get('/me', protect, ctrl.myComplaints);
router.post('/:id/upvote', protect, ctrl.upvote);

// Admin
router.get('/', protect, adminOnly, ctrl.listAll);
router.put('/:id/status', protect, adminOnly, ctrl.updateStatus);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
