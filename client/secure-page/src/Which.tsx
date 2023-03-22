import "./Global.css"
import React from "react";
import { CallbackButton } from "./CallbackButton";
import './Which.css'
import { Account } from "./account";
import { AccountSecurity } from "./accountSecurity";
import { SolanaLib } from "./solanalib";

export const Which = () => {

    const a = () => {
        const account = new Account(new SolanaLib() )
        const accountSecurity = new AccountSecurity(new SolanaLib() )
        account.download(accountSecurity.getSecret())
        window.location.href = "./secure.html?downloadsecret"
    }
    const b = () => {
        window.location.href = "./secure.html?changesecret"
    }
    const c = () => {
        window.location.href = "./secure.html?deletesecret"
    }

    return (
        <div className="Which">
            <CallbackButton caption="Download Secretkey" visible={true}  onclick={a}/>
            <CallbackButton caption="Change Secret"      visible={true}  onclick={b}/>
            <CallbackButton caption="Delete Secret"      visible={true}  onclick={c}/>
        </div>
    )
}