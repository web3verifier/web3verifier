import { v4 as uuidv4 } from 'uuid';
import { verify, parse } from './verify_sign';
import { BlockChain } from './blockchain'
import { SolanaBlockChain } from './solanablockchain';
import { SOLANA_BLOCKCHAIN_SERVER } from './url';
import { SECURITY_SERVER } from './url';

export const Request = {
    User_Paid_USDC_More_Than_Equal_X: 1
} as const

export type Request = typeof Request[keyof typeof Request]

export type Verify_Request_Param = {
    type: Request
    uiAmount?: number,
    userAddress?: string
}

export function existRequirement( requires: Verify_Request_Param[], require: Request ): boolean{
    for ( const p of requires ){
        if ( p.type === require ){
            return true
        }
    }
    return false
}
export function getRequirement( requires: Verify_Request_Param[], require: Request ): Verify_Request_Param | null {
    for ( const p of requires ){
        if ( p.type === require ){
            return p 
        }
    }
    return null
}
export class Verifier {
    private param: Verify_Request_Param[]
    constructor( param: Verify_Request_Param[] ){
        this.param = param
    }
    private map = new Map<string, Date>();
    public generateNonce(): string{
        let nonce = uuidv4()
        this.map.set(nonce,new Date())
        return nonce
    }
    public async verify( url: string ): Promise<boolean> {
        let [srcpublickey, nonce_in_url, signature] = await parse(url)
        if ( this.map.has(nonce_in_url) ){
            this.map.delete(nonce_in_url)

            // Start from VV is mandatory
            //if ( srcpublickey[0] !== "V" ){
            if ( srcpublickey[0] !== "V" || srcpublickey[1] !== "V" ) {
                return false
            }

            if ( existRequirement(this.param,Request.User_Paid_USDC_More_Than_Equal_X) === true ){
                let param: Verify_Request_Param = getRequirement(this.param,Request.User_Paid_USDC_More_Than_Equal_X)!
                let blockchain: BlockChain = new SolanaBlockChain(SOLANA_BLOCKCHAIN_SERVER)
                if (await blockchain.requireUSDCExist(srcpublickey,param.userAddress!,param.uiAmount!) === false ) {
                    return false
                }
            }

            return verify(url)
        } else {
            return false
        }
    }
}
