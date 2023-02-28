const http = require('http');
const textBody = require('body');
const querystring = require('node:querystring');
const googleToken = require('./google-token.js');

const server = http.createServer(async (req, res) => {
    console.log(`URL:${req.url} METHOD:${req.method}`);
    //CORS ...
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //CORS boilerplate...
    if (req.method === 'OPTIONS') {
    
        res.writeHead(200);
        res.end();
        return;
    }
    if (req.url === "/test" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write("Hi there, This is a Vanilla Node.js API");
        res.end();
    }
    else if (req.url === "/api/client_id") {
        res.writeHead(200, {"Content-Type" : "json"});
        res.write(JSON.stringify({client_id : process.env.CLIENT_ID}));
        res.end();
    }
    else if (req.url === "/api/login" && req.method === "POST") {
        textBody(req, res, (err, body) => {
            if (err) {
                res.writeHead(500);
                return res.end("FATAL")
            }
            let postRequest = querystring.parse(body);
            processGooglePostRequest(postRequest.credential, res).catch(console.error);
        })
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen('3000');

console.log("Server listening on port 3000");

async function processGooglePostRequest(postRequest, res) {
    // Cross-Site Request Forgery should be here
    let paramsToUrl = {};
    let verifiedObject = await googleToken.verify(postRequest, res);
    paramsToUrl.userId = verifiedObject.userId;
    paramsToUrl.email = verifiedObject.payload.email;
    paramsToUrl.name = verifiedObject.payload.name;

    res.writeHead(303, {"location" : addQueryParameters("http://localhost:9778/home", paramsToUrl)});
    res.end();
}
function addQueryParameters(url, paramsObject) {
    let newUrlStr = url + '?';

    for (const [key, value] of Object.entries(paramsObject)) {
        newUrlStr += (key + '=' + value + '&');
    }
    newUrlStr = newUrlStr.substring(0, newUrlStr.length - 1);
    
    return newUrlStr;
}