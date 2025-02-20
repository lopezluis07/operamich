const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

router.post('/grupos', gruposController.createGrupo);
router.get('/grupos', gruposController.getGrupos);
router.delete('/grupos/:id', gruposController.deleteGrupo);

module.exports = router;
