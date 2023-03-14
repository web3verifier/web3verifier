import { Connection, TokenAccountBalancePair } from '@solana/web3.js';
import { BlockChain } from './blockchain';
import { PublicKey } from '@solana/web3.js';
import { ParsedTransactionWithMeta } from '@solana/web3.js'
import { ConfirmedSignatureInfo } from '@solana/web3.js'
import { ParsedInstruction } from '@solana/web3.js'
import { PartiallyDecodedInstruction } from '@solana/web3.js'
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface USDCTransferTransaction{
    destination: string;
    mint       : string;
    source     : string;
    uiAmount   : string;
}

export class SolanaBlockChain extends BlockChain {
    private solana: Connection
    constructor(serverUrl:string){
        super()
        this.solana = new Connection(serverUrl)
    }

    private async getAssociatedUSDCAddress( publickey:string ){
        const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        const mintPublickey = new PublicKey(USDC_ADDRESS)
        const Publickey  = new PublicKey(publickey)
        return await getAssociatedTokenAddress(mintPublickey, Publickey)
    }

    private async getUSDCTransferTransaction( confirmedSignatureInfo: ConfirmedSignatureInfo, txns: USDCTransferTransaction[] ): Promise<USDCTransferTransaction[]>{
        let parsed: ParsedTransactionWithMeta | null = await this.solana.getParsedTransaction(confirmedSignatureInfo.signature, {
            maxSupportedTransactionVersion: 0,    
        });
        let instructions = parsed?.transaction.message.instructions;
        instructions?.forEach((instruct: ParsedInstruction | PartiallyDecodedInstruction) => {
            if ('parsed' in instruct) {
                let instruction: ParsedInstruction = instruct as ParsedInstruction;
                if (instruction.parsed.type === "transferChecked") {
                    let r: USDCTransferTransaction = {
                        destination: instruction.parsed.info.destination,
                        mint: instruction.parsed.info.mint,
                        source: instruction.parsed.info.source,
                        uiAmount: instruction.parsed.info.tokenAmount.uiAmount
                    }
                    txns.push(r)
                }
            } else {
            }
        });
        return txns
    }
    private async getUSDCTransactions( publickeyStr:string ): Promise<USDCTransferTransaction[]>{
            let publickey = new PublicKey(publickeyStr)
            let txns = new Array<USDCTransferTransaction>
            //console.log("    getSignaturesForAddress")
            try {
                let signatures = await this.solana.getSignaturesForAddress( publickey )
                for ( const confirmedSignatureInfo of signatures ){
                    //console.log("    signature=" + confirmedSignatureInfo.signature)
                    //console.log("    getTransferTransaction")
                    txns = await this.getUSDCTransferTransaction( confirmedSignatureInfo, txns )
                }
                return txns
            } catch (e) {
                console.log("error=" + e)
                throw Error(e)
            }
    }

    public async requireUSDCExist(srcpublickey:string, dstpublickey:string, reqUiAmount:number ) :Promise<boolean> {
        //console.log("requireSDCExist(){")
        //console.log( "  dstpublickey=" + dstpublickey)
        //console.log( "  srcpublickey=" + srcpublickey)
        //console.log( "  reqUiAmount="  + reqUiAmount)
        try {
            let txns = await this.getUSDCTransactions(srcpublickey )
            const associatedSrcPublickey = await this.getAssociatedUSDCAddress(srcpublickey)
            const associatedDstPublickey = await this.getAssociatedUSDCAddress(dstpublickey)
            //console.log( "  associate Srckey=" + associatedSrcPublickey.toString())
            //console.log( "  associate Dstkey=" + associatedDstPublickey.toString())
            for ( const txn of txns ){
                //console.log( "  txn.destination=" + txn.destination)
                //console.log( "  txn.source     =" + txn.source)
                //console.log( "  txn.uiAmount    =" + txn.uiAmount)
                const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                if ( txn.mint !== USDC_ADDRESS ){
                    continue
                }
                let txnUiAmount: number = parseFloat(txn.uiAmount)

                if ( isNaN(txnUiAmount) === true ){
                    continue
                }


                if (   associatedDstPublickey.toString() === txn.destination
                    && associatedSrcPublickey.toString() === txn.source
                    && reqUiAmount                       <=  txnUiAmount ){
                        return true
                }
            }
        } catch (e) {
            //throw Error("error=" + e)
            console.log("error=" + e)
            return false
        }
        //console.log("}")
        return false
    }
    public async requestUSDCBalance( publickeyStr:string ): Promise<number> {
        try {
            const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            let publickey = new PublicKey(publickeyStr)
            let mintPublickey = new PublicKey(USDC_ADDRESS)
            const a = await this.solana.getParsedTokenAccountsByOwner( publickey, {mint: mintPublickey})
            if ( a.value.length === 0 ){
                return 0
            } else {
                const balance:number = a.value[0]['account']['data']['parsed']['info']['tokenAmount']['uiAmount']
                return balance
            }
        } catch (e) {
            console.log( "error" )
            console.log( e )
            return -1
        }
    }
}