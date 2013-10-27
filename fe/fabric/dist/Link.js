
Canalada.Link = fabric.util.createClass(fabric.Object, {
    ctype: 'Link',
    inp: undefined,
    outp: undefined,
    
    initialize: function() {
    }
});





function makeCurveCircle(left, top, line1, line2, line3) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 12,
    fill: '#fff',
    stroke: '#666'
  });

  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}

function makeCurvePoint(left, top, line1, line2, line3) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 14,
    fill: '#fff',
    stroke: '#666'
  });

  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}