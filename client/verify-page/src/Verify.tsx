import React from 'react';
import './Global.css'
import './Verify.css'
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
    const _showRequirement = () => {
        return true
    }
    const _showVerifyButton = () => {
        return true
    }

    const [Amount, setAmount                         ] = useState("0")
    const [isAmountLabelVisible,  showAmountLabel    ] = useReducer( _showAmountLabel, false )
    const [isFirstButtonsVisible, hideFirstButtons   ] = useReducer( _hideFirstButtons, true )
    const [isMsgPubVisible,       setIsMsgPubVisible ] = useState(false)
    const [PrintPublickey,        setPublickey       ] = useState("")
    const [isMsg2Visible,         setIsMsg2Visible   ] = useState(false)
    const [isRequirementVisible,  showRequirement    ] = useReducer( _showRequirement, false)
    const [isVerifyButtonVisible, showVerifyButton   ] = useReducer( _showVerifyButton, false)
    const [isDisableVerifyButton, setDisableVerifyButton] = useState(true)
    const requestNonceCount                            = useRef(0)
    const [RequestKeyValues,  setRequestKeyValue]      = useState<KeyValue[]>([])
    const RefRequestKeyValues                          = useRef<KeyValue[]>([])

    const createAccount = () => {
        hideFirstButtons()
        setIsMsgPubVisible(true)
        account.generateSecretkey(setPublickey, showMsg2,readyForWeb3Verify)
    }
    const haveAccount = () => {
        window.top!.postMessage("request topurl", "*");
    }

    const receiveMessage = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if ( typeof event.data !== "string" ){
            return
        }
        if ( event.data.indexOf("requirement=") !== -1 ){
            const length = "requirement=".length
            const requirement:string = event.data.substring(length, event.data.length)
            const reqs_string = requirement.split("?")

            let reqkeyvalue: KeyValue[] = []
            for ( const req_string of reqs_string ){
                if (req_string === "") continue
                let req = split( req_string, "&", ["type", "uiAmount", "address"])
                //console.log(req)
                reqkeyvalue.push(req)
            }
            setRequestKeyValue(reqkeyvalue)

            let refreqkeyvalue: KeyValue[] = []
            for ( const req_string of reqs_string ){
                if (req_string === "") continue
                let req = split( req_string, "&", ["type", "uiAmount", "address"])
                if ( req['type'] === "1" ){
                    let uiAmount = Number(req['uiAmount'])
                    if ( isNaN(uiAmount)){
                        throw Error("not number")
                    }
                    if ( await blockChain.requireUSDCExist( account.getSrcPublickey(), req['address'], uiAmount )  === true ){
                        req["result"] = "true"
                        console.log("prepare already paid")
                    } else {
                        req["result"] = "false"
                        console.log("prepare not paid")
                    }
                }
                refreqkeyvalue.push(req) 
            }

            RefRequestKeyValues.current = refreqkeyvalue
            setDisableVerifyButton(false)
        } else if ( event.data.indexOf("nonce_url=") !== -1 ){
            if ( requestNonceCount.current === 0 ){
                console.log("this function must be called after click web3verify button. security error.")
                return
            }
            requestNonceCount.current = requestNonceCount.current -1
            let nonce_url:string = event.data.substring("nonce_url=".length, event.data.length)
            let d = nonce_url.split("&")
            let nonce:string     = d[0].substring("nonce=".length, d[0].length)
            let topurl:string    = d[1].substring("topurl=".length, d[1].length)
            let [plain, signature] = await account.sign( nonce )

            for ( const requestKeyValue of RefRequestKeyValues.current ){
                if ( requestKeyValue['type'] === "1" && requestKeyValue['result'] === "false" ){
                    console.log("uiAmount=" + requestKeyValue["uiAMount"])
                    let uiAmount = Number(requestKeyValue['uiAmount'])
                    let address  = requestKeyValue['address']
                    let nextencodeurl  = encodeURIComponent(topurl + plain + "?signature=" + signature)
                    window.top!.location.href = SECURITY_SERVER+ "/secure_"+ WEB3VERIFY_VERSION + ".html" + "?pay?" + "uiAmount=" + uiAmount.toString() + "&" + "address=" + address + "&" + "nextencodedurl=" + nextencodeurl
                    console.log("not enough")
                    return
                }
            }
            console.log("enough")
            window.top!.location.href = topurl + plain + "?signature=" + signature
            return
        } else if ( event.data.indexOf("encoded_top_url=") !== -1 ){
            let encoded_top_url:string = event.data.substring("encoded_top_url=".length, event.data.length)
            window.top!.location.href = SECURITY_SERVER + "/secure_" + WEB3VERIFY_VERSION + ".html" + "?entersecret?" + "nextencodedurl=" + encoded_top_url
        } else {
            return
        }
    }

    useEffect( () => {
        window.addEventListener( "message", receiveMessage, false );

        // this is for safari history-back to enable button after web3verify button click
        history.replaceState(null, document.getElementsByTagName('title')[0].innerHTML, null);
        window.addEventListener('popstate', function(e) {
            window.location.reload();
        });
        getRequirement()
    }, [])

    const getRequirement = async () => {
        window.top!.postMessage("request requirement", "*");
    }
    const web3Verify = async () => {
        requestNonceCount.current = requestNonceCount.current +1
        setDisableVerifyButton(true)
        window.top!.postMessage("request getnonce", "*");
    }
    const readyForWeb3Verify = () => {
        showAmountLabel()
        setIsMsgPubVisible(false)
        setIsMsg2Visible(false)
        showVerifyButton()
        showRequirement()
    }
    const showMsg2 = () => {
        setIsMsg2Visible(true)
    }

    if ( account.getSrcPublickey() !== "GUEST_ACCOUNT" && isFirstButtonsVisible === true ) {
        hideFirstButtons()
        readyForWeb3Verify()
    } 
    return(
        <div className="Window Window_Verify">
            <div className="Window_FirstLine Window_FirstLine_Verify">
                <LinkOnParent className="Window_MainSite" name='Web3Verifier' url={SECURITY_SERVER+"/index.html"}></LinkOnParent> <AmountLabel caption="Balance:" amount={Amount} pointname="USDC" visible={isAmountLabelVisible} />
            </div>
            <Message className="Verify_Message1"  text="Calculating publickeys starting with VV" visible={isMsgPubVisible}/>
            <Message className="Verify_Publickey" text={PrintPublickey}                          visible={isMsgPubVisible}/>
            <Message className="Verify_Message2"  text="  generate OK! downloading secretkey."   visible={isMsg2Visible}/>
            <div className="Window_Aligner Window_Aligner_Verify">
                <CallbackButton caption="Create New Account"     visible={isFirstButtonsVisible}  onclick={createAccount} disabled={false}/>
                <CallbackButton caption="Already Have a Account" visible={isFirstButtonsVisible}  onclick={haveAccount}   disabled={false}/>
                <Requirement    requirements={RequestKeyValues}  visible={isRequirementVisible} />
                <CallbackButton caption="Web3Verify"             visible={isVerifyButtonVisible}  onclick={web3Verify}   disabled={isDisableVerifyButton}/>
            </div>
        </div>
    );
}

const container = document.getElementById('root')
const root = createRoot( container! )
root.render(
    <Verify /> 
)
