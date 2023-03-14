import { v4 as uuidv4 } from 'uuid';
import { verify, parse } from './verify_sign';
import { BlockChain } from './blockchain'
import { SolanaBlockChain } from './solanablockchain';
import { SOLANA_BLOCKCHAIN_SERVER } from './url';
import { SECURITY_SERVER } from './url';

export const Request = {
    User_Paid_USDC_More_Than_Equal_X: 1
} as const

export type Request = typeof Request[keyof typeof Request]

export type Verify_Request_Param = {
    type: Request
    uiAmount?: number,
    userAddress?: string
}

export function existRequirement( requires: Verify_Request_Param[], require: Request ): boolean{
    for ( const p of requires ){
        if ( p.type === require ){
            return true
        }
    }
    return false
}
export function getRequirement( requires: Verify_Request_Param[], require: Request ): Verify_Request_Param | null {
    for ( const p of requires ){
        if ( p.type === require ){
            return p 
        }
    }
    return null
}

export class Verifier {
    private param: Verify_Request_Param[]
    constructor( param: Verify_Request_Param[] ){
        this.param = param
    }
    private map = new Map<string, Date>();
    private generateNonce(): string{
        let nonce = uuidv4()
        this.map.set(nonce,new Date())
        return nonce
    }
    private proxyScript(): string {
        return ( "\n\
send = ( url, callback ) => {\n\
    connect = new XMLHttpRequest();\n\
    connect.open('GET', url, true);\n\
    connect.onreadystatechange = () => {\n\
        if (connect.readyState === 4 && connect.status === 200) {\n\
            callback( connect.responseText );\n\
        } else if (connect.status >= 307 && connect.readyState === 4) {\n\
            alert('error');\n\
        }\n\
    }\n\
    connect.send(null);\n\
}\n\
window.addEventListener('message', (event) => {\n\
    const SECURITY_SERVER = '" + SECURITY_SERVER + "'\n\
    if (event.origin !== SECURITY_SERVER ){\n\
        return;\n\
    }\n\
    if ( event.data === 'request getnonce'){\n\
        send( './getnonce', (nonce) => {\n\
            let win = window.top.frames.web3verify;\n\
            let host = window.location.hostname\n\
            let port = window.location.port\n\
            let url = ''\n\
            if ( port === '80' ) {\n\
                url = 'https://' + host\n\
            } else {\n\
                url = 'https://' + host + ':' + port\n\
            }\n\
            win.postMessage('nonce_url=' + 'nonce=' + nonce + '&' + 'topurl=' + url, SECURITY_SERVER);\n\
        } )\n\
    } else if ( event.data === 'request requirement' ){\n\
        send( './getrequirement', (requirement) => {\n\
            let win = window.top.frames.web3verify;\n\
            win.postMessage('requirement=' + requirement, SECURITY_SERVER);\n\
        } )\n\
    } else {\n\
        return;\n\
    }\n\
}, false);\n\
        ")
    }
    public isRequestForPrepare( url: string ){
        if ( url === '/proxy.js' || url === '/getnonce' || url === '/getrequirement' ){
            return true
        } else {
            return false
        }
    }
    public isRequestVerify( url: string ){
        if ( url?.indexOf('/web3verify?') !== -1  ){
            return true
        } else {
            return false
        }
    }
    public response( url: string ): string {
        if ( url === '/proxy.js' ){
            console.log ( "    return script")
            return this.proxyScript()
        } else if ( url === '/getnonce' ){
            let nonce: string = this.generateNonce()
            console.log( "  nonce=" + nonce)
            return nonce
        } else if ( url === '/getrequirement' ){
            let rtn = ""
            let first = true
            for ( const p of this.param ){
                if ( first === false ){
                    rtn += "?"
                }
                first = false
                rtn  = "type="     + p.type        + "&"
                rtn += "uiAmount=" + p.uiAmount    + "&"
                rtn += "address="  + p.userAddress 
            }
            console.log("  requirement=" + rtn )
            return rtn
        } else {
            throw Error("response error")
        }
    }
    public async verify( url: string ): Promise<boolean> {
        let [srcpublickey, nonce_in_url, signature] = await parse(url)
        if ( this.map.has(nonce_in_url) ){
            this.map.delete(nonce_in_url)

            // Start from VV is mandatory
            //if ( srcpublickey[0] !== "V" ){
            if ( srcpublickey[0] !== "V" || srcpublickey[1] !== "V" ) {
                return false
            }

            if ( existRequirement(this.param,Request.User_Paid_USDC_More_Than_Equal_X) === true ){
                let param: Verify_Request_Param = getRequirement(this.param,Request.User_Paid_USDC_More_Than_Equal_X)!
                let blockchain: BlockChain = new SolanaBlockChain(SOLANA_BLOCKCHAIN_SERVER)
                if (await blockchain.requireUSDCExist(srcpublickey,param.userAddress!,param.uiAmount!) === false ) {
                    return false
                }
            }

            return verify(url)
        } else {
            return false
        }
    }
}