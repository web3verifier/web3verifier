import { Keypair } from "@solana/web3.js"
import { sign } from '../node_modules/@solana/web3.js/src/utils/ed25519'
//import { verify } from "@solana/web3.js/src/utils/ed25519"
import { sync } from "@noble/ed25519"
import { Signature } from "@noble/ed25519"
import { sha512 } from '@noble/hashes/sha512'
import base58 from 'bs58';
import { CryptoLib } from "./cryptolib"


export type TRANSACTION_RESULT_TYPE = "OK" | "NOT_ENOUGH_AMOUNT" | "ERROR"
export type NETWORK_TYPE = "PUBLIC" | "TESTNET"
export const network: NETWORK_TYPE = "PUBLIC"

export class SolanaLib extends CryptoLib {
    public createSecretkey(): string {
        let keypair = Keypair.generate()
        let base58secret = base58.encode(keypair.secretKey)
        return base58secret
    }
    public getPublickeyFromSecret(secretstr: string): string {
        const secret: Uint8Array = base58.decode(secretstr)
        const keypair = Keypair.fromSecretKey(secret)
        return keypair.publicKey.toBase58()
    }
    public sign(plain: string, secretstr: string): string {
        const secret: Uint8Array = new TextEncoder().encode(secretstr);
        let message: Parameters< typeof sync.sign>[0] = plain
        //return "sign"
        return sign( message, secret ).toString()
    }
    public verify(plain: string, publickey: string, sign: string): boolean {
        let message: Parameters< typeof sync.sign>[0] = plain
        let sig: Parameters< typeof sync.sign>[0] | Signature = sign
        return true
        //return verify( sig, message, publickey )
    }
    public hash(str: string): string {
        return sha512( str ).toString()
    }
    public hashFromTicketInfo(dstPublickey: string, priceInt: string, srcPublickey: string): string {
        return this.hash(dstPublickey + priceInt + srcPublickey)
    }
}
