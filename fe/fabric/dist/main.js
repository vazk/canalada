function main()
{
    var canvas = new fabric.Canvas('c');

    
/*    canvas.findTarget = (function(originalFn) {
  // The object search loop, taken from the original 'findTarget' in fabric.js
  // 0.8.42.
  //
  // This version differs in that it recurses into a Group's 'objects'
  // property.
  var findTargetInObjects = function(e, objects) {
    if(!(e.type === 'mousedown') ) return;
    var target;
    for (var i = objects.length; i--; ) {
      if (objects[i] && this.containsPoint(e, objects[i])) {
        // Ok, we matched a group.  Try to find out which thing INSIDE that
        // group that was clicked.
        if (objects[i].type === "group") {
          return findTargetInObjects.call(this, e, objects[i]._objects);
        } else {
          target = objects[i];
        }
        break;
      }
    }
    return target;
  };

  // The new 'findTarget' implementation, it is largely copied from the
  // existing on in fabric.js 0.8.42
  var newFn = function (e, skipGroup) {
    var target,
        pointer = this.getPointer(e);
    // then check all of the objects on canvas
    target = findTargetInObjects.call(this, e, this._objects);

    if (target && target.selectable) {
      return target;
    }
  };

  return function() {
    return newFn.apply(this, arguments);
  };
})(canvas.findTarget);
*/
    
    
    
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
    canvas.add(r);

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
    canvas.add(actView);
 
    canvas.on('mouse:down', function(e) {
        if(e.target === undefined) {
            return;
        }
        if(e.target.ctype === 'ActorView') {
            objects = e.target.getObjects();
            var center = e.target.getCenterPoint()
            for(var i = objects.length; i--; ) {
                var pt = {x:e.e.offsetX - center.x, y:e.e.offsetY - center.y};
                if(objects[i] && objects[i].containsPoint(pt)) {
                    objects[i].setStroke('#ad2e3a');
                    break;
                }
            }
        } else {
            e.target.setStroke('#ad2e3a');
        }
        canvas.renderAll();
    });
    canvas.on('mouse:up', function(e) {
        if(e.target === undefined) {
            return;
        }
        if(e.target.ctype === 'ActorView') {
            objects = e.target.getObjects();
            var center = e.target.getCenterPoint()
            for(var i = objects.length; i--; ) {
                var pt = {x:e.e.offsetX - center.x, y:e.e.offsetY - center.y};
                if(objects[i] && objects[i].containsPoint(pt)) {
                    objects[i].setStroke('#30407a');
                    break;
                }
            }
        } else {
            e.target.setStroke('#30407a');
        }
        canvas.renderAll();
    });
}