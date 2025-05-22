const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  articleId: Number, 
  content: String,
  revisions: [
    {
      updatedAt: Date,
      content: String,
    }
  ]
});

module.exports = mongoose.model('Article', ArticleSchema);
