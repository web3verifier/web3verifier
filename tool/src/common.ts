import { error } from "./error"

export type TICKET_TYPE = "SEND" | "DONATION" | "INVOICE" | "LOOSE_VERIFICATION" | "STRICT_VERIFICATION"

export class Common {
    constructor() {
    }
    public getDomainUrl(): string {
        return "https://test-pl9fwre.link/"
    }
    public byid(id: string): HTMLElement {
        const htmlelement: HTMLElement | null = document.getElementById(id)
        if (htmlelement !== null) {
            return htmlelement
        } else {
            const err = new Error("there is no id? id=" + id)
            error(err)
            throw err
        }
    }
    public refval(id: string): string {
        const element: HTMLInputElement = document.getElementById(id) as HTMLInputElement
        return element.value
    }
    public setval(id: string, value: string): void {
        (document.getElementById(id) as HTMLInputElement).value = value
    }
    public addval(id: string, value: string): void {
        (document.getElementById(id) as HTMLInputElement).value += value
    }

    public repeat(char: string, n: number): string {
        let str = ""
        for (let i = 0; i < n; i++) {
            str += char
        }
        return str
    }
    // replace for all charactor include special charactor
    public replaceString(str: string, before: string, after: string): string {
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
}
