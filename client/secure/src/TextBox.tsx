import React from "react"

export const TextBox = (props: { visible: boolean; value: string | number | readonly string[]; onchange: React.ChangeEventHandler<HTMLInputElement>; className: string; size: number; maxLength: number }) => {

    if ( props.visible === true ) {
        return (
            <input value={props.value} onChange={props.onchange} type="text" className={props.className} size={props.size} maxLength={props.maxLength}></input>
        )
    } else {
        return (
            <></>
        )
    }
}