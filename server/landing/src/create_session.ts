import express, { Response } from 'express';
import session from 'express-session';
import { Verifier } from './verifier';
import { server_publickey_key, domain_key, nonce_key } from './verify_sign';
import http  from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const this_domain = "192.168.15.6"
let server_publickey = "UNINIT_SERVER_PUBLICKEY"

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
        let message                  = req.body.message
        let message_signed_by_client = req.body.message_signed_by_client

        let keyvalue = verifier.parse( message )

        if ( verifier.check(keyvalue[nonce_key]) === false ){
            throw Error("verify error " + nonce_key + " is not exist")
        }
        if ( this_domain !== keyvalue[domain_key]){
            throw Error("verify error " + keyvalue[domain_key] + " is not " + this_domain) 
        }

        if ( await verifier.verify( client_id, message, message_signed_by_client ) === false ) {
            throw Error("verify error") 
        }

        req.session.regenerate( (err: any) =>{
            if ( err ){
                throw Error("regenerate error")
            }
            req.session.client_id = req.body.client_id
            server_publickey = req.body.client_id
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

app.set("view engine", "ejs");

app.get('/seller.html', (req, res) => {
    const filename = "/seller.html"
    const filePath = path.join(__dirname+"/public", filename );
    console.log( filePath )

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'text/html');

    var data = {
        server_publickey: server_publickey
    };
    res.render( "./seller.ejs", data )
});

app.get('/:filename', (req, res) => {
    const filename= req.params.filename;
    const filePath = path.join(__dirname+"/public", filename );
    console.log( filePath )

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'text/html');

    // Send the file to the client
    res.sendFile(filePath);
});

app.get('/js/:filename', (req, res) => {
    const filename= req.params.filename;
    const filePath = path.join(__dirname+"/public/js", filename );
    console.log( filePath )

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'text/javascript');

    // Send the file to the client
    res.sendFile(filePath);
});

app.get('/css/:filename', (req, res) => {
    const filename= req.params.filename;
    const filePath = path.join(__dirname+"/public/css", filename );
    console.log( filePath )

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'text/css');

    // Send the file to the client
    res.sendFile(filePath);
});

app.get('/img/:filename', (req, res) => {
    const filename= req.params.filename;
    const filePath = path.join(__dirname+"/public/img", filename );
    console.log( filePath )

    // Set the appropriate content type and headers
    res.setHeader('Content-Type', 'image/png');

    // Send the file to the client
    res.sendFile(filePath);
});


const sslOptions = {
    key: fs.readFileSync('./public/ssl/key.pem'),
    cert: fs.readFileSync('./public/ssl/cert.pem'),
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
