import React from "react"

export const Message = (props: { visible: boolean; className: string; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal }) => {

    if ( props.visible === true ) {
        return (
            <div className={props.className}>{props.text}</div>
        )
    } else {
        return (
            <></>
        )
    }
}