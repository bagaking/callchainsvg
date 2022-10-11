import * as fs from "fs";
import {Data} from "./ttype";

export const defaultDataFilePath = "./link_data.json"

export function Currify<Tout>(fn: (...args: any) => Tout, ...vals: any): (...args: any) => Tout {
    return (...inn: any) => {
        return fn(...vals, ...inn)
    }
}

export function LoadLinkData(path: string = defaultDataFilePath): Data {
    let str = fs.readFileSync(path).toLocaleString()
    return JSON.parse(str) as Data
}

