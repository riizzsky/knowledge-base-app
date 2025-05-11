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

// ✅ Tambahkan method untuk mendapatkan artikel berdasarkan ID
exports.getArticleById = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);  // Pastikan kita mendapatkan ID sebagai integer

  try {
    // Ambil metadata artikel dari MySQL
    const metadata = await ArticleMetadata.findByPk(articleId);

    if (!metadata) {
      return res.status(404).json({ error: 'Article metadata not found' });
    }

    // Ambil konten artikel dari MongoDB
    const content = await Article.findOne({ articleId });

    if (!content) {
      return res.status(404).json({ error: 'Article content not found' });
    }

    // Gabungkan metadata dan konten dan kirimkan sebagai respons
    res.json({
      id: metadata.id,
      title: metadata.title,
      slug: metadata.slug,
      status: metadata.status,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
      content: content.content,
      revisions: content.revisions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
