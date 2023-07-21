import './EnterSecret.css'
import './Global.css'
import './AmountLabel.css'
import React from 'react';
import { AccountSecurity } from './accountSecurity'
import { SolanaLib } from './solanalib';
import { useState, useReducer } from 'react'
import { CallbackButton } from './CallbackButton';
import { TextBox } from './TextBox';
import { split } from "./util"
import { LinkOnParent } from './LinkOnParent';
import { SECURITY_SERVER } from './url';
import { Message } from './Message'


export const EnterSecret = () =>{

    const _ShowOKButton = () => {
        return true
    }

    const [secretkey, setSecretkey] = useState("")
    const [message, setMessage]     = useState(" ")
    const [isOKButtonVisible, showOKButton] = useReducer( _ShowOKButton, false )
    const onchange = ( {target: { value }}) => {
        setSecretkey(value)
    }

    const onclick = () => {
        let solanalib = new SolanaLib()
        let accountSecurity = new AccountSecurity( solanalib )
        let [result, str]= accountSecurity.setSecret( secretkey )
        setSecretkey(secretkey)
        if ( result == false ){
            setMessage( str )
        } else {
            setMessage( "" )
            showOKButton()
        }
    }

    let args_all:string = window.location.search
    if ( args_all[0] !== "?"){
        throw Error( "error" )
    }
    args_all = args_all.substring( "?entersecret?".length, args_all.length)
    let args = split( args_all, "&", ["nextencodedurl"] )

    const nexturl:string  = decodeURIComponent( args["nextencodedurl"] )

    const returnback = () =>{
        window.location.href = nexturl
    }

    if ( isOKButtonVisible === false ){
        return(
            <div className="AllCenter">
                <div className="Window Window_EnterSecret">
                    <div className="Window_FirstLine Window_FirstLine_EnterSecret">
                        <LinkOnParent className="Window_MainSite" name='zeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <div className="Window_ColumnDirection Window_ColumnDirection_EnterSecret">
                        <Message className="EnterSecret_Message"  text="Enter a secret key whose public key begins with Z." visible={true}/>
                        <div>
                            <TextBox visible={!isOKButtonVisible} value={secretkey} onchange={onchange} className="SecretText" size={88} maxLength={88} />
                            &nbsp;&nbsp;
                            <CallbackButton caption="OK" visible={!isOKButtonVisible}  onclick={onclick}/>
                        </div>
                        <Message className="EnterSecret_Message"  text={message} visible={true}/>
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <div className="AllCenter">
                <div className="Window Window_EnterSecret">
                    <div className="Window_FirstLine Window_FirstLine_EnterSecret">
                        <LinkOnParent className="Window_MainSite" name='zeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <div className="Window_ColumnDirection Window_ColumnDirection_EnterSecret">
                        <div>
                        <CallbackButton caption="OK" visible={isOKButtonVisible}  onclick={returnback}/>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}
