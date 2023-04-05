# @Metatolls/Graph

graph data utility

## Install

```bash
npm install metatools-graph 

```

## Usage

```javascript
const graph = require('metatools-graph')

const g = new graph.Graph()
const startV = g.addVertex({1:3, 3:4})
const endV = g.addVertex({4:5})
const label = 'test'
startV.setOutEdge(endV, label)
        
console.dir(endV.getInV(label).vertexs)

```

if want  more, see docs directry