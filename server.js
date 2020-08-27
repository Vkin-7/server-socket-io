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

    
    /*let interval;
    
    io.on("connection", (socket) => {
      console.log("New client connected");
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => getApiAndEmit(socket), 1000);
      socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
      });
    });
    
    const getApiAndEmit = socket => {
        const response = new Date();
        // Emitting a new message. Will be consumed by the client
        socket.emit("FromAPI", response);
      };*/


http.listen(port, () => console.log(`Listening on port ${port}`))

let connectedPeers = new Map()

io.on('connection', socket => {
  console.log(socket.id)

  socket.emit('connection-success', {success: socket.id})

  connectedPeers.set(socket.id, socket)

  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedPeers.delete(socket.id)
  })

  socket.on('offerOrAnswer', data => {
    //send to other peer(s) if any
    for(const [socketID, socket] of connectedPeers.entries()){
      //dont send to self
      if(socketID !== data.socketID){
        console.log(socketID, data.payload.type)
        socket.emit('offerOrAnswer', data.payload)
      }
    }
  })

  socket.on('candidate', data => {
    //send candidates to the other peer(s) if any
    for(const [socketID, socket] of connectedPeers.entries()){
      //dont send to self
      if(socketID !== data.socketID){
        console.log(socketID, data.payload)
        socket.emit('candidate', data.payload)
      } 
    }
  })
})