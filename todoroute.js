const express = require('express'); //route tanımlamaları
const router = express.Router();


//arayüzdeki tek sayfanın route bağlaması
router.get('/', (req, res) => {
  res.render('homepage');
});

module.exports = router;
