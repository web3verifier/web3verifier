import { Keypair } from "@solana/web3.js";
import base58 from "bs58";

function getPublickeyFromSecret( secretstr: string ): string {
    const secret: Uint8Array = base58.decode(secretstr)
    const keypair = Keypair.fromSecretKey(secret)
    return keypair.publicKey.toBase58()
}

let secretstr:string = process.argv[2]
console.log( "Secretkey=" + secretstr )
console.log( "Publickey=" + getPublickeyFromSecret(secretstr) )