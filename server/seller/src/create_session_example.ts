import express, { Response } from 'express';
import session from 'express-session';
import { Verifier } from './verifier';
import { server_publickey_key, domain_key, nonce_key } from './verify_sign';
import http  from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const this_domain = "192.168.15.6"

let port = 443
if ( process.argv.length == 3 ) {
    port = Number(process.argv[2])
    if ( Number.isNaN( port ) ){
        console.log( process.argv[2] + "is not number" )
        process.exit(1)
    }
}

console.log( "port=" + port )

const app = express();
let verifier = new Verifier()

app.use(express.json());
app.use(session({
    secret: 'YOUR_SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Use secure cookies (HTTPS)
        httpOnly: true, // Prevent client-side JavaScript access to cookies
    }
}));

app.post('/create_session', async (req: any, res: Response) => {
    console.log( "in /create_session" )
    console.log( "req.body=" )
    console.log( req.body )
    try {
        let client_id                = req.body.client_id
        let content                  = req.body.content
        let content_signed_by_client = req.body.content_signed_by_client

        let keyvalue = verifier.parse( content )
        //keyvalue[server_publickey_key]
        if ( verifier.check(keyvalue[nonce_key]) === false ){
            throw Error("verify error " + nonce_key + " is not exist")
        }
        if ( this_domain !== keyvalue[domain_key]){
            throw Error("verify error " + keyvalue[domain_key] + " is not " + this_domain) 
        }

        if ( await verifier.verify( client_id, content, content_signed_by_client ) === false ) {
            throw Error("verify error") 
        }

        req.session.regenerate( (err: any) =>{
            if ( err ){
                throw Error("regenerate error")
            }
            req.session.client_id = req.body.client_id
            res.sendStatus(200);
        })
    } catch (error) {
        console.error('Error verifying ID token:', error);
        res.sendStatus(401);
    }
});

app.get('/get_nonce', (req, res) => {
    console.log( "in /getnonce" )
    let randomkey = verifier.generateNonce()
    console.log(randomkey)
    res.send(randomkey)
});

app.get('/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log( fileName )
    const filePath = path.join(__dirname, fileName);

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'text/html');

    // Send the file to the client
    res.sendFile(filePath);
});

const sslOptions = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem'),
};



if ( port == 80 ){
    http.createServer(app).listen(port, () => {
        console.log('http server is running on port ' + port);
    });
} else {
    https.createServer(sslOptions, app).listen(port, () => {
        console.log('https server is running on port ' + port);
    });
}
