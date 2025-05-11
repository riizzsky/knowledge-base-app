const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

const ArticleMetadata = sequelize.define('ArticleMetadata', {
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  status: DataTypes.STRING,
});

User.hasMany(ArticleMetadata);
ArticleMetadata.belongsTo(User);

module.exports = { User, ArticleMetadata };
