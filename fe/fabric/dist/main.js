function main()
{
    Canalada.canvas = new fabric.Canvas('c');
    
    
    
(function drawQuadratic() {

  var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', { fill: '', stroke: 'black' });

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



    
    var r = new fabric.Rect({
            left: 200,
            top: 300,
            strokeWidth: 8,
            width: 130,
            height: 90,
            fill: '#fff',
            stroke: '#666'
          });

    r.hasBorders = r.hasControls = false;
    Canalada.canvas.add(r);

    var act = new Canalada.Actor();
    act.addInPort('blain1');
    act.addInPort('blain2');
    act.addInPort('blain3');
    act.addOutPort('blaout1');
    act.addOutPort('blaout2');
    act.addOutPort('blaout3');
    act.addOutPort('blaout4');
    act.addOutPort('blaout5');
    
    
    var actView = new Canalada.ActorView(act);
    
    Canalada.canvas.add(actView);
    
    Canalada.canvas.on({
        'object:selected'         : Canalada.onObjectSelected,
        'object:moving'           : Canalada.onObjectMoving,
        'before:selection:cleared': Canalada.onBeforeSelectionCleared,
        'mouse:up'                : Canalada.onMouseUp,
        'mouse:down'              	: Canalada.onMouseDown
    });


    
    
    
    
    
    
 
    
}