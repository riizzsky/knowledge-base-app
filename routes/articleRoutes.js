const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController')

router.post('/articles', articleController.createArticle);
router.get('/articles/:id', articleController.getArticleById)

module.exports = router;
