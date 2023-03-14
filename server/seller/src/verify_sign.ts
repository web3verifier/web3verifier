import { SolanaLib } from "./solanalib"
import { CryptoLib } from './cryptolib';


let path: string          = "/web3verify"
let publickey_key: string = "?publickey="
let nonce_key: string      = "&nonce="
let sign_key: string      = "?signature="

export async function sign( publickey:string, secretkey:string, nonce:string ): Promise<[string, string]> {
    let cryptolib: CryptoLib = new SolanaLib()

    let plain = path + publickey_key + publickey + nonce_key + nonce 
    console.log( "sign(plain,secretkey)")
    console.log( "plain=" + plain)
    console.log( "secretkey=" + secretkey)
    return [plain, await cryptolib.sign(plain, secretkey)]
}

export async function parse( url: string ): Promise<[string, string, string]>{
    let str:string = url;

    if ( str.indexOf(path+publickey_key,0) !== -1 ){
        str = str.substring((path+publickey_key).length)
    }

    let publickey="nothing"
    if ( str.indexOf(nonce_key,0) !== -1 ){
        publickey = str.substring( 0, str.indexOf( nonce_key ) )
        str = str.substring((publickey+nonce_key).length)
    }

    let signature = "nothing"
    let nonce_in_url = "nothing"
    if ( str.indexOf(sign_key,0) !== -1 ){
        nonce_in_url = str.substring( 0, str.indexOf(sign_key) )
        signature = str.substring((nonce_in_url+sign_key).length)
    }
    return [publickey, nonce_in_url, signature]
}
export async function verify( url: string ): Promise<boolean> {
    let cryptolib: CryptoLib = new SolanaLib()

    let signaturePos = url.indexOf(sign_key)
    let plain = url.substring(0, signaturePos)
    let [publickey, nonce_in_url, signature] = await parse(url)

    if ( publickey === "nothing" || nonce_in_url === "nothing" || signature === "nothing" ){
        return false
    }

    console.log("  verify(plain,publickey,signature)")
    console.log("    plain=" + plain)
    console.log("    publickey=" + publickey)
    console.log("    signature=" + signature)

    return await cryptolib.verify(plain,publickey,signature)
}
