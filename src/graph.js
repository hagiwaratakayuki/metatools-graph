class Graph{
    /**
     * 
     * @param {{veetexClass?:any, edgeClass?:any, vertexListClass?:any}} options 
     */
    constructor(options = {}) {
        this._vertexCount = 0;        
        
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
    createVertexListFromIds(ids) {
        let my = this;
        const vs = ids.map(id => my.getVertex(id)); 
        return this.createVertexList(vs);

    }
    createVertexList(vertexs) {
     
        return new this._vertexListClass(this, vertexs);

    }
    toJSON() {
        const vertexs = this._vertexs.values().map(function(v) {
            return v.toJSON()
        })
        const edges = this._edges.values().map(function(e){
            return e.toJSON();
        })
        return {vertexs, edges}
    }
    /**
     * 
     * @param {any} property 
     * @param {any?} id 
     * @returns {Vertex}
     */
    addVertex(property, id){
        const vertex = new this._vertexClass(this, this._vertexCount, property)
        
        
        if (typeof id === 'undefined') {
            this._vertexs.set(this._vertexCount, vertex);
            this._vertexCount += 1;
        }
        else {
            this._vertexs.set(id, vertex);
        }
        
        return vertex

    }
    /**
     * 
     * @param {any} fromId 
     * @param {any} toId 
     * @param {any} label 
     * @param {any?} id 
     * @returns {Edge}
     */
    addEge(fromId, toId, label) {
        if (this._vertexs.has(fromId) === false) {
            throw new VertexNotExistError(fromId)

        }
        if (this._vertexs.has(toId) === false) {
            throw new VertexNotExistError(toId)

        }
        const edgeId = [fromId, toId, label].join('_')
        if (this._edges.has(edgeId)) {
            return this._edges.get(edgeId)
        }
        const edge = this._edgeClass(this._edgeCount,fromId, toId, label, edgeId);
        

        this._edges.set(edgeId, edge);
        
        
        
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
        let hasIntVertexId = false;
       
        for (const vertexData of _datas.vertexs ) {
            
            const vertex = new this._vertexClass(Object.assign({graph:this}, vertexData))
            this._vertexs.set(vertexData.id,vertex)
            if (Number.isInteger(vertexData.id) && vertexData.id > this._vertexCount) {
                hasIntVertexId = true;
                this._vertexCount = vertexData.id;
                

            }


        }
        for (const edgeData of _datas.edgess) {
            /**
             * @type {Edge}
             */
            const edge = new this._edgeClass(Object.assign(edgeData))
            
            this._edges.set(edgeData.id, edge)
            const fromV = this._vertexs.get(edge.outId);
            fromV.setOutEdge(edge.toId, edge.label)


        }
        if (hasIntVertexId === true) {
            this._vertexCount += 1;

        }
      

        


    }
   
    getVertex (id) {
        if (this._vertexs.has(id) === false) {
            throw new VertexNotExistError(id)
        }
        return this._vertexs.get(id);
    }
    getEdge (id) {
        if (this._eadges.has(id) === false) {

            throw new EadgeNotExistError(id);

        }

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
    _setOutEdges (edges) {
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
        return this.graph.createVertexListFromIds(vList)
       

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
        return this.graph.createVertexListFromIds(vList)

    }
    /**
     * 
     * @param {any} eId 
     */
    setOutEdge(eId, label, isUpdateGraph=true) {
        const _eId = typeof eId.id === 'undefined' ? eId :eId.id
        this.graph.addEge(id, label, _eId)
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
            this.setInEdge(eId);
        }

    }
    /**
     * 
     * @param {any} eId
     * @param {boolean} isUpdateGraph 
     */
    setInEdge(eId, label, isUpdateGraph=true) {
        
        const _eId = typeof eId === 'undefined' ? eId : eId.id
        

        if (isUpdateGraph === true){
            this.graph.addEge(_eId, this.id)
        }
        

        this._inEdges.set(eId, true);
        const v = this.graph.getVertex(eId)
        v.getOutEdges(_eId, false)

    }
    getInEdges(isIterator = true) {
        const itr = this._inEdges.keys();
        if (isIterator === true) {
            return itr;
        }
        return Array.from(itr)
    }
   
    toJSON() {
        return {id:this.id, property:this.property}

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
        return this._graph.createVertexListFromIds(ret)


    }
    inV(label) {
        const ret = this._vertexs.reduce(function (prev, next) {
            return prev.concat(next.getInV(label, true));
        }, []);
        return this._graph.createVertexListFromIds(ret);

    }
    filter(filterFunc) {
        return this._graph.createVertexList(this._vertexs.filter(filterFunc));
    }


}
class Edge {
    /**
     * 
     * @param {{inId:any, outId:nay, id:string}} param0 
     */
    constructor({inId, outId, label, id}) {
        this.inId = inId
        this.outId = outId
        this.label = label
        this.id = id
        
    }
    toJSON() {
        return this;
    }
    

}

class VertexNotExistError extends Error{
    constructor (id) {
        super('vertex id' + id + ' does not exist')

    }


}
class EadgeNotExistError extends Error {
    constructor(id) {
        super('eadge id  ' + id + ' does not exist')

    }


}
module.exports = {Graph, Edge, Vertex, VertexList, VertexNotExistError, EadgeNotExistError}