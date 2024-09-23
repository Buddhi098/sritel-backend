const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./api/Server_1/user');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', userRoutes);
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});
io.on('connection', (socket) => {
	console.log(`User connected -> ${socket.id}`);
});

server.listen(5001, () => {
	console.log(`Server_1 listening on port ${5001}`);
});

// var cors = require('cors');
// const bodyParser = require('body-parser');

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use('/api', userRoutes);

// const path = require('path');
// const {json} = require('sequelize');
// const {INSERT, UPDATE, SELECT, DELETE} = require('./models/database');
// const userRoutes = require('./api/user');

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
// 	cors: {
// 		origin: '*',
// 		methods: ['GET', 'POST'],
// 	},
// });
// io.on('connection', (socket) => {
// 	console.log('We are live and connected');
// 	console.log(socket.id);
// });
// httpServer.listen(5001, () => {
// 	console.log(`Example app listening on port ${5001}`);
// });
// const server = app.listen(5001, () => {
// 	console.log('Server listening on port 5001');

// });
// const io = socket(server);
// io.on('connection', function (socket) {
// 	console.log('Made socket connection');
// 	console.log(socket.id);
// });
