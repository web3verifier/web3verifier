import express, { Response } from 'express';
import session from 'express-session';
import { Request, Verifier, Verify_Request_Param } from './verifier';
import http  from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

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
let verifier = new Verifier( [] )

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
        //if ( await verifier.verify( req.body ) === false ){
            //throw Error("verify error") 
        //}
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
