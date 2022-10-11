import {Relation} from "./ttype";


export class LinkIndex {

    public index: {
        [from: string]: {
            [to: string]: Relation[]
        }
    }
    constructor(data: Relation[]) {
        this.index = {}
        for(let i in data) {
            let l = data[i]
            this.index[l.From.Service] = this.index[l.From.Service] || {}
            this.index[l.From.Service][l.To.Service] = [ ...this.index[l.From.Service][l.To.Service] || [], l]
        }
        console.log("index initialed", this.index)
    }


    public get(from: string, to: string): Relation[] {
        return this.index[from] ? this.index[from][to] : []
    }

    public getToList(from: string): string[] {
        let ret: string[] = []
        for(let key in this.index[from]) {
            ret = [...ret, key]
        }
        return ret
    }
}

// 环怎么搞
// 重边怎么搞
export class Algo {
    public out: { [key: string]: string[]}
    public round = 0
    constructor(data: Relation[]) {
        this.out = {}
        data.forEach((l) => {
            const fromS = l.From.Service, toS = l.To.Service
            if(!this.out[toS]) {
                this.out[toS] = []
            }

            this.out[fromS] = this.out[fromS] || []
            let i = this.out[fromS].indexOf(toS)
            if(i < 0) {
                this.out[fromS] = [...this.out[fromS], toS]
            }
        })

        console.log("algo initialed", this.out)
    }

    public forEachLink (cb: (from: string, to: string) => void) {
        for(let from in this.out) {
            for(let to of this.out[from]) {
                cb(from, to)
            }
        }
    }

    public erase(): string[] {
        console.log(":: round", this.round, "start >", this.out)
        let ret: string[] = []
        for(let key in this.out) {
            if(this.out[key].length > 0) continue
            ret = [...ret, key]
        }
        console.log("- got d0 keys", ret)

        // remove 'from' key
        for(let key of ret) {
            delete(this.out[key])
        }

        // remove 'to' key
        for(let from in this.out) {
            for(let key of ret) {
                let i = this.out[from].indexOf(key)
                if (i >= 0) {
                    console.log("- remove", key, "index", i, "from list of", from, this.out[from])
                    this.out[from].splice(i, 1)
                    console.log("- - new list", from, this.out[from])
                }
            }
        }

        console.log(":: round", this.round++, "layer", ret)

        return ret
    }
}