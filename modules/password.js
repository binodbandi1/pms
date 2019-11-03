const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Mongodbuser:Mongodbuser@1.@cluster0-0l9qv.mongodb.net/test?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

   var passwordSchema = new mongoose.Schema({
	password : String,
	category_id : String,
	});   
	/* var passwordSchema = new mongoose.Schema({
	//password : String,
	category_id : {
		type : String,
		required : true,
		index : {
			 unique : false 
		 }
		},
		password : {
			type:String,
			required : true,
			index : {
				 unique : false
			}

		},
		date:{
		type : Date,
		default : Date.now
	    },
	 
	});  */
 
 var passwordModel = mongoose.model('password', passwordSchema);

 module.exports = passwordModel;

  