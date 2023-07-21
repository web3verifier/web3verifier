import { Keypair } from "@solana/web3.js"

import { sha512 } from '@noble/hashes/sha512'
import * as base58 from 'bs58';
import { CryptoLib } from "./cryptolib"
import * as ed from '@solana/web3.js/src/utils/ed25519'

export type TRANSACTION_RESULT_TYPE = "OK" | "NOT_ENOUGH_AMOUNT" | "ERROR"
export type NETWORK_TYPE = "PUBLIC" | "TESTNET"
export const network: NETWORK_TYPE = "PUBLIC"

export class SolanaLib extends CryptoLib {
    public createSecretkeyFromSeed(seed:Uint8Array): string{
        let keypair = Keypair.fromSeed(seed)
        let base58secret = base58.encode(keypair.secretKey)
        return base58secret
    }
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
    public async sign(content: string, secretstr: string): Promise<string> {
        const secret: Uint8Array = base58.decode(secretstr).slice(0,32)
        let message: Uint8Array = sha512(content)
        return base58.encode(await ed.sign(message, secret))
    }
    public async verify(content: string, publickey: string, signature: string): Promise<boolean> {
        let message: Uint8Array = sha512(content)
        let sig: Uint8Array = base58.decode(signature)
        return ed.verify(sig, message, base58.decode(publickey))
    }
    public hash(array:Uint8Array): Uint8Array {
        return sha512( array )
    }
}
