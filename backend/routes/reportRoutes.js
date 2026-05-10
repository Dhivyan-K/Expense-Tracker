const express = require('express');
const router = express.Router();
const { getDailyReport, getWeeklyReport, getMonthlyReport, getCategoryReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/categories', getCategoryReport);

module.exports = router;
