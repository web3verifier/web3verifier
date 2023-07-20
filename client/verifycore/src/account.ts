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
        this.localStorageSecretName = localStorageName + "secretkey"
        this.localStoragePublicName = localStorageName + "publickey"
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
    private async fixSecretkey(): Promise<void> {
        this.setSecret( this.tmpSecretkey )
        this.download( this.tmpSecretkey )
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
    public async generateSecretkey(Vcount:number, setPrintPublickey: (arg0: string) => void,callback1: () => void,callback2: () => void) {
        let rtn: [boolean, string] = [false,""]
        for ( let i =0 ; i < 128 ; i++ ){
            rtn = await this.tryToCreateSecretkey(Vcount)
            if ( rtn[0] == true ) break
        }
        let result    = rtn[0]
        setPrintPublickey( rtn[1] )

        if ( result == false ){
            setTimeout( ()=> {
                this.generateSecretkey(Vcount, setPrintPublickey, callback1, callback2)
            }, 0)
        } else {
            this.fixSecretkey()
            callback1()
            setTimeout( () => {
                callback2()
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
