import {Service} from "./ttype";
import {Algo, LinkIndex} from "./algorithm";
import {ChartsMode, makeGraph, makeLine, makeNode, makeOption} from "./gulp_echarts";
import * as ECharts from 'echarts'
import {EChartsOption} from 'echarts'
import * as fs from "fs";
import {LoadLinkData} from "./utils";

const ITEM_W_SPAN = 512, ITEM_H_SPAN = 108

export default function deal(mode: ChartsMode | string = ChartsMode.NONE) {
    const {relation, service} = LoadLinkData();
    const figureOutNew = () => new Algo(relation)
    const figureOutLinkIndex = () => new LinkIndex(relation)


    let algo = figureOutNew()
    console.log("=== run ===")

    let graph = makeGraph(mode)
    const linkInd = figureOutLinkIndex()


    let eraseNodes: any[][] = []
    for (let i = 1; ; i++) {
        let erasedNode = algo.erase()
        if (erasedNode.length <= 0) {
            break
        }
        eraseNodes = [erasedNode, ...eraseNodes]
    }

    let topRowCount = eraseNodes[eraseNodes.length - 1].length
    let lastGen: string[] = []
    function getScore(svrName : string): number {
        let score = 0
        for(let indLastName = 0; indLastName < lastGen.length; indLastName ++) {
            if (!!linkInd.get(lastGen[indLastName], svrName)) {
                score += 1000 + 100 * indLastName
            }
        }
        score += linkInd.getToList(svrName).length
        return score
    }
    eraseNodes.forEach((gen, i) => {
        gen.sort((a, b) => getScore(a) - getScore(b))

        let x = i * ITEM_W_SPAN

        let topRowAccu = 0
        gen.forEach((name) => {
            let opt = undefined
            const svr = (service as any)[name] as Service
            if (!svr) {
                console.error(`cannot find svr meta of`, name)
            } else switch (svr.Meta["domain"]) {
                case "L0":
                    opt = {color: "#2BF"};
                    break;
                case "L1":
                    opt = {color: "#FB2"};
                    break;
            }

            makeNode(graph, name, x, topRowAccu * ITEM_H_SPAN, opt)
            topRowAccu +=  topRowCount / (gen.length - 1 || 1)
        })

        lastGen = gen
    })


    const windowSize = {width: eraseNodes.length * ITEM_W_SPAN, height: topRowCount * ITEM_H_SPAN}

    algo = figureOutNew()
    algo.forEachLink((from, to) => {
        const linksBetween = linkInd.get(from, to)
        for (let i in linksBetween) {
            const link = linksBetween[i]
            makeLine(graph, from, to, {
                label: `${link.From.Method} => ${link.To.Method}`,
                dashed: link.Meta["relation"] != "strong",
                curveness: Number.parseInt(i) * 0.25,
            })
        }
    })

    console.log("===== SIZE =====\n", "topRowCount", topRowCount, windowSize)
    console.log("===== Graph =====\n", JSON.stringify(graph))

    if(mode != ChartsMode.FORCE) {
        drawCharts("callchaintest", makeOption("Call Chain", graph), {...windowSize})
    } else {
        drawCharts("callchaintest", makeOption("Call Chain", graph), { width: 4096, height: 4096 }) // for force graph
    }
}


function drawCharts(name: string, option: EChartsOption, opt?: { width: number, height: number }) {
    const fileName = `${name}.svg`

// 在 SSR 模式下第一个参数不需要再传入 DOM 对象
    const chart = ECharts.init(null, undefined, {
        renderer: 'svg', // 必须使用 SVG 模式
        ssr: true, // 开启 SSR
        ...opt // 需要指明高和宽
    });

// 像正常使用一样 setOption
    chart.setOption(option);

// 输出字符串
    const svgStr = chart.renderToSVGString();
    fs.writeFileSync(fileName, svgStr)
    console.log("exported", fileName)
}
