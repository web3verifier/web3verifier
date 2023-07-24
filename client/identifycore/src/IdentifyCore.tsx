import React from 'react';
import './Global.css'
import './IdentifyCore.css'
import { createRoot } from 'react-dom/client';
import { Account } from './account'
import { SolanaLib } from './solanalib';
import { SolanaBlockChain } from './solanablockchain'
import { AmountLabel } from './AmountLabel';
import { CallbackButton } from './CallbackButton';
import { Message } from './Message';
import { useState, useReducer } from 'react';
import { LinkOnParent } from './LinkOnParent';
import { useEffect } from 'react';
import { split } from './util';
import { SOLANA_BLOCKCHAIN_SERVER } from './url';
import { SECURITY_SERVER } from './url';
import { ZEROIDENTIFY_VERSION } from './version';

export const Identify = () => {

    const rootAccount  = new Account("root", new SolanaLib() )
    const childAccount = new Account("child_"+window.location.hostname, new SolanaLib() )

    const blockChain = new SolanaBlockChain(SOLANA_BLOCKCHAIN_SERVER)

    const _showAmountLabel = () => {
        const req_bal = async () => {
            const balance = await blockChain.requestUSDCBalance(rootAccount.getSrcPublickey())
            setAmount( balance.toString() )
        }
        req_bal()
        return true
    }
    const _hideFirstButtons = () => {
        return false
    }
    const _hideCalcChildBtn = () => {
        return false
    }

    const [Amount,                   setAmount]             = useState("0")
    const [isAmountLabelVisible,     showAmountLabel]       = useReducer( _showAmountLabel, false )
    const [isFirstButtonsVisible,    hideFirstButtons]      = useReducer( _hideFirstButtons, true )
    const [isCalcChildKeyBtnVisible, hideCalcChildBtn]      = useReducer( _hideCalcChildBtn, true )
    const [PrintPublickey,           setPublickey]          = useState("")
    const [isGenerateRootOKMsg ,     setGenerateRootOKMsg]  = useState( false )
    const [isGenerateChildOKMsg ,    setGenerateChildOKMsg] = useState( false )
    const [ButtonCaption,            setButtonCaption]      = useState("will be verified")
    const [IdentifyType,             setIdentifyType]         = useState("not set Identifytype")
    const [ServerPublickey,          setServerPublickey]    = useState("not Init Publickey")

    const createRootAccount = () => {
        hideFirstButtons()
        rootAccount.generateSecretkey(1, setPublickey, setRootMsg)
    }
    const createChildAccount = () => {
        hideCalcChildBtn()

        const hostname = window.location.hostname
        childAccount.calculateSecretkey(rootAccount.getSrcPrivatekey(), 1, hostname[0]+hostname[1], setPublickey, setChildMsg) // no two start words
    }
    const haveRootAccount = () => {
        window.top!.postMessage("zeroidentify_topurl@", "*");
    }

    const setType = ( Identifytype:string ) => {
        if ( Identifytype === "log_in" ){
            setButtonCaption("Log In")
            setIdentifyType(Identifytype)
        }
    }

    const handle_identifytype = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["identify_type"] )
        setType(reqs["identify_type"])
    }

    const handle_param = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["callback_func", "server_publickey", "domain", "nonce" ] )
        let [message, signature] = await rootAccount.sign( reqs["server_publickey"], reqs["domain"], reqs["nonce"] )
        setServerPublickey( reqs["server_publickey"] )
        let msg = "zeroidentify_callbackfunc@"
        msg += "client_id="            + rootAccount.getSrcPublickey() 
        msg += "&message="             + message
        msg += "&signature_by_client=" + signature
        msg += "&callback_func="       + reqs["callback_func"];
        return msg
    }

    const handle_jump = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["encoded_top_url"] )
        const encoded_top_url:string = decodeURIComponent( reqs["encoded_top_url"] ) 
        window.top!.location.href = SECURITY_SERVER + "/secure_" + ZEROIDENTIFY_VERSION + ".html" + "?entersecret?" + "nextencodedurl=" + encoded_top_url
    }

    const receiveMessage = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if ( typeof event.data !== "string" ){
            return
        }
        if ( event.data.indexOf("identify_type=") !== -1 ){
            handle_identifytype(event.data)
        } else if ( event.data.indexOf("callback_func=") !== -1 ){
            let msg_call_func = await handle_param(event.data)
            window.top!.postMessage(msg_call_func, "*");
        } else if ( event.data.indexOf("encoded_top_url=") !== -1 ){
            handle_jump( event.data )
        } else {
            return
        }
    }

    useEffect( () => {
        window.addEventListener( "message", receiveMessage, false );
        if ( rootAccount.getSrcPublickey() !== "GUEST_ACCOUNT" ) {
            prepare()
        }
    }, [])

    const zeroIdentify = async () => {
        if ( IdentifyType === "log_in" ){
            window.top!.postMessage("zeroidentify_getparam@" , "*");
        }
    }
    const setRootMsg = (show:boolean) => {
        setGenerateRootOKMsg(show)
        showAmountLabel()
    }
    const setChildMsg = (show:boolean) => {
        setGenerateChildOKMsg(show)
        prepare()
    }
    const prepare = () => {
        window.top!.postMessage("zeroidentify_getidentifytype@", "*");
        showAmountLabel()
    }

    if ( rootAccount.getSrcPublickey() === "GUEST_ACCOUNT" ) {
        if ( isFirstButtonsVisible === true ){
            return(
                <div className="Window Window_Identify">
                    <div className="Window_FirstLine Window_FirstLine_Identify">
                        <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <div className="Window_RowDirection Window_RowDirection_Identify">
                        <CallbackButton caption="Generate New Root Secretkey" visible={true}  onclick={createRootAccount} disabled={false}/>
                        <CallbackButton caption="Already Have Root Secretkey" visible={true}  onclick={haveRootAccount}   disabled={false}/>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="Window Window_Identify">
                    <div className="Window_FirstLine Window_FirstLine_Identify">
                        <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Identify_Message1"  text="The Root Secret key is generating, the pair of public key of which begins with the letter Z." visible={true}/>
                    <Message className="Identify_Publickey" text={PrintPublickey}                         visible={true}/>
                </div>
            );
        }
    } else {
        if ( isGenerateRootOKMsg === true ){
            return(
                <div className="Window Window_Identify">
                    <div className="Window_FirstLine Window_FirstLine_Identify">
                        <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Identify_Message1"  text="Found the Root Secretkey!"                    visible={true}/>
                    <Message className="Identify_Publickey" text={PrintPublickey}                               visible={true}/>
                    <Message className="Identify_Message2"  text="  generate OK! downloading Root Secretkey."   visible={true}/>
                </div>
            );
        } else {
            if ( childAccount.getSrcPublickey() === "GUEST_ACCOUNT" ) {
                if ( isCalcChildKeyBtnVisible === true ){
                    return(
                        <div className="Window Window_Identify">
                            <div className="Window_FirstLine Window_FirstLine_Identify">
                                <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <div className="Window_ColumnDirection Window_RowDirection_Identify">
                                <Message className="Identify_Publickey" text={rootAccount.getSrcPublickey()} visible={true}/>
                                <CallbackButton caption={"Calculate Child Secretkey to Sign up"}          visible={true}  onclick={createChildAccount} />
                            </div>
                        </div>
                    );
                } else {
                    let firstChars = window.location.hostname[0] + window.location.hostname[1]
                    return(
                        <div className="Window Window_Identify">
                            <div className="Window_FirstLine Window_FirstLine_Identify">
                                <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <Message className="Identify_Message1"  text={"The Child Secret key is calculating."} visible={true}/>
                            <Message className="Identify_Publickey" text={PrintPublickey}                         visible={true}/>
                            <Message className="Identify_Message2"  text={"Finding this pair of public key begins with the letter \""+firstChars+"\". this is current domain first two chars."} visible={true}/>
                        </div>
                    );
                }
            } else {
                if ( isGenerateChildOKMsg === true ){
                    return(
                        <div className="Window Window_Identify">
                            <div className="Window_FirstLine Window_FirstLine_Identify">
                                <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <Message className="Identify_Message1"  text="Found the Child Secretkey!" visible={true}/>
                            <Message className="Identify_Publickey" text={PrintPublickey}       visible={true}/>
                            <Message className="Identify_Message2"  text="  calculate OK!"      visible={true}/>
                        </div>
                    );
                } else {
                    return(
                        <div className="Window Window_Identify">
                            <div className="Window_FirstLine Window_FirstLine_Identify">
                                <LinkOnParent className="Window_MainSite" name='ZeroIDentify' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <div className="Window_ColumnDirection Window_RowDirection_Identify">
                                <Message className="Identify_Publickey" text={childAccount.getSrcPublickey()} visible={true}/>
                                <CallbackButton caption={ButtonCaption}          visible={true}  onclick={zeroIdentify}  />
                            </div>
                        </div>
                    );
                }
            }
        }
    }
}
const container = document.getElementById('root')
const root = createRoot( container! )
root.render(
    <Identify /> 
)
