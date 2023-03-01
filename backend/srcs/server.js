const http = require('http');
const textBody = require('body');
const querystring = require('node:querystring');
const googleToken = require('./google-token.js');
const cookie = require('cookie');

/*****************/
/* Server Set up */
/*****************/

const server = http.createServer((req, res) => {requestHandler(req, res)} );

server.listen('3000');

console.log("Server listening on port 3000");

/***************/
/* Server Core */
/***************/

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9778');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/*
**  My attempt at scalability in pure-ish nodeJS, if a new endpoint to a particular
**  request is needed, just add it to the corresponding object with the
**  endpoint location as the key, and its corresponding callback as its value.
*/

const POSTEndpoints = {
    '/api/login' : processLogIn,
    '/api/valid-auth' : processAuthorization,
};

const GETEndpoints = {
    '/api/client_id' : serveClientId,
    '/api/check-auth' : checkAuthorization,
};

const DELETEEndpoints = {
    '/api/delete-auth' : deleteAuthorization,
};

const serverEndpoints = {
    'GET' : GETEndpoints,
    'POST' : POSTEndpoints,
    'DELETE' : DELETEEndpoints,
}

/*
**  The handler looks for an endpoint to a specific http request, if it's defined,
**  the needed method is then called, if it isn't a 404 is sent.
**
**  This is the core of the server, all requests pass through here!
**  For specific behaviours, just look for the callbacks assigned to
**  each location in the objects above.
*/

async function requestHandler(req, res) {
    setCORS(res);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    let serverMethod = serverEndpoints[req.method][req.url];
    if (serverMethod !== undefined) {
        serverMethod(req, res);
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end();
    }
}

/********************/
/* Response methods */  
/********************/

function deleteAuthorization(req, res) {
    res.clearCookie('SuperSecureSecretCookie', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'localhost',
        path: '/',
    });
}

function checkAuthorization(req, res) {
    const credential = cookie.parse(req.headers.cookie || '').SuperSecureSecretCookie;
    res.writeHead(200, {"Content-type" : "text"});
    if (credential === undefined) {
        res.write('false');
    }
    else {
        res.write('true')
    }
    res.end();
}

function processLogIn(req, res) {
    textBody(req, res, (err, body) => {
        if (err) {
            res.writeHead(500);
            return res.end("FATAL")
        }
        let parsedRequest = querystring.parse(body);
        processGooglePostRequest(parsedRequest, req, res).catch((err) => {
            console.log(err);
            invalidCredential(res);
        });
    })
}

function serveClientId(req, res) {
    res.writeHead(200, {"Content-Type" : "json"});
    res.write(JSON.stringify({client_id : process.env.CLIENT_ID}));
    res.end();
}

function processAuthorization(req, res) {
    const credential = cookie.parse(req.headers.cookie || '').SuperSecureSecretCookie;
    processCredentialAuthentication(credential, res).catch((error) => {
        invalidCredential(res);
    });
}

function CrossSiteRequestForgeryProtection(csrf_token, req) {
    const cookies = cookie.parse(req.headers.cookie || '');

    if ((cookies.g_csrf_token === undefined) || (cookies.g_csrf_token !== csrf_token)) {
        throw new Error('CSRF protection failed');
    }

}

async function processGooglePostRequest(parsedRequest, req, res) {
    CrossSiteRequestForgeryProtection(parsedRequest.g_csrf_token, req);
    let paramsToUrl = {};
    let verifiedObject = await googleToken.verify(parsedRequest.credential);
    paramsToUrl.userId = verifiedObject.userId;
    paramsToUrl.email = verifiedObject.payload.email;
    paramsToUrl.name = verifiedObject.payload.name;

    res.setHeader("Set-Cookie", "SuperSecureSecretCookie=" + parsedRequest.credential + "; Domain=localhost; Path=/; Secure; HttpOnly;");
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


function invalidCredential(res) {
    console.error('Invalid credential submitted');
    res.writeHead(401, {'Content-Type': 'text/plain'});
    res.end("false");
}

/***********************/
/* Auxiliary functions */  
/***********************/

function addQueryParameters(url, paramsObject) {
    let newUrlStr = url + '?';

    for (const [key, value] of Object.entries(paramsObject)) {
        newUrlStr += (key + '=' + encodeURIComponent(value) + '&');
    }
    newUrlStr = newUrlStr.substring(0, newUrlStr.length - 1);
    
    return newUrlStr;
}