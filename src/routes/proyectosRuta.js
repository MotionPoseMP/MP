const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/', proyectosController.view);
module.exports = router;