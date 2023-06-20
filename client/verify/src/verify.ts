import {split} from "./util"

const SECURITY_SERVER = 'https://192.168.15.6:4433'

function send( url: string | URL, callback: { (nonce: any): void; (requirement: any): void; (arg0: string): void; } ) {
    let connect = new XMLHttpRequest();
    connect.open('GET', url, true);
    connect.onreadystatechange = () => {
        if (connect.readyState === 4 && connect.status === 200) {
            callback( connect.responseText );
        } else if (connect.status >= 307 && connect.readyState === 4) {
            alert('error');
        }
    }
    connect.send(null);
}
function isIFrame(input: HTMLElement | null): input is HTMLIFrameElement{
    return input !== null && input.tagName === 'IFRAME';
}
function postMessage(iframe:HTMLIFrameElement, msg: string){
    if (isIFrame(iframe) && iframe.contentWindow) {
        iframe.contentWindow.postMessage(msg , SECURITY_SERVER);
    }
}

let iframe = document.createElement('iframe')
iframe.src = 'https://192.168.15.6:4433/verifycore_v0.7.html'
let web3verifier:HTMLElement | null = document.getElementById('web3verifier')
web3verifier!.appendChild(iframe)

window.addEventListener('message', (event) => {
    if (event.origin !== SECURITY_SERVER ){
        return;
    }
    if ( event.data === 'web3verifier_getverifytype@'){
        let el = document.getElementById("web3verifier")
        let type     = el!.getAttribute("verify_type")
        postMessage(iframe, 'verify_type=' + type );
    } else if ( event.data === 'web3verifier_getcallbackfunc_tokensignedbyserver@') {
        let el = document.getElementById("web3verifier")
        let token    = el!.getAttribute("token_signed_by_server")
        let callback = el!.getAttribute("callback_func")
        postMessage(iframe, "callback_func=" + callback + "&token_signed_by_server=" + token)
    } else if ( event.data.indexOf("web3verifier_callbackfunc@") !== -1 ){
        const length = "web3verifier_callbackfunc=".length
        const reqs_string:string = event.data.substring(length, event.data.length)
        let reqs = split( reqs_string, "&", ["client_id", "token_signed_by_client", "callback_func"] )
        let funcname = reqs["callback_func"]
        eval(funcname)( reqs["client_id"], reqs["token_signed_by_client"] )

/*    } else if ( event.data === 'web3verifier_getnonce@'){
        send( './web3verifier_getnonce', (nonce: string) => {
            let host = window.location.hostname
            let port = window.location.port
            let url = ''
            if ( port === '80' ) {
                url = 'https://' + host
            } else {
                url = 'https://' + host + ':' + port
            }
            postMessage(iframe, 'nonce_url=' + 'nonce=' + nonce + '&' + 'topurl=' + url);
        } )
    } else if ( event.data === 'web3verifier_getrequirement@' ){
        send( './web3verifier_getrequirement', (requirement: string) => {
            postMessage(iframe, 'requirement=' + requirement);
        } )
    } else if ( event.data === 'request topurl@' ){
        const topurl = window.top!.location.href;
        postMessage(iframe, 'encoded_top_url=' + encodeURIComponent(topurl));
*/
    } else {
        return;
    }
}, false);



