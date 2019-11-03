const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Mongodbuser:Mongodbuser@1.@cluster0-0l9qv.mongodb.net/test?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

var passwordCategorySchema = new mongoose.Schema({
	category_name : String,
	});
 
 var passwordCategoryModel = mongoose.model('password_category', passwordCategorySchema);

 module.exports = passwordCategoryModel;

  