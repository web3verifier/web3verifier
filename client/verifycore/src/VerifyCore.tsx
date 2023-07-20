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
import { Requirement } from './Requirement'
import { LinkOnParent } from './LinkOnParent';
import { useEffect } from 'react';
import { useRef } from 'react';
import { split, KeyValue } from './util';
import { SOLANA_BLOCKCHAIN_SERVER } from './url';
import { SECURITY_SERVER } from './url';
import { WEB3VERIFY_VERSION } from './version';

export const Verify = () => {

    const account = new Account(new SolanaLib() )

    const blockChain = new SolanaBlockChain(SOLANA_BLOCKCHAIN_SERVER)

    const _showAmountLabel = () => {
        const req_bal = async () => {
            const balance = await blockChain.requestUSDCBalance(account.getSrcPublickey())
            setAmount( balance.toString() )
        }
        req_bal()
        return true
    }
    const _hideFirstButtons = () => {
        return false
    }

    const [Amount, setAmount                         ] = useState("0")
    const [isAmountLabelVisible,  showAmountLabel    ] = useReducer( _showAmountLabel, false )
    const [isFirstButtonsVisible, hideFirstButtons   ] = useReducer( _hideFirstButtons, true )
    const [PrintPublickey,        setPublickey       ] = useState("")
    const [isGenerateOKMsgVisible,setIsGenerateOKMsgVisiable   ] = useState(false)
    const [isDisableVerifyButton, setDisableVerifyButton] = useState(true)
    const [RequestKeyValues,  setRequestKeyValue]      = useState<KeyValue[]>([])
    const RefRequestKeyValues                          = useRef<KeyValue[]>([])
    const [ButtonCaption,        setButtonCaption ] = useState("will be verified")
    const [VerifyType,           setVerifyType    ] = useState("not set verify type")

    const createAccount = () => {
        hideFirstButtons()
        account.generateSecretkey(setPublickey, showMsg, hideMsg)
    }
    const haveAccount = () => {
        window.top!.postMessage("request topurl@", "*");
    }

    const setType = ( type:string ) => {
        if ( type === "log_in" ){
            setButtonCaption("Log In")
            setVerifyType(type)
            setDisableVerifyButton(false)
        }
    }

    const handle_verifytype = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["verify_type"] )
        setType(reqs["verify_type"])
    }

    const handle_param = async ( client_rtn: string ) => {
        let reqs = split( client_rtn, "&", ["callback_func", "server_publickey", "domain", "nonce" ] )
        let [message, signature] = await account.sign( reqs["server_publickey"], reqs["domain"], reqs["nonce"] )
        let msg = "web3verifier_callbackfunc@"
        msg += "client_id="            + account.getSrcPublickey() 
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
        if ( account.getSrcPublickey() !== "GUEST_ACCOUNT" ) {
            prepare()
        }
    }, [])

    const web3Verify = async () => {
        if ( VerifyType === "log_in" ){
            window.top!.postMessage("web3verifier_getparam@" , "*");
        }
    }
    const hideMsg = () => {
        setIsGenerateOKMsgVisiable(false)
        prepare()
    }
    const showMsg = () => {
        setIsGenerateOKMsgVisiable(true)
    }
    const prepare = () => {
        window.top!.postMessage("web3verifier_getverifytype@", "*");
        showAmountLabel()
    }


    if ( account.getSrcPublickey() === "GUEST_ACCOUNT" ) {
        if ( isFirstButtonsVisible === true ){
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <div className="Window_RowDirection Window_RowDirection_Verify">
                        <CallbackButton caption="Generate New Root Secretkey" visible={true}  onclick={createAccount} disabled={false}/>
                        <CallbackButton caption="Already Have Root Secretkey" visible={true}  onclick={haveAccount}   disabled={false}/>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Verify_Message1"  text="Calculating publickeys starting with VV" visible={true}/>
                    <Message className="Verify_Publickey" text={PrintPublickey}                          visible={true}/>
                </div>
            );
        }
    } else {
        if ( isGenerateOKMsgVisible === true ){
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent>
                    </div>
                    <Message className="Verify_Message1"  text="Found the secretkey!" visible={true}/>
                    <Message className="Verify_Publickey" text={PrintPublickey}                          visible={true}/>
                    <Message className="Verify_Message2"  text="  generate OK! downloading secretkey."   visible={true}/>
                </div>
            );
        } else {
            return(
                <div className="Window Window_Verify">
                    <div className="Window_FirstLine Window_FirstLine_Verify">
                        <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
                    </div>
                    <div className="Window_RowDirection Window_RowDirection_Verify">
                        <Requirement    requirements={RequestKeyValues}  visible={true} />
                        <CallbackButton caption={ButtonCaption}             visible={true}  onclick={web3Verify}   disabled={isDisableVerifyButton}/>
                    </div>
                </div>
            );
        }
    }
}
const container = document.getElementById('root')
const root = createRoot( container! )
root.render(
    <Verify /> 
)
