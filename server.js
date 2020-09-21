const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const uniqid = require('uniqid');

const PORT = 3334;
app.use('/form', express.static(__dirname + '/index.html'));

// default options
app.use('/u', express.static(__dirname + '/uploads'));
app.use(fileUpload());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get('/', function(req, res) {
  res.send(401);
});

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (req.body.pass != "sushibtw0") {
    res.send(401);
    return;
  }
  

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;
  
  let fileName = uniqid.time();
  let extension = sampleFile.name.substring(sampleFile.name.lastIndexOf('.') + 1);
  
  if(extension == "png" || extension == "jpg" || extension == "jpeg" || extension == "gif")
  {} else return res.status(401).send('Invalid type.');

  uploadPath = __dirname + '/uploads/' + fileName + "." + extension;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect(`/u/${fileName}.${extension}`);
  });
});

app.get('*', function(req, res) {
  res.send(404);
});

app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});
