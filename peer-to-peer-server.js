// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);

const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const routes = require("./src/routes");
const cors = require('cors')

const port = process.env.PORT || 3333;

app.use(cors())
app.use(express.json())
app.use(routes)

http.listen(port, () => console.log(`server is running on port ${port}`));

const users = {};

io.on('connection', socket => {
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});