import React from "react";
import { CallbackButton } from "./CallbackButton";
import { Account } from "./account";
import { SolanaLib } from './solanalib';
import { useState, useReducer } from "react"

export const DeleteSecret = ( props: { returnBackURL: string; } ) => {

    const _hideButton = () => {
        return false
    }
    const [isButtonVisible, hideButton] = useReducer(_hideButton, true)
    const [comment, setComment]         = useState( "Is it really ok to delete current secretkey from this browser?" )
    const deleteSecret = () => {
        const account = new Account( "root", new SolanaLib() )
        account.deleteAllKey()
        hideButton()
        setComment("Secretkey have been deleted")
    }
    const returnback = () => {
        window.location.href = props.returnBackURL
    }

    return (
        <div className="Global_BasicColumnFlex">
            <div>{comment}</div>
            <CallbackButton caption="Delete Secret OK" visible={isButtonVisible}  onclick={deleteSecret}/>
            <CallbackButton caption="OK" visible={!isButtonVisible}  onclick={returnback}/>
        </div>
    )
}