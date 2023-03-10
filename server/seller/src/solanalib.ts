import { Keypair } from "@solana/web3.js"

import { sha512 } from '@noble/hashes/sha512'
import base58 from 'bs58';
import { CryptoLib } from "./cryptolib"
import * as ed from '@solana/web3.js/src/utils/ed25519'

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
    public async sign(plain: string, secretstr: string): Promise<string> {
        const secret: Uint8Array = base58.decode(secretstr).slice(0,32)
        let message: Uint8Array = sha512(plain)
        return base58.encode(await ed.sign(message, secret))
    }
    public async verify(plain: string, publickey: string, signature: string): Promise<boolean> {
        let message: Uint8Array = sha512(plain)
        let sig: Uint8Array = base58.decode(signature)
        return ed.verify(sig, message, base58.decode(publickey))
    }
    public hash(str: string): string {
        return sha512( str ).toString()
    }
    public hashFromTicketInfo(dstPublickey: string, priceInt: string, srcPublickey: string): string {
        return this.hash(dstPublickey + priceInt + srcPublickey)
    }
}
