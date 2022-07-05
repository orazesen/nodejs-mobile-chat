const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { emit } = require('process');

const app = express();
const server = http.createServer(app);

if (process.env.SOCKET_SSL_ENABLED == true) {
    server = https.createServer(
        {
            requestCert: false,
            rejectUnauthorized: false,
            key:  fs.readFileSync(path.join(__dirname, '../certs/your_cert_private.key')),
            cert: fs.readFileSync(path.join(__dirname, '../certs/your_domain_certificate.crt'))
        },
        app
    );
}

app.get('/', async (req, res) => {
    res.send({'blah':'/'})
})


const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));


const port = process.env.SOCKET_IO_PORT || 3000

io.on('connection', (client) => {
    client.on('disconnect', function () {
        console.log('a client disconnected '+ new Date)
    })

    client.on('new_message', async (data) => {
        console.log(data);
        io.emit('new_message', data);
    })
})

server.listen(port, '0.0.0.0', () => {
    console.log('Server is running on port ', port)
})
