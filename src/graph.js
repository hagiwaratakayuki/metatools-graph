class Graph{
    /**
     * 
     * @param {{vertexClass?:any, edgeClass?:any, vertexListClass?:any}} options 
     */
    constructor(options = {vertexClass:Vertex, edgeClass:Edge, vertexListClass:VertexList}) {
        this._vertexCount = 0;        
        
        /**
         * @type {Map<any, Vertex>}
         */
        this._vertexs = new Map();
        /**
         * @type {Map<any,Edge>}
         */
        this._edges = new Map();

        this._vertexClass = options.vertexClass
        this._edgeClass = options.edgeClass
        this._vertexListClass = options.vertexListClass
    


    }
    /**
     * 
     * @param {any[]} ids 
     * @returns 
     */
    createVertexListFromIds(ids) {
        let my = this;
        const vs = ids.map(id => my.getVertex(id)); 
        return this.createVertexList(vs);

    }
    /**
     * 
     * @param {Vertex[]} vertexs 
     * @returns {VertexList}
     */
    createVertexList(vertexs) {
     
        return new this._vertexListClass(this, vertexs);

    }
    toJSON() {
        const vertexs = Array.from(this._vertexs.values()).map(function(v) {
            return v.toJSON()
        })
        const edges = Array.from(this._edges.values()).map(function(e){
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
        const vertex = new this._vertexClass({graph:this, id:this._vertexCount, property})
        
        
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
     * @param {any} outId 
     * @param {any} inId 
     * @param {any} label 
     * @returns {Edge}
     */
    addEge(outId, inId, label) {
        if (this._vertexs.has(outId) === false) {
            throw new VertexNotExistError(outId)

        }
        if (this._vertexs.has(inId) === false) {
            throw new VertexNotExistError(inId)

        }
        const edgeId = [outId, inId, label].join('_')
        if (this._edges.has(edgeId)) {
            return this._edges.get(edgeId)
        }
        const edge = new this._edgeClass({id:edgeId, outId, inId, label});
        

        this._edges.set(edgeId, edge);
        
        
        
        return edge;


        

    }
    /**
     * 
     * @param {string | {vertexs:[{id:number, property:any}]}} datas if raw json, it parsed 
     */
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
        for (const edgeData of _datas.edges) {
            /**
             * @type {Edge}
             */
            const edge = new this._edgeClass(edgeData)
            
            this._edges.set(edge.id, edge)
            const fromV = this._vertexs.get(edge.outId);
            fromV.setOutEdge(edge.inId, edge.label)


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
        if (this._edges.has(id) === false) {

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
    setOutEdges (edges) {
        for (const eId of edges) {
           this.setOutEdge(eId);
        }

    }
    /**
     * 
     * @param {any} label 
     * @param {boolean} rawId 
     * @returns {VertexList}
     */
    getOutV(label, rawId=false) {
        const vList = [];
        for (const eid of this.getOutEdges()) {
            const edge = this.graph.getEdge(eid)
            if (label && edge.label !== label) {
                continue;

            }
            vList.push(edge.inId)

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
            vList.push(edge.outId)

        }
        if (rawId === true) {
            return vList;

        }
        return this.graph.createVertexListFromIds(vList)

    }
    /**
     * 
     * @param {any} toVId
     * @param {any} label
     * @param {Edge?} edge
     */
    setOutEdge(toVId, label, edge) {
        const _toVId = typeof toVId.id === 'undefined' ? toVId :toVId.id
        let _edge = edge;
        if (!edge) {
             _edge = this.graph.addEge(this.id,  _toVId, label)
            const endV = this.graph.getVertex(_toVId)
            endV.setInEdge(this.id, label, _edge)
        }
    
           
        
        
        this._outEdges.set(_edge.id, true);

      
        return _edge;
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
     * @param {any} fromVId
     * @param {Edge?} edge 
     */
    setInEdge(fromVId, label, edge=true) {
        
        const _fromVId = typeof fromVId === 'undefined' ? fromVId : fromVId.id
        let _edge = edge;

        if (!edge){
             _edge = this.graph.addEge(_fromVId, this.id, label)
            const v = this.graph.getVertex(_fromVId)
            v.setOutEdge(this.id, label, edge)
        }
        

        this._inEdges.set(edge.id, true);
       
        return _edge

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
        this.vertexs = vertexs;


    }
    outV(label){
        
        const ret =  this.vertexs.reduce(function(prev, next){
            return prev.concat(next.getOutV(label, true))
        },[]);
        return this._graph.createVertexListFromIds(ret)


    }
    inV(label) {
        const ret = this.vertexs.reduce(function (prev, next) {
            return prev.concat(next.getInV(label, true));
        }, []);
        return this._graph.createVertexListFromIds(ret);

    }
    filter(filterFunc) {
        return this._graph.createVertexList(this.vertexs.filter(filterFunc));
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
        super('vertex id ' + id + ' does not exist')

    }


}
class EadgeNotExistError extends Error {
    constructor(id) {
        super('eadge id  ' + id + ' does not exist')

    }


}
module.exports = {Graph, Edge, Vertex, VertexList, VertexNotExistError, EadgeNotExistError}