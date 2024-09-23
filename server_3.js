const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const server_3_routes = require('./api/Server_3/server_3_routes');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', server_3_routes);
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

server.listen(5003, () => {
	console.log(`Server_3 listening on port ${5003}`);
});
//INSERT('user', '(user_name,password)', "('dian','asd')");
