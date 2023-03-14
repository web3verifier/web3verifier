
export abstract class CryptoLib {
    public abstract createSecretkey(): string 
    public abstract getPublickeyFromSecret(secretstr: string): string 
    public abstract sign(plain: string, secretstr: string): Promise<string>
    public abstract verify(plain: string, publickey: string, sign: string): Promise<boolean>
    public abstract hash(str: string): string 
    public abstract hashFromTicketInfo(dstPublickey: string, priceInt: string, srcPublickey: string): string 
}
