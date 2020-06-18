const path = require('path');
const { Router } = require('express');

const router = new Router();

router.get('/game/:roomId', (req, res) => {
  const { roomId } = req.params;
  // req.io.socket[roomId];

  return res.sendFile(
    path.join(__dirname, '..', 'public', 'game', 'index.html'),
  );
});

router.post('/oi', (req, res) => {
  // console.log(req.io.sockets);
  return res.json({ ok: 'oi' });
});

module.exports = router;
