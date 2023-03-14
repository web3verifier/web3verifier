import React from "react"

export const LinkOnParent = (props: { url: any; className: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal }) => {
    const jump = () =>{
        window.top!.location.href = props.url
    }
    return (
        <div className={props.className} onClick={jump}>{props.name}</div>
    )
}