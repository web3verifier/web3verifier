import { SolanaLib } from "./solanalib"
import { CryptoLib } from './cryptolib';


let path: string                  = "/web3verifier_verify"
let server_publickey_key: string  = ":serverpublickey="
let domain_key: string            = ":domain="
let nonce_key: string             = ":nonce="
let sign_key: string              = ":signature="

export function getContent( serverpublickey:string, domain:string, nonce:string ) {
    let content = path + server_publickey_key + serverpublickey + domain_key + domain + nonce_key + nonce
    return content
}

export async function sign( content:string, secretkey:string ): Promise<[string, string]> {
    let cryptolib: CryptoLib = new SolanaLib()

    console.log("    sign( content="+content+", secretkey="+secretkey+" )" )

    return [content, await cryptolib.sign(content, secretkey)]
}

export async function verify( clientpublickey:string, content:string, signature:string ): Promise<boolean> {
    let cryptolib: CryptoLib = new SolanaLib()

    if ( clientpublickey === "nothing" || content === "nothing" || signature === "nothing" ){
        return false
    }

    console.log("    verify( publickey="+clientpublickey+", content="+content+", signature="+signature+" )" )

    return await cryptolib.verify(content,clientpublickey,signature)
}

