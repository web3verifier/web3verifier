import { v4 as uuidv4 } from 'uuid';
import { verify } from './verify_sign';
import { BlockChain } from './blockchain'
import { SolanaBlockChain } from './solanablockchain';
import { SOLANA_BLOCKCHAIN_SERVER } from './url';
import { SECURITY_SERVER } from './url';

export class Verifier {
    constructor(){}
    private map = new Map<string, Date>();
    public generateNonce(): string{
        let nonce = uuidv4()
        this.map.set(nonce,new Date())
        return nonce
    }
    public async verify( clientpublickey:string, content:string, signature:string ): Promise<boolean> {
        return verify(clientpublickey, content, signature)
    }
}
