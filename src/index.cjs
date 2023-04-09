/**
 * @typedef {import("./graph.js").Graph} Graph
 * @typedef {import("./graph.js").Vertex} Vertex
 * @typedef {import("./graph.js").Edge} Edge
 * @typedef {import("./graph.js").VertexList} VertexList
 * @typedef {import("./graph.js").EadgeNotExistError} EdgeNotExistError
 * @typedef {import("./graph.js").VertexNotExistError} VertexNotExistError
 * */



/**
 * @type {{Graph:Graph, Vertex:Vertex, Edge:Edge, VertexList:VertexList, EdgeNotExistError:EdgeNotExistError, VertexNotExistError:VertexNotExistError}}
 */


//const {Graph, Vertex, Edge, VertexList, EdgeNotExistError, VertexNotExistError } = require('./graph.js');

//module.exports = { Graph, Vertex, Edge, VertexList, EdgeNotExistError, VertexNotExistError } 
module.exports = require('./graph.js');
