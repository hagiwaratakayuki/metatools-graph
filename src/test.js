const graph = require('./graph')
const assert = require('node:assert');
describe('basic graph test', function () {

    it('shoud create graph, add vertex and eadge', function (done) {
        const g = new graph.Graph()
        const startV = g.addVertex({1:3, 3:4})
       
        assert(startV.property[1] === 3)
        const endV = g.addVertex({4:5})
        const label = 'test'
        startV.setOutEdge(endV, label)
        
        assert.equal(endV.getInV(label).vertexs[0].id, startV.id);
        done();



    })
});