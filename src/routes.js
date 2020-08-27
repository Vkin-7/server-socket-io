const express = require("express");
const routes = express.Router();

routes.get('/', (req, res) => {
    res.send({ response: "I am alive" }).status(200);
})

routes.get('/webrtc', (req, res) => {
    res.send({ response: "I am alive" }).status(200);
})

module.exports = routes