import module from "module";
const require = module.createRequire(import.meta.url)
const namespace = require('./index.cjs');
export const { Graph, Edge, Vertex, VertexList } = namespace
export default namespace 