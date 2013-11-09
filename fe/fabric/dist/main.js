
function main()
{
    Canalada.canvas = new fabric.Canvas('c');
    
    
/*
    
(function drawQuadratic() {

  var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', { fill: '', stroke: 'black', selectable: true,
    strokeWidth : 5});

  line.path[0][1] = 100;
  line.path[0][2] = 100;

  line.path[1][1] = 200;
  line.path[1][2] = 200;

  line.path[1][3] = 300;
  line.path[1][4] = 100;

  line.selectable = false;
  Canalada.canvas.add(line);

  var p1 = makeCurvePoint(200, 200, null, line, null)
  p1.name = "p1";
  Canalada.canvas.add(p1);

  var p0 = makeCurveCircle(100, 100, line, p1, null);
  p0.name = "p0";
  Canalada.canvas.add(p0);

  var p2 = makeCurveCircle(300, 100, null, p1, line);
  p2.name = "p2";
  Canalada.canvas.add(p2);

})();


*/

    var actA = new Canalada.Actor("FileWriter");
    actA.addInPort('blain1');
    actA.addInPort('blain2');
    actA.addInPort('blain3');
    actA.addOutPort('blaout1');
    actA.addOutPort('blaout2');
    actA.addOutPort('blaout3');
    actA.addOutPort('blaout4');
    actA.addOutPort('blaout5');

    var actB = new Canalada.Actor("FileReader");
    actB.addInPort('ain1');
    actB.addInPort('ain2');
    actB.addOutPort('aout1');

    actA.setup();
    actB.setup();
    Canalada.canvas.add(actA);
    Canalada.canvas.add(actB);
    
    Canalada.canvas.add(new Canalada.FileWriterActor())
    
    Canalada.canvas.on({
        'object:selected'         : Canalada.onObjectSelected,
        'object:moving'           : Canalada.onObjectMoving,
        //'before:selection:cleared': Canalada.onBeforeSelectionCleared,
        'mouse:up'                : Canalada.onMouseUp,
        'mouse:down'              	: Canalada.onMouseDown
    });
    
}
