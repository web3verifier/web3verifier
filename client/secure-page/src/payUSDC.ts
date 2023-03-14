import { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js"
import base58 from "bs58"
import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { SOLANA_BLOCKCHAIN_SERVER } from "./url";

async function payToken( srcPrivatekey:string, mintPublickey:string, dstPublickey:string, lamport: number, decimals:number ): Promise<[boolean,string]>{
    if ( isNaN( lamport )){
        throw Error("Error1")
    }
    if ( isNaN(decimals)){
        throw Error("Error2")
    }
    if ( Number.isInteger(lamport) === false ){
        throw Error("error3")
    }
    const secret: Uint8Array = base58.decode(srcPrivatekey)
    const keypair = Keypair.fromSecretKey(secret)
    let mintpublickey = new PublicKey(mintPublickey)
    let srcpublickey = new PublicKey( keypair.publicKey )
    console.log( "srcPublickey=" + keypair.publicKey )
    let dstpublickey = new PublicKey(dstPublickey)
    let associatedSrcPublickey = await getAssociatedTokenAddress(mintpublickey, srcpublickey)
    let associatedDstPublickey = await getAssociatedTokenAddress(mintpublickey, dstpublickey)
 
    let connection = new Connection(SOLANA_BLOCKCHAIN_SERVER)
    // check whether account exist or not.
    const dstAccountInfo = await connection.getAccountInfo(
        associatedDstPublickey
    )

    let transaction = new web3.Transaction()
    if ( dstAccountInfo === null ){
        console.log( "dst account " + associatedSrcPublickey.toString() + " does not exist")
        transaction.add(
            createAssociatedTokenAccountInstruction(
                srcpublickey, //fee payer
                associatedDstPublickey,
                dstpublickey,
                mintpublickey,
            )
        )
    }
    transaction.add(
        createTransferCheckedInstruction(
            associatedSrcPublickey,
            mintpublickey,
            associatedDstPublickey,
            srcpublickey,
            lamport,
            decimals
        ) 
    )
    let blockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.recentBlockhash = blockhash;

    try {
        let signature: string = await web3.sendAndConfirmTransaction(connection, transaction, [keypair] )
        return [true,""]
    } catch(e) {
        console.log(e)
        return [false,e]
    }
}

export async function payUSDC( srcPrivatekey:string, dstPublickey:string, uiAmount:string ): Promise<[boolean,string]>{
    console.log( "srcPrivatekey=" + srcPrivatekey)
    console.log( "dstPublickey =" + dstPublickey )
    console.log( "uiAmount="      + uiAmount )

    const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

    let uiAmount_n = Number(uiAmount)
    if ( isNaN(uiAmount_n) ){
        throw Error("error1")
    }
    let lamports = uiAmount_n * 1000000
    if ( Number.isInteger(lamports) === false ){
        throw Error("error2")
    }

    return await payToken(srcPrivatekey, USDC_ADDRESS, dstPublickey, lamports, 6) 
}
