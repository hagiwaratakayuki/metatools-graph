export class Graph {
    /**
     *
     * @param {{vertexClass?:any, edgeClass?:any, vertexListClass?:any}} options
     */
    constructor(options?: {
        vertexClass?: any;
        edgeClass?: any;
        vertexListClass?: any;
    });
    _vertexCount: number;
    /**
     * @type {Map<any, Vertex>}
     */
    _vertexs: Map<any, Vertex>;
    /**
     * @type {Map<any, Edge>}
     */
    _edges: Map<any, Edge>;
    _vertexClass: any;
    _edgeClass: any;
    _vertexListClass: any;
    /**
     *
     * @param {any[]} ids
     * @returns {VertexList}
     */
    createVertexListFromIds(ids: any[]): VertexList;
    /**
     *
     * @param {Vertex[]} vertexs
     * @returns {VertexList}
     */
    createVertexList(vertexs: Vertex[]): VertexList;
    /**
     *
     * @returns {vertexs:any, edges:any}
     */
    toJSON(): any;
    /**
     *
     * @param {any} property
     * @param {any?} id
     * @returns {Vertex}
     */
    addVertex(property: any, id: any | null): Vertex;
    /**
     *
     * @param {any} outId
     * @param {any} inId
     * @param {any} label
     * @returns {Edge}
     */
    addEdge(outId: any, inId: any, label: any): Edge;
    /**
     *
     * @param {any} id
     * @returns {boolean}
     */
    hasVertex(id: any): boolean;
    /**
     *
     * @param {any} id
     * @returns {boolean}
     */
    hasEdge(id: any): boolean;
    /**
     *
     * @param {string | {vertexs:[{id:any, property:any}, edge:[{outId:any, inId:any, labl:any}]]}} datas if raw json, it parsed
     */
    fromJSON(datas: string | {
        vertexs: [{
            id: any;
            property: any;
        }, edge: [{
            outId: any;
            inId: any;
            labl: any;
        }]];
    }): void;
    /**
     *
     * @param {any} id
     * @param {any} property
     */
    _merge(id: any, property: any): void;
    /**
     *
     * @param {any} id
     * @returns
     */
    getVertex(id: any): any;
    /**
     *
     * @param {any} id
     * @returns
     */
    getEdge(id: any): any;
    destract(): void;
}
export class Edge {
    /**
     *
     * @param {{inId:any, outId:nay, id:string}} param0
     */
    constructor({ inId, outId, label, id }: {
        inId: any;
        outId: nay;
        id: string;
    });
    inId: any;
    outId: nay;
    label: any;
    id: string;
    toJSON(): Edge;
}
export class Vertex {
    /**
     *
     * @param {{graph:Graph, id:number, property:any}} param0
     */
    constructor({ graph, id, property }: {
        graph: Graph;
        id: number;
        property: any;
    });
    /**
     * @type {Graph}
     */
    graph: Graph;
    id: number;
    _outEdges: any;
    _inEdges: any;
    setProperty(property: any): void;
    property: any;
    setOutEdges(edges: any): void;
    /**
     *
     * @param {any} label
     * @param {boolean} rawId
     * @returns {VertexList}
     */
    getOutV(label: any, rawId?: boolean): VertexList;
    getInV(label: any, rawId?: boolean): any[] | VertexList;
    /**
     *
     * @param {any} toVId
     * @param {any} label
     * @param {Edge?} edge
     */
    setOutEdge(toVId: any, label: any, edge: Edge | null): Edge;
    getOutEdges(isIterator?: boolean): any;
    setInEdges(edges: any): void;
    /**
     *
     * @param {any} fromVId
     * @param {Edge?} edge
     */
    setInEdge(fromVId: any, label: any, edge?: Edge | null): Edge;
    getInEdges(isIterator?: boolean): any;
    toJSON(): {
        id: number;
        property: any;
    };
}
export class VertexList {
    constructor(graph: any, vertexs?: any[]);
    /**
     * @type {Graph}
     */
    _graph: Graph;
    /**
     * @type {[Vertex]}
     */
    vertexs: [Vertex];
    outV(label: any): VertexList;
    inV(label: any): VertexList;
    filter(filterFunc: any): VertexList;
}
export class VertexNotExistError extends Error {
    constructor(id: any);
}
export class EdgeNotExistError extends Error {
    constructor(id: any);
}
