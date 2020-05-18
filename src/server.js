const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  return res.json({ ok: true })
})

app.listen(3000)