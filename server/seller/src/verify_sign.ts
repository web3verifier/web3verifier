import { SolanaLib } from "./solanalib"
import { CryptoLib } from './cryptolib';

import { split } from './util'

let path: string                  = "/zeroidentify_identify"
let delemeter                     = ":"
export const server_publickey_key: string  = "serverpublickey"
export const domain_key: string            = "domain"
export const nonce_key: string             = "nonce"

export function getContent( serverpublickey:string, domain:string, nonce:string ) {
    let message = path + delemeter + server_publickey_key+ "=" + serverpublickey + delemeter +  domain_key+"="+ domain + delemeter + nonce_key+"=" + nonce
    return message
}

export function parse( message:string ){
    let w = message.substring(path.length+":".length, message.length)
    let words = split( w, ":", [server_publickey_key, domain_key, nonce_key])
    return words
}
export async function sign( message:string, secretkey:string ): Promise<[string, string]> {
    let cryptolib: CryptoLib = new SolanaLib()

    console.log("sign( message="+message+", secretkey="+secretkey+" )" )

    return [message, await cryptolib.sign(message, secretkey)]
}

export async function verify( clientpublickey:string, message:string, signature:string ): Promise<boolean> {
    let cryptolib: CryptoLib = new SolanaLib()

    if ( clientpublickey === "nothing" || message === "nothing" || signature === "nothing" ){
        return false
    }

    console.log("verify( publickey="+clientpublickey+", message="+message+", signature="+signature+" )" )

    return await cryptolib.verify(message,clientpublickey,signature)
}

