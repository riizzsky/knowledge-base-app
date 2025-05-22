const { ArticleMetadata } = require('../models/mysqlModels');
const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  try {
    const { userId, title, slug, status, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Simpan metadata DAN image path ke MySQL
    const metadata = await ArticleMetadata.create({ 
      title, 
      slug, 
      status, 
      image: imagePath, // Simpan image path di MySQL
      UserId: userId 
    });

    // Simpan hanya content dan revisions ke MongoDB
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
    // Ambil semua metadata artikel dari MySQL (termasuk image)
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
          image: metadata.image, // Ambil image dari MySQL
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
  const articleId = parseInt(req.params.id, 10);
  const { title, slug, status, content } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Update metadata DAN image di MySQL
    const metadata = await ArticleMetadata.findByPk(articleId);
    if (!metadata) {
      return res.status(404).json({ error: 'Article metadata not found' });
    }

    // Prepare update data untuk MySQL
    const updateData = { title, slug, status };
    if (imagePath) {
      updateData.image = imagePath; // Update image path di MySQL
    }

    await metadata.update(updateData);

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

exports.deleteArticle = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);

  try {
    // Hapus konten dari MongoDB terlebih dahulu
    await Article.deleteOne({ articleId });

    // Hapus metadata (termasuk image path) dari MySQL
    const deleted = await ArticleMetadata.destroy({ where: { id: articleId } });

    if (!deleted) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};