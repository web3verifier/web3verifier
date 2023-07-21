import axios from 'axios'
//import * as assert from 'assert'
import assert from 'assert'
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
        axios.get('http://localhost:8100' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("secure communication error")
            console.log(error)
        })
    } else if ( pathname?.indexOf("identify_core") != -1 ){
        axios.get('http://localhost:8090' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("identify_core communication error")
            console.log(error)
        })
    } else if ( pathname?.indexOf("identify") != -1 ){
        axios.get('http://localhost:8080' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("identify communication error")
            console.log(error)
        })
    } else {
        axios.get('http://localhost:8100' + pathname)
        .then( (results) => {
            //console.log(results.status)
            //console.log(results.data)
            response.writeHead(results.status)
            response.end(results.data)
        })
        .catch( (error) => {
            console.log("else communication error")
            console.log(error)
        })
    }

})

server.listen(4433, () =>{
    console.log("proxy start")
})
