import { Keypair } from '@solana/web3.js'
import base58 from  'bs58';

function createSecretkey(): string {
	let keypair = Keypair.generate()
	let base58secret = base58.encode(keypair.secretKey)
	return base58secret
}

console.log( "generated secretKey=" + createSecretkey() )

