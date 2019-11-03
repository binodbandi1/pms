const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Mongodbuser:Mongodbuser@1.@cluster0-0l9qv.mongodb.net/test?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true,
});

var conn = mongoose.connection;

var userSchema = new mongoose.Schema({ 
	username : {
		type : String,
		required : true,
		index : {
			unique : true
		}
	},
	email : {
		type : String,
		required : true,
		index : {
			unique : true
		}
	},
	password : {
		type : String,
		required : true,
		 
	},
	date:{
		type : Date,
		default : Date.now
	}
	});
 
 var userModel = mongoose.model('user', userSchema);

 module.exports = userModel;

  