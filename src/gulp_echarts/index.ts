export enum ChartsMode {
    NONE =  "none",
    FORCE = "force"
}

interface EChartsLinkInterface {
    links: {
        source: string
        target: string
        value?: number
        label?: {
            show?: boolean
            formatter?: string
        },
        lineStyle?: {
            width?: number
            curveness?: number
            type?: "solid" | "dashed" | "dotted"
        }
    }[]
}

interface EChartsDataInterface {
    data: {
        name: string,
        x: number,
        y: number
        value?: string,
        itemStyle?: {
            color?: string
        }
    }[]
}


export function makeNode(graph: EChartsDataInterface, name: string, x: number, y: number, opt?: {
    color?: string
}) {
    graph.data = [...graph.data, {
        name, x, y,
        // value: ""
        itemStyle: {
            color: opt?.color
        }
    }]
}

export function makeLine(graph: EChartsLinkInterface, source: string, target: string, opt?: {
    dashed?: boolean
    label?: string
    curveness?: number
}) {
    graph.links = [...graph.links, {
        source,
        target,
        value: 1,
        label: {
            show: !!opt?.label,
            formatter: opt?.label,
        },
        lineStyle: {
            // width: 1,
            curveness: opt?.curveness,
            type: opt?.dashed ? "dashed" : "solid",
        }
    }]
}

export function makeGraph(mode: ChartsMode | string = ChartsMode.NONE) {
    let g: any = {
        type: 'graph',
        layout: 'none',

        roam: true,
        symbol: 'rect',
        symbolSize: [160, 48],
        color: '#666',
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 15],
        edgeLabel: {
            // fontSize: 20
        },
        data: [],
        links: [],
        lineStyle: {
            opacity: 0.9,
            width: 1,
            curveness: 0
        },
        label: {
            show: true
        },
    }

    if(mode == ChartsMode.FORCE) {
        g = {
            ...g,
            layout: 'force',
            left: 'left',
            top: 'top',
            force: {
                initLayout: "circle",
                repulsion: 1024,
                gravity: 0.1,
                edgeLength: [64, 86],
                layoutAnimation: false,
            },
        }
    }

    return g
}


export function makeOption(title: string, graph: any) {
    return {
        title: {
            text: title
        },
        tooltip: {},
        series: [
            graph
        ]
    }
}
