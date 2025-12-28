const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;
