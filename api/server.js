// implement your server here
// require your posts router and connect it here
const express = require('express')

const postsRouter = require('./posts/posts-router')

const server = express()

server.use(express.json())

server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>node-api2-project</h>
    `);
  });
  

module.exports = server