const SECURITY_SERVER = 'https://192.168.15.6:4433'

function send( url, callback ) {
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
let web3verifier = document.getElementById('web3verifier')
web3verifier.appendChild(iframe)

window.addEventListener('message', (event) => {
    if (event.origin !== SECURITY_SERVER ){
        return;
    }
    if ( event.data === 'web3verifier_getnonce'){
        send( './web3verifier_getnonce', (nonce) => {
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
    } else if ( event.data === 'web3verifier_getrequirement' ){
        send( './web3verifier_getrequirement', (requirement) => {
            postMessage(iframe, 'requirement=' + requirement);
        } )
    } else if ( event.data === 'request topurl' ){
        const topurl = window.top.location.href;
        postMessage(iframe, 'encoded_top_url=' + encodeURIComponent(topurl));
    } else {
        return;
    }
}, false);


