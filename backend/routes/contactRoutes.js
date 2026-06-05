const express = require('express');
const { getContacts, submitContact, respondToContact, getMyContacts, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public/Private operations
router.route('/').post(submitContact);
router.route('/my').get(protect, getMyContacts);

// Admin operations
router.route('/').get(protect, authorize('admin'), getContacts);
router.route('/:id/respond').put(protect, authorize('admin'), respondToContact);
router.route('/:id').delete(protect, authorize('admin'), deleteContact);

module.exports = router;
