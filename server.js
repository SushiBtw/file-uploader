const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const uniqid = require('uniqid');

const PORT = 3000;
app.use('/form', express.static(__dirname + '/index.html'));

// default options
app.use('/u', express.static(__dirname + '/uploads'));
app.use(fileUpload());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;
  
  let fileName = uniqid.time();
  let extension = sampleFile.name.substring(sampleFile.name.lastIndexOf('.') + 1);

  uploadPath = __dirname + '/uploads/' + fileName + "." + extension;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect(`/u/${fileName}.${extension}`);
  });
});

app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});
