import { SolanaLib } from "./solanalib"
import { CryptoLib } from './cryptolib';

import { split } from './util'

let path: string                  = "/web3verifier_verify"
let delemeter                     = ":"
export const server_publickey_key: string  = "serverpublickey"
export const domain_key: string            = "domain"
export const nonce_key: string             = "nonce"

export function getContent( serverpublickey:string, domain:string, nonce:string ) {
    let content = path + delemeter + server_publickey_key+ "=" + serverpublickey + delemeter +  domain_key+"="+ domain + delemeter + nonce_key+"=" + nonce
    return content
}

export function parse( message:string ){
    let w = message.substring(path.length+":".length)
    let words = split( w, ":", [server_publickey_key, domain_key, nonce_key])
    return words
}
export async function sign( content:string, secretkey:string ): Promise<[string, string]> {
    let cryptolib: CryptoLib = new SolanaLib()

    console.log("sign( content="+content+", secretkey="+secretkey+" )" )

    return [content, await cryptolib.sign(content, secretkey)]
}

export async function verify( clientpublickey:string, content:string, signature:string ): Promise<boolean> {
    let cryptolib: CryptoLib = new SolanaLib()

    if ( clientpublickey === "nothing" || content === "nothing" || signature === "nothing" ){
        return false
    }

    console.log("verify( publickey="+clientpublickey+", content="+content+", signature="+signature+" )" )

    return await cryptolib.verify(content,clientpublickey,signature)
}

