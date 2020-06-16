const path = require('path');
const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'home', 'index.html'),
  );
});

router.get('/game/:roomId', (req, res) => {
  // const { roomId } = req.params;

  return res.sendFile(
    path.join(__dirname, '..', 'public', 'game', 'index.html'),
  );
});

router.post('/oi', (req, res) => {
  // console.log(req.io.sockets);
  return res.json({ ok: 'oi' });
});

module.exports = router;
