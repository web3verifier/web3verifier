import React from 'react';
import './Global.css'
import './VerifyCore.css'
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
import { WEB3VERIFY_VERSION } from './version';

export const Verify = () => {

    const rootAccount  = new Account("root", new SolanaLib() )
    const childAccount = new Account("child", new SolanaLib() )

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
    const [VerifyType,               setVerifyType]         = useState("not set verify type")

    const createRootAccount = () => {
        hideFirstButtons()
        rootAccount.generateSecretkey(1, setPublickey, setGenerateRootOKMsg, true )
    }
    const createChildAccount = () => {
        hideCalcChildBtn()
        childAccount.generateSecretkey(1, setPublickey, setChildMsg, false)
    }
    const haveRootAccount = () => {
        window.top!.postMessage("request topurl@", "*");
    }

    const setType = ( type:string ) => {
        if ( type === "log_in" ){
            setButtonCaption("Log In")
            setVerifyType(type)
        }
    }

    const handle_verifytype = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["verify_type"] )
        setType(reqs["verify_type"])
    }

    const handle_param = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["callback_func", "server_publickey", "domain", "nonce" ] )
        let [message, signature] = await rootAccount.sign( reqs["server_publickey"], reqs["domain"], reqs["nonce"] )
        let msg = "web3verifier_callbackfunc@"
        msg += "client_id="            + rootAccount.getSrcPublickey() 
        msg += "&message="             + message
        msg += "&signature_by_client=" + signature
        msg += "&callback_func="       + reqs["callback_func"];
        return msg
    }

    const receiveMessage = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if ( typeof event.data !== "string" ){
            return
        }
        if ( event.data.indexOf("verify_type=") !== -1 ){
            handle_verifytype(event.data)
        } else if ( event.data.indexOf("callback_func=") !== -1 ){
            let msg_call_func = await handle_param(event.data)
            window.top!.postMessage(msg_call_func, "*");
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

    const web3Verify = async () => {
        if ( VerifyType === "log_in" ){
            window.top!.postMessage("web3verifier_getparam@" , "*");
        }
    }
    const setChildMsg = (show:boolean) => {
        setGenerateChildOKMsg(show)
        prepare()
    }
    const prepare = () => {
        window.top!.postMessage("web3verifier_getverifytype@", "*");
        showAmountLabel()
    }

    if ( rootAccount.getSrcPublickey() === "GUEST_ACCOUNT" ) {
        if ( isFirstButtonsVisible === true ){
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <div className="Window_RowDirection Window_RowDirection_Verify">
                        <CallbackButton caption="Generate New Root Secretkey" visible={true}  onclick={createRootAccount} disabled={false}/>
                        <CallbackButton caption="Already Have Root Secretkey" visible={true}  onclick={haveRootAccount}   disabled={false}/>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Verify_Message1"  text="Calculating publickeys starting with Z" visible={true}/>
                    <Message className="Verify_Publickey" text={PrintPublickey}                         visible={true}/>
                </div>
            );
        }
    } else {
        if ( isGenerateRootOKMsg === true ){
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Verify_Message1"  text="Found the secretkey!" visible={true}/>
                    <Message className="Verify_Publickey" text={PrintPublickey}                               visible={true}/>
                    <Message className="Verify_Message2"  text="  generate OK! downloading root secretkey."   visible={true}/>
                </div>
            );
        } else {
            if ( childAccount.getSrcPublickey() === "GUEST_ACCOUNT" ) {
                if ( isCalcChildKeyBtnVisible === true ){
                    return(
                        <div className="Window Window_Verify">
                            <div className="Window_FirstLine Window_FirstLine_Verify">
                                <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <div className="Window_RowDirection Window_RowDirection_Verify">
                                <CallbackButton caption={"Calculate Child Secretkey to Sign-in"}          visible={true}  onclick={createChildAccount} />
                            </div>
                        </div>
                    );
                } else {
                    return(
                        <div className="Window Window_Verify">
                            <div className="Window_FirstLine Window_FirstLine_Verify">
                                <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                            </div>
                            <Message className="Verify_Message1"  text="Calculating publickeys starting with ZZ" visible={true}/>
                            <Message className="Verify_Publickey" text={PrintPublickey}                         visible={true}/>
                        </div>
                    );
                }
            } else {
                if ( isGenerateChildOKMsg === true ){
                    return(
                        <div className="Window Window_Verify">
                            <div className="Window_FirstLine Window_FirstLine_Verify">
                                <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                            </div>
                            <Message className="Verify_Message1"  text="Found the secretkey!" visible={true}/>
                            <Message className="Verify_Publickey" text={PrintPublickey}                               visible={true}/>
                            <Message className="Verify_Message2"  text="  generate OK!" visible={true}/>
                        </div>
                    );
                } else {
                    return(
                        <div className="Window Window_Verify">
                            <div className="Window_FirstLine Window_FirstLine_Verify">
                                <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                            </div>
                            <div className="Window_RowDirection Window_RowDirection_Verify">
                                <CallbackButton caption={ButtonCaption}          visible={true}  onclick={web3Verify}  />
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
    <Verify /> 
)
