const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

async function  verify(token, res) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });

    let payload = ticket.getPayload();
    let userId = payload['sub'];
    return {payload : payload, userId : userId};
}

module.exports = {
    verify,
}
