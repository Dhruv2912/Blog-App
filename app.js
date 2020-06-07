var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var expressSanitizer = require("express-sanitizer")
var mongoose = require("mongoose")
var express = require("express")
var app = express()

// App Config 
mongoose.connect("mongodb://localhost:27017/restfull_blog_app",{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose Model Config 
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes

//Index route 
app.get("/", function(req,res){
	res.redirect("/blogs");	
});

//New route 
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//Create route
app.post("/blogs",function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err, newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});	
});

//Show route 
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");	
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit Route 
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");	
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//Update route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");	
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//Delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");	
		} else {
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs", function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		} else{
			res.render("index", {blogs: blogs});
		}
	});
});

//Port
app.listen(3000, function(){
	console.log("Started!");
});
	