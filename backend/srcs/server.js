const http = require('http');

const hostname = '0.0.0.0';
const port = 9778;

const server = http.createServer( (request, response) => {
	response.statusCode = 200;
	response.setHeader('Content-type', 'text/plain');
	response.end('200:OK');
});

server.listen(port, hostname, () => {
	console.log(`Server at http://${hostname}:${port}`);
});
