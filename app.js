const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || "3000";
const upf = require("./uploder");
 


app.set('view engine','ejs');
 app.use(express.static(__dirname + '/public'));
 app.use('/uploads', express.static('uploads'));


 var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   }
})
var upload = multer({ storage: storage })

 
 
app.get("/",function(req,res){
   res.render("form");
});

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
   // req.file is the `profile-file` file
   // req.body will hold the text fields, if there were any
   console.log("your image file is uplodinf... start Looding");
   console.log(JSON.stringify(req.file))
   
  
   var ipfsr =  upf.pinFileToIPFS(req.file.path,req.body.name,req.body.description);
   ipfsr.then(function(_responce){
    console.log(_responce);
    //deleting the file from upload directory
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err)
        
      }
    else{
      console.log("delete file success fully");
    }});
    console.log("your image file uploded success fully");
  res.render("result",{
    name:req.body.name,
    description: req.body.description,
    filesrc: req.file.path,
    URI: _responce.IpfsHash


  });
   });
     
 })

 
 
 app.listen(port, () => {
   console.log(`Listening to requests on http://localhost:${port}`);});
   