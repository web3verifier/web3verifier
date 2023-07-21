import base58 from 'bs58';
import { CryptoLib } from './cryptolib';
import { error } from './error';
import { sign, getContent } from './verify_sign'

export type GUEST_ACCOUNT = "guest_account"
export type GUEST_SECRET  = "guest_secret"
export type OK = "OK"

export class Account {
    cryptolib: CryptoLib
    tmpSecretkey: string
    localStorageSecretName: string
    localStoragePublicName: string
    constructor(localStorageName: string, cryptolib: CryptoLib) {
        this.cryptolib = cryptolib
        this.tmpSecretkey = "NotSetYet"
        this.localStorageSecretName = localStorageName + "_secretkey"
        this.localStoragePublicName = localStorageName + "_publickey"
    }
    private setSecret(secretkey: string): [boolean, string] {
        if ( window.localStorage.getItem(this.localStorageSecretName) !== null ) {
            const e = new Error("localstorage.getItem(" + this.localStorageSecretName + ") must be null")
            error( e )
            throw e
        }
        try {
            this.setPublickey(this.cryptolib.getPublickeyFromSecret(secretkey))
        } catch(e) {
            return [false, e.message]
        }
        window.localStorage.setItem(this.localStorageSecretName, secretkey)
        return [true, ""]
    }
    private setPublickey(publickey: string): void {
        window.localStorage.setItem(this.localStoragePublicName, publickey)
    }
    public download(secretkey:string) {
        var link = document.createElement('a');
        link.setAttribute("href", "data:text/plain;charset=utf-8," + secretkey)
        link.setAttribute("download", "account_" + this.getSrcPublickey() + ".txt")

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }



    private FixChar: string = "Z"
    private async tryToCreateSecretkey(VCount:number): Promise<[boolean,string]> {
        this.tmpSecretkey = this.cryptolib.createSecretkey()
        let publickey = this.cryptolib.getPublickeyFromSecret(this.tmpSecretkey)

        if ( VCount === 2 ){
            if ( publickey[0] === this.FixChar && publickey[1] === this.FixChar ) {
                return [true, publickey];
            } else {
                return [false, publickey];
            }
        } else if ( VCount === 1 ){
            if ( publickey[0] === this.FixChar ) {
                return [true, publickey];
            } else {
                return [false, publickey];
            }

        } else {
            throw Error("not proper VCount")
        }

    }

    /*
private cat(a: Uint8Array, b: Uint8Array): Uint8Array {
    let c = new Uint8Array(65)
    c[a.length] = b[0]
    return c;
}
*/
    private numToUint8Array(num): Uint8Array {
        let arr = new Uint8Array(8);

        for (let i = 0; i < 8; i++) {
            arr[i] = num % 256;
            num = Math.floor(num / 256);
        }

        return arr;
    }
    private cat(a: Uint8Array, b: Uint8Array): Uint8Array {
        let c = new Uint8Array(64)
        for ( let i=0; i < a.length; i++ ){
            c[i] = a[i] + b[i]
        }
        return c
    }
    private escapeBase58Unused( url: string ): string{
        // Base58:  123456789ABCDEFGHJKLMN PQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
        // URL   : 0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz-_.!'()*
        let base58String:string = url
        base58String = base58String.replace( "0", "x" )
        base58String = base58String.replace( "O", "x" )
        base58String = base58String.replace( "-", "x" )
        base58String = base58String.replace( "_", "x" )
        base58String = base58String.replace( ".", "x" )
        base58String = base58String.replace( "!", "x" )
        base58String = base58String.replace( "'", "x" )
        base58String = base58String.replace( "(", "x" )
        base58String = base58String.replace( ")", "x" )
        base58String = base58String.replace( "*", "x" )
        return base58String
    }

    private async tryToCalculateSecretkey(rootSecretkey:string, n:number, firstSubDomainChars:string): Promise<[boolean,string]> {
        if ( base58.decode(rootSecretkey).length != 64 ){
            throw Error( "hash length error" )
        }
        const encoder = new TextEncoder()
        let salt0: Uint8Array = this.cryptolib.hash(encoder.encode(window.location.hostname))
        let salt1: Uint8Array = this.cryptolib.hash(this.numToUint8Array(n))
        let seed0: Uint8Array = base58.decode(rootSecretkey)
        let seed1: Uint8Array = this.cryptolib.hash(this.cat(seed0,salt0))
        let seed:  Uint8Array = this.cryptolib.hash(this.cat(seed1,salt1))


        this.tmpSecretkey = this.cryptolib.createSecretkeyFromSeed(seed.slice(0,32))
        let publickey:string = this.cryptolib.getPublickeyFromSecret(this.tmpSecretkey)

        console.log("n=" + n + " base58 seed=" + base58.encode(seed))
        console.log("publicekey =" + publickey)
        console.log("expectChars=" + firstSubDomainChars)

        if ( publickey.indexOf( this.escapeBase58Unused(firstSubDomainChars) ) === 0 ){
            return [true, publickey];
        } else {
            return [false, publickey];
        }
    }

    public async calculateSecretkey(rootSecretkey:string, n:number, firstSubDomainChars: string, setPrintPublickey: (arg0: string) => void, showMsg: (arg0: boolean) => void ) {
        let rtn: [boolean, string] = [false,""]
        for ( let i =0 ; i < 128 ; i++ ){
            rtn = await this.tryToCalculateSecretkey(rootSecretkey, n, firstSubDomainChars)
            n ++
            if ( rtn[0] == true ) break
        }
        let result    = rtn[0]
        setPrintPublickey( rtn[1] )

        if ( result == false ){
            setTimeout( ()=> {
                this.calculateSecretkey(rootSecretkey, n, firstSubDomainChars, setPrintPublickey, showMsg )
            }, 0)
        } else {
            showMsg(true)
            this.setSecret( this.tmpSecretkey )
            setTimeout( () => {
                showMsg(false)
            }, 5000)
        }

    }
    public async generateSecretkey(Vcount:number, setPrintPublickey: (arg0: string) => void, showMsg: (arg0: boolean) => void) {
        let rtn: [boolean, string] = [false,""]
        for ( let i =0 ; i < 128 ; i++ ){
            rtn = await this.tryToCreateSecretkey(Vcount)
            if ( rtn[0] == true ) break
        }
        let result    = rtn[0]
        setPrintPublickey( rtn[1] )

        if ( result == false ){
            setTimeout( ()=> {
                this.generateSecretkey(Vcount, setPrintPublickey, showMsg )
            }, 0)
        } else {
            showMsg(true)
            this.setSecret( this.tmpSecretkey )
            this.download( this.tmpSecretkey )
            setTimeout( () => {
                showMsg(false)
            }, 5000)
        }
    }
    public deleteAllKey(): void {
        window.localStorage.removeItem(this.localStoragePublicName)
        window.localStorage.removeItem(this.localStorageSecretName)
    }
    public getSrcPublickey(): string | GUEST_ACCOUNT {
        const publickey: string | null = window.localStorage.getItem(this.localStoragePublicName)
        if (publickey !== null) {
            return publickey
        } else {
            return "GUEST_ACCOUNT"
        }
    }

    public async sign( serverpublickey:string, domain:string, nonce:string ): Promise<[string, string]>{
        let cont = getContent( serverpublickey, domain, nonce )
        let [message,sig] = await sign( cont, window.localStorage.getItem(this.localStorageSecretName)! )
        return [message, sig]
    }

    public getSrcPrivatekey(): string {
        return window.localStorage.getItem(this.localStorageSecretName)!
    }

}
