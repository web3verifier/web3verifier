
export abstract class BlockChain {
    public abstract requestUSDCBalance( publickeyStr:string ): Promise<number> 
    public abstract requireUSDCExist(srcpublickey:string, dstpublickey:string, reqUiAmount:number ) :Promise<boolean> 
}