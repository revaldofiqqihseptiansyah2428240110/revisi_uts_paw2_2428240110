const express = require('express');
const router = express.Router();
const sesiFotoController = require('../controllers/sesiFotoController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', sesiFotoController.getAll);
router.get('/:id', sesiFotoController.getById);
router.post('/', cekApiKey, sesiFotoController.create);
router.put('/:id', cekApiKey, sesiFotoController.update);
router.delete('/:id', cekApiKey, sesiFotoController.remove);

module.exports = router;