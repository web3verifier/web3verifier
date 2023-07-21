import { v4 as uuidv4 } from 'uuid';
import { verify, parse } from './verify_sign';

export class Verifier {
    constructor(){}
    private map = new Map<string, Date>();
    public generateNonce(): string{
        let nonce = uuidv4()
        this.map.set(nonce,new Date())
        return nonce
    }
    public check( nonce:string ): boolean{
        if (this.map.has(nonce) === true) {
            this.map.delete(nonce)
            return true
        } else {
            return false
        }
    }
    public parse( message:string ){
        let s = parse(message)
        return s
    }
    public async verify( clientpublickey:string, content:string, signature:string ): Promise<boolean> {
        return verify(clientpublickey, content, signature)
    }
}
