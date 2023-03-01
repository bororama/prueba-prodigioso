const http = require('http');
const textBody = require('body');
const querystring = require('node:querystring');
const googleToken = require('./google-token.js');
const cookie = require('cookie');

const server = http.createServer(async (req, res) => {
    console.log(`URL:${req.url} METHOD:${req.method}`);
    //CORS ...
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9778');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //CORS boilerplate...
    if (req.method === 'OPTIONS') {
    
        res.writeHead(200);
        res.end();
        return;
    }
    if (req.url === "/api/delete-auth" && req.method === "DELETE") {
        res.clearCookie('SuperSecureSecretCookie', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: 'localhost',
            path: '/',
        });
    }
    else if (req.url === "/api/client_id" && req.method === "GET") {
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
            console.log(`login ${body} /login`);
            processGooglePostRequest(postRequest.credential, res).catch(() => {
                invalidCredential(res);
            });
        })
    }
    else if (req.url === "/api/valid-auth" && req.method === "POST") {

        const credential = cookie.parse(req.headers.cookie || '').SuperSecureSecretCookie;
        processCredentialAuthentication(credential, res).catch((error) => {
            console.log(`ERROR CAUGHT : ${error}`);
            invalidCredential(res);
        });
    }
    else if (req.url === "/api/check-auth" && req.method === "GET") {

        const credential = cookie.parse(req.headers.cookie || '').SuperSecureSecretCookie;
        console.log("cookiecredential is:", credential);
        res.writeHead(200, {"Content-type" : "text"});
        if (credential === undefined) {
            res.write('false');
        }
        else {
            res.write('true')
        }
        res.end();
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end();
    }
});

server.listen('3000');

console.log("Server listening on port 3000");

async function processGooglePostRequest(credential, res) {
    // Cross-Site Request Forgery protection could go here
    let paramsToUrl = {};
    let verifiedObject = await googleToken.verify(credential);
    paramsToUrl.userId = verifiedObject.userId;
    paramsToUrl.email = verifiedObject.payload.email;
    paramsToUrl.name = verifiedObject.payload.name;

    res.setHeader("Set-Cookie", "SuperSecureSecretCookie=" + credential + "; Domain=localhost; Path=/; Secure; HttpOnly;");
    res.writeHead(303, {
        "location" : addQueryParameters("http://localhost:9778/home", paramsToUrl),
    });
    res.end();
}

async function processCredentialAuthentication(credential, res) {
    let verifiedObject = await googleToken.verify(credential);

    if (verifiedObject.payload !== undefined) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('true');
    }
}

function addQueryParameters(url, paramsObject) {
    let newUrlStr = url + '?';

    for (const [key, value] of Object.entries(paramsObject)) {
        newUrlStr += (key + '=' + encodeURIComponent(value) + '&');
    }
    newUrlStr = newUrlStr.substring(0, newUrlStr.length - 1);
    
    return newUrlStr;
}

function invalidCredential(res) {
    console.error('Invalid credential submitted');
    res.writeHead(401, {'Content-Type': 'text/plain'});
    res.end("false");
}