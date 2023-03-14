export interface KeyValue {
    [key: string]: string;
}
export function split( src:string, delimiter:string, keys:string[] ): KeyValue {

    let splited: string[] = src.split(delimiter)

    let keyvalue: KeyValue = {}
    for ( const s of splited ){
        for ( const key of keys ){
            if ( s.indexOf(key+"=") !== -1 ){
                const length = (key+"=").length
                const value = s.substring(length,s.length)
                keyvalue[key] = value
                continue
            }
        }
    }
    if ( Object.keys(keyvalue).length !== keys.length ){
        throw Error( "expect key " + keys + " is not proper")
    }
    return keyvalue

} 