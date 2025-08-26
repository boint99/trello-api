
const express = require('express')

const app = express()
const hostname = 'localhost'
const port = 8017

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1?')
})

app.listen(port, hostname, () => {
  console.log(`Hello Tiểu Bối, I am coder http://${hostname}:${port}`)
})