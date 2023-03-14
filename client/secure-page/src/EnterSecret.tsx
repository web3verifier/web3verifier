import React from 'react';
import './EnterSecret.css'
import { AccountSecurity } from './accountSecurity'
import { SolanaLib } from './solanalib';
import { useState, useReducer } from 'react'
import { CallbackButton } from './CallbackButton';
import { TextBox } from './TextBox';

export const EnterSecret = () =>{

    const _ShowOKButton = () => {
        return true
    }
    const [secretkey, setSecretkey] = useState("")
    const [message1, setMessage1]     = useState("Enter your solana secretkey")
    const [message2, setMessage2]     = useState("")
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
            setMessage2( str )
        } else {
            setMessage1( "" )
            setMessage2( "Secretkey change is OK" )
            showOKButton()
        }
    }
    const returnback = () =>{
        window.location.href = "./secure.html"
    }
    return(
        <div className="Global_BasicColumnFlex">
            <div className="EnterSecret">
                <div>{message1}</div>
                <TextBox visible={!isOKButtonVisible} value={secretkey} onchange={onchange} className="SecretText" size={88} maxLength={88} />
                <CallbackButton caption="OK" visible={!isOKButtonVisible}  onclick={onclick}/>
            </div>
            <div>&nbsp;{message2}</div>
            <CallbackButton caption="OK" visible={isOKButtonVisible}  onclick={returnback}/>
        </div>
    )
}
