export interface FeatMap {[key: string]: string|boolean|number}

export interface Service {
    Name : string
    Meta: FeatMap
}

export interface Tuple {
    Service: string
    Method : string
}

export interface Relation {
    From : Tuple
    To : Tuple
    Meta : FeatMap
}

export interface Data { service: { [key: string]: Service }, relation: Relation[] }