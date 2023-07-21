import React from 'react';
import './Router.css';
import { Which } from './Which';
import { EnterSecret } from './EnterSecret';
import { DownloadSecret } from './DownloadSecret';
import { ChangeSecret } from './ChangeSecret';
import { DeleteSecret } from './DeleteSecret';
import { Pay } from './Pay'
import { Account } from './account';
import { SolanaLib } from './solanalib';
import { ZEROIDENTIFY_VERSION } from './version';


export const Router = () => {
    const param = window.location.search
    console.log(window.location.search)

    let account = new Account( "root", new SolanaLib() )
    let src = account.getSrcPublickey()

    if ( src === "GUEST_ACCOUNT" ){
        if ( param.indexOf("?entersecret") !== -1 ){
            return (
                <EnterSecret />
            )
        }
    } else {
        if ( param === "" ) {
            return (
                <Which />
            )
        } else if ( param === "?downloadsecret" ){
            return (
                <DownloadSecret />
            )
        } else if ( param === "?changesecret" ){
            return (
                <ChangeSecret />
            )
        } else if ( param === "?deletesecret" ){
            return (
                <DeleteSecret returnBackURL = {"./secure_"+ZEROIDENTIFY_VERSION+".html"} />
            )
        } else if ( param.indexOf("?pay") !== -1 ){
            return (
                <Pay />
            )
        }
    }
    return (
        <Which />
    )
}

