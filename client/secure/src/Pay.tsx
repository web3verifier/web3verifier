import React from "react";
import { useReducer, useState } from "react";
import { CallbackButton } from './CallbackButton';
import { split } from "./util"
import { payUSDC } from "./payUSDC";
import { Account } from "./account";
import { SolanaLib } from "./solanalib";
import { Message } from "./Message"


export const Pay = () => {

    const _showErr = () =>{
        return true
    }
    const [isMsgErrVisiable,  showErr ] = useReducer( _showErr, false)
    const [ErrMsg, setErrMsg]           = useState("")
    const [isDisableButton, setisDisableButton] = useState(false)

    let args_all:string = window.location.search
    if ( args_all[0] !== "?"){
        throw Error( "error" )
    }
    args_all = args_all.substring( "?pay?".length, args_all.length)
    let args = split( args_all, "&", ["uiAmount", "address", "nextencodedurl"] )

    const nexturl:string  = decodeURIComponent( args["nextencodedurl"] )

    const pay = async () => {
        setisDisableButton(true)
        const account = new Account( "root", new SolanaLib() )
        const privatekey = account.getSrcPrivatekey()
        const [result, errmsg]= await payUSDC( privatekey, args["address"], args["uiAmount"] )
        if ( result === true ){
            window.location.href = nexturl
        } else {
            setErrMsg(errmsg)
            showErr()
        }
    }
    return (
        <div className="Global_BasicColumnFlex">
            <div>Pay for zeroIDentify</div>
            <div>{args["uiAmount"]} USDC</div>
            <div>Destination: {args["address"]}</div>
            <CallbackButton caption="Pay for web3veirfy" visible={true} disabled={isDisableButton}  onclick={pay}/>
            <Message className="Verify_Publickey" text={ErrMsg} visible={isMsgErrVisiable}/>
        </div>
    )
}