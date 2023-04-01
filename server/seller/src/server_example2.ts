import * as https from 'https'
import * as fs from 'fs'
import { Request, Verifier, Verify_Request_Param} from './verifier';
import assert from 'assert';

let key  = fs.readFileSync('ssl/key.pem')
let cert = fs.readFileSync('ssl/cert.pem')
const options = { key, cert }

const param1: Verify_Request_Param = {
    type:        Request.User_Paid_USDC_More_Than_Equal_X,
    uiAmount:    0.002,                                         // X = 0.002
    userAddress: "Bc2BLuksyWWPxduSksntYFbNxJDpTiYH8qkYR6ZQXnef" // your address to recieve USDC from user(publickey). this address is not associated address for uSDC
    
}
let verifier = new Verifier( [param1] )

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
        } else if ( verifier.isRequestVerify(request.url) ){
            if ( await verifier.verify( request.url ) == true ){
                console.log("  verify() === true")
                rtnHtml = verifyOkHtml
            } else {
                console.log("  verify() === false")
                rtnHtml = verifyNgHtml
            }
        }

    }

    response.writeHead(200)
    response.end(rtnHtml)
})

server.listen(443, () =>{
    console.log("server start")
    console.log("server start")
    console.log("please access:")
    console.log("https://192.168.15.6:443/test.html")
})
