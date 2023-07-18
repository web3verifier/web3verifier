import { split } from "./util"
import { SECURITY_SERVER } from "./url"

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
iframe.src = SECURITY_SERVER + '/verify_core_v0.7.html'
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
    } else if ( event.data === 'web3verifier_getparam@') {
        let el = document.getElementById("web3verifier")
        let buttonclickfunc = el!.getAttribute("button_click_func")
        let getnoncefunc    = el!.getAttribute("get_nonce_func")
        let serverpublickey = el!.getAttribute("server_publickey")
        let domain          = document.domain
        eval(getnoncefunc)( (nonce) => {
            let msg = "callback_func=" + buttonclickfunc + "&server_publickey=" + serverpublickey + "&domain=" + domain + "&nonce=" + nonce 
            postMessage(iframe, msg) 
        })
    } else if ( event.data.indexOf("web3verifier_callbackfunc@") !== -1 ){
        const length = "web3verifier_callbackfunc=".length
        const reqs_string:string = event.data.substring(length, event.data.length)
        let reqs = split( reqs_string, "&", ["client_id", "message", "signature_by_client", "callback_func"] )
        let funcname = reqs["callback_func"]
        eval(funcname)( reqs["client_id"], reqs["message"], reqs["signature_by_client"] )
    } else {
        return;
    }
}, false);



