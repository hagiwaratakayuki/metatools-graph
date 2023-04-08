import module from "module";
const require = module.createRequire(import.meta.url)
/**
 * @type {import('./graph.js')}
 */
const namespace = require('./index.cjs');

export const { Graph, Edge, Vertex, VertexList,EadgeNotExistError,VertexNotExistError } = namespace
export default namespace 