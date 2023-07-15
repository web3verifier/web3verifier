import { CryptoLib } from './cryptolib';
import { error } from './error';
import { sign } from './verify_sign'

export type GUEST_ACCOUNT = "guest_account"
export type GUEST_SECRET  = "guest_secret"
export type OK = "OK"

export class Account {
    cryptolib: CryptoLib
    tmpSecretkey: string
    constructor(cryptolib: CryptoLib) {
        this.cryptolib = cryptolib
        this.tmpSecretkey = "NotSetYet"
    }
    private setSecret(secretkey: string): [boolean, string] {
        if ( window.localStorage.getItem("secretkey") !== null ) {
            const e = new Error("localstorage.getItem(secretkey) must be null")
            error( e )
            throw e
        }
        try {
            this.setPublickey(this.cryptolib.getPublickeyFromSecret(secretkey))
        } catch(e) {
            return [false, e.message]
        }
        window.localStorage.setItem("secretkey", secretkey)
        return [true, ""]
    }
    private setPublickey(publickey: string): void {
        window.localStorage.setItem("publickey", publickey)
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

    private async tryToCreateSecretkey(): Promise<[boolean,string]> {
        this.tmpSecretkey = this.cryptolib.createSecretkey()
        let publickey = this.cryptolib.getPublickeyFromSecret(this.tmpSecretkey)
        if ( publickey[0] === "V" && publickey[1] === "V" ) {
        //if ( publickey[0] === "V" ) {
            return [true, publickey];
        } else {
            return [false, publickey];
        }
    }
    public async generateSecretkey(setPrintPublickey: (arg0: string) => void,callback1: () => void,callback2: () => void) {
        let rtn: [boolean, string] = [false,""]
        for ( let i =0 ; i < 128 ; i++ ){
            rtn = await this.tryToCreateSecretkey()
            if ( rtn[0] == true ) break
        }
        let result    = rtn[0]
        setPrintPublickey( rtn[1] )

        if ( result == false ){
            setTimeout( ()=> {
                this.generateSecretkey(setPrintPublickey, callback1, callback2)
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
        window.localStorage.removeItem("publickey")
        window.localStorage.removeItem("secretkey")
    }
    public getSrcPublickey(): string | GUEST_ACCOUNT {
        const publickey: string | null = window.localStorage.getItem("publickey")
        if (publickey !== null) {
            return publickey
        } else {
            return "GUEST_ACCOUNT"
        }
    }

    public async sign( serverpublickey:string, domain:string, nonce:string ): Promise<[string, string]>{
        let [plain,sig] = await sign( serverpublickey, domain, nonce, window.localStorage.getItem("secretkey")! )
        return [plain, sig]
    }

    public getSrcPrivatekey(): string {
        return window.localStorage.getItem("secretkey")!
    }

}
