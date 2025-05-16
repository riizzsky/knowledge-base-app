const { ArticleMetadata } = require('../models/mysqlModels');
const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  try {
    const { userId, title, slug, status, content } = req.body;

    const metadata = await ArticleMetadata.create({ title, slug, status, UserId: userId });

    await Article.create({
      articleId: metadata.id,
      content,
      revisions: [{ updatedAt: new Date(), content }]
    });

    res.status(201).json({ message: 'Article created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    // Ambil semua metadata artikel dari MySQL
    const metadatas = await ArticleMetadata.findAll();

    // Ambil konten artikel dari MongoDB berdasarkan setiap metadata
    const articles = await Promise.all(
      metadatas.map(async (metadata) => {
        const content = await Article.findOne({ articleId: metadata.id });
        return {
          id: metadata.id,
          title: metadata.title,
          slug: metadata.slug,
          status: metadata.status,
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt,
          content: content ? content.content : null,
          revisions: content ? content.revisions : []
        };
      })
    );

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update artikel berdasarkan ID
exports.updateArticle = async (req, res) => {
  const articleId = parseInt(req.params.id, 10); // pastikan dalam bentuk integer
  const { title, slug, status, content } = req.body;

  try {
    // Update metadata (MySQL)
    const metadata = await ArticleMetadata.findByPk(articleId);
    if (!metadata) {
      return res.status(404).json({ error: 'Article metadata not found' });
    }

    await metadata.update({ title, slug, status });

    // Update content & tambah revisi di MongoDB
    const article = await Article.findOne({ articleId });
    if (!article) {
      return res.status(404).json({ error: 'Article content not found' });
    }

    article.content = content;
    article.revisions.push({ updatedAt: new Date(), content });

    await article.save();

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports. deleteArticle = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);

  try {
    // Hapus konten dari MongoDB terlebih dahulu
    await Article.deleteOne({ articleId });

    // Hapus metadata dari MySQL
    const deleted = await ArticleMetadata.destroy({ where: { id: articleId } });

    if (!deleted) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
