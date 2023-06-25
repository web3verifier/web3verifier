import { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js"
import base58 from "bs58"

async function pay( srcPrivatekey: string, dstPublickey: string, amount: string ){
    const secret: Uint8Array = base58.decode(srcPrivatekey)
    const keypair = Keypair.fromSecretKey(secret)
    let srcpublickey = new PublicKey(keypair.publicKey)
    let number: number = parseFloat(amount)
    if ( isNaN( number )){
        return "Error"
    }
 
    let connection = new Connection( "https://api.mainnet-beta.solana.com" )
    const transaction = new web3.Transaction().add(web3.SystemProgram.transfer({
        fromPubkey: srcpublickey,
        toPubkey: new web3.PublicKey(dstPublickey), //public key of receive account in string
        lamports: number * web3.LAMPORTS_PER_SOL
    }))
    transaction.feePayer = srcpublickey
    let blockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.recentBlockhash = blockhash;
    let signature: string = await web3.sendAndConfirmTransaction(connection, transaction, [keypair] )
    return signature;
}

let srcPrivatekey:string = process.argv[2]
let dstPublickey:string  = process.argv[3]
let amount:string        = process.argv[4]
console.log( "srcPrivatekey=" + srcPrivatekey)
console.log( "dstPublickey =" + dstPublickey )
console.log( "amount       =" + amount )

const paySync = async (srcPrivatekey:string,dstPublickey:string,amount:string) => {
    await pay( srcPrivatekey, dstPublickey, amount )
}
console.log( paySync(srcPrivatekey, dstPublickey, amount) )
