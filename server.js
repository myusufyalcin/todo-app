const express = require('express');  //sunucu oluşturma 
const bodyParser = require('body-parser');
const jsonServer = require('json-server'); //json-server entegrasyonu
const path = require('path');
const app = express();
const router = require('./todoroute.js'); //route dosyasının bağlanması

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 

app.set('view engine', 'ejs'); //ejs ile şablon düzenleme
app.set('views', path.join(__dirname, 'views'));

app.use('/', router);  //route bağlama

const jsonServerRouter = jsonServer.router('db.json');
app.use('/api', jsonServerRouter);

const PORT = 4444;  //sunucuyu 4444 portunda başlatma (ödevde öyle istenmiş)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
