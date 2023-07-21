import React from 'react';
import { DeleteSecret } from './DeleteSecret';
import { ZEROIDENTIFY_VERSION } from './version';

export const ChangeSecret = () => {
    return (
        <div>
            <DeleteSecret returnBackURL= {"./secure_" + ZEROIDENTIFY_VERSION + ".html" + "?entersecret"} />
        </div>
    )
}