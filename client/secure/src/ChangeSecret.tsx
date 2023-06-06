import React from 'react';
import { DeleteSecret } from './DeleteSecret';
import { WEB3VERIFY_VERSION } from './version';

export const ChangeSecret = () => {
    return (
        <div>
            <DeleteSecret returnBackURL= {"./secure_" + WEB3VERIFY_VERSION + ".html" + "?entersecret"} />
        </div>
    )
}