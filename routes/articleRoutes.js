const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const upload = require('../middleware/upload');



router.post('/articles', upload.single('image'), articleController.createArticle);
router.get('/articles', articleController.getAllArticles);
router.put('/articles/:id', upload.single('image'),articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

module.exports = router;
