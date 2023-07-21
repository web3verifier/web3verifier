import "./Global.css"
import React from "react";
import { CallbackButton } from "./CallbackButton";
import './Which.css'
import { Account } from "./account";
import { AccountSecurity } from "./accountSecurity";
import { SolanaLib } from "./solanalib";
import { ZEROIDENTIFY_VERSION } from "./version";

export const Which = () => {

    const a = () => {
        const account = new Account("root", new SolanaLib() )
        const accountSecurity = new AccountSecurity(new SolanaLib() )
        account.download(accountSecurity.getSecret())
        window.location.href = "./secure.html_"+ZEROIDENTIFY_VERSION+"?downloadsecret"
    }
    const b = () => {
        window.location.href = "./secure.html_"+ZEROIDENTIFY_VERSION+"?changesecret"
    }
    const c = () => {
        window.location.href = "./secure.html_"+ZEROIDENTIFY_VERSION+"?deletesecret"
    }

    return (
        <div className="Which">
            <CallbackButton caption="Download Secretkey" visible={true}  onclick={a}/>
            <CallbackButton caption="Change Secret"      visible={true}  onclick={b}/>
            <CallbackButton caption="Delete Secret"      visible={true}  onclick={c}/>
        </div>
    )
}