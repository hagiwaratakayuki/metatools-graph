class Graph{
    constructor(options = {}) {
        this._vertexCount = 0;        
        this._edgeCount = 0;
        /**
         * @type {Map<any, Vertex>}
         */
        this._vertexs = new Map();
        /**
         * @type {Map<any,Edge>}
         */
        this._edges = new Map();

        this._vertexClass = options.vertexClass || Vertex;
        this._edgeClass = options.edgeClass || Edge;
        this._vertexListClass = options.vertexListClass || VertexList
    


    }
    createVertexListFromId(ids) {
        let my = this;
        const vs = ids.map(id => my.getVertex(id)); 
        return this.createVertexList(vs);

    }
    createVertexList(vertexs) {
     
        return new this._vertexListClass(this, vertexs);

    }
    toJSON() {
        return {vertexs:Array.from(this._vertexs.entries()), edges:Array.from(this._edges.entries()) }
    }
    addVertex(property){
        const vertex = new this._vertexClass(this, this._vertexCount, property)
        this._vertexs.set(this._vertexCount, vertex);
        this._vertexCount += 1;
        return vertex

    }
    addEge(fromId, toId, label) {
        const edge = this._edgeClass(this._edgeCount,fromId, toId, label);
        this._edges.set(this._edgeCount, edge);
        this._edgeCount += 1;
        return edge;


        

    }
    fromJSON(datas){
        let _datas;
        if (typeof datas === 'string') {
            _datas = JSON.parse(datas)

        }
        else {
            _datas = datas;
        }
        
        for (const vertexData of _datas.vertexs ) {
            
            const vertex = new this._vertexClass(Object.assign({graph:this}, vertexData))
            this._vertexs.set(vertexData.id,vertex) 


        }
        for (const edgeData of _datas.edgess) {
           
            const edge = new this._vertexClass(Object.assign({ graph: this }, edgeData))
            this._eges.set(edgeData.id, edge)


        }

        this._vertexCount = this._vertexs.size();
        this._edgeCount = this._edges.size();



    }
    getVertex (id) {
        return this._vertexs.get(id);
    }
    getEdge (id) {
        return this._edges.get(id);
    }
    destract () {
        this._edges.clear();
        this._vertexs.clear();
    }

}

class Vertex {
    /**
     * 
     * @param {{graph:Graph, id:number, property:any}} param0 
     */
    constructor({ graph, id, property }) {
        
        /**
         * @type {Graph}
         */
        this.graph = graph
        this.id = id;
        this.setProperty(property);
        this._outEdges = new Map();
        this._inEdges = new Map();
    
    }
    setProperty(property) {
        this.property = property

    }
    setOutEdges (edges) {
        for (const eId of edges) {
           this.setOutEdge(eId);
        }

    }
    getOutV(label, rawId=false) {
        const vList = [];
        for (const eid of this.getOutEdges()) {
            const edge = this.graph.getEdge(eid)
            if (label && edge.label !== label) {
                continue;

            }
            vList.push(edge.outId)

        }
        if (rawId === true) {
            return vList

        }
        return this.graph.createVertexListFromId(vList)
       

    }
    getInV(label, rawId=false) {
        const vList = [];
        for (const eid of this.getInEdges()) {
            const edge = this.graph.getEdge(eid)
            if (label && edge.label !== label) {
                continue;

            }
            vList.push(edge.inId)

        }
        if (rawId === true) {
            return vList;

        }
        return this.graph.createVertexListFromId(vList)

    }
    setOutEdge(eId) {
        this._outEdges.set(eId, true);
    }
    getOutEdges(isIterator=true) {
        const itr = this._outEdges.keys(); 
        if (isIterator === true) {
            return itr;
        }
        return Array.from(itr)
    }
    setInEdges(edges) {
        for (const eId of edges) {
            this.setOutEdge(eId);
        }

    }
    setInEdge(eId) {
        this._inEdges.set(eId, true);
    }
    getInEdges(isIterator = true) {
        const itr = this._inEdges.keys();
        if (isIterator === true) {
            return itr;
        }
        return Array.from(itr)
    }
    toJSON() {
        return {id:this.id, property:this.property, inEdge:this.getInEdges(false), outEdge:this.getOutEdges(false)}

    }

}
class VertexList {
    constructor (graph, vertexs=[]) {
        /**
         * @type {Graph}
         */
        this._graph = graph;
        /**
         * @type {[Vertex]}
         */
        this._vertexs = vertexs;


    }
    outV(label){
        
        const ret =  this._vertexs.reduce(function(prev, next){
            return prev.concat(next.getOutV(label, true))
        },[]);
        return this._graph.createVertexListFromId(ret)


    }
    inV(label) {
        const ret = this._vertexs.reduce(function (prev, next) {
            return prev.concat(next.getInV(label, true));
        }, []);
        return this._graph.createVertexListFromId(ret);

    }
    filter(filterFunc) {
        return this._graph.createVertexList(this._vertexs.filter(filterFunc));
    }


}
class Edge {
    constructor(inId, outId, label) {
        this.inId = inId
        this.outId = outId
        this.label = label
        
    }
    

}