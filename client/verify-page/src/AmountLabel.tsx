import './AmountLabel.css'
import React from 'react';

export const AmountLabel = (props: { visible: boolean; caption: string; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; pointname: string; }) => {

    if ( props.visible === true ){
        return (
            <div className="AmountLabel">{props.caption + " "} <div style={{color: 'blue', display: 'inline-block'}}>{props.amount}</div> {" " + props.pointname}</div>
        )
    } else {
        return(
            <></>
        )
    }
}