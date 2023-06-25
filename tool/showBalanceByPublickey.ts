import { Connection, PublicKey } from "@solana/web3.js";

async function requestBalance( publickeyStr:string ): Promise<number> {
    try {
        let connection = new Connection( "https://api.mainnet-beta.solana.com" )
        let publickey = new PublicKey(publickeyStr)
        let balance: number = await connection.getBalance(publickey)
        return balance
    } catch (e) {
        alert( "error" )
        alert( e )
        return -1
    }
}

let publickeystr = process.argv[2];
console.log( "publickey=" + publickeystr );
let balance:number = await requestBalance(publickeystr);
console.log( balance.toString() );
