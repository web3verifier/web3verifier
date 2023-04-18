import axios from 'axios'
import * as assert from 'assert'
import * as https from 'https'
import * as fs from 'fs'
import * as url from 'url'


let key  = fs.readFileSync('ssl/key.pem')
let cert = fs.readFileSync('ssl/cert.pem')
const options = { key, cert }


let server = https.createServer(options, async function(request, response) {

    assert( request.url !== undefined )
    const {pathname} = url.parse(request.url)
    console.log(pathname)

    if ( pathname?.indexOf("secure") != -1 ){
        axios.get('http://localhost:8090' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("communication error")
            console.log(error)
        })

    } else {
        axios.get('http://localhost:8080' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("communication error")
            console.log(error)
        })
    }

})

server.listen(4433, () =>{
    console.log("server start")
    console.log("please access:")
    console.log("https://192.168.15.6:4433/test.html")
})
