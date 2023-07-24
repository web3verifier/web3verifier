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
iframe.src = SECURITY_SERVER + '/identify_core_v0.8.html'
let zeroidentify:HTMLElement | null = document.getElementById('zeroIDentify')
zeroidentify!.appendChild(iframe)

window.addEventListener('message', (event) => {
    if (event.origin !== SECURITY_SERVER ){
        return;
    }
    if ( event.data === 'zeroidentify_getidentifytype@'){
        let el = document.getElementById("zeroIDentify")
        let type     = el!.getAttribute("identify_type")
        postMessage(iframe, 'identify_type=' + type );
    } else if ( event.data === 'zeroidentify_getparam@') {
        let el = document.getElementById("zeroIDentify")
        let buttonclickfunc = el!.getAttribute("button_click_func")
        let getnoncefunc    = el!.getAttribute("get_nonce_func")
        let serverpublickey = el!.getAttribute("server_publickey")
        let domain          = document.location.hostname
        if ( buttonclickfunc === null ){
            throw Error( "There is no setting. button_click_func = XXXXX" )
        }
        if ( getnoncefunc === null ){
            throw Error( "There is no setting. get_nonce_func = XXXXX" )
        }
        if ( serverpublickey === null ){
            throw Error( "There is no setting. server_publickey = XXXXX" )
        }
        eval(getnoncefunc)( (nonce) => {
            let msg = "callback_func=" + buttonclickfunc + "&server_publickey=" + serverpublickey + "&domain=" + domain + "&nonce=" + nonce 
            postMessage(iframe, msg) 
        })
    } else if ( event.data.indexOf("zeroidentify_callbackfunc@") !== -1 ){
        const length = "zeroidentify_callbackfunc=".length
        const reqs_string:string = event.data.substring(length, event.data.length)
        let reqs = split( reqs_string, "&", ["client_id", "message", "signature_by_client", "callback_func"] )
        let funcname = reqs["callback_func"]
        eval(funcname)( reqs["client_id"], reqs["message"], reqs["signature_by_client"] )
    } else if ( event.data === 'zeroidentify_topurl@' ){
        const topurl = window.top!.location.href;
        postMessage(iframe, 'encoded_top_url=' + encodeURIComponent(topurl));
    } else {
        return;
    }
}, false);



