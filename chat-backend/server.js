const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const ChatMessage = require('./models/ChatMessage');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', async (data) => {
    try{
        const {user, message} = data;
        const chatMessage = new ChatMessage({user, message});
        await chatMessage.save();
        io.emit('message', chatMessage);
    }catch(err){
        console.error('Error saving message to database', err);
    }
});

socket.on('disconnect', () => {
    console.log('A user disconnected');
});
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});