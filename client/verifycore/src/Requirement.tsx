import React from "react"
import { Message } from "./Message"
import "./Requirement.css"
import { KeyValue } from "./util"

export const Requirement = (props: { visible: boolean; requirements: KeyValue[]}) => {
    if ( props.visible === true ){
        let i = 2
        const rows: string[] = []
        for ( const requirement of props.requirements ){
            if ( requirement['type'] === "1" ){
                rows.push( i.toString() + ". " + "You have sent >= " + requirement['uiAmount'] + " USDC" + " to " + requirement['address'].substring(0,7) + "..." )
            }
        }
        return (
            <div className="Requirements">
                <Message className="Requirement" text="Requirement:"                    visible={true}></Message>
                <Message className="Requirement" text="1. Your Account Start from VV.." visible={true}></Message>

                { rows.map( function(text){
                    return <Message className="requirement" text={text} visible={true} key={text}></Message>
                })}
            </div>
        ) 
    } else {
        return (
            <></>
        )
    }
}