import React from 'react';
import { DeleteSecret } from './DeleteSecret';

export const ChangeSecret = () => {
    return (
        <div>
            <DeleteSecret returnBackURL= "./entersecret.html" />
        </div>
    )
}