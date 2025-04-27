const express = require('express');
const router = express.Router();
const programController = require('../controllers/program.controller');

router.get('/', programController.getAllPrograms);
router.post('/', programController.createProgram);
router.get('/:id', programController.getProgram);

module.exports = router;
