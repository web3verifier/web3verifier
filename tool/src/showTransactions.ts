import { Connection, ParsedTransactionWithMeta, ParsedInstruction, PartiallyDecodedInstruction, ConfirmedSignatureInfo, TransactionReturnData } from '@solana/web3.js';
import { PublicKey }  from "@solana/web3.js"
import { assert } from "console";

interface TransferTransaction{
    destination: string;
    lamports   : string;
    source     : string;
}

async function getTransferTransction( confirmedSignatureInfo: ConfirmedSignatureInfo, txns: TransferTransaction[] ): Promise<TransferTransaction[]>{
    let connection = new Connection( "https://api.mainnet-beta.solana.com" )
    let parsed: ParsedTransactionWithMeta | null = await connection.getParsedTransaction(confirmedSignatureInfo.signature, undefined);
    let instructions = parsed?.transaction.message.instructions;
    instructions?.forEach((instruct: ParsedInstruction | PartiallyDecodedInstruction) => {
        if ('parsed' in instruct) {
            let instruction: ParsedInstruction = instruct as ParsedInstruction;
            if (instruction.parsed.type === "transfer") {
                let r: TransferTransaction = {
                    destination: instruction.parsed.info.destination,
                    lamports: instruction.parsed.info.lamports,
                    source: instruction.parsed.info.source
                }
                txns.push(r)
            }
        } else {
        }
    });
    return txns
}
async function getTransactions(publickeyStr:string): Promise<TransferTransaction[]>{
        let publickey = new PublicKey(publickeyStr)
        let connection = new Connection( "https://api.mainnet-beta.solana.com" )
        let signatures = await connection.getSignaturesForAddress( publickey )
        let txns = new Array<TransferTransaction>
        for ( const confirmedSignatureInfo of signatures ){
            txns = await getTransferTransction( confirmedSignatureInfo, txns )
        }
        return txns
}

async function showTransactions( publickeyStr: string ){
    let txns = await getTransactions( publickeyStr )
    for ( const txn of txns ){
        console.log( "instruct {" )
        console.log( "    destination:" + txn.destination )
        console.log( "    lamports   :" + txn.lamports )
        console.log( "    source     :" + txn.source )
        console.log( "}" )
    }
}

let publickeystr = process.argv[2];
console.log( "publickey=" + publickeystr );
await showTransactions(publickeystr);

