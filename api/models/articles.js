const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title:String,
    url:String,
    thumb:String
})

const Article = mongoose.model('articles',articleSchema);

module.exports = Article;