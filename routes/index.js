var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt  = require('jsonwebtoken')
const { check, validationResult } = require('express-validator'); 
const { matchedData, sanitizeBody } = require('express-validator');  
var passwordCategoryModel = require('../modules/password-category'); 
var passwordCategoryData = passwordCategoryModel.find({}); 
var passwordModel = require('../modules/password');
var passwordData = passwordModel.find({}); 
var userModule = require('../modules/user');
var userData = userModule.find({}); 

function checkLoginUser(req, res, next){
	var userToken = localStorage.getItem('userToken');
	   try { 
	   jwt.verify(userToken, 'loginToken');
	} catch(err) {
	      res.redirect('/'); 
	} 
	next(); 
}

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
/* GET home page. */
router.get('/', function(req, res, next) {
	var userToken = localStorage.getItem('userToken');
	if(userToken){
		res.redirect('/dashboard');
	}
  res.render('index', { title: 'Express' });
});
/**********  Check login and redirect to dashboard **********/
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var checkUserEmail = userModule.findOne({email:email});
	checkUserEmail.exec((err, data) => {
	   if (err) throw err;
	   if (data){
		   var getPassword = data.password;
		   var getUserId = data._id;
		   var getUserName = data.username;
			  if(bcrypt.compareSync(password,getPassword)){

              var token = jwt.sign({ userId: getUserId }, 'loginToken');
	           localStorage.setItem('userToken', token);
	           localStorage.setItem('loginUser', getUserName);
                res.redirect('/dashboard'); 
		        //res.render('index', { title: 'signin user', message : 'User Login Successfully.' });
			  }else{
		        res.render('index', { title: 'signin user', message : 'Invalid Password.' });
			  }
   }else{
       	res.render('index', { title: 'signin user', message : 'Invalid Emailid.' });
   }
	  
	   
	   
	}); 
});

router.get('/logout', function(req, res, next) { 
	 localStorage.removeItem('userToken');
	 localStorage.removeItem('loginUser');  
	 res.redirect('/');
});


router.get('/dashboard',checkLoginUser,  function(req, res, next) {
	var loginUser = localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'User Dashboard', loginUser : loginUser });
});

router.get('/signup', function(req, res, next) { 
	var userToken = localStorage.getItem('userToken');
	if(userToken){
		res.redirect('/dashboard');
	}
  res.render('signup', { title: 'Express' });
});
/**********  middleare check user name and emai unique or not **********/
function checkEmail(req, res, next){
   var email = req.body.email;
   var checkExistEmail = userModule.findOne({email:email});
checkExistEmail.exec((err, data) => {
   if (err) throw err;
   if (data){
   return	res.render('signup', { title: 'signup user', message : 'Error: Email Already Exist.' });
   }
   next();
});
}

function checkUserName(req, res, next){
   var username = req.body.username;
   var checkExistUserName = userModule.findOne({username:username});
checkExistUserName.exec((err, data) => {
   if (err) throw err;
   if (data){
   return	res.render('signup', { title: 'signup user', message : 'Error: User Name Already Exist.' });
   }
   next();
});
}
/************** Signup with middleware ***************/
router.post('/signup', checkEmail, checkUserName, function(req, res, next) { 
	 if(req.body.password != req.body.conpassword){
	 	res.render('signup', { title: 'signup user', message : 'Error: Password not matched with confirm password.' });
	 }
	password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModule({
           	username : req.body.username,
           	email : req.body.email,
           	password : password, 
           }); 

    userDetails.save(function(err, res1){
             if (err) throw err; 
              res.render('signup', { title: 'signup user', message : 'Success: User Details  Successfully Saved' });
			  });
});


/********************* Product category get update delete **************/
router.get('/password-category', function(req, res, next) { 
  passwordCategoryData.exec(function(err, data){
		      if(err) throw err; 
		      console.log(data);
		      res.render('password-category', { title: 'Password Category', records: data, message : 'Success: Saved Category Successfully', error: '' });
			});
});
router.post('/password-category', [
     check('category_name', 'Category can not be blank').not().isEmpty(), 
	], function(req, res, next) {

         const errors = validationResult(req);
		  if (!errors.isEmpty()) {
                 passwordCategoryData.exec(function(err, data){
		      if(err) throw err;  
		      res.render('password-category', { title: 'Password Category', records: data, message : '', error:errors.mapped()});
			});
		    
		  }else{
		  	var passwordCategoryDetails = new passwordCategoryModel({
           	category_name : req.body.category_name 
           });  
           passwordCategoryDetails.save(function(err, res1){
             if (err) throw err;

             passwordCategoryData.exec(function(err, data){
		      if(err) throw err;  
		      res.render('password-category', { title: 'Password Category', records: data, message : 'Saved Category Successfully', error:'' });
			});

           });
		  }


	
  
});

router.get('/password-category/delete/:id', function(req, res, next) {
	  var id = req.params.id;
       var del = passwordCategoryModel.findByIdAndDelete(id);
     // console.log("Hello");
	  del.exec(function(err, data){
      if(err) throw err;
       //res.redirect("/password-category");
       passwordCategoryData.exec(function(err, data){
		      if(err) throw err;  
		      res.render('password-category', { title: 'Password Category', records: data, message : 'Success: Deleted Category Successfully' });
			});
	});  
  
});

/****************  Add new Password ***************/
router.get('/password', function(req, res, next) { 
             passwordData.exec(function(err, data){
		      if(err) throw err;  
		      res.render('password', { title: 'Password List', records: data, message : '', error : '' });
			});
});

router.post('/password', [
	 check('category_id', 'Category can not be blank').not().isEmpty(), 
     check('password', 'Enter minimum 5 character for password').isLength({ min: 5 }),
    
	], function(req, res, next) { 

          const errors = validationResult(req);
		  if (!errors.isEmpty()) {
                passwordData.exec(function(err, data){
		      if(err) throw err;  
		      res.render('password', { title: 'Password List', records: data, message : '', error: errors.mapped()});
			});
		    //return res.status(422).json({ errors: errors.array() });
		  }else{
  	       //const data = matchedData(req);
  	      //  console.log(req.body.password);
  	        //res.redirect("/password"); 
  	        password = bcrypt.hashSync(req.body.password, 10);
            var passwordDetails = new passwordModel({
			password : password,
			category_id : req.body.category_id 
           });  
           passwordDetails.save(function(err, res1){
             if (err) throw err; 
              res.redirect("/password"); 
           });   
       
  }

          
});



module.exports = router;
