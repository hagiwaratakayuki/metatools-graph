const graph = require('./graph')
const assert = require('node:assert');
describe('basic graph test', function () {

    it('shoud create graph, add vertex and edge', function (done) {
        const g = new graph.Graph()
        const startV = g.addVertex({1:3, 3:4})
       
        assert(startV.property[1] === 3)
        const endV = g.addVertex({4:5})
        const label = 'test'
        startV.setOutEdge(endV, label)
        
        assert.equal(endV.getInV(label).vertexs[0].id, startV.id);
        done();



    })
    it('shoud create graph, add vertex and edge', function (done) {
        const g = new graph.Graph()
        const startV = g.addVertex({ 1: 3, 3: 4 })

        assert(startV.property[1] === 3)
        const endV = g.addVertex({ 4: 5 })
        const label = 'test'
        startV.setOutEdge(endV, label)

        assert.equal(endV.getInV(label).vertexs[0].id, startV.id);
        done();



    })
});
describe('json graph test', function () {

    it('shoud work toJSON & fromJSON ', function (done) {
        const g = new graph.Graph()
        const startV = g.addVertex({ 1: 3, 3: 4 })

        assert(startV.property[1] === 3)
        const endV = g.addVertex({ 4: 5 })
        const label = 'test'
        startV.setOutEdge(endV, label)
        const g2 = new graph.Graph()
       
        g2.fromJSON(g.toJSON())

        assert.equal(g2.getVertex(endV.id).getInV(label).vertexs[0].id, startV.id);
        done();



    })
});