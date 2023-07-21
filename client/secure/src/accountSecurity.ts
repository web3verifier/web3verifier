import { CryptoLib } from './cryptolib';
import { error } from './error';

export type GUEST_ACCOUNT = "guest_account"
export type GUEST_SECRET  = "guest_secret"
export type OK = "OK"

export class AccountSecurity {
    cryptolib: CryptoLib
    constructor(cryptolib: CryptoLib) {
        this.cryptolib = cryptolib
    }
    private setPublickey(publickey: string): void {
        window.localStorage.setItem("root_publickey", publickey)
    }
    public setSecret(secretkey: string): [boolean, string] {
        if ( window.localStorage.getItem("root_secretkey") !== null ) {
            const e = new Error("localstorage.getItem(secretkey) must be null")
            error( e )
            throw e
        }
        try {
            const publickey = this.cryptolib.getPublickeyFromSecret(secretkey)
            if ( publickey[0] === "Z" ) {
                this.setPublickey(publickey)
            } else {
                return [false, "your publickey is " + publickey + ".\n" + "publickey for zeroIDentify need to start with Z"]
            }
        } catch(e) {
            return [false, e.message]
        }
        window.localStorage.setItem("root_secretkey", secretkey)
        return [true, ""]
    }
    public getSecret(): string | GUEST_SECRET {
        const secretkey: string | null = window.localStorage.getItem("root_secretkey")
        if (secretkey !== null) {
            return secretkey
        } else {
            return "GUEST_SECRET"
        }
    }
}
