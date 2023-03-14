import "./CallbackButton.css"
import React from "react"

export const CallbackButton = (props) => {

    let op : string
    if ( props.disabled === true ){
        op = "0.4"
    } else {
        op = "1"
    }
    if ( props.visible === true ){
        return (
            <>
                <button style={{ 'opacity': op }} onClick={props.onclick} className="CallbackButton" disabled={props.disabled}>{props.caption}</button>
            </>
        )
    } else {
        return (
            <></>
        )
    }
}