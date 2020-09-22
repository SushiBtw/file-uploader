const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const uniqid = require('uniqid');
const config = require('./config.json');

let PORT = config.port || 8080;
let uploadsPath = `/${config.uploadsPath}`;
let localPath = `/${config.localPath}`;
let allowedExtensions = config.allowedExtensions;
let userBase = config.userBase;

app.use(uploadsPath, express.static(`${__dirname}${localPath}`));
app.use(fileUpload());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;
    let user = req.body.username;
    let password = req.body.password;
    let files = req.files;
    let fileName;
    let extension;

    let u = userBase.filter(user => user.username == user);
    if(!u || Object.keys(u).length === 0)
        return res.status(400).send('Invalid user.');
    if(u[0].password !== password)
        return res.status(400).send('Invalid credentials.');


    if (!files || Object.keys(files).length === 0)
        return res.status(400).send('No files were uploaded.');
    sampleFile = req.files.sampleFile;

    fileName = uniqid.time(); // Generate fileName via time-uuid
    extension = sampleFile.name.substring(sampleFile.name.lastIndexOf('.') + 1); // File extension

    if (!allowedExtensions.includes(extension))
        return res.status(401).send('Invalid file extension type.');

    uploadPath = `${__dirname}${localPath}/${fileName}.${extension}`;

    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.redirect(`${uploadsPath}/${fileName}.${extension}`);
    });
});

app.get('*', function(req, res) {
    res.redirect('/') // Redirect user on Invalid Path
});

app.listen(PORT, function() {
  console.log(`File-Uploader working on :${PORT}`);
});
