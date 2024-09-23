const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const server_4_routes = require('./api/Server_4/server_4_routes');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', server_4_routes);
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

server.listen(5004, () => {
	console.log(`Server_4 listening on port ${5004}`);
});
//INSERT('user', '(user_name,password)', "('dian','asd')");
