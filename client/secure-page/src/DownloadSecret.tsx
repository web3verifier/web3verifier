import React from "react";
import { CallbackButton } from './CallbackButton';

export const DownloadSecret = () => {

    const returnback = () => {
        window.location.href = "./secure.html"
    }
    return (
        <div className="Global_BasicColumnFlex">
            <div>Your privatekey have been downloaded</div>
            <CallbackButton caption="OK" visible={true}  onclick={returnback}/>
        </div>
    )
}