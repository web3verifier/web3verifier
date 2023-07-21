
export abstract class CryptoLib {
    public abstract createSecretkeyFromSeed(seed:Uint8Array):string
    public abstract createSecretkey(): string 
    public abstract getPublickeyFromSecret(secretstr: string): string 
    public abstract sign(content: string, secretstr: string): Promise<string>
    public abstract verify(content: string, publickey: string, sign: string): Promise<boolean>
    public abstract hash(array: Uint8Array): Uint8Array
}
