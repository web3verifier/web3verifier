
export const SPECIAL_DELIMETER_STRING = "Jw9YsScN"

// replace for all charactor include special charactor
function replaceString(str: string, before: string, after: string): string {
    let rtnStr: string = ""
    const totalLen = str.length
    let pos = 0
    while (pos < totalLen) {
        const chr: string = str.substr(pos, 1)
        if (str.substr(pos, before.length) === before) {
            rtnStr += after
            pos += before.length
        } else {
            rtnStr += chr
            pos++
        }
    }
    return rtnStr
}

export async function error(err: Error): Promise<void> {
    let s: string
    if (err.stack !== undefined) {
        s = err.stack.toString()
    } else {
        s = "undefined"
    }
    s = replaceString(s, String.fromCharCode(0), SPECIAL_DELIMETER_STRING)
    const args: string = encodeURIComponent(s)
}
