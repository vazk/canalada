var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});

var connect = function(source, sourcePort, target, targetPort) {
    var link = new joint.shapes.devs.Link({
        source: { id: source.id, selector: source.getPortSelector(sourcePort) },
        target: { id: target.id, selector: target.getPortSelector(targetPort) }
    });
    graph.addCell(link);
};


var a1 = new joint.shapes.devs.Model({
    position: { x: 360, y: 360 },
    size: { width: 100, height: 300 },
    inPorts: ['port XY'],
    outPorts: ['x','y', 'a', 'b']
});

var a2 = new joint.shapes.devs.Model({
    position: { x: 50, y: 260 },
    inPorts: ['in'],
    outPorts: ['out', 'outb']
});

var a3 = new joint.shapes.devs.Model({
    position: { x: 650, y: 150 },
    size: { width: 100, height: 300 },
    inPorts: ['a','b']
});

graph.addCell(a1).addCell(a2).addCell(a3);


connect(a2,'outb',a1,'port XY');
connect(a2,'out',a3,'a');
connect(a1,'y',a3,'b');

