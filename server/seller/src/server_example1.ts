import * as https from 'https'
import * as fs from 'fs'
import { Request, Verifier, Verify_Request_Param } from './verifier';
import assert from 'assert';

let port = 443
if ( process.argv.length == 3 ) {
    port = Number(process.argv[2])
    if ( Number.isNaN( port ) ){
        console.log( process.argv[2] + "is not number" )
        process.exit(1)
    }
}
console.log( "port=" + port )

let key  = fs.readFileSync('ssl/key.pem')
let cert = fs.readFileSync('ssl/cert.pem')
const options = { key, cert }


let verifier = new Verifier( [] )

let server = https.createServer(options, async function(request, response) {

    console.log( request.url )

    let rtnHtml = "not_found"
    let staticHtml   = fs.readFileSync('test.html').toString()
    let verifyOkHtml = fs.readFileSync('ok.html').toString()
    let verifyNgHtml = fs.readFileSync('ng.html').toString()


    if ( request.url === '/test.html' ){
        rtnHtml = staticHtml
    } else {
        assert( request.url !== undefined )

        if ( verifier.isRequestForPrepare(request.url) ){
            rtnHtml = verifier.response( request.url )
        } else {
            if ( verifier.isRequestVerify(request.url) ){
                if ( await verifier.verify( request.url ) == true ){
                    console.log("  verify() === true")
                    rtnHtml = verifyOkHtml
                } else {
                    console.log("  verify() === false")
                    rtnHtml = verifyNgHtml
                }
            }
        }

    }

    response.writeHead(200)
    response.end(rtnHtml)
})

server.listen(port, () =>{
    console.log("server start")
    console.log("please access:")
    console.log("https://Server_IP_Address:" + port + "/test.html")
})
