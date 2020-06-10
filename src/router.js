const path = require('path');
const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'home', 'index.html'),
  );
});

router.get('/game', (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'game', 'index.html'),
  );
});

module.exports = router;
