
function resize() {
    var canvasDiv = document.getElementById('canal');
    var canvasSelf = document.getElementById('canal-canvas');
    var viewportWidth = window.innerWidth-180;
    var viewportHeight = window.innerHeight-20;
    canvasDiv.style.position = "fixed";
    canvasDiv.style.width = viewportWidth + 'px';
    canvasDiv.style.height = viewportHeight + 'px';
    canvasSelf.style.top = 0;
    canvasSelf.style.left = 0;
    Canalada.canvas.setWidth(viewportWidth);
    Canalada.canvas.setHeight(viewportHeight);
    Canalada.canvas.calcOffset();
};



function main()
{
    window.addEventListener('resize', resize, false);
 
    var lib_items = document.querySelectorAll('#lib_items_s1 itm');
    [].forEach.call(lib_items, function (itm) {
        img.addEventListener('dragstart', function(e){this.style.opacity = '0.4'}, false);
        img.addEventListener('dragend', function(e){}, false);
    });
    
    Canalada.canvas = new fabric.Canvas('canal-canvas', { backgroundColor:'#fff' });

    
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        return false;
    }
    
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        return false;
    }
    
    function handleDragEnter(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        return false;
    }
    

    // Bind the event listeners for the canvas
    var canvasContainer = document.getElementById('canal');
    canvasContainer.addEventListener('dragenter', handleDragEnter, false);
    canvasContainer.addEventListener('dragover',  handleDragOver, false);
    //canvasContainer.addEventListener('dragleave', handleDragLeave, false);
    canvasContainer.addEventListener('drop',      handleDrop, false);
    
    
    
    
    
    Canalada.canvas.findTarget = (function(originalFn) {
        return function() {
            var target = originalFn.apply(this, arguments);
            var e = arguments[0];
            if(target == null || e.type !== 'mousedown')
                return target;
            
            if(target.ctype === 'Actor') {
                var p = target.getSelectedItem({x:e.offsetX, y:e.offsetY});
                if(p && (p.ctype === 'InPort' || p.ctype === 'OutPort')) {
                    var mouse = Canalada.canvas.getPointer(e);
                    Canalada.mouseState.down = true;
                    Canalada.mouseState.x = mouse.x;
                    Canalada.mouseState.y = mouse.y;
                    var endpt = new fabric.Circle({
                                    radius: 3,
                                    left: Canalada.mouseState.x,
                                    top: Canalada.mouseState.y,
                                    stroke: '#444',
                                    hasBorders : false,
                                    hasControls : false});
                    var ln = new fabric.Line(
                                    [Canalada.mouseState.x,
                                     Canalada.mouseState.y,
                                     Canalada.mouseState.x,
                                     Canalada.mouseState.y],
                                    {
                                    strokeDashArray: [5, 5],
                                    stroke: '#444',
                                    strokeWidth: 2,
                                    hasBorders: false,
                                    hasControls: false
                                    });

                    //ln._setWidthHeight();
                    Canalada.canvas.add(endpt);
                    Canalada.canvas.add(ln);
                    Canalada.mouseState.marker = endpt;
                    Canalada.mouseState.line = ln;
                    return Canalada.mouseState.marker;
                }

            }
            return target;
        };
    })(Canalada.canvas.findTarget);
    
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
    resize();
}
