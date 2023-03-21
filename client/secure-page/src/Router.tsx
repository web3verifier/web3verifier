import React from 'react';
import './Router.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Which } from './Which';
import { EnterSecret } from './EnterSecret';
import { DownloadSecret } from './DownloadSecret';
import { ChangeSecret } from './ChangeSecret';
import { DeleteSecret } from './DeleteSecret';
import { Pay } from './Pay'
import { Account } from './account';
import { SolanaLib } from './solanalib';


export const Router = () => {
    let account = new Account( new SolanaLib() )
    let src = account.getSrcPublickey()

    if ( src === "GUEST_ACCOUNT" ){
        return (
            <div className="Router">
                <BrowserRouter>
                    <Routes>
                        <Route path="/entersecret.html?" element={<EnterSecret />} />
                    </Routes>
                </BrowserRouter>
            </div>
        )
    } else {
        return (
            <div className="Router">
                <BrowserRouter>
                    <Routes>
                        <Route path="/secure.html"         element={<Which />} />
                        <Route path="/downloadsecret.html" element={<DownloadSecret />} />
                        <Route path="/changesecret.html"   element={<ChangeSecret />} />
                        <Route path="/deletesecret.html"   element={<DeleteSecret returnBackURL = "./index.html" />} />
                        <Route path="/pay.html?"           element={<Pay />} />
                    </Routes >
                </BrowserRouter>
            </div>
        )
    }
}

